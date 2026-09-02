export type AllergyKey =
  | "egg"
  | "milk"
  | "wheat"
  | "shrimp"
  | "crab"
  | "peanut"
  | "buckwheat"
  | "walnut";

export type MenuRegistrationForm = {
  menuName: string;
  originalPrice: string;
  discountPrice: string;
  availableSeats: string;
  deadlineDate: string;
  deadlineTime: string;
  bannerText: string;
  materials: string;
  allergies: AllergyKey[];
  description: string;
  imageUri: string | null;
  isOnSale: boolean;
  isFeatured: boolean;
};

export const ALLERGY_OPTIONS: { key: AllergyKey; label: string }[] = [
  { key: "egg", label: "卵" },
  { key: "milk", label: "乳" },
  { key: "wheat", label: "小麦" },
  { key: "shrimp", label: "えび" },
  { key: "crab", label: "かに" },
  { key: "peanut", label: "落花生" },
  { key: "buckwheat", label: "そば" },
  { key: "walnut", label: "くるみ" },
];

export function createEmptyMenuRegistrationForm(): MenuRegistrationForm {
  return {
    menuName: "",
    originalPrice: "",
    discountPrice: "",
    availableSeats: "",
    deadlineDate: "",
    deadlineTime: "",
    bannerText: "",
    materials: "",
    allergies: [],
    description: "",
    imageUri: null,
    isOnSale: true,
    isFeatured: false,
  };
}

export function calculateDiscountPercent(
  originalPrice: string,
  discountPrice: string
): number {
  const original = Number(originalPrice);
  const discount = Number(discountPrice);
  if (!original || original <= 0 || Number.isNaN(discount)) return 0;
  if (discount >= original) return 0;
  return Math.round(((original - discount) / original) * 100);
}
