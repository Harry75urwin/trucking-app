import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Printer } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AdminReports() {
  const { t } = useLanguage();
  const reports = [
    {
      name: t("User Activity Report", "उपयोगकर्ता गतिविधि रिपोर्ट"),
      desc: t(
        "Summary of user registrations and activity",
        "उपयोगकर्ता पंजीकरण और गतिविधि का सारांश"
      ),
    },
    {
      name: t("Revenue Report", "आय रिपोर्ट"),
      desc: t(
        "Monthly revenue breakdown by category",
        "श्रेणी के अनुसार मासिक आय विवरण"
      ),
    },
    {
      name: t("Load Performance Report", "लोड प्रदर्शन रिपोर्ट"),
      desc: t(
        "Load completion rates and timeliness",
        "लोड पूर्णता दर और समय परिपालन"
      ),
    },
    {
      name: t("Dispute Resolution Report", "विवाद समाधान रिपोर्ट"),
      desc: t(
        "Dispute trends and resolution metrics",
        "विवाद रुझान और समाधान मेट्रिक्स"
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Reports", "रिपोर्ट")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Generate and export reports",
              "रिपोर्ट जनरेट करें और निर्यात करें"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            {t("Export", "निर्यात")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
            <Printer className="h-4 w-4" />
            {t("Print", "प्रिंट")}
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                {report.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{report.desc}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                <FileText className="h-3 w-3" />
                {t("View Report", "रिपोर्ट देखें")}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
