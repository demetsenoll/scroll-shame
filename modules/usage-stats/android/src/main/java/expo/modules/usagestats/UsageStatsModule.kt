package expo.modules.usagestats

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.*
import java.util.Calendar

private val SOCIAL_APPS = mapOf(
    "com.zhiliaoapp.musically"   to "tiktok",
    "com.ss.android.ugc.trill"   to "tiktok",
    "com.bytedance.tiktok"       to "tiktok",
    "com.instagram.android"      to "instagram",
    "com.google.android.youtube" to "youtube",
    "com.twitter.android"        to "twitter",
    "com.x.android"              to "twitter",
)

class UsageStatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "UsageStats"

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasPermission(): Boolean {
        val usm = reactApplicationContext
            .getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, now - 60_000, now)
        return !stats.isNullOrEmpty()
    }

    @ReactMethod
    fun openPermissionSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun getTodayUsage(promise: Promise) {
        try {
            if (!hasPermission()) {
                promise.resolve(null)
                return
            }
            val usm = reactApplicationContext
                .getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val startOfDay = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }.timeInMillis

            val stats: List<UsageStats> = usm.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startOfDay,
                System.currentTimeMillis()
            ) ?: emptyList()

            val totals = mutableMapOf("tiktok" to 0L, "instagram" to 0L, "youtube" to 0L, "twitter" to 0L)
            for (stat in stats) {
                val key = SOCIAL_APPS[stat.packageName] ?: continue
                totals[key] = totals.getValue(key) + stat.totalTimeInForeground
            }

            val result = Arguments.createMap().apply {
                totals.forEach { (k, ms) -> putInt(k, maxOf(0, (ms / 60_000).toInt())) }
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("USAGE_STATS_ERROR", e.message, e)
        }
    }
}
