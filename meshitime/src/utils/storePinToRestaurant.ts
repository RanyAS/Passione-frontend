import type { StorePin } from "@/types/StorePin";
import type { Restaurant } from "../../types/meshitime";
import { supabase } from "@/lib/supabase";

/** Mappe un StorePin API vers le modèle Restaurant utilisé par la map. */
export function storePinToRestaurant(pin: StorePin): Restaurant {
    const image = pin.store?.imagePath
    ? supabase.storage
        .from("stores-images")
        .getPublicUrl(pin.store.imagePath).data.publicUrl
    : "";
  return {
    id: pin.id,
    storeId: pin.storeId,
    name: pin.store?.name ?? "店舗",
    romajiName: pin.store?.name ?? "Store",
    image,
    emoji: "🍜",
    rating: pin.store?.star ?? 4,
    reviewsCount: 0,
    address: pin.store?.address ?? "",
    openingHours: pin.store?.openTime ?? "",
    phone: pin.store?.tel ?? "",
    gradient: ["#FDBA74", "#FFEDD5"],
    categories: ["all", "nearby"],
    deal: {
      discountLabel: pin.rule ?? "OFF",
      originalPrice: 0,
      dealPrice: 0,
      availableSeats: pin.emptySeat,
      deadlineLabel: pin.endsAt ?? "",
      campaign: pin.description ?? "",
    },
    menuItems: [],
    reviews: [],
    isFavorite: false,
    coordinates: {
      latitude: pin.coordinates?.latitude ?? Number(pin.store?.latitude) ?? 0,
      longitude: pin.coordinates?.longitude ?? Number(pin.store?.longitude) ?? 0,
    },
    pinPosition: {
      top: "50%",
      left: "50%",
      active: pin.isActive,
    },
  };
}
