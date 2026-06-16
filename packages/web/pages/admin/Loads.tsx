import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Package, Eye } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const loads = [
  {
    id: "LD-2024-342",
    from: "Mumbai",
    to: "Delhi",
    weight: "25T",
    amount: "₹45,000",
    status: "in_transit",
    customer: "Sharma Exports",
    trucker: "Raj Singh",
  },
  {
    id: "LD-2024-341",
    from: "Pune",
    to: "Bengaluru",
    weight: "18T",
    amount: "₹32,000",
    status: "delivered",
    customer: "Tech Goods Co",
    trucker: "Amit Yadav",
  },
  {
    id: "LD-2024-340",
    from: "Jaipur",
    to: "Ahmedabad",
    weight: "22T",
    amount: "₹28,000",
    status: "pending",
    customer: "Rajputana Traders",
    trucker: "-",
  },
  {
    id: "LD-2024-339",
    from: "Chennai",
    to: "Hyderabad",
    weight: "30T",
    amount: "₹38,000",
    status: "in_transit",
    customer: "South Cargo",
    trucker: "Suresh K",
  },
  {
    id: "LD-2024-338",
    from: "Kolkata",
    to: "Patna",
    weight: "15T",
    amount: "₹18,000",
    status: "delivered",
    customer: "East Bengal Co",
    trucker: "Ravi Das",
  },
];
const statusStyles: Record<string, string> = {
  in_transit: "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-0",
  delivered: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  pending: "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
};

export default function LoadsManagement() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = loads.filter(
    (l) =>
      (filter === "all" || l.status === filter) &&
      (l.id.includes(search) ||
        l.from.toLowerCase().includes(search.toLowerCase()) ||
        l.customer.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("Loads Management", "लोड प्रबंधन")}
        </h1>
        <p className="text-muted-foreground">
          {t("Monitor all platform loads", "सभी प्लेटफॉर्म लोड मॉनिटर करें")}
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search loads...", "लोड खोजें...")}
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
                  : t("Delivered", "डिलीवर")}
          </Button>
        ))}
      </div>
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-4 space-y-3">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 transition-all hover:from-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold">{l.id}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {l.from} → {l.to} · {l.weight}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {l.customer} → {l.trucker}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">{l.amount}</span>
                <Badge className={statusStyles[l.status]}>
                  {l.status === "in_transit"
                    ? t("In Transit", "यातायात में")
                    : l.status === "pending"
                      ? t("Pending", "लंबित")
                      : t("Delivered", "डिलीवर")}
                </Badge>
                <Button variant="outline" size="sm" className="hover:bg-muted">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
