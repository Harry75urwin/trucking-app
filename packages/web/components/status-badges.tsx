import { Badge } from "@/components/ui/badge";
import type { LoadStatus, DriverStatus, VehicleStatus } from "@/lib/supabase";
import { useLanguage } from "@/lib/language-context";

const loadStatusLabels: Record<LoadStatus, { en: string; hi: string }> = {
  pending: { en: "Pending", hi: "लंबित" },
  dispatched: { en: "Dispatched", hi: "भेजा गया" },
  in_transit: { en: "In Transit", hi: "यातायात में" },
  delivered: { en: "Delivered", hi: "डिलीवर किया गया" },
  cancelled: { en: "Cancelled", hi: "रद्द किया गया" },
  problem: { en: "Problem", hi: "समस्या" },
};

const driverStatusLabels: Record<DriverStatus, { en: string; hi: string }> = {
  available: { en: "Available", hi: "उपलब्ध" },
  on_load: { en: "On Load", hi: "लोड पर" },
  off_duty: { en: "Off Duty", hi: "ऑफ ड्यूटी" },
};

const vehicleStatusLabels: Record<VehicleStatus, { en: string; hi: string }> = {
  active: { en: "Active", hi: "सक्रिय" },
  maintenance: { en: "Maintenance", hi: "रखरखाव" },
  out_of_service: { en: "Out of Service", hi: "सेवा से बाहर" },
};

export function LoadStatusBadge({ status }: { status: LoadStatus }) {
  const { t } = useLanguage();
  const label = t(loadStatusLabels[status].en, loadStatusLabels[status].hi);

  return (
    <Badge
      variant="outline"
      className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
    >
      {label}
    </Badge>
  );
}

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const { t } = useLanguage();
  const colors: Record<DriverStatus, { className: string }> = {
    available: {
      className:
        "border-green-300 text-green-800 dark:border-green-700 dark:text-green-300",
    },
    on_load: {
      className:
        "border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-300",
    },
    off_duty: {
      className:
        "border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300",
    },
  };

  const label = t(driverStatusLabels[status].en, driverStatusLabels[status].hi);

  return (
    <Badge variant="outline" className={colors[status].className}>
      {label}
    </Badge>
  );
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const { t } = useLanguage();
  const colors: Record<VehicleStatus, { className: string }> = {
    active: {
      className:
        "border-green-300 text-green-800 dark:border-green-700 dark:text-green-300",
    },
    maintenance: {
      className:
        "border-yellow-300 text-yellow-800 dark:border-yellow-700 dark:text-yellow-300",
    },
    out_of_service: {
      className:
        "border-red-300 text-red-800 dark:border-red-700 dark:text-red-300",
    },
  };

  const label = t(
    vehicleStatusLabels[status].en,
    vehicleStatusLabels[status].hi,
  );

  return (
    <Badge variant="outline" className={colors[status].className}>
      {label}
    </Badge>
  );
}
