#!/bin/bash

# Create a clean folder for the plugin
PLUGIN_DIR="wp-order-automator"
mkdir -p $PLUGIN_DIR

# Copy the PHP plugin file
cp wp-auto-wallet.php $PLUGIN_DIR/

# Create a dummy index file for security
echo "<?php // Silence is golden" > $PLUGIN_DIR/index.php

# Zip the folder
# Note: In a real environment, we would also copy the built React assets (dist folder)
# but for this preview, we are providing the main logic and dashboard structure.
zip -r wp-order-automator.zip $PLUGIN_DIR

echo "Plugin package created: wp-order-automator.zip"
echo "You can now install this file via Plugins > Add New > Upload in your WordPress dashboard."