import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Weight,
  IndianRupee,
  Users,
  Package,
  Phone,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type BidStatus = "active" | "accepted" | "rejected" | "countered";

const mockAuction = {
  id: "AUC-2024-001",
  from: "अहमदाबाद, गुजरात",
  to: "राजकोट, गुजरात",
  weight: "20 टन",
  goods: "Textiles",
  startingBid: "₹25,000",
  currentBid: "₹28,500",
  timeLeft: "2घ 30मि",
  bids: 5,
  customer: "Sharma Exports",
  customerPhone: "+91 98765 11111",
  pickupDate: "2024-01-15",
  deliveryDate: "2024-01-17",
  description:
    "Textile goods transportation, handle with care. Fragile items included.",
  bidHistory: [
    { bidder: "Raj Kumar", amount: "₹28,500", time: "2 min ago" },
    { bidder: "Amit Singh", amount: "₹27,000", time: "15 min ago" },
    { bidder: "Raj Kumar", amount: "₹26,000", time: "32 min ago" },
    { bidder: "Priya Patel", amount: "₹25,500", time: "1 hour ago" },
  ],
};

export default function BidDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [myBid, setMyBid] = useState("");
  const [bidStatus, setBidStatus] = useState<BidStatus>("active");
  const [counterOffer, setCounterOffer] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceBid = async () => {
    if (
      !myBid ||
      parseFloat(myBid) <=
        parseFloat(mockAuction.currentBid.replace(/[^\d]/g, ""))
    ) {
      setFeedback({
        type: "error",
        message: "Bid must be higher than current bid",
      });
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise((_resolve) => setTimeout(_resolve, 500));
      setBidStatus("accepted");
      setFeedback({
        type: "success",
        message: `Bid placed successfully! Amount: ₹${myBid}`,
      });
      setMyBid("");
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to place bid. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptBid = async () => {
    setIsProcessing(true);
    try {
      await new Promise((_resolve) => setTimeout(_resolve, 500));
      setBidStatus("accepted");
      setFeedback({
        type: "success",
        message: "Bid accepted! Load assigned to you.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to accept bid. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBid = async () => {
    setIsProcessing(true);
    try {
      await new Promise((_resolve) => setTimeout(_resolve, 500));
      setBidStatus("rejected");
      setFeedback({ type: "success", message: "Bid rejected successfully." });
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to reject bid. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCounterOffer = async () => {
    if (
      !counterOffer ||
      parseFloat(counterOffer) <=
        parseFloat(mockAuction.currentBid.replace(/[^\d]/g, ""))
    ) {
      setFeedback({
        type: "error",
        message: "Counter-offer must be higher than current bid",
      });
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise((_resolve) => setTimeout(_resolve, 500));
      setBidStatus("countered");
      setFeedback({
        type: "success",
        message: `Counter-offer sent: ₹${counterOffer}`,
      });
      setCounterOffer("");
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to send counter-offer. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {feedback && (
        <Alert
          className={`border-0 ${feedback.type === "success" ? "bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20" : "bg-linear-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"}`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <AlertTitle>
            {feedback.type === "success"
              ? t("Success", "सफल")
              : t("Error", "त्रुटि")}
          </AlertTitle>
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <Link to="/trucker/bidding">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-xl">{mockAuction.id}</CardTitle>
            {bidStatus === "accepted" ? (
              <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                {t("Accepted", "स्वीकृत")}
              </Badge>
            ) : bidStatus === "rejected" ? (
              <Badge className="bg-linear-to-r from-rose-500 to-pink-600 border-0">
                <XCircle className="w-3 h-3 mr-1" /> {t("Rejected", "अस्वीकृत")}
              </Badge>
            ) : bidStatus === "countered" ? (
              <Badge className="bg-linear-to-r from-amber-500 to-orange-600 border-0">
                <TrendingUp className="w-3 h-3 mr-1" />{" "}
                {t("Counter-offered", "काउंटर-ऑफर")}
              </Badge>
            ) : (
              <Badge className="bg-linear-to-r from-rose-500 to-pink-600 border-0 animate-pulse">
                <Clock className="w-3 h-3 mr-1" /> {mockAuction.timeLeft}
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {mockAuction.from} → {mockAuction.to}
          </CardDescription>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 overflow-hidden">
            <CardHeader className="pb-3 bg-linear-to-r from-orange-100/50 to-amber-100/50 dark:from-orange-900/20 dark:to-amber-900/20">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{mockAuction.id}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> {mockAuction.from} →{" "}
                    {mockAuction.to}
                  </CardDescription>
                </div>
                <Badge className="bg-linear-to-r from-rose-500 to-pink-600 border-0 animate-pulse">
                  <Clock className="w-3 h-3 mr-1" /> {mockAuction.timeLeft}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/50">
                  <p className="text-muted-foreground">{t("Weight", "वजन")}</p>
                  <p className="font-semibold flex items-center gap-1 mt-1">
                    <Weight className="w-3 h-3" />
                    {mockAuction.weight}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/50">
                  <p className="text-muted-foreground">{t("Goods", "माल")}</p>
                  <p className="font-semibold flex items-center gap-1 mt-1">
                    <Package className="w-3 h-3" />
                    {mockAuction.goods}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/50">
                  <p className="text-muted-foreground">
                    {t("Bids", "बोलियाँ")}
                  </p>
                  <p className="font-semibold flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    {mockAuction.bids}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("Current Bid", "वर्तमान बोली")}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{mockAuction.currentBid}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {t("Starting Bid", "शुरुआती बोली")}
                    </p>
                    <p className="text-lg font-medium">
                      ₹{mockAuction.startingBid}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  {mockAuction.bids}{" "}
                  {t(
                    "bidders are active - place your bid now!",
                    "बोलीदाता सक्रिय हैं - अभी बोली लगाएं!"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {t("Route & Delivery Details", "मार्ग और डिलीवरी विवरण")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Pickup and delivery schedule",
                  "पिकअप और डिलीवरी कार्यक्रम"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">
                      {t("Pickup", "पिकअप")}
                    </span>
                  </div>
                  <p className="font-semibold">{mockAuction.from}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {mockAuction.pickupDate}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-medium">
                      {t("Delivery", "डिलीवरी")}
                    </span>
                  </div>
                  <p className="font-semibold">{mockAuction.to}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {mockAuction.deliveryDate}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/30 dark:bg-slate-800/30">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("Description", "विवरण")}
                </p>
                <p className="text-sm">{mockAuction.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />{" "}
                {t("Bid History", "बोली इतिहास")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAuction.bidHistory.map((bid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {bid.bidder.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bid.bidder}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {bid.time}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{bid.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Auction Summary", "नीलामी सारांश")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Auction ID", "नीलामी आईडी")}
                </span>
                <span className="font-medium">{mockAuction.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Weight", "वजन")}
                </span>
                <span className="font-medium flex items-center gap-1">
                  <Weight className="w-3 h-3" />
                  {mockAuction.weight}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Current Bid", "वर्तमान बोली")}
                </span>
                <span className="font-medium text-lg text-primary">
                  {mockAuction.currentBid}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  {t("Starting Bid", "शुरुआती बोली")}
                </span>
                <span className="font-medium">{mockAuction.startingBid}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  {t("Time Left", "समय बचा")}
                </span>
                <Badge className="bg-linear-to-r from-rose-500 to-pink-600 border-0">
                  {mockAuction.timeLeft}
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
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{mockAuction.customer}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {mockAuction.customerPhone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-linear-to-br from-orange-500 to-amber-600 text-white">
            <CardContent className="pt-6 space-y-4">
              <p className="font-semibold text-lg">
                {t("Place Your Bid", "अपनी बोली लगाएं")}
              </p>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input
                  className="pl-8 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder={t("Enter bid amount", "बोली राशि डालें")}
                  value={myBid}
                  onChange={(e) => setMyBid(e.target.value)}
                  type="number"
                  disabled={bidStatus !== "active"}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="bg-white text-orange-700 hover:bg-white/90 font-semibold shadow-lg"
                  onClick={() => void handlePlaceBid()}
                  disabled={bidStatus !== "active" || isProcessing}
                >
                  {isProcessing
                    ? t("Placing...", "लगाया जा रहा है...")
                    : t("🔨 Place Bid", "🔨 बोली लगाएं")}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold"
                  onClick={() => void handleAcceptBid()}
                  disabled={bidStatus !== "active" || isProcessing}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {t("Accept", "स्वीकार")}
                </Button>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                <Input
                  className="pl-8 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder={t("Counter offer amount", "काउंटर-ऑफर राशि")}
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  type="number"
                  disabled={bidStatus !== "active"}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 border-amber-300/50 text-amber-700 hover:bg-amber-50/20 font-semibold"
                  onClick={() => void handleCounterOffer()}
                  disabled={bidStatus !== "active" || isProcessing}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {t("Counter Offer", "काउंटर-ऑफर")}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-rose-300/50 text-rose-700 hover:bg-rose-50/20 font-semibold"
                  onClick={() => void handleRejectBid()}
                  disabled={bidStatus !== "active" || isProcessing}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  {t("Reject", "अस्वीकार")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
