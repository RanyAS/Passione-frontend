import { createStorePin } from "@/api/StorePinApi";
import { DEMO_STORE_ID } from "@/constants/session";
import {
  calculateDiscountPercent,
  type MenuRegistrationForm,
} from "../../types/menu-registration";
import { resetMenuRegistrationForm } from "../context/menu-registration-store";

function buildEndsAt(form: MenuRegistrationForm): string | null {
  if (!form.deadlineDate) return null;
  const time = form.deadlineTime?.trim() || "23:59";
  const iso = new Date(`${form.deadlineDate}T${time}:00`);
  if (Number.isNaN(iso.getTime())) return null;
  return iso.toISOString();
}

/**
 * Enregistre l’offre comme StorePin (carte + réservations).
 * Les champs menu détaillés restent en description / rule pour la V1.
 */
export async function saveMenu(form: MenuRegistrationForm) {
  if (!form.menuName.trim()) {
    throw new Error("menuName is required");
  }
  if (!form.availableSeats.trim()) {
    throw new Error("availableSeats is required");
  }

  const percent = calculateDiscountPercent(
    form.originalPrice,
    form.discountPrice
  );

  const pin = await createStorePin({
    storeId: DEMO_STORE_ID,
    emptySeat: Number(form.availableSeats) || 0,
    time: form.deadlineTime?.trim() || null,
    description: form.menuName.trim(),
    rule: percent > 0 ? `${percent}%OFF` : form.bannerText || null,
    endsAt: buildEndsAt(form),
    isActive: form.isOnSale,
  });

  resetMenuRegistrationForm();
  return pin;
}
