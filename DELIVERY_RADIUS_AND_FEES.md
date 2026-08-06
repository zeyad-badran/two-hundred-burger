# Delivery Radius and Fees System

## Overview
The Delivery Radius and Fees system allows Two Hundred Burger to dynamically calculate delivery costs based on the straight-line (Haversine) distance between the customer's pinned location and the selected branch. 

This system enforces strict radius limits and validates all financial calculations securely on the server side to prevent manipulation.

## Branch Configuration
Delivery rules are defined per branch in `lib/branches.ts`.

```typescript
export interface Branch {
  id: string;
  name_en: string;
  name_ar: string;
  address_en: string;
  address_ar: string;
  is_active: boolean;
  latitude: number;
  longitude: number;
  delivery_radius_km: number;
  base_delivery_fee: number;
  included_distance_km: number;
  fee_per_extra_km: number;
  minimum_delivery_fee: number;
}
```

### Fee Calculation Logic
The calculation is handled by `lib/delivery/fees.ts`:
1. Start with the `base_delivery_fee`.
2. Check if the distance exceeds `included_distance_km`.
3. If it does, calculate the extra distance and charge `fee_per_extra_km` for every *started* kilometer (using `Math.ceil`).
4. Ensure the total fee is at least `minimum_delivery_fee`.

### Distance Calculation
Distance is calculated using the Haversine formula in `lib/delivery/distance.ts`. It measures the great-circle distance between the branch's coordinates and the customer's coordinates.

## Architecture

### Frontend (Client-Side)
- **Map Picker:** Uses Leaflet/OpenStreetMap to allow customers to pin their exact location.
- **Real-time UX:** The checkout page calculates and displays the distance and fee dynamically.
- **Validation:** Disables the "Place Order" button if the customer is outside the branch's `delivery_radius_km`.

### Backend (Server-Side Source of Truth)
- **Security Check:** The `app/api/checkout/route.ts` recalculates the distance and fee independently.
- **Verification:** It rejects the order (`400 Bad Request`) if the distance is beyond the allowed radius.
- **Financial Integrity:** The final total sent to the payment provider (PayTabs) and saved to the database includes the securely calculated delivery fee.

## Database Schema Changes
The following columns were added to the `orders` table via migration:
- `delivery_distance_km (numeric)`
- `delivery_fee (numeric, default 0)`
- `delivery_radius_km (numeric)`
- `is_delivery_in_range (boolean)`
- `branch_lat (numeric)`
- `branch_lng (numeric)`

## Affected Systems
- **Kitchen Dashboard:** Shows delivery distance and fee on the order cards.
- **Receipts:** Prints the delivery fee and distance.
- **WhatsApp Notifications:** Includes distance, fee, and location link.
- **Order Tracking:** Customers see the separated delivery fee.
- **Admin Dashboard:** Total revenue KPI now correctly includes delivery fees.
