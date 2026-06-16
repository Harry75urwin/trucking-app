import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

const bidData = [
  {
    loadId: "LD-003",
    route: "Jaipur → Ahmedabad",
    bids: [
      { trucker: "Raj Singh", rating: 4.8, amount: 26000, trips: 156 },
      { trucker: "Suresh Kumar", rating: 4.5, amount: 27500, trips: 89 },
      { trucker: "Mohan Lal", rating: 4.2, amount: 25000, trips: 203 },
    ],
  },
];

export default function BidsPage() {
  const { t } = useLanguage();
  const [accepted, setAccepted] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Incoming Bids", "आने वाली बोलियाँ")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Review and accept bids for your loads",
            "अपने लोड के लिए बोलियाँ समीक्षा करें और स्वीकार करें",
          )}
        </p>
      </div>
      {bidData.map((ld) => (
        <Card key={ld.loadId} className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {ld.loadId}{" "}
              <span className="text-muted-foreground text-sm font-normal flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {ld.route}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ld.bids.map((bid, i) => (
              <div
                key={i}
                className={`p-4 border-0 rounded-xl flex items-center justify-between transition-all ${accepted === bid.trucker ? "bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20" : "bg-linear-to-r from-muted/20 to-transparent dark:from-slate-800/30 hover:from-muted/40"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    {bid.trucker[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{bid.trucker}</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {bid.rating} · {bid.trips} {t("trips", "यात्राएं")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-primary">
                    ₹{bid.amount.toLocaleString()}
                  </span>
                  {accepted === bid.trucker ? (
                    <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t("Accepted", "स्वीकृत")}
                    </Badge>
                  ) : accepted ? null : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md"
                        onClick={() => setAccepted(bid.trucker)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {t("Accept", "स्वीकार करें")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-muted"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {t("Reject", "अस्वीकार")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
