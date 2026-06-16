import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCircle2, Camera, Save, Building2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import {
  updateUser,
  updateOrganization,
  fetchOrganization,
  uploadFileToR2,
} from "@/lib/trucker-api";

export default function ProfileSettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { session, login } = useAuthSession();
  const user = session.user;
  if (!user) return null;
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    avatarUrl: user.avatarUrl ?? "",
  });

  const [orgForm, setOrgForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    website: "",
    description: "",
    logoUrl: "",
    primaryColor: "",
  });
  const [loadingOrg, setLoadingOrg] = useState(false);

  const loadOrg = async () => {
    if (!user?.organizationId) return;
    setLoadingOrg(true);
    try {
      const org = await fetchOrganization(session, user.organizationId);
      setOrgForm({
        name: org.name ?? "",
        email: org.email ?? "",
        phoneNumber: org.phoneNumber ?? "",
        address: org.address ?? "",
        city: org.city ?? "",
        state: org.state ?? "",
        website: org.website ?? "",
        description: org.description ?? "",
        logoUrl: org.logoUrl ?? "",
        primaryColor: org.primaryColor ?? "",
      });
    } catch {}
    setLoadingOrg(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateUser(session, user.id, profileForm);
      login({ ...session, user: { ...session.user, ...updated } });
      setMessage(t("Profile updated", "प्रोफ़ाइल अपडेट हो गई"));
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
    setSaving(false);
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organizationId) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateOrganization(session, user.organizationId, orgForm);
      setMessage(t("Organization updated", "संगठन अपडेट हो गया"));
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to update organization",
      );
    }
    setSaving(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
      setSaving(true);
      setMessage(null);
      try {
        const updated = await updateUser(session, user.id, {
          avatarUrl: dataUrl,
        });
        login({ ...session, user: { ...session.user, ...updated } });
        setMessage(t("Avatar updated", "अवतार अपडेट हो गया"));
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "Failed to upload avatar",
        );
      }
      setSaving(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.organizationId) return;
    setUploadingLogo(true);
    setMessage(null);
    try {
      const logoUrl = await uploadFileToR2(
        session,
        file,
        "organization-logo",
      );
      setOrgForm((prev) => ({ ...prev, logoUrl }));
      await updateOrganization(session, user.organizationId, { logoUrl });
      setMessage(t("Logo uploaded", "लोगो अपलोड हो गया"));
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to upload logo",
      );
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const initials =
    `${profileForm.firstName?.[0] ?? ""}${profileForm.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("Profile", "प्रोफ़ाइल")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Update your account identity and contact details",
              "अपनी खाता पहचान और संपर्क विवरण अपडेट करें",
            )}
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="profile"
        className="w-full"
        onValueChange={(v) => v === "branding" && loadOrg()}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="profile">
            {t("Personal", "व्यक्तिगत")}
          </TabsTrigger>
          <TabsTrigger value="branding">
            {t("Company Branding", "कंपनी ब्रांडिंग")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                  <UserCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle>{t("Profile", "प्रोफ़ाइल")}</CardTitle>
                  <CardDescription>
                    {t(
                      "Manage your personal information",
                      "अपनी व्यक्तिगत जानकारी प्रबंधित करें",
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleProfileSubmit}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      className="h-20 w-20 cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                      onClick={handleAvatarClick}
                    >
                      <AvatarImage src={profileForm.avatarUrl} alt="avatar" />
                      <AvatarFallback className="text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t("Profile Photo", "प्रोफ़ाइल फोटो")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "JPG, PNG or GIF. Max 2MB.",
                        "JPG, PNG या GIF। अधिकतम 2MB।",
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {t("First Name", "पहला नाम")}
                    </Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {t("Last Name", "अंतिम नाम")}
                    </Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">{t("Email", "ईमेल")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">
                      {t("Phone Number", "फोन नंबर")}
                    </Label>
                    <Input
                      id="phone"
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {message && (
                  <p className="text-sm text-muted-foreground">{message}</p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4" />{" "}
                    {saving
                      ? t("Saving...", "सहेज रहे हैं...")
                      : t("Save Changes", "परिवर्तन सहेजें")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          {user?.organizationId ? (
            <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>
                      {t("Company Branding", "कंपनी ब्रांडिंग")}
                    </CardTitle>
                    <CardDescription>
                      {t(
                        "Customize your public profile appearance",
                        "अपने सार्वजनिक प्रोफ़ाइल का स्वरूप अनुकूलित करें",
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleOrgSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("Company Name", "कंपनी का नाम")}</Label>
                      <Input
                        value={orgForm.name}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Company Email", "कंपनी का ईमेल")}</Label>
                      <Input
                        value={orgForm.email}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Phone", "फोन")}</Label>
                      <Input
                        value={orgForm.phoneNumber}
                        onChange={(e) =>
                          setOrgForm((p) => ({
                            ...p,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Website", "वेबसाइट")}</Label>
                      <Input
                        value={orgForm.website}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, website: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t("Address", "पता")}</Label>
                      <Input
                        value={orgForm.address}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, address: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("City", "शहर")}</Label>
                      <Input
                        value={orgForm.city}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, city: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("State", "राज्य")}</Label>
                      <Input
                        value={orgForm.state}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, state: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t("Description", "विवरण")}</Label>
                      <Textarea
                        value={orgForm.description}
                        onChange={(e) =>
                          setOrgForm((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Logo", "लोगो")}</Label>
                      <div className="flex items-center gap-3">
                        {orgForm.logoUrl ? (
                          <img
                            src={orgForm.logoUrl}
                            alt="company logo"
                            className="h-12 w-12 rounded-lg border object-cover bg-white"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            Logo
                          </div>
                        )}
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo || saving}
                        >
                          {uploadingLogo
                            ? t("Uploading...", "अपलोड हो रहा है...")
                            : t("Upload Logo", "लोगो अपलोड करें")}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Logo URL", "लोगो URL")}</Label>
                      <Input
                        value={orgForm.logoUrl}
                        onChange={(e) =>
                          setOrgForm((p) => ({ ...p, logoUrl: e.target.value }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("Primary Brand Color", "प्राथमिक ब्रांड रंग")}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={orgForm.primaryColor}
                          onChange={(e) =>
                            setOrgForm((p) => ({
                              ...p,
                              primaryColor: e.target.value,
                            }))
                          }
                          placeholder="#6366f1"
                          className="w-28"
                        />
                        <div
                          className="h-9 w-9 rounded-md border"
                          style={{
                            background: orgForm.primaryColor || "#6366f1",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {message && (
                    <p className="text-sm text-muted-foreground">{message}</p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Save className="w-4 h-4" />{" "}
                      {saving
                        ? t("Saving...", "सहेज रहे हैं...")
                        : t("Save Changes", "परिवर्तन सहेजें")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-card/50 backdrop-blur-sm max-w-3xl">
              <CardContent className="py-8 text-center text-muted-foreground">
                {t(
                  "No organization linked to this account.",
                  "इस खाते से कोई संगठन संबद्ध नहीं है।",
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
