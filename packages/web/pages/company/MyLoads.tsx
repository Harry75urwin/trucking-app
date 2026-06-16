import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Package } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
const loads = [
  {
    id: "LD-001",
    from: "Mumbai",
    to: "Delhi",
    weight: "25T",
    amount: "₹45,000",
    status: "in_transit",
    trucker: "Raj Singh",
  },
  {
    id: "LD-002",
    from: "Pune",
    to: "Bengaluru",
    weight: "18T",
    amount: "₹32,000",
    status: "in_transit",
    trucker: "Amit Yadav",
  },
  {
    id: "LD-003",
    from: "Jaipur",
    to: "Ahmedabad",
    weight: "22T",
    amount: "₹28,000",
    status: "pending",
    trucker: "-",
  },
  {
    id: "LD-004",
    from: "Chennai",
    to: "Hyderabad",
    weight: "15T",
    amount: "₹22,000",
    status: "delivered",
    trucker: "Suresh Kumar",
  },
];
const statusMap: Record<string, string> = {
  in_transit: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  pending: "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
  delivered: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
};

export default function MyLoadsCompany() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = loads.filter(
    (l) =>
      (filter === "all" || l.status === filter) &&
      (l.id.includes(search) ||
        l.from.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Company Loads", "कंपनी के लोड")}
        </h1>
        <p className="text-muted-foreground">
          {t("All loads in your operations", "आपके संचालन के सभी लोड")}
        </p>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search...", "खोजें...")}
          />
        </div>
        {["all", "pending", "in_transit", "delivered"].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            className={
              filter === s
                ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                : ""
            }
            onClick={() => setFilter(s)}
          >
            {s === "all"
              ? t("All", "सभी")
              : s === "in_transit"
                ? t("Transit", "यातायात")
                : s === "pending"
                  ? t("Pending", "लंबित")
                  : t("Done", "पूर्ण")}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((l) => (
          <Card key={l.id} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold">{l.id}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {l.from} → {l.to} · {l.weight} · {l.trucker}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{l.amount}</span>
                <Badge className={statusMap[l.status]}>
                  {l.status === "in_transit"
                    ? t("In Transit", "यातायात में")
                    : l.status === "pending"
                      ? t("Pending", "लंबित")
                      : t("Delivered", "डिलीवर")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
