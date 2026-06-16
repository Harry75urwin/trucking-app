import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp, IndianRupee, Users } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const auctions = [
  {
    id: "AUC-001",
    from: "Ahmedabad",
    to: "Rajkot",
    weight: "20T",
    startBid: 25000,
    currentBid: 28500,
    timeLeft: "2h 30m",
    bids: 5,
    goods: "Textiles",
  },
  {
    id: "AUC-002",
    from: "Jaipur",
    to: "Delhi",
    weight: "30T",
    startBid: 35000,
    currentBid: 38000,
    timeLeft: "5h 15m",
    bids: 8,
    goods: "Electronics",
  },
  {
    id: "AUC-003",
    from: "Kolkata",
    to: "Patna",
    weight: "15T",
    startBid: 18000,
    currentBid: 19500,
    timeLeft: "1h 10m",
    bids: 3,
    goods: "FMCG",
  },
  {
    id: "AUC-004",
    from: "Indore",
    to: "Nagpur",
    weight: "25T",
    startBid: 22000,
    currentBid: 22000,
    timeLeft: "8h 00m",
    bids: 1,
    goods: "Machinery",
  },
];

export default function BiddingPage() {
  const { t } = useLanguage();
  const [bids, setBids] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<Record<string, boolean>>({});

  const placeBid = (id: string) => {
    if (bids[id]) setPlaced({ ...placed, [id]: true });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Live Auctions", "लाइव नीलामी")}
        </h1>
        <p className="text-muted-foreground">
          {t("Bid on available loads", "उपलब्ध लोड पर बोली लगाएं")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map((a) => (
          <Card
            key={a.id}
            className="border-0 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden"
          >
            <CardHeader className="pb-3 bg-linear-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/20 dark:to-amber-900/20">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{a.id}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {a.from} → {a.to}
                  </CardDescription>
                </div>
                <Badge className="bg-linear-to-r from-rose-500 to-pink-600 border-0 animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  {a.timeLeft}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{t("Weight", "वजन")}</p>
                  <p className="font-semibold">{a.weight}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("Goods", "माल")}</p>
                  <p className="font-semibold">{a.goods}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {t("Bids", "बोलियाँ")}
                  </p>
                  <p className="font-semibold">{a.bids}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("Current Bid", "वर्तमान बोली")}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    ₹{a.currentBid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("Starting", "शुरुआती")}
                  </p>
                  <p className="font-medium">₹{a.startBid.toLocaleString()}</p>
                </div>
              </div>
              {placed[a.id] ? (
                <div className="p-3 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg text-center">
                  <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                    ✅ {t("Bid Placed: ₹", "बोली लगाई: ₹")}
                    {bids[a.id]}
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-8 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
                      type="number"
                      placeholder={t("Your bid", "आपकी बोली")}
                      value={bids[a.id] || ""}
                      onChange={(e) =>
                        setBids({ ...bids, [a.id]: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    className="bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md"
                    onClick={() => placeBid(a.id)}
                  >
                    {t("Bid", "बोली")}
                  </Button>
                </div>
              )}
              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-muted"
                  asChild
                >
                  <Link to={`/trucker/bidding/${a.id}`}>
                    {t("Details", "विवरण")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
