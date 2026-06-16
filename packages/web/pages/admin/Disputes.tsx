import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Pill,
  ShieldCheck,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

type DisputeStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "rejected"
  | "escalated";

const disputes = [
  {
    id: "DSP-001",
    loadId: "LD-2024-310",
    type: "Damage Claim",
    from: "Sharma Exports",
    against: "Raj Singh",
    amount: "₹15,000",
    status: "open",
    date: "Jun 10",
    desc: "Goods damaged during transit - broken electronics",
    priority: "high",
    evidence: "Photos attached by both parties",
    assignedTo: "Support Lead",
    auditTrail: [
      {
        action: "dispute_filed",
        actor: "Sharma Exports",
        time: "Jun 10, 10:30 AM",
        notes: "Initial filing",
      },
      {
        action: "evidence_uploaded",
        actor: "Raj Singh",
        time: "Jun 10, 2:15 PM",
        notes: "Submitted photos",
      },
    ],
  },
  {
    id: "DSP-002",
    loadId: "LD-2024-298",
    type: "Late Delivery",
    from: "Tech Goods Co",
    against: "Amit Yadav",
    amount: "₹5,000",
    status: "under_review",
    date: "Jun 8",
    desc: "Delivery was 3 days late causing business loss",
    priority: "medium",
    evidence: "GPS logs uploaded",
    assignedTo: "Ops Manager",
    auditTrail: [
      {
        action: "dispute_filed",
        actor: "Tech Goods Co",
        time: "Jun 8, 9:00 AM",
        notes: "Late delivery complaint",
      },
      {
        action: "review_started",
        actor: "Ops Manager",
        time: "Jun 9, 11:00 AM",
        notes: "Investigation in progress",
      },
    ],
  },
  {
    id: "DSP-003",
    loadId: "LD-2024-280",
    type: "Payment Dispute",
    from: "Raj Singh",
    against: "FastFreight",
    amount: "₹22,000",
    status: "resolved",
    date: "Jun 2",
    desc: "Payment not received after load delivered",
    priority: "high",
    evidence: "Bank transaction proof",
    assignedTo: "Finance",
    auditTrail: [
      {
        action: "dispute_filed",
        actor: "Raj Singh",
        time: "Jun 2, 3:00 PM",
        notes: "Payment discrepancy",
      },
      {
        action: "review_started",
        actor: "Finance",
        time: "Jun 3, 10:00 AM",
        notes: "Verifying transactions",
      },
      {
        action: "approved",
        actor: "Finance",
        time: "Jun 4, 4:30 PM",
        notes: "Payment confirmed, dispute resolved",
      },
    ],
  },
];

const statusStyles: Record<string, string> = {
  open: "bg-linear-to-r from-rose-500 to-pink-600 text-white border-0",
  under_review:
    "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
  resolved: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
  rejected: "bg-linear-to-r from-slate-500 to-gray-600 text-white border-0",
  escalated: "bg-linear-to-r from-indigo-500 to-purple-600 text-white border-0",
};

const priorityStyles: Record<string, string> = {
  high: "bg-linear-to-r from-rose-500 to-pink-600 text-white border-0",
  medium: "bg-linear-to-r from-amber-500 to-orange-600 text-white border-0",
  low: "bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0",
};

type DetailOpen = string | null;

const actionLabels: Record<string, { en: string; hi: string }> = {
  dispute_filed: { en: "Dispute Filed", hi: "विवाद दायर" },
  evidence_uploaded: { en: "Evidence Uploaded", hi: "प्रमाण अपलोड किया" },
  review_started: { en: "Review Started", hi: "समीक्षा शुरू" },
  approved: { en: "Approved", hi: "स्वीकृत" },
  rejected: { en: "Rejected", hi: "अस्वीकृत" },
  closed: { en: "Closed", hi: "बंद कर दिया" },
  escalated: { en: "Escalated", hi: "उच्च स्तर पर" },
};

