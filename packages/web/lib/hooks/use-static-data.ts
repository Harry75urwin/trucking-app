import { useEffect, useState, useCallback } from "react";

export interface StaticDataItem {
  id: string;
  category: string;
  key: string;
  value: string;
  display_en?: string;
  display_hi?: string;
  sort_order?: number;
  is_active: boolean;
}

const defaultStatusColors: Record<string, string> = {
  available: "var(--chart-green)",
  on_load: "var(--chart-blue)",
  off_duty: "var(--chart-gray)",
  active: "var(--chart-green)",
  maintenance: "var(--chart-yellow)",
  out_of_service: "var(--chart-red)",
};

const cachedData: Map<string, StaticDataItem> = new Map();
let isLoaded = false;

export function useStaticData() {
  const [staticData, setStaticData] = useState<StaticDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(!isLoaded);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      return;
    }

    const loadStaticData = async () => {
      try {
        const response = await fetch("/api/static-data");
        if (response.ok) {
          const data: StaticDataItem[] = await response.json();
          setStaticData(data);
          data.forEach((item) => {
            cachedData.set(`${item.category}:${item.key}`, item);
            cachedData.set(`${item.category}:${item.value}`, item);
          });
          isLoaded = true;
        }
      } catch (error) {
        console.error("Failed to load static data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStaticData();
  }, []);

  const getDisplay = useCallback(
    (
      category: string,
      key: string,
      lang: "en" | "hi" = "en"
    ): string | undefined => {
      const cacheKey = `${category}:${key}`;
      const cached = cachedData.get(cacheKey);
      if (!cached) {
        const dataKey = staticData.find(
          (d) => d.category === category && (d.key === key || d.value === key)
        );
        if (dataKey) {
          cachedData.set(cacheKey, dataKey);
          return lang === "hi" ? dataKey.display_hi : dataKey.display_en;
        }
        return undefined;
      }
      return lang === "hi" ? cached.display_hi : cached.display_en;
    },
    [staticData]
  );

  const getOptions = useCallback(
    (category: string): StaticDataItem[] => {
      return staticData.filter((d) => d.category === category && d.is_active);
    },
    [staticData]
  );

  const statusColor = useCallback((status: string) => {
    const colors: Record<string, { className: string }> = {
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
    return colors[status] || colors;
  }, []);

  const chartColor = useCallback((status: string) => {
    return defaultStatusColors[status] || "var(--chart-1)";
  }, []);

  return {
    staticData,
    isLoading,
    getDisplay,
    getOptions,
    statusColor,
    chartColor,
  };
}
