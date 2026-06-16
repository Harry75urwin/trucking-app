import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Truck,
  Package,
  MapPin,
  Phone,
  Globe,
  ArrowLeft,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const orgs = [
  {
    id: "1",
    name: "FastFreight Pvt Ltd",
    city: "Delhi",
    state: "Delhi",
    website: "https://fastfreight.example.com",
    phone: "+91-98765-00001",
    description:
      "Leading logistics provider specializing in bulk and FTL shipments across North India. 10+ years of reliable service with 24/7 fleet tracking and dedicated customer support.",
    logoUrl: "",
    primaryColor: "#6366f1",
    created_at: "2020-01-15",
    rating: 4.7,
    loads: 120,
    drivers: 18,
  },
  {
    id: "2",
    name: "Sharma Express",
    city: "Jaipur",
    state: "Rajasthan",
    website: "https://sharmaexpress.example.com",
    phone: "+91-98765-00002",
    description:
      "Family-owned transport company with deep roots in Rajasthan. We handle refrigerated and dry goods with modern temperature-controlled fleet.",
    logoUrl: "",
    primaryColor: "#0891b2",
    created_at: "2018-06-01",
    rating: 4.5,
    loads: 85,
    drivers: 12,
  },
  {
    id: "3",
    name: "Metro Cargo Solutions",
    city: "Mumbai",
    state: "Maharashtra",
    website: "https://metrocargo.example.com",
    phone: "+91-98765-00003",
    description:
      "Premium logistics for e-commerce and high-value goods. Real-time tracking, insurance coverage, and same-city express delivery available.",
    logoUrl: "",
    primaryColor: "#be185d",
    created_at: "2022-03-10",
    rating: 4.3,
    loads: 210,
    drivers: 25,
  },
];

export default function PublicProfilePage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const org = orgs.find((o) => o.id === id) || orgs[0];
  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {t("Back to Login", "लॉगिन पर वापस जाएं")}
        </Link>

        <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-lg overflow-hidden">
          <div
            className="h-32 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600"
            style={{ background: org.primaryColor || undefined }}
          />
          <CardContent className="relative pt-0 pb-8 px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              <div className="relative">
                {org.logoUrl ? (
                  <img
                    src={org.logoUrl}
                    alt={org.name}
                    className="h-32 w-32 rounded-2xl border-4 border-background shadow-xl object-cover bg-white"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-2xl border-4 border-background shadow-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold">{org.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  {org.city && org.state && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {org.city}, {org.state}
                    </span>
                  )}
                  {org.website && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> {org.website}
                    </span>
                  )}
                  {org.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {org.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className="bg-linear-to-r from-amber-500 to-orange-600 text-white border-0">
                    <Star className="w-3 h-3 mr-1 fill-white" /> {org.rating}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20">
                    <ShieldCheck className="w-3 h-3 mr-1 text-primary" />{" "}
                    {t("Verified", "सत्यापित")}
                  </Badge>
                </div>
              </div>
            </div>

            {org.description && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {org.description}
                </p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 bg-muted/30">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{org.drivers}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("Drivers", "ड्राइवर")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-muted/30">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{org.loads}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("Total Loads", "कुल लोड")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-muted/30">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {new Date(org.created_at).getFullYear()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("Established", "स्थापित")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle>{t("Top Drivers", "शीर्ष ड्राइवर")}</CardTitle>
            <CardDescription>
              {t(
                "Rated drivers from this organization",
                "इस संगठन के रेटेड ड्राइवर"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Raj Singh", home: "Mumbai, MH", rating: 4.8 },
              { name: "Amit Yadav", home: "Bengaluru, KA", rating: 4.5 },
              { name: "Suresh Kumar", home: "Pune, MH", rating: 4.9 },
            ].map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white">
                      {d.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.home}</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />{" "}
                  {d.rating}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle>{t("Recent Loads", "हाल के लोड")}</CardTitle>
            <CardDescription>
              {t("Latest shipments handled", "नवीनतम शिपमेंट्स")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                id: "LD-104",
                from: "Mumbai",
                to: "Delhi",
                status: "delivered",
              },
              {
                id: "LD-103",
                from: "Pune",
                to: "Bengaluru",
                status: "in_transit",
              },
              {
                id: "LD-102",
                from: "Jaipur",
                to: "Ahmedabad",
                status: "pending",
              },
            ].map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{l.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.from} → {l.to}
                    </p>
                  </div>
                </div>
                <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 border-0">
                  {l.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
