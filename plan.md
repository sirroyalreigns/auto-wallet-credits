# WordPress Automation Plugin: Auto Order Completion & Wallet Credit

## Scope Summary
Build a WordPress plugin that automates two key tasks:
1.  **Auto-Complete Orders**: Automatically transition WooCommerce orders from 'processing' to 'completed' after a configurable number of days.
2.  **Wallet Credit**: Credit a user's wallet with a **percentage of the order total** or **product-specific amounts** when their order is marked 'completed'.

## New Feature: Product-Specific Overrides
- Admins can now go to any WooCommerce product edit page.
- A new "Wallet Credit" tab/field allows setting a custom reward for that specific product.
- This override can be a **fixed amount** or a **percentage** specific to that item.
- If no override is set, the global percentage/amount applies.

## Affected Areas
- **Backend (PHP)**: Main plugin logic, cron scheduling, and **Product Meta Data** handling.
- **Admin UI (React)**: Settings page and a new "Product Overrides" overview.
- **Database (WordPress/MySQL)**: Storing plugin settings and product-specific meta.

## Phases

### Phase 1: Plugin Scaffolding & Settings API
- [x] Create the main plugin entry point (`wp-auto-wallet.php`).
- [x] Define global settings: `auto_complete_days` and `wallet_credit_percentage`.

### Phase 2: Product-Specific Logic
- [x] Add meta fields to WooCommerce Product edit screen.
- [x] Implement logic to save `_wp_auto_wallet_override_type` and `_wp_auto_wallet_override_value`.

### Phase 3: Calculation Logic Update
- [x] Modify `credit_user_wallet` to calculate rewards per line-item.
- [x] Prioritize item-level overrides over global settings.

### Phase 4: Frontend Settings Dashboard
- [x] Build a React-based admin page within the WordPress dashboard.
- [x] Add UI section for "Product Specific Rules" (Overview).

## Downstream Ownership
- **quick_fix_engineer**: Handles the PHP logic, WordPress hooks, and WooCommerce meta fields.
- **frontend_engineer**: Handles the settings UI and product override indicators.