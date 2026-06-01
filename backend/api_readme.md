# Backend API Reference

This document summarizes the backend API routes for the `Category` project.
It includes all major route groups for:
- Authentication
- Admin panel
- Vendor panel
- Customer/cart/checkout
- Product, category, subcategory, coupon, gift card, order

Each section lists the route, HTTP method, auth requirements, major query/body parameters, and intended usage.

---

## Authentication

Base path: `/api/auth`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/register` | Public | Register a new customer user | `{ name, email, password, phone }` |
| POST | `/register-admin` | Public (requires `ADMIN_SECRET`) | Register a new admin user | `{ name, email, password, phone, secretKey }` |
| POST | `/register-vendor` | Public | Register a new vendor account + vendor profile | `{ name, email, password, phone, shopName, shopAddress, shopDescription }` (exact fields vary) |
| POST | `/login` | Public | Login for user/admin/vendor, returns JWT cookie + user payload | `{ email, password }` |
| POST | `/logout` | Authenticated | Clears auth cookie and logs out | none |

### Notes
- Responses include a `token` cookie and user payload.
- Vendor registration creates both a `User` and a `Vendor` document.

---

## Admin Profile

Base path: `/api/admin/profile` (mounted under profile router)

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/admin/profile` | Protected | Get current admin profile | none |
| PUT | `/admin/profile` | Protected | Update admin profile and optionally upload profile image | `multipart/form-data` with fields `name`, `email`, `phone`, `currentPassword`, `newPassword`, `confirmPassword`, optional `profileImage` |

### Notes
- Profile routes require the user to be logged in and role must be `admin`.
- Password change requires `currentPassword` and matching new password confirmation.

---

## User Management (Admin)

Base path: `/api/users`

| Method | Path | Auth | Description | Query / Body |
|---|---|---|---|---|
| GET | `/stats` | Protected/Admin | Returns user dashboard counts: total, hot, cold, deactive | none |
| GET | `/` | Protected/Admin | List users with pagination/search/status filter | `?pageNumber=1&search=...&status=Hot|Cold|Deactive` |
| GET | `/:id` | Protected/Admin | Get single user profile and recent orders | none |
| PUT | `/:id/status` | Protected/Admin | Manually override user status | `{ status: "Hot" | "Cold" | "Deactive" | "" }` |
| DELETE | `/:id` | Protected/Admin | Hard-delete a user (admin accounts cannot be deleted) | none |

### Notes
- Status is derived from recent order history unless manually overridden.
- Admin can view full user order history and computed metrics.

---

## Admin Vendor Management

Base path: `/api/admin/vendors`

| Method | Path | Auth | Description | Body |
|---|---|---|---|---|
| GET | `/` | Protected/Admin | List all vendors with pagination/status filters | `?page=1&limit=10&status=pending|active|suspended` |
| GET | `/:id` | Protected/Admin | Get vendor detail by MongoDB ID | none |
| PUT | `/:id/status` | Protected/Admin | Approve or suspend vendor account | `{ status: "active" | "suspended" }` |
| PUT | `/:id/commission` | Protected/Admin | Set vendor commission rate | `{ commissionRate: number }` |
| DELETE | `/:id` | Protected/Admin | Delete vendor account and linked user | none |

---

## Cart API

Base path: `/api/cart`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/` | Protected | Get current user's cart, populate coupon, calculate totals | none |
| POST | `/add` | Protected | Add product to cart | `{ productId, quantity }` |
| PUT | `/update/:productId` | Protected | Update cart item quantity | `{ quantity }` |
| DELETE | `/remove/:productId` | Protected | Remove a product from cart | none |
| DELETE | `/clear` | Protected | Empty the user's cart | none |
| POST | `/apply-coupon` | Protected | Apply a coupon code to cart | `{ couponCode }` |
| DELETE | `/remove-coupon` | Protected | Remove coupon from cart | none |

### Notes
- `calculateCartTotals` is used server-side to enforce subtotal, tax, shipping, and discounts.
- Coupon validity and minimum order rules are checked before applying.

---

## Category API

Base path: `/api/category`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/create` | Protected | Create a new admin category | `{ name, slug, status }` |
| GET | `/all` | Protected | Get all categories (admin list) | none |
| GET | `/public/all` | Public/Protected | Get active categories for storefront | none |
| PUT | `/update/:id` | Protected | Update a category | Request body fields to update |
| DELETE | `/delete/:id` | Protected | Delete category by ID | none |

