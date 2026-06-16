import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Truck,
  Package,
  IndianRupee,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const stats = [
    {
      label: t("Total Revenue", "कुल आय"),
      value: "₹2.4M",
      icon: IndianRupee,
      change: "+18%",
    },
    {
      label: t("Active Loads", "सक्रिय लोड"),
      value: "342",
      icon: Package,
      change: "+8%",
    },
    {
      label: t("Fleet Utilization", "फ्लीट उपयोग"),
      value: "87%",
      icon: Truck,
      change: "+5%",
    },
    {
      label: t("Growth", "वृद्धि"),
      value: "+24%",
      icon: TrendingUp,
      change: "+4%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("Analytics", "विश्लेषण")}
        </h1>
        <p className="text-muted-foreground">
          {t("Platform performance metrics", "प्लेटफ़ॉर्म प्रदर्शन मेट्रिक्स")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {t("from last month", "पिछले महीने से")} {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t("Analytics Overview", "विश्लेषण अवलोकन")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t(
              "Detailed analytics and visualization charts will be displayed here.",
              "विस्तृत विश्लेषण और विज़ुअलाइज़ेशन चार्ट यहां दिखाए जाएंगे।"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
