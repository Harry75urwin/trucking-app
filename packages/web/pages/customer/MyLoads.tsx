import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Package } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const loads = [
  {
    id: "LD-2024-001",
    from: "Mumbai",
    to: "Delhi",
    weight: "25T",
    amount: "₹35,000",
    status: "in_transit",
    date: "2024-06-10",
    trucker: "Raj Singh",
  },
  {
    id: "LD-2024-002",
    from: "Pune",
    to: "Bengaluru",
    weight: "18T",
    amount: "₹22,000",
    status: "delivered",
    date: "2024-06-05",
    trucker: "Amit Yadav",
  },
  {
    id: "LD-2024-003",
    from: "Jaipur",
    to: "Ahmedabad",
    weight: "20T",
    amount: "₹18,500",
    status: "pending",
    date: "2024-06-12",
    trucker: "-",
  },
  {
    id: "LD-2024-004",
    from: "Chennai",
    to: "Hyderabad",
    weight: "15T",
    amount: "₹15,000",
    status: "delivered",
    date: "2024-05-28",
    trucker: "Suresh Kumar",
  },
];

const statusStyles: Record<string, string> = {
  in_transit: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  delivered: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  pending: "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
};

export default function MyLoadsCustomer() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = loads.filter(
    (l) =>
      (filter === "all" || l.status === filter) &&
      (l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.from.toLowerCase().includes(search.toLowerCase()) ||
        l.to.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("My Loads", "मेरे लोड")}
        </h1>
        <p className="text-muted-foreground">
          {t("All your posted shipments", "आपके सभी पोस्ट किए गए शिपमेंट")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            placeholder={t("Search loads...", "लोड खोजें...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "in_transit", "delivered"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
              className={
                filter === s
                  ? "bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md"
                  : ""
              }
            >
              {t(
                s === "all"
                  ? "All"
                  : s === "in_transit"
                    ? "In Transit"
                    : s.charAt(0).toUpperCase() + s.slice(1),
                s === "all"
                  ? "सभी"
                  : s === "in_transit"
                    ? "यातायात में"
                    : s === "pending"
                      ? "लंबित"
                      : "डिलीवर",
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              {t("No loads found", "कोई लोड नहीं मिला")}
            </CardContent>
          </Card>
        )}
        {filtered.map((load) => (
          <Card
            key={load.id}
            className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{load.id}</span>
                      <Badge className={statusStyles[load.status]}>
                        {load.status === "in_transit"
                          ? t("In Transit", "यातायात में")
                          : load.status === "delivered"
                            ? t("Delivered", "डिलीवर")
                            : t("Pending", "लंबित")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {load.from} → {load.to}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("Trucker", "ट्रकर")}: {load.trucker} · {load.weight} ·{" "}
                      {load.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {load.amount}
                  </p>
                  {load.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 hover:bg-muted"
                    >
                      {t("View Bids", "बोलियाँ देखें")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
