import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateStaticDataDto } from './dto/create-static-data.dto';
import { UpdateStaticDataDto } from './dto/update-static-data.dto';
import { StaticData } from './entities/static-data.entity';

@Injectable()
export class StaticDataService implements OnModuleInit {
  constructor(
    @InjectRepository(StaticData)
    private staticDataRepository: Repository<StaticData>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      await this.initializeDefaultData();
    }
  }

  private isDemoDataEnabled() {
    return ['1', 'true', 'yes'].includes(
      (this.configService.get<string>('DEMO_DATA_ENABLED') ?? '')
        .trim()
        .toLowerCase(),
    );
  }

  private async initializeDefaultData() {
    const defaultCategories = [
      {
        category: 'load_status',
        data: [
          {
            key: 'pending',
            value: 'pending',
            display_en: 'Pending',
            display_hi: 'लंबित',
            sort_order: 1,
          },
          {
            key: 'dispatched',
            value: 'dispatched',
            display_en: 'Dispatched',
            display_hi: 'भेजा गया',
            sort_order: 2,
          },
          {
            key: 'in_transit',
            value: 'in_transit',
            display_en: 'In Transit',
            display_hi: 'यातायात में',
            sort_order: 3,
          },
          {
            key: 'delivered',
            value: 'delivered',
            display_en: 'Delivered',
            display_hi: 'डिलीवर किया गया',
            sort_order: 4,
          },
          {
            key: 'cancelled',
            value: 'cancelled',
            display_en: 'Cancelled',
            display_hi: 'रद्द किया गया',
            sort_order: 5,
          },
          {
            key: 'problem',
            value: 'problem',
            display_en: 'Problem',
            display_hi: 'समस्या',
            sort_order: 6,
          },
        ],
      },
      {
        category: 'driver_status',
        data: [
          {
            key: 'available',
            value: 'available',
            display_en: 'Available',
            display_hi: 'उपलब्ध',
            sort_order: 1,
          },
          {
            key: 'on_load',
            value: 'on_load',
            display_en: 'On Load',
            display_hi: 'लोड पर',
            sort_order: 2,
          },
          {
            key: 'off_duty',
            value: 'off_duty',
            display_en: 'Off Duty',
            display_hi: 'ऑफ ड्यूटी',
            sort_order: 3,
          },
        ],
      },
      {
        category: 'vehicle_status',
        data: [
          {
            key: 'active',
            value: 'active',
            display_en: 'Active',
            display_hi: 'सक्रिय',
            sort_order: 1,
          },
          {
            key: 'maintenance',
            value: 'maintenance',
            display_en: 'Maintenance',
            display_hi: 'रखरखाव',
            sort_order: 2,
          },
          {
            key: 'out_of_service',
            value: 'out_of_service',
            display_en: 'Out of Service',
            display_hi: 'सेवा से बाहर',
            sort_order: 3,
          },
        ],
      },
      {
        category: 'vehicle_type',
        data: [
          {
            key: 'truck',
            value: 'truck',
            display_en: 'Truck',
            display_hi: 'ट्रक',
            sort_order: 1,
          },
          {
            key: 'trailer',
            value: 'trailer',
            display_en: 'Trailer',
            display_hi: 'ट्रेलर',
            sort_order: 2,
          },
        ],
      },
    ];

    for (const { category, data } of defaultCategories) {
      const existingCount = await this.staticDataRepository.count({
        where: { category },
      });
      if (existingCount > 0) continue;

      for (const item of data) {
        const entity = this.staticDataRepository.create({
          id: `${category}_${item.key}`,
          category,
          key: item.key,
          value: item.value,
          display_en: item.display_en,
          display_hi: item.display_hi,
          sort_order: item.sort_order,
          is_active: true,
        });
        await this.staticDataRepository.save(entity);
      }
    }
  }

  create(createStaticDataDto: CreateStaticDataDto) {
    const staticData = this.staticDataRepository.create({
      id: `${createStaticDataDto.category}_${createStaticDataDto.key}`,
      ...createStaticDataDto,
    });
    return this.staticDataRepository.save(staticData);
  }

  findAll(category?: string) {
    const where = category ? { category } : {};
    return this.staticDataRepository.find({
      where,
      order: { sort_order: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.staticDataRepository.findOne({ where: { id } });
  }

  findByCategory(category: string) {
    return this.findAll(category);
  }

  async getValue(category: string, key: string): Promise<string | undefined> {
    const data = await this.staticDataRepository.findOne({
      where: { category, key },
    });
    return data?.value;
  }

  async getDisplay(
    category: string,
    key: string,
    lang: 'en' | 'hi' = 'en',
  ): Promise<string | undefined> {
    const data = await this.staticDataRepository.findOne({
      where: { category, key },
    });
    return lang === 'hi' ? data?.display_hi : data?.display_en;
  }

  update(id: string, updateStaticDataDto: UpdateStaticDataDto) {
    return this.staticDataRepository.update(id, updateStaticDataDto);
  }

  remove(id: string) {
    return this.staticDataRepository.delete(id);
  }
}