### Notes
- `status` can be used to activate/inactivate categories.
- When a category becomes inactive, linked subcategories may also be updated.

---

## Sub-Category API

Base path: `/api/subCategory`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/create` | Protected | Create subcategory under a category | `{ name, parentCategory, status }` |
| GET | `/all` | Protected | Get all subcategories | none |
| GET | `/public/all` | Public/Protected | Get active subcategories | none |
| PUT | `/update/:id` | Protected | Update a subcategory | Request body fields to update |
| DELETE | `/delete/:id` | Protected | Delete subcategory | none |

### Notes
- Subcategories are linked to `parentCategory`.
- Inactive parent categories may cascade status to child subcategories.

---

## Product API

Base path: `/api/product`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/create` | Protected | Create product with image upload | `multipart/form-data` fields plus `subCategory,name,brand,price,...` |
| GET | `/all` | Protected | Get all products with optional search/filter/pagination | `?search=&limit=&page=&status=&subCategory=` |
| GET | `/public/all` | Public | Get all active products for storefront | none |
| GET | `/public/:id` | Public | Get a single product by ID | none |
| PUT | `/update/:id` | Protected | Update product fields and images | `multipart/form-data` plus updated product fields |
| DELETE | `/delete/:id` | Protected | Delete a product by ID | none |

### Notes
- Image upload fields are `image`, `image1`, `image2`, `image3`, `image4`.
- Active product listing is exposed via `/public/all`.

---

## Variant API

Base path: `/api/variant`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/create` | Protected | Create a variant product with image upload | `multipart/form-data` plus `parentProduct,name,brand,price,discountPercent,status` |
| GET | `/all` | Protected | Get all variant products with optional filters | `?status=&product=` |
| PUT | `/update/:id` | Protected | Update a variant product and images | `multipart/form-data` plus update fields |
| DELETE | `/delete/:id` | Protected | Delete a variant product | none |

### Notes
- Variant records connect to `parentProduct`.
- Discounts are recalculated automatically from `discountPercent` and `price`.

---

## Coupon API

Base path: `/api/coupon`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/products/search` | Protected | Search products for product-specific coupons | `?search=&limit=` |
| POST | `/apply` | Protected | Apply a coupon to the current logged-in user | `{ couponCode, cartTotal, productId? }` |
| POST | `/release` | Protected | Release a coupon from a cart or order | `{ couponCode, userId, orderId? }` |
| POST | `/confirm-usage` | Protected | Confirm coupon usage after order completion | `{ couponCode, userId, orderId }` |
| GET | `/usage-history` | Protected | Get coupon usage records | optional filters may apply |
| POST | `/create` | Protected | Create a coupon (admin) | coupon details such as `code, discountType, discountValue, minimumOrderAmount, expiryDate` |
| GET | `/` | Protected | Get all coupons | none |
| GET | `/:id` | Protected | Get coupon by ID | none |
| PUT | `/update/:id` | Protected | Update coupon fields | request body updates |
| DELETE | `/delete/:id` | Protected | Delete coupon by ID | none |
| PATCH | `/toggle-status/:id` | Protected | Toggle coupon active/inactive state | none |

### Notes
- Coupon validation checks expiry, usage limit, status, minimum order, and product eligibility.
- There are separate user-facing application endpoints and admin coupon CRUD endpoints in the same router.

