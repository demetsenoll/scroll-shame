const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Adds PACKAGE_USAGE_STATS permission to AndroidManifest.xml.
 * This is a "normal" permission but must be declared; the user
 * must still grant access via Settings → Usage access.
 */
module.exports = function withUsageStats(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const mainApp = manifest.manifest;

    if (!mainApp['uses-permission']) {
      mainApp['uses-permission'] = [];
    }

    const alreadyAdded = mainApp['uses-permission'].some(
      (p) => p.$?.['android:name'] === 'android.permission.PACKAGE_USAGE_STATS'
    );

    if (!alreadyAdded) {
      mainApp['uses-permission'].push({
        $: { 'android:name': 'android.permission.PACKAGE_USAGE_STATS', 'tools:ignore': 'ProtectedPermissions' },
      });
    }

    return mod;
  });
};