export default function DisputesPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<DetailOpen>(null);
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, DisputeStatus>
  >({});
  const [resolutionNotes, setResolutionNotes] = useState<
    Record<string, string>
  >({});
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentStatusMap = (id: string) =>
    localStatuses[id] || disputes.find((d) => d.id === id)?.status || "open";

  const select = (id: DetailOpen) => setSelected(id);
  const back = () => setSelected(null);

  const updateStatus = (id: string, status: DisputeStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const setNote = (id: string, value: string) =>
    setResolutionNotes((prev) => ({ ...prev, [id]: value }));

  const handleApprove = (id: string) => {
    setFeedback({
      type: "success",
      message: t("Dispute approved successfully", "विवाद स्वीकृत हुआ"),
    });
    updateStatus(id, "resolved");
  };

  const handleReject = (id: string) => {
    setFeedback({
      type: "success",
      message: t("Dispute rejected successfully", "विवाद अस्वीकृत किया गया"),
    });
    updateStatus(id, "rejected");
  };

  const handleClose = (id: string) => {
    setFeedback({
      type: "success",
      message: t("Dispute closed successfully", "विवाद बंद कर दिया गया"),
    });
    updateStatus(id, "resolved");
  };

  const handleEscalate = (id: string) => {
    setFeedback({
      type: "success",
      message: t(
        "Dispute escalated to senior support",
        "विवाद को वरिष्ठ समर्थन के स्तर पर उठाया गया",
      ),
    });
    updateStatus(id, "escalated");
  };

  const detail = disputes.find((d) => d.id === selected);

  return (
    <div className="p-6 space-y-6">
      {feedback && (
        <div className="p-4 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-0 border-emerald-200 dark:border-emerald-900/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-800 dark:text-emerald-300">
              {feedback.message}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {t("Dispute Management", "विवाद प्रबंधन")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Review and resolve platform disputes",
              "प्लेटफॉर्म विवाद समीक्षा और हल करें",
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-linear-to-r from-rose-500 to-pink-600 text-white border-0 px-3 py-1">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {
              disputes.filter((d) => currentStatusMap(d.id) === "open").length
            }{" "}
            {t("Open", "खुले")}
          </Badge>
          <Badge className="bg-linear-to-r from-amber-500 to-orange-600 text-white border-0 px-3 py-1">
            <Clock className="w-3 h-3 mr-1" />
            {
              disputes.filter((d) => currentStatusMap(d.id) === "under_review")
                .length
            }{" "}
            {t("Under Review", "समीक्षा में")}
          </Badge>
          <Badge className="bg-linear-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {
              disputes.filter(
                (d) =>
                  currentStatusMap(d.id) === "resolved" ||
                  currentStatusMap(d.id) === "rejected",
              ).length
            }{" "}
            {t("Resolved", "हल हुआ")}
          </Badge>
        </div>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 gap-4">
          {disputes.map((d) => (
            <Card
              key={d.id}
              className={`border-0 cursor-pointer transition-shadow hover:shadow-lg ${d.status === "open" ? "bg-linear-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20" : "bg-card/50 backdrop-blur-sm"}`}
              onClick={() => select(d.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{d.id}</h3>
                      <Badge variant="outline">{d.loadId}</Badge>
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[currentStatusMap(d.id)]}`}
                      >
                        {currentStatusMap(d.id) === "open"
                          ? t("Open", "खुला")
                          : currentStatusMap(d.id) === "under_review"
                            ? t("Under Review", "समीक्षा में")
                            : currentStatusMap(d.id) === "resolved"
                              ? t("Resolved", "हल हुआ")
                              : currentStatusMap(d.id) === "rejected"
                                ? t("Rejected", "अस्वीकृत")
                                : t("Escalated", "उच्च स्तम्भ")}
                      </Badge>
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[d.priority]}`}
                      >
                        {d.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {d.type} · {d.date} · {t("Assigned To", "असाइन किया")}:{" "}
                      {d.assignedTo}
                    </p>
                  </div>
                  <span className="font-bold text-lg text-primary">
                    {d.amount}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-muted-foreground text-xs">
                      {t("Filed By", "दायर किया")}
                    </p>
                    <p className="font-medium">{d.from}</p>
                  </div>
                  <div className="p-2 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                    <p className="text-muted-foreground text-xs">
                      {t("Against", "के खिलाफ")}
                    </p>
                    <p className="font-medium">{d.against}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/30 dark:bg-slate-800/30 p-3 rounded-lg">
                  {d.desc}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <Pill className="w-3 h-3 inline mr-1" />
                    {d.evidence}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={back} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />{" "}
            {t("Back to Disputes", "विवादों पर वापस जाएं")}
          </Button>

          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{detail?.id}</h2>
                    <Badge
                      className={
                        statusStyles[currentStatusMap(detail?.id || "")]
                      }
                    >
                      {currentStatusMap(detail?.id || "") === "open"
                        ? t("Open", "खुला")
                        : currentStatusMap(detail?.id || "") === "under_review"
                          ? t("Under Review", "समीक्षा में")
                          : currentStatusMap(detail?.id || "") === "resolved"
                            ? t("Resolved", "हल हुआ")
                            : currentStatusMap(detail?.id || "") === "rejected"
                              ? t("Rejected", "अस्वीकृत")
                              : t("Escalated", "उच्च स्तम्भ")}
                    </Badge>
                    <Badge
                      className={priorityStyles[detail?.priority || "low"]}
                    >
                      {detail?.priority}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {detail?.type} · {detail?.date} · {detail?.loadId}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {detail?.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("Assigned To", "असाइन किया")}: {detail?.assignedTo}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Filed By", "दायर किया")}
                  </p>
                  <p className="font-medium">{detail?.from}</p>
                </div>
                <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {t("Against", "के खिलाफ")}
                  </p>
                  <p className="font-medium">{detail?.against}</p>
                </div>
              </div>
              <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  {t("Issue Description", "विवाद विवरण")}
                </p>
                <p className="text-sm">{detail?.desc}</p>
              </div>
              <div className="p-3 bg-muted/30 dark:bg-slate-800/30 rounded-lg flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("Evidence Provided", "प्रमाण प्रदान किया गया")}
                  </p>
                  <p className="text-sm font-medium">{detail?.evidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {t("Audit Trail", "ऑडिट ट्रेल")}
              </CardTitle>
              <CardDescription>
                {t(
                  "History of all actions taken on this dispute",
                  "इस विवाद पर लिए गए सभी कार्रवाइयों का इतिहास",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detail?.auditTrail.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {actionLabels[entry.action]?.en || entry.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.time}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("By", "द्वारा")}: {entry.actor}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Resolution Actions", "समाधान कार्रवाइयाँ")}
              </CardTitle>
              <CardDescription>
                {t("Take action on this dispute", "इस विवाद पर कार्रवाई करें")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md gap-2"
                  onClick={() => handleApprove(detail?.id || "")}
                  disabled={
                    currentStatusMap(detail?.id || "") === "resolved" ||
                    currentStatusMap(detail?.id || "") === "rejected"
                  }
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("Approve", "स्वीकार")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950/30 gap-2"
                  onClick={() => handleClose(detail?.id || "")}
                  disabled={currentStatusMap(detail?.id || "") === "resolved"}
                >
                  <XCircle className="w-4 h-4" />
                  {t("Close", "बंद करें")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-950/30 gap-2"
                  onClick={() => handleReject(detail?.id || "")}
                  disabled={currentStatusMap(detail?.id || "") === "rejected"}
                >
                  <XCircle className="w-4 h-4" />
                  {t("Reject", "अस्वीकार")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-950/30 gap-2"
                  onClick={() => handleEscalate(detail?.id || "")}
                  disabled={currentStatusMap(detail?.id || "") === "escalated"}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {t("Escalate", "उच्च स्तम्भ")}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  {t("Resolution Notes", "समाधान नोट")}
                </label>
                <Textarea
                  rows={3}
                  placeholder={t(
                    "Add notes for this resolution...",
                    "इस समाधान के लिए नोट जोड़ें...",
                  )}
                  value={resolutionNotes[detail?.id || ""] || ""}
                  onChange={(e) => setNote(detail?.id || "", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