---

## Gift Card API

Base path: `/api/giftCard`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/create` | Protected | Create a new gift card | `{ receiverName, senderName, code, giftCardValue, expiryDate, description, status }` |
| GET | `/list` | Protected | List gift cards with search/filter/pagination | `?search=&status=&page=&limit=` |
| GET | `/single/:id` | Protected | Get a single gift card by ID | none |
| PUT | `/update/:id` | Protected | Update gift card fields | request body updates |
| DELETE | `/delete/:id` | Protected | Delete gift card by ID | none |

### Notes
- Gift card codes are normalized to uppercase and must be unique.
- Expiry dates must be in the future.

---

## Order API

Base path: `/api/orders`

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/` | Protected | Create an order, deduct stock atomically | `{ orderItems, shippingAddress, paymentMethod }` |
| GET | `/myorders` | Protected | Get current user's orders with pagination | `?pageNumber=1` |
| GET | `/` | Protected/Admin | Get all orders with pagination/filter | `?pageNumber=1&status=&from=&to=` |
| GET | `/:id` | Protected | Get order by ID (owner or admin) | none |
| PUT | `/:id/pay` | Protected | Mark an order paid after payment callback | `{ id, status, update_time, email_address? }` |
| PUT | `/:id/cancel` | Protected | User cancels own order and restores stock | optional `{ note }` |
| PUT | `/:id/status` | Protected/Admin | Admin updates order status | `{ status: "Pending"|"Processing"|"Shipped"|"Delivered"|"Cancelled" }` |

### Notes
- Order creation fetches authoritative product prices and uses MongoDB transactions to deduct stock safely.
- Admin order listing is paginated and filterable by status/date range.

---

## Vendor API

Base path: `/api/vendor/:vendorSlug`

### Vendor Profile

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/me` | Protected/Vendor | Get logged-in vendor shop profile | none |
| PUT | `/me` | Protected/Vendor | Update vendor shop profile | body fields vary by implementation |

### Vendor Categories

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/categories` | Protected/Vendor | Get vendor categories with pagination | `?page=1&limit=10` |
| GET | `/categories/:id` | Protected/Vendor | Get one category by ID | none |
| POST | `/categories` | Protected/Vendor | Create a new vendor category | `{ name, image? }` |
| PUT | `/categories/:id` | Protected/Vendor | Update vendor category | `{ name?, image?, isActive? }` |
| DELETE | `/categories/:id` | Protected/Vendor | Delete a category | none |

### Vendor Subcategories

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/subcategories` | Protected/Vendor | Get vendor subcategories, optional `?category=<categoryId>` | none |
| GET | `/subcategories/:id` | Protected/Vendor | Get one subcategory by ID | none |
| POST | `/subcategories` | Protected/Vendor | Create vendor subcategory | `{ name, category }` |
| PUT | `/subcategories/:id` | Protected/Vendor | Update vendor subcategory | `{ name?, category?, isActive? }` |
| DELETE | `/subcategories/:id` | Protected/Vendor | Delete vendor subcategory | none |

### Vendor Products

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/products/upload-image` | Protected/Vendor | Upload one product image using `multipart/form-data` field `image` | file upload |
| GET | `/products` | Protected/Vendor | Get all vendor products, supports filters | `?category=&subCategory=&isActive=` |
| GET | `/products/:id` | Protected/Vendor | Get a single product by ID | none |
| POST | `/products` | Protected/Vendor | Create vendor product | JSON body with `name, price, stock, images[], category, subCategory, isActive, ...` |
| PUT | `/products/:id` | Protected/Vendor | Update vendor product | JSON body of fields to update |
| DELETE | `/products/:id` | Protected/Vendor | Delete vendor product | none |

