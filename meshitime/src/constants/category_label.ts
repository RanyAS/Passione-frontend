export type Category = "すべて" | "近く" | "和食" | "洋食" | "人気";

export const FILTERS: { label: Category; icon: string }[] = [
  { label: "すべて", icon: "🍜" },
  { label: "近く", icon: "📍" },
  { label: "和食", icon: "🍣" },
  { label: "洋食", icon: "🍕" },
  { label: "人気", icon: "⭐" },
];

/** HomeMap `filter` query param → SearchResults chip label */
export const ROUTE_TO_FILTER_LABEL: Record<string, Category> = {
  all: "すべて",
  nearby: "近く",
  japanese: "和食",
  western: "洋食",
  popular: "人気",
  すべて: "すべて",
  近く: "近く",
  和食: "和食",
  洋食: "洋食",
  人気: "人気",
};
