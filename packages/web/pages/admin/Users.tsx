import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const users = [
  {
    id: 1,
    name: "Raj Singh",
    role: "trucker",
    city: "Mumbai",
    status: "active",
    joined: "Jan 2024",
    loads: 45,
  },
  {
    id: 2,
    name: "FastFreight Pvt Ltd",
    role: "company",
    city: "Delhi",
    status: "active",
    joined: "Mar 2024",
    loads: 120,
  },
  {
    id: 3,
    name: "Sharma Exports",
    role: "customer",
    city: "Jaipur",
    status: "active",
    joined: "Feb 2024",
    loads: 28,
  },
  {
    id: 4,
    name: "Amit Yadav",
    role: "trucker",
    city: "Bengaluru",
    status: "pending",
    joined: "Jun 2024",
    loads: 0,
  },
  {
    id: 5,
    name: "South Cargo Co",
    role: "company",
    city: "Chennai",
    status: "suspended",
    joined: "Nov 2023",
    loads: 67,
  },
];
const roleColor: Record<string, string> = {
  trucker: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  company:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  customer:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
};
const statusColor: Record<string, string> = {
  active: "bg-linear-to-r from-emerald-500 to-teal-600 border-0",
  pending: "bg-linear-to-r from-amber-500 to-orange-600 border-0",
  suspended: "bg-linear-to-r from-rose-500 to-pink-600 border-0",
};

export default function UsersManagement() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filtered = users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {t("User Management", "उपयोगकर्ता प्रबंधन")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "Manage all platform users",
            "सभी प्लेटफॉर्म उपयोगकर्ताओं को प्रबंधित करें",
          )}
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background/80 dark:bg-slate-800/50 backdrop-blur-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search users...", "उपयोगकर्ता खोजें...")}
          />
        </div>
        {["all", "trucker", "company", "customer"].map((r) => (
          <Button
            key={r}
            size="sm"
            variant={roleFilter === r ? "default" : "outline"}
            className={
              roleFilter === r
                ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                : ""
            }
            onClick={() => setRoleFilter(r)}
          >
            {r === "all"
              ? t("All", "सभी")
              : r === "trucker"
                ? t("Truckers", "ट्रकर")
                : r === "company"
                  ? t("Companies", "कंपनियाँ")
                  : t("Customers", "ग्राहक")}
          </Button>
        ))}
      </div>
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="space-y-3">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 border-0 rounded-xl bg-linear-to-r from-muted/30 to-transparent dark:from-slate-800/50 transition-all hover:from-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{u.name}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[u.role]}`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {u.city} · {t("Joined", "जुड़े")} {u.joined} · {u.loads}{" "}
                      {t("loads", "लोड")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColor[u.status]} text-white`}>
                    {u.status}
                  </Badge>
                  {u.status === "pending" && (
                    <Button
                      size="sm"
                      className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t("Approve", "मंजूरी दें")}
                    </Button>
                  )}
                  {u.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      {t("Suspend", "निलंबित करें")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