### Vendor Coupons

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/coupons` | Protected/Vendor | Get vendor coupons | optional `?isActive=true|false` |
| GET | `/coupons/:id` | Protected/Vendor | Get one coupon by ID | none |
| POST | `/coupons` | Protected/Vendor | Create vendor coupon | coupon fields depend on controller logic |
| PUT | `/coupons/:id` | Protected/Vendor | Update vendor coupon | JSON update fields |
| DELETE | `/coupons/:id` | Protected/Vendor | Delete vendor coupon | none |

### Vendor Orders

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| GET | `/orders` | Protected/Vendor | Get orders belonging to the vendor | none |

### Vendor Uploads

| Method | Path | Auth | Description | Body / Query |
|---|---|---|---|---|
| POST | `/upload` | Protected/Vendor | Upload an image for vendor resources | `multipart/form-data` field `image` |

### Notes
- `:vendorSlug` must match the logged-in vendor's slug via vendor middleware.
- Vendor routes are protected by `protect`, `authorizeRoles("vendor")`, and vendor ownership guards.

---

## Middleware and Auth Summary

| Middleware | Purpose |
|---|---|
| `protect` | Requires valid JWT, attaches `req.user` |
| `authorizeRoles("admin")` | Allows only admin users |
| `authorizeRoles("vendor")` | Allows only vendor users |
| `vendorGuard` | Loads vendor data and verifies `:vendorSlug` belongs to current vendor |
| `upload` | Handles `multipart/form-data` image uploads via multer |

---

## Notes for Developers

- Many routes use pagination and filtering through query parameters.
- The vendor API is scoped under `/api/vendor/:vendorSlug` and is separate from admin routes.
- Public-facing storefront APIs include `/api/product/public/all`, `/api/product/public/:id`, `/api/category/public/all`, and `/api/subCategory/public/all`.
- Admin routes generally use `protect` and some use `admin` checks in route logic.
- The same router files may contain both user-facing and admin-facing endpoints (example: `/api/coupon`).

---

## Route Mount Points in `server.js`

| Prefix | Router | Notes |
|---|---|---|
| `/api/auth` | `authRoutes` | Authentication, registration, login, logout |
| `/api/category` | `categoryRoutes` | Category CRUD + public category list |
| `/api/subCategory` | `subCategoryRoutes` | Subcategory CRUD + public list |
| `/api/product` | `productRoutes` | Product CRUD + public storefront endpoints |
| `/api/variant` | `variantRoutes` | Variant CRUD |
| `/api/cart` | `cartRoutes` | User cart and coupon application |
| `/api/coupon` | `couponRoutes` | Coupon apply/release/confirm + admin coupon CRUD |
| `/api/giftCard` | `giftCardRoutes` | Gift card CRUD |
| `/api/orders` | `orderRoutes` | Order creation, user orders, admin orders |
| `/api/users` | `userRoutes` | Admin user management |
| `/api/admin/vendors` | `adminVendorRoutes` | Admin vendor management |
| `/api/vendor/:vendorSlug` | `vendorProfileRoutes` | Vendor own profile |
| `/api/vendor/:vendorSlug/categories` | `vendorCategoryRoutes` | Vendor category management |
| `/api/vendor/:vendorSlug/subcategories` | `vendorSubCategoryRoutes` | Vendor subcategory management |
| `/api/vendor/:vendorSlug/products` | `vendorProductRoutes` | Vendor product management |
| `/api/vendor/:vendorSlug/coupons` | `vendorCouponRoutes` | Vendor coupon management |
| `/api/vendor/:vendorSlug/orders` | `vendorOrderRoutes` | Vendor order viewing |
| `/api/vendor/:vendorSlug/upload` | `vendorUploadRoutes` | Vendor image upload |

---

## How to Use This Document

- Use the route tables to identify the correct backend endpoint for admin, vendor, or customer UI pages.
- Refer to each section when building frontend pages that need backend integration.
- Check query/body notes for the expected request payload shape.
- Read the middleware summary for authentication/authorization requirements.
