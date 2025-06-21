// Simplified HomeScreenwidget.kt - Just show loaded data
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
import android.util.Log

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
            val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
            val habitName = prefs.getString("widget_${appWidgetId}_habit_name", null)
            
            if (habitName != null) {
                updateAppWidget(context, appWidgetManager, appWidgetId)
            }
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
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val editor = prefs.edit()
        
        for (appWidgetId in appWidgetIds) {
            editor.remove("widget_${appWidgetId}_category_id")
            editor.remove("widget_${appWidgetId}_habit_name")
            editor.remove("widget_${appWidgetId}_habit_color")
            editor.remove("widget_${appWidgetId}_habit_streak")
            editor.remove("widget_${appWidgetId}_habit_checkedDays")
            editor.remove("widget_${appWidgetId}_habit_startDate")
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
    val habitColor = prefs.getString("widget_${appWidgetId}_habit_color", "#60A5FA") ?: "#60A5FA"
    
    // Simply use the stored streak - no recalculation
    val streak = prefs.getString("widget_${appWidgetId}_habit_streak", "0")?.toIntOrNull() ?: 0
    
    views.setTextViewText(R.id.appwidget_streak, "$streak 🔥")
    views.setTextViewText(R.id.appwidget_text, habitName)
    
    // Check if today is in checkedDays
    val today = LocalDate.now(ZoneId.systemDefault()).toString()
    val gson = Gson()
    val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
    val type = object : TypeToken<List<DaysRemoteViewsFactory.CheckedDay>>() {}.type
    val checkedDays = try {
        gson.fromJson<List<DaysRemoteViewsFactory.CheckedDay>>(json, type) ?: emptyList()
    } catch (e: Exception) {
        emptyList<DaysRemoteViewsFactory.CheckedDay>()
    }

   val isChecked = checkedDays.any { checkedDay ->
    try {
        // Extrahiere nur das Datum (vor dem 'T') für Vergleich
        val dateOnly = if (checkedDay.date.contains('T')) {
            checkedDay.date.split('T')[0]
        } else {
            checkedDay.date
        }
        val result = dateOnly == today && checkedDay.status == true
        Log.d("WidgetDebug", "Comparing: '$dateOnly' == '$today' && ${checkedDay.status} = $result")
        result
    } catch (e: Exception) {
        Log.e("WidgetDebug", "Date parsing error for: ${checkedDay.date}", e)
        false
    }
}

    Log.d("WidgetDebug", "Today: $today")
Log.d("WidgetDebug", "CheckedDays JSON: $json")
checkedDays.forEach { day ->
    Log.d("WidgetDebug", "CheckedDay: date='${day.date}', status=${day.status}")
}
Log.d("WidgetDebug", "IsChecked result: $isChecked")
    
    
    // Create button with correct state
    val buttonBitmap = createButtonBitmap(isChecked, habitColor)
    views.setImageViewBitmap(R.id.round_button, buttonBitmap)
    views.setInt(R.id.round_button, "setBackgroundResource", 0)

    appWidgetManager.updateAppWidget(appWidgetId, views)
}

@RequiresApi(Build.VERSION_CODES.O)
private fun updateButton(context: Context, appWidgetId: Int) {
    val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
    val editor = prefs.edit()
    
    val gson = Gson()
    val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
    val type = object : TypeToken<MutableList<DaysRemoteViewsFactory.CheckedDay>>() {}.type
    val checkedDays = gson.fromJson<MutableList<DaysRemoteViewsFactory.CheckedDay>>(json, type) ?: mutableListOf()
    
val today = LocalDate.now(ZoneId.systemDefault()).toString() // "2025-06-21"
    
val existing = checkedDays.find { 
    val dateOnly = if (it.date.contains('T')) {
        it.date.split('T')[0]
    } else {
        it.date
    }
    dateOnly == today
} 

val wasChecked = existing?.status == true
    
    if (existing != null) {
        checkedDays.remove(existing)
    }
    checkedDays.add(DaysRemoteViewsFactory.CheckedDay(today, !wasChecked))
    
    checkedDays.sortBy { it.date }
    
    editor.putString("widget_${appWidgetId}_habit_checkedDays", gson.toJson(checkedDays))
    
    val newStreak = if (!wasChecked) {
        // Was unchecked, now checking -> increase streak
        val currentStreak = prefs.getString("widget_${appWidgetId}_habit_streak", "0")?.toIntOrNull() ?: 0
        currentStreak + 1
    } else {
        // Was checked, now unchecking -> decrease streak
        val currentStreak = prefs.getString("widget_${appWidgetId}_habit_streak", "0")?.toIntOrNull() ?: 0
        maxOf(0, currentStreak - 1)
    }
    
    editor.putString("widget_${appWidgetId}_habit_streak", newStreak.toString())
    editor.apply()
    
    val appWidgetManager = AppWidgetManager.getInstance(context)
    updateAppWidget(context, appWidgetManager, appWidgetId)
    appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.days_grid)
}

private fun createButtonBitmap(isChecked: Boolean, habitColor: String): Bitmap {
    val size = 104
    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    
    val backgroundPaint = Paint().apply {
        isAntiAlias = true
        color = try {
            if (isChecked) Color.parseColor(habitColor) else Color.parseColor("#2c2c2c")
        } catch (e: Exception) {
            if (isChecked) Color.parseColor("#60A5FA") else Color.parseColor("#2c2c2c")
        }
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