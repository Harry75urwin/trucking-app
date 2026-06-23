import { Badge } from "@/components/ui/badge";
import { useStaticData } from "@/lib/hooks/use-static-data";

export function LoadStatusBadge({ status }: { status: string }) {
  const { getDisplay, isLoading } = useStaticData();

  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
      >
        {status}
      </Badge>
    );
  }

  const label = getDisplay("load_status", status);

  return (
    <Badge
      variant="outline"
      className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
    >
      {label || status}
    </Badge>
  );
}

export function DriverStatusBadge({ status }: { status: string }) {
  const { getDisplay, statusColor, isLoading } = useStaticData();

  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
      >
        {status}
      </Badge>
    );
  }

  const label = getDisplay("driver_status", status);
  const colors = statusColor(status);

  return (
    <Badge variant="outline" className={colors.className}>
      {label || status}
    </Badge>
  );
}

export function VehicleStatusBadge({ status }: { status: string }) {
  const { getDisplay, statusColor, isLoading } = useStaticData();

  if (isLoading) {
    return (
      <Badge
        variant="outline"
        className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
      >
        {status}
      </Badge>
    );
  }

  const label = getDisplay("vehicle_status", status);
  const colors = statusColor(status);

  return (
    <Badge variant="outline" className={colors.className}>
      {label || status}
    </Badge>
  );
}
