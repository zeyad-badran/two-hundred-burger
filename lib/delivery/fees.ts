export interface DeliveryRules {
  base_delivery_fee: number;
  included_distance_km: number;
  fee_per_extra_km: number;
  minimum_delivery_fee: number;
  maximum_delivery_fee?: number;
  free_delivery_threshold?: number;
}

/**
 * Calculate the delivery fee based on distance and business rules.
 *
 * @param distanceKm The distance from branch to customer in km
 * @param subtotal The order subtotal
 * @param rules The delivery rules for the selected branch
 * @returns The calculated delivery fee
 */
export function calculateDeliveryFee(
  distanceKm: number,
  subtotal: number,
  rules: DeliveryRules
): number {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(subtotal)) {
    throw new Error('Invalid numeric inputs provided for fee calculation.');
  }

  // If free delivery applies based on subtotal threshold
  if (
    rules.free_delivery_threshold &&
    subtotal >= rules.free_delivery_threshold
  ) {
    return 0;
  }

  let fee = rules.base_delivery_fee;

  // Calculate extra distance beyond the included base distance
  if (distanceKm > rules.included_distance_km) {
    const extraDistance = distanceKm - rules.included_distance_km;
    // Charge per *started* kilometer (Math.ceil)
    const extraKmChunks = Math.ceil(extraDistance);
    fee += extraKmChunks * rules.fee_per_extra_km;
  }

  // Ensure minimum fee is respected
  if (fee < rules.minimum_delivery_fee) {
    fee = rules.minimum_delivery_fee;
  }

  // Cap at maximum fee if configured
  if (
    rules.maximum_delivery_fee !== undefined &&
    fee > rules.maximum_delivery_fee
  ) {
    fee = rules.maximum_delivery_fee;
  }

  // Return rounded to 2 decimal places to avoid floating point issues
  return Number(fee.toFixed(2));
}
