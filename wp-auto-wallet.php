<?php
/**
 * Plugin Name: WP Order Automator & Wallet Credit
 * Description: Automates order completion after X days and credits the user's wallet with percentage or product-specific rewards.
 * Version: 1.2.1
 * Author: Frontend Automation Expert
 * License: GPL2
 */

if (!defined('ABSPATH')) exit;

class WP_Order_Automator {
    
    public function __construct() {
        // Register Cron
        add_action('init', [$this, 'schedule_automation']);
        add_action('wp_order_automation_event', [$this, 'process_auto_completion']);
        
        // Reward Logic
        add_action('woocommerce_order_status_completed', [$this, 'credit_user_wallet']);
        
        // Admin UI Hooks
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        // Product Override UI
        add_action('woocommerce_product_options_general_product_data', [$this, 'add_product_reward_fields']);
        add_action('woocommerce_process_product_meta', [$this, 'save_product_reward_fields']);
    }

    /**
     * Enqueue Vite-built assets for the React dashboard
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'wp-order-automator') === false) {
            return;
        }

        $dist_path = plugin_dir_path(__FILE__) . 'dist/assets/';
        $dist_url = plugin_dir_url(__FILE__) . 'dist/assets/';

        if (!is_dir($dist_path)) return;

        // Find JS and CSS files (handling Vite hashes)
        $js_files = glob($dist_path . 'index-*.js');
        $css_files = glob($dist_path . 'index-*.css');

        if (!empty($js_files)) {
            $js_file = basename($js_files[0]);
            wp_enqueue_script('wp-order-automator-js', $dist_url . $js_file, [], '1.2.1', true);
        }

        if (!empty($css_files)) {
            $css_file = basename($css_files[0]);
            wp_enqueue_style('wp-order-automator-css', $dist_url . $css_file, [], '1.2.1');
        }
    }

    public function schedule_automation() {
        if (!wp_next_scheduled('wp_order_automation_event')) {
            wp_schedule_event(time(), 'hourly', 'wp_order_automation_event');
        }
    }

    public function process_auto_completion() {
        if (!class_exists('WooCommerce')) return;

        $days = (int) get_option('wp_auto_wallet_days', 7);
        
        $args = [
            'status' => 'processing',
            'limit' => -1,
            'date_created' => '<' . (time() - ($days * 86400)),
        ];
        
        $orders = wc_get_orders($args);
        
        foreach ($orders as $order) {
            $order->update_status('completed', __('Automated completion by system.', 'wp-order-automator'));
        }
    }

    public function credit_user_wallet($order_id) {
        if (!class_exists('WooCommerce')) return;

        $global_percentage = (float) get_option('wp_auto_wallet_percentage', 0);
        $order = wc_get_order($order_id);
        if (!$order) return;

        $total_credit = 0;
        $reward_details = [];

        foreach ($order->get_items() as $item_id => $item) {
            $product_id = $item->get_product_id();
            
            $override_type = get_post_meta($product_id, '_wp_auto_wallet_override_type', true);
            $override_value = (float) get_post_meta($product_id, '_wp_auto_wallet_override_value', true);

            $item_credit = 0;

            if ($override_type === 'fixed') {
                $item_credit = $override_value * $item->get_quantity();
                $reward_details[] = sprintf('%s: Fixed %s', $item->get_name(), wc_price($item_credit));
            } elseif ($override_type === 'percentage') {
                $item_credit = $item->get_total() * ($override_value / 100);
                $reward_details[] = sprintf('%s: %s%% of item total (%s)', $item->get_name(), $override_value, wc_price($item_credit));
            } else {
                $item_credit = $item->get_total() * ($global_percentage / 100);
                if ($global_percentage > 0) {
                    $reward_details[] = sprintf('%s: Global %s%% (%s)', $item->get_name(), $global_percentage, wc_price($item_credit));
                }
            }

            $total_credit += $item_credit;
        }
        
        if ($total_credit <= 0) return;

        $user_id = $order->get_user_id();

        if ($user_id) {
            $description = __('Order Reward: ', 'wp-order-automator') . implode(', ', $reward_details);
            
            if (function_exists('terawallet_add_credit')) {
                terawallet_add_credit($user_id, $total_credit, $description);
            } else {
                $current_balance = (float) get_user_meta($user_id, '_uw_balance', true);
                update_user_meta($user_id, '_uw_balance', $current_balance + $total_credit);
            }
            
            $order->add_order_note(sprintf(__('Wallet credited with total %s. Details: %s', 'wp-order-automator'), wc_price($total_credit), $description));
        }
    }

    public function add_product_reward_fields() {
        echo '<div class="options_group">';
        
        woocommerce_wp_select([
            'id'      => '_wp_auto_wallet_override_type',
            'label'   => __('Wallet Credit Override Type', 'wp-order-automator'),
            'options' => [
                ''           => __('Use Global Settings', 'wp-order-automator'),
                'fixed'      => __('Fixed Amount per Item', 'wp-order-automator'),
                'percentage' => __('Percentage of Item Subtotal', 'wp-order-automator'),
            ],
            'desc_tip' => true,
            'description' => __('Specify if this product should have a different reward rule than the global setting.', 'wp-order-automator'),
        ]);

        woocommerce_wp_text_input([
            'id'          => '_wp_auto_wallet_override_value',
            'label'       => __('Wallet Credit Override Value', 'wp-order-automator'),
            'placeholder' => '0',
            'desc_tip'    => true,
            'description' => __('The amount (in currency) or percentage (0-100) for this product reward.', 'wp-order-automator'),
            'type'        => 'number',
            'custom_attributes' => ['step' => 'any', 'min' => '0'],
        ]);

        echo '</div>';
    }

    public function save_product_reward_fields($post_id) {
        $override_type = isset($_POST['_wp_auto_wallet_override_type']) ? sanitize_text_field($_POST['_wp_auto_wallet_override_type']) : '';
        $override_value = isset($_POST['_wp_auto_wallet_override_value']) ? sanitize_text_field($_POST['_wp_auto_wallet_override_value']) : '';

        update_post_meta($post_id, '_wp_auto_wallet_override_type', $override_type);
        update_post_meta($post_id, '_wp_auto_wallet_override_value', $override_value);
    }

    public function add_admin_menu() {
        add_menu_page(
            'Order Automator',
            'Order Automator',
            'manage_options',
            'wp-order-automator',
            [$this, 'render_admin_page'],
            'dashicons-automation',
            56
        );
    }

    public function render_admin_page() {
        echo '<div id="wp-order-automator-root"></div>';
    }
}

new WP_Order_Automator();