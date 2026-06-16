import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Weight,
  DollarSign,
  User,
  Phone,
  Truck,
  Clock,
  Navigation,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Link } from "react-router-dom";

const mockLoad = {
  id: "LD-2024-001",
  loadNumber: "LD-2024-001",
  from: "मुंबई, महाराष्ट्र",
  to: "दिल्ली, दिल्ली",
  weight: "25 टन",
  price: "₹35,000",
  status: "in_transit",
  progress: 65,
  customer: "Sharma Exports",
  customerPhone: "+91 98765 11111",
  driver: "Raj Kumar",
  driverPhone: "+91 98765 43210",
  vehicle: "MH 04 AB 1234",
  pickupDate: "2024-01-15",
  deliveryDate: "2024-01-18",
  description:
    "General goods transportation with fragile items handling required.",
};

export default function LoadDetails() {
  const { id } = useParams();
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/trucker/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {t("Load Details", "लोड विवरण")}
          </h1>
          <p className="text-muted-foreground">
            {mockLoad.loadNumber} · {id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {mockLoad.loadNumber}
                  </CardTitle>
                  <CardDescription>
                    {mockLoad.from} → {mockLoad.to}
                  </CardDescription>
                </div>
                <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0">
                  {mockLoad.status === "in_transit"
                    ? t("🚚 In Transit", "🚚 यातायात में")
                    : mockLoad.status === "pickup"
                      ? t("📍 Pickup", "📍 पिकअप")
                      : t("✅ Delivered", "✅ डिलीवर")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("Progress", "प्रगति")}
                  </span>
                  <span className="font-medium">{mockLoad.progress}%</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${mockLoad.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-slate-800/50 rounded-lg">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900 dark:text-blue-300">
                  {t("Currently near", "वर्तमान में पास")}: {mockLoad.to}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{t("Route Information", "मार्ग जानकारी")}</CardTitle>
              <CardDescription>
                {t("Pickup and delivery details", "पिकअप और डिलीवरी विवरण")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">
                      {t("Pickup Location", "पिकअप स्थान")}
                    </span>
                  </div>
                  <p className="font-semibold">{mockLoad.from}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {mockLoad.pickupDate}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-medium">
                      {t("Delivery Location", "डिलीवरी स्थान")}
                    </span>
                  </div>
                  <p className="font-semibold">{mockLoad.to}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {mockLoad.deliveryDate}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("Description", "विवरण")}
                </p>
                <p className="text-sm">{mockLoad.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Load Summary", "लोड सारांश")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Load ID", "लोड आईडी")}
                </span>
                <span className="font-medium">{mockLoad.loadNumber}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Weight", "वजन")}
                </span>
                <span className="font-medium flex items-center gap-1">
                  <Weight className="w-3 h-3" />
                  {mockLoad.weight}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Price", "कीमत")}
                </span>
                <span className="font-medium text-lg text-primary">
                  {mockLoad.price}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Vehicle", "वाहन")}
                </span>
                <span className="font-medium flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  {mockLoad.vehicle}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  {t("Status", "स्थिति")}
                </span>
                <Badge
                  className={
                    mockLoad.status === "in_transit"
                      ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0"
                      : "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0"
                  }
                >
                  {mockLoad.status === "in_transit"
                    ? t("In Transit", "यातायात में")
                    : t("Delivered", "डिलीवर")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Customer Info", "ग्राहक जानकारी")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{mockLoad.customer}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {mockLoad.customerPhone}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("Assigned Driver", "निर्दिष्ट ड्राइवर")}
                </p>
                <p className="font-medium">{mockLoad.driver}</p>
                <p className="text-sm text-muted-foreground">
                  {mockLoad.driverPhone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
