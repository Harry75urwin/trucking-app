import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useStaticData } from "@/lib/hooks/use-static-data";

export function LoadStatusBadge({ status }: { status: string }) {
  const { getDisplay, isLoading, error, retry } = useStaticData();

  if (error) {
    return (
      <span className="inline-flex items-center gap-1">
        <Badge
          variant="outline"
          className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
        >
          {status}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0"
          onClick={retry}
          title="Retry loading status data"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </span>
    );
  }

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
  const { getDisplay, statusColor, isLoading, error, retry } = useStaticData();

  if (error) {
    return (
      <span className="inline-flex items-center gap-1">
        <Badge
          variant="outline"
          className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
        >
          {status}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0"
          onClick={retry}
          title="Retry loading status data"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </span>
    );
  }

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
  const { getDisplay, statusColor, isLoading, error, retry } = useStaticData();

  if (error) {
    return (
      <span className="inline-flex items-center gap-1">
        <Badge
          variant="outline"
          className="border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-300"
        >
          {status}
        </Badge>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0"
          onClick={retry}
          title="Retry loading status data"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </span>
    );
  }

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
