export const CATEGORY_CONFIG = {
  fixed: {
    label: "고정비",
    color: "bg-third-600 !text-gray-100",
  },
  variable: {
    label: "변동비",
    color: "bg-green-600 !text-gray-100",
  },
  other: {
    label: "기타",
    color: "bg-gray-300 !text-gray-900",
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
