// Updated HomeScreenwidget.kt
package com.kreakxx.loop
import android.annotation.SuppressLint
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.time.LocalDate
import java.time.ZoneId
import android.graphics.Color
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.Typeface

class HomeScreenwidget : AppWidgetProvider() {
    companion object {
        const val ACTION_BUTTON_CLICK = "com.kreakxx.loop.ACTION_BUTTON_CLICK"
    }
    
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }
    
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_BUTTON_CLICK) {
            val appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1)
            if (appWidgetId != -1) {
                updateButton(context, appWidgetId)
            }
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        // Clean up preferences when widget is deleted
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val editor = prefs.edit()
        
        for (appWidgetId in appWidgetIds) {
            editor.remove("widget_${appWidgetId}_category_id")
            editor.remove("widget_${appWidgetId}_habit_name")
            editor.remove("widget_${appWidgetId}_habit_color")
            editor.remove("widget_${appWidgetId}_habit_streak")
            editor.remove("widget_${appWidgetId}_habit_checkedDays")
        }
        
        editor.apply()
        super.onDeleted(context, appWidgetIds)
    }
}

@SuppressLint("NewApi")
internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    val views = RemoteViews(context.packageName, R.layout.home_screenwidget_medium)
    val clickIntent = Intent(context, HomeScreenwidget::class.java).apply {
        action = HomeScreenwidget.ACTION_BUTTON_CLICK
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
    }

    val clickPendingIntent = PendingIntent.getBroadcast(
        context,
        appWidgetId,
        clickIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
    )

    views.setOnClickPendingIntent(R.id.round_button, clickPendingIntent)
    
    val intent = Intent(context, DaysRemoteViewsService::class.java)
    intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
    intent.data = Uri.parse("content://com.kreakxx.loop.widget/${appWidgetId}/${System.currentTimeMillis()}")

    views.setRemoteAdapter(R.id.days_grid, intent)

    val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
    val habitName = prefs.getString("widget_${appWidgetId}_habit_name", "Habit") ?: "Habit"
    val habitStreakString = prefs.getString("widget_${appWidgetId}_habit_streak", "0") ?: "0"
    val habitStreak = habitStreakString.toIntOrNull() ?: 0
    val habitColor = prefs.getString("widget_${appWidgetId}_habit_color", "#60A5FA") ?: "#60A5FA"
    
    views.setTextViewText(R.id.appwidget_streak, "$habitStreak 🔥")
    views.setTextViewText(R.id.appwidget_text, habitName)
    
    val gson = Gson()
    val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
    val type = object : TypeToken<List<DaysRemoteViewsFactory.CheckedDay>>() {}.type
    val checkedDays = gson.fromJson<List<DaysRemoteViewsFactory.CheckedDay>>(json, type)

    val today = LocalDate.now(ZoneId.systemDefault()).toString()
    val isChecked = checkedDays.any { it.date == today && it.status }
    
    // Create button bitmap based on checked state
    val buttonBitmap = createButtonBitmap(isChecked, habitColor)
    views.setImageViewBitmap(R.id.round_button, buttonBitmap)
    views.setInt(R.id.round_button, "setBackgroundResource", 0)

    appWidgetManager.updateAppWidget(appWidgetId, views)
}

@RequiresApi(Build.VERSION_CODES.O)
private fun updateButton(context: Context, appWidgetId: Int) {
    val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
    val habitColor = prefs.getString("widget_${appWidgetId}_habit_color", "#60A5FA") ?: "#60A5FA"
    val gson = Gson()
    val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
    val type = object : TypeToken<MutableList<DaysRemoteViewsFactory.CheckedDay>>() {}.type
    val checkedDays = gson.fromJson<MutableList<DaysRemoteViewsFactory.CheckedDay>>(json, type)

    val today = LocalDate.now(ZoneId.systemDefault()).toString()

    val existing = checkedDays.find { it.date == today }
    val wasChecked = existing?.status == true

    if (existing != null) {
        checkedDays.remove(existing)
        checkedDays.add(DaysRemoteViewsFactory.CheckedDay(today, !wasChecked))
    } else {
        checkedDays.add(DaysRemoteViewsFactory.CheckedDay(today, true))
    }

    // Update checkedDays in prefs
    prefs.edit().putString("widget_${appWidgetId}_habit_checkedDays", gson.toJson(checkedDays)).apply()

    // Update streak
    val currentStreakStringSave = prefs.getString("widget_habit_streak", "0") ?: "0"
    val currentStreakString = prefs.getString("widget_${appWidgetId}_habit_streak", "0") ?: "0"
    val currentStreak = currentStreakString.toIntOrNull() ?: 0
    val currentStreakSave = currentStreakStringSave.toIntOrNull() ?: 0

    val newStreak = if (wasChecked) currentStreak - 1 else currentStreak + 1
    val newStreakSave = if (wasChecked) currentStreakSave - 1 else currentStreakSave + 1

    prefs.edit().putString("widget_${appWidgetId}_habit_streak", newStreak.toString()).apply()
    prefs.edit().putString("widget_habit_streak", newStreakSave.toString()).apply()


    // Create new RemoteViews for the widget
    val views = RemoteViews(context.packageName, R.layout.home_screenwidget_medium)

    val isNowChecked = checkedDays.any { it.date == today && it.status }
    val buttonBitmap = createButtonBitmap(isNowChecked, habitColor)
    views.setImageViewBitmap(R.id.round_button, buttonBitmap)
    views.setInt(R.id.round_button, "setBackgroundResource", 0)
    views.setTextViewText(R.id.appwidget_streak, "$newStreak 🔥")

    val appWidgetManager = AppWidgetManager.getInstance(context)
    appWidgetManager.updateAppWidget(appWidgetId, views)
    updateAppWidget(context, appWidgetManager, appWidgetId)
    appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.days_grid)
}

private fun createButtonBitmap(isChecked: Boolean, habitColor: String): Bitmap {
    val size = 104
    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    
    val backgroundPaint = Paint().apply {
        isAntiAlias = true
        color = if (isChecked) Color.parseColor(habitColor) else Color.parseColor("#2c2c2c")
        style = Paint.Style.FILL
    }
    
    val radius = size / 2f
    canvas.drawCircle(radius, radius, radius, backgroundPaint)
    
    val textPaint = Paint().apply {
        isAntiAlias = true
        color = Color.WHITE
        textSize = size * 0.4f
        textAlign = Paint.Align.CENTER
        typeface = Typeface.DEFAULT_BOLD
    }
    
    val textBounds = Rect()
    textPaint.getTextBounds("✓", 0, 1, textBounds)
    val textX = radius
    val textY = radius - textBounds.exactCenterY()
    
    canvas.drawText("✓", textX, textY, textPaint)
    
    return bitmap
}