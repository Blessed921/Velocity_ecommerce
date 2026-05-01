# Velox Sneakers Security Specification

## 1. Data Invariants
- A `Sneaker` must have a name, brand, positive price, and stock.
- An `Order` must be linked to a valid `userId`.
- A `Review` can only be created by an authenticated user and must belong to a valid `sneakerId`.
- Users can only access their own private data (profile, orders, notifications).
- Only Admins can modify the product catalog (`sneakers`).

## 2. The Dirty Dozen (Malicious Payloads)
1. **Identity Spoofing**: User A trying to update User B's profile.
2. **Privilege Escalation**: User A trying to set `role: 'admin'`.
3. **Price Manipulation**: User trying to create an order with $0 items.
4. **ID Poisoning**: Injecting 1MB strings as document IDs.
5. **Ghost Field Injection**: Adding `isVerified: true` to a profile update.
6. **Orphaned Writes**: Creating a review for a sneaker that doesn't exist.
7. **Negative Stock**: Trying to set sneaker stock to -10.
8. **PII Leak**: Unauthorized user trying to read user private info.
9. **Status Jumping**: User trying to mark their own order as 'shipped'.
10. **Date Faking**: User trying to set `createdAt` to a future date instead of server time.
11. **Denial of Wallet**: Infinite loop of recursive lookups (guarded by rule order).
12. **Wishlist Poisoning**: Adding non-string IDs to a wishlist array.

## 3. Test Runner (Draft)
The `firestore.rules.test.ts` will verify these scenarios.
