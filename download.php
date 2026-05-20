<?php
/**
 * Standalone Plugin Bundler
 * Creates a ZIP file of the plugin and prompts download.
 */

$zip_filename = 'wp-auto-wallet-plugin.zip';
$zip = new ZipArchive();

if ($zip->open($zip_filename, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Cannot create zip file");
}

// Files to include in the root
$root_files = [
    'wp-auto-wallet.php',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'postcss.config.js',
    'plan.md'
];

foreach ($root_files as $file) {
    if (file_exists($file)) {
        $zip->addFile($file, 'wp-order-automator/' . $file);
    }
}

// Add directories recursively
function add_dir_to_zip($zip, $dir_path, $zip_path) {
    if (!is_dir($dir_path)) return;
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir_path),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($files as $name => $file) {
        if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen(realpath($dir_path)) + 1);
            $zip->addFile($filePath, 'wp-order-automator/' . $zip_path . '/' . $relativePath);
        }
    }
}

add_dir_to_zip($zip, 'src', 'src');
add_dir_to_zip($zip, 'dist', 'dist');
add_dir_to_zip($zip, 'public', 'public');

$zip->close();

// Headers to prompt download
if (file_exists($zip_filename)) {
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $zip_filename . '"');
    header('Content-Length: ' . filesize($zip_filename));
    header('Pragma: no-cache');
    header('Expires: 0');
    readfile($zip_filename);
    
    // Clean up temporary zip file
    unlink($zip_filename);
    exit;
} else {
    die("Zip file creation failed.");
}