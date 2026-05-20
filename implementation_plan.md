# Advanced Try & Buy / Check & Buy Return Flow Implementation Plan

This plan outlines the implementation of the advanced return flow for "Try & Buy" and "Check & Buy" orders. It supports product-wise returns, multi-vendor drop-off routing, and strict delivery boy continuity, while preserving existing backward compatibility.

## User Review Required

> [!IMPORTANT]
> Please review the proposed database schema additions and the UI approach for the Customer and Delivery Boy apps. Specifically, we will add a `vendorDropoffs` array to the `ReturnRequest` model to handle multi-vendor returns efficiently without breaking existing single-vendor logic. 

## Open Questions

1. **Try Session Duration**: Is there a specific time limit for the "Try Active" session before it auto-completes if the user doesn't make a selection?
2. **Delivery Boy App Routing**: Should the multi-vendor drop-off route in the Delivery Boy app reuse the exact same map UI as the multi-vendor pickup flow?
3. **Refund Processing**: Should the refund be initiated immediately upon pickup from the customer, or only after the items are successfully dropped off and verified by the vendors?

## Proposed Changes

---

### Database Layer

#### [MODIFY] `d:\appzeto project\Clouse-main\Clouse\backend\src\models\ReturnRequest.model.js`
- **Extend Schema**: Add `isMultiVendor` (Boolean) to distinguish multi-vendor returns.
- **Add `vendorDropoffs`**: An array tracking vendor-wise drop-offs, mimicking `vendorPickups` in `Order`.
  - Fields: `vendorId`, `vendorName`, `shopLocation`, `shopAddress`, `items` (array of products going to this vendor), `status` (pending, arrived, dropped_off), `dropoffOtpHash`, `dropoffOtpDebug`, `proofPhoto`.
- **Add `originalDeliveryBoyId`**: To strict-map the return to the delivery boy who delivered the order.
- **Add `trySessionActive`**: Boolean to flag if the return is originating from a Try & Buy session.

#### [MODIFY] `d:\appzeto project\Clouse-main\Clouse\backend\src\models\Order.model.js`
- Ensure `status` enum explicitly supports `try_active` or equivalent if needed, though we can manage this via the `deliveryFlow.phase` (e.g., `try_and_buy_active`).

---

### Backend API & Controllers

#### [NEW] `d:\appzeto project\Clouse-main\Clouse\backend\src\modules\user\controllers\return.controller.js` (or extend existing)
- **POST `/api/user/orders/:orderId/try-buy-return`**:
  - Validates if the order is Try & Buy or Check & Buy.
  - If Check & Buy AND multi-vendor: Returns HTTP 400 with the policy message "Return policy is currently not available for multi-vendor Check & Buy orders."
  - Accepts a list of `selectedProducts` for return.
  - Groups products by `vendorId`.
  - Creates a `ReturnRequest` with `vendorDropoffs` generated and sequenced.
  - Auto-assigns the `ReturnRequest` to the `order.deliveryBoyId`.
  - Marks non-returned items as 'completed/kept'.

#### [MODIFY] `d:\appzeto project\Clouse-main\Clouse\backend\src\modules\delivery\controllers\deliveryReturn.controller.js` (or similar)
- **GET `/api/delivery/returns/:returnId`**: Update to populate `vendorDropoffs` and `items`.
- **POST `/api/delivery/returns/:returnId/pickup-from-customer`**: Handles customer OTP verification for picking up returned items.
- **POST `/api/delivery/returns/:returnId/dropoff-at-vendor`**: Handles vendor OTP verification and marks the specific `vendorDropoff` as completed.
- **Auto-Routing**: Expose an endpoint or compute the shortest drop-off route for the delivery boy.

---

### Customer App UI (Frontend)

#### [MODIFY] `d:\appzeto project\Clouse-main\Clouse\frontend\src\modules\user\pages\OrderDetailsPage.jsx`
- **Return Policy Banner**: If `orderType === 'check_and_buy'` and `isMultiVendor === true`, show a persistent message: "Check & Buy return is supported only for single-vendor orders."
- **Product List View**: Add a Checkbox next to each item when the order is in `try_active` state.
- **Action Buttons**: Add a "Return Selected Products" floating button.
- **Timeline**: Render a live stepper tracking the return phase (Pickup Pending -> Picked Up -> Returning to Vendor A -> Returning to Vendor B -> Completed).

---

### Delivery Boy App UI (Frontend)

#### [MODIFY] `d:\appzeto project\Clouse-main\Clouse\frontend\src\modules\Delivery\pages\ReturnDetails.jsx` (or similar)
- **Customer Pickup View**: Show the customer's address and the exact list of selected products to pick up. Include the Customer OTP input.
- **Vendor Routing View**: After picking up, transition to a "Vendor Route" view. Show the list of vendors to drop items off at, in optimized order.
- **Vendor Drop-off Flow**: For each vendor, show the specific items to drop off, and require the Vendor OTP.

---

### Vendor & Admin UI

#### [MODIFY] `Vendor App`
- Ensure vendors only see the specific items being returned to them, not the entire multi-vendor order.
- Add OTP generation/verification for accepting returned goods.

#### [MODIFY] `Admin Panel`
- Add monitoring dashboards to track `try_active` sessions, active `ReturnRequests`, delivery boy assignments, and vendor drop-off progress.
- Add manual override to re-assign a ReturnRequest to a different delivery boy if the original one becomes unavailable.

## Verification Plan

### Automated/Unit Tests
- Verify that a multi-vendor Check & Buy order correctly rejects return attempts via API.
- Verify that the `ReturnRequest` payload properly groups products by `vendorId`.

### Manual Verification
1. Place a multi-vendor Try & Buy order.
2. Complete delivery using the Delivery Boy app.
3. As the Customer, select 1 item from Vendor A and 1 item from Vendor B to return.
4. Verify the ReturnRequest is instantly assigned to the same Delivery Boy.
5. As the Delivery Boy, verify the customer OTP, pick up the items, and successfully drop them off at Vendor A and Vendor B sequentially using vendor OTPs.
