import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, createHmac, randomUUID } from 'crypto';
import { DEMO_AUTH_ORGANIZATION, DEMO_AUTH_USERS } from '../demo/demo-data';
import { LoginDto } from './dto/login.dto';
import {
  AuthOrganizationResponseDto,
  AuthResponseDto,
  AuthUserResponseDto,
} from './dto/auth-response.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (!this.isDemoDataEnabled()) {
      return;
    }

    const userCount = await this.userRepository.count();
    if (userCount > 0) return;

    const now = new Date('2026-06-01T08:00:00.000Z');

    const organization = this.organizationRepository.create({
      name: DEMO_AUTH_ORGANIZATION.name,
      email: DEMO_AUTH_ORGANIZATION.email,
      phoneNumber: DEMO_AUTH_ORGANIZATION.phoneNumber,
      website: DEMO_AUTH_ORGANIZATION.website,
      address: DEMO_AUTH_ORGANIZATION.address,
      city: DEMO_AUTH_ORGANIZATION.city,
      state: DEMO_AUTH_ORGANIZATION.state,
      country: DEMO_AUTH_ORGANIZATION.country,
      postalCode: DEMO_AUTH_ORGANIZATION.postalCode,
      description: DEMO_AUTH_ORGANIZATION.description,
    });
    await this.organizationRepository.save(organization);

    for (let i = 0; i < DEMO_AUTH_USERS.length; i++) {
      const demoUser = DEMO_AUTH_USERS[i];
      const userCreatedAt = new Date(now.getTime() + i * 60_000);
      const { salt, passwordHash } = this.hashPassword(demoUser.password);

      const user = this.userRepository.create({
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        email: demoUser.email.toLowerCase(),
        phoneNumber: demoUser.phoneNumber,
        role: demoUser.role,
        organizationId: organization.id,
        isActive: true,
        createdAt: userCreatedAt,
        updatedAt: userCreatedAt,
        salt,
        password: passwordHash,
      });
      await this.userRepository.save(user);
    }

    await this.organizationRepository.update(organization.id, {
      ownerUserId: 1,
    });
  }

  private isDemoDataEnabled() {
    return ['1', 'true', 'yes'].includes(
      (this.configService.get<string>('DEMO_DATA_ENABLED') ?? '')
        .trim()
        .toLowerCase(),
    );
  }

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const normalizedEmail = signupDto.email.toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const now = new Date();
    const organization = await this.createOrganizationIfNeeded(signupDto, now);
    const { salt, passwordHash } = this.hashPassword(signupDto.password);

    const user = this.userRepository.create({
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      email: normalizedEmail,
      phoneNumber: signupDto.phoneNumber,
      role: signupDto.role ?? 'driver',
      organizationId: organization?.id,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salt,
      password: passwordHash,
    });
    const savedUser = await this.userRepository.save(user);

    if (organization) {
      await this.organizationRepository.update(organization.id, {
        ownerUserId: savedUser.id,
      });
    }

    return {
      message: 'Signup successful',
      accessToken: this.createAccessToken(savedUser),
      user: this.toPublicUser(savedUser),
      organization: organization
        ? this.toPublicOrganization(organization)
        : null,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const normalizedPhoneNumber = loginDto.phoneNumber.trim();
    const user = await this.userRepository.findOne({
      where: { phoneNumber: normalizedPhoneNumber },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash } = this.hashPassword(loginDto.password, user.salt);

    if (passwordHash !== user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const organization = user.organizationId
      ? await this.organizationRepository.findOne({
          where: { id: user.organizationId },
        })
      : undefined;

    return {
      message: 'Login successful',
      accessToken: this.createAccessToken(user),
      user: this.toPublicUser(user),
      organization: organization
        ? this.toPublicOrganization(organization)
        : null,
    };
  }

  private async createOrganizationIfNeeded(
    signupDto: SignupDto,
    now: Date,
  ): Promise<Organization | undefined> {
    if (!signupDto.organizationName) {
      return undefined;
    }

    const organization = this.organizationRepository.create({
      name: signupDto.organizationName,
      email: signupDto.organizationEmail ?? signupDto.email,
      phoneNumber: signupDto.organizationPhoneNumber,
      website: signupDto.organizationWebsite,
      address: signupDto.organizationAddress,
      city: signupDto.organizationCity,
      state: signupDto.organizationState,
      country: signupDto.organizationCountry,
      postalCode: signupDto.organizationPostalCode,
      description: signupDto.organizationDescription,
      createdAt: now,
      updatedAt: now,
    });

    return this.organizationRepository.save(organization);
  }

  private hashPassword(password: string, salt: string = randomUUID()) {
    return {
      salt,
      passwordHash: createHash('sha256')
        .update(`${salt}:${password}`)
        .digest('hex'),
    };
  }

  private createAccessToken(user: User) {
    const secret =
      this.configService.get<string>('AUTH_SECRET') ?? 'development-secret';
    const tokenTtlSeconds =
      Number(this.configService.get<string>('AUTH_TOKEN_TTL_SECONDS')) || 86400;
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + tokenTtlSeconds;
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId ?? null,
      iat: issuedAt,
      exp: expiresAt,
    };
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      'base64url',
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );
    const signature = createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private toPublicUser(user: User): AuthUserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }

  private toPublicOrganization(
    organization: Organization,
  ): AuthOrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      email: organization.email,
      phoneNumber: organization.phoneNumber,
      website: organization.website,
      address: organization.address,
      city: organization.city,
      state: organization.state,
      country: organization.country,
      postalCode: organization.postalCode,
      description: organization.description,
      ownerUserId: organization.ownerUserId,
    };
  }
}
