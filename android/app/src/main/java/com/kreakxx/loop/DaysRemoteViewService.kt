// Updated DaysRemoteViewsService.kt with simplified date handling from version 2
package com.kreakxx.loop

import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import android.appwidget.AppWidgetManager
import androidx.annotation.RequiresApi
import com.google.common.reflect.TypeToken
import com.google.gson.Gson
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import android.graphics.Color
import android.util.Log

class DaysRemoteViewsService : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        val appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
        return DaysRemoteViewsFactory(applicationContext, appWidgetId)
    }
}

class DaysRemoteViewsFactory(private val context: Context, private val appWidgetId: Int) : RemoteViewsService.RemoteViewsFactory {

    private val totalDays = 70 // total days to show
    private var checkedDays = listOf<Int>()
    private val gridItems = mutableListOf<Int>()

    companion object {
        // Utility function for consistent date formatting (same as HomeScreenwidget)
        fun getTodayDateString(): String {
            return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                LocalDate.now(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_LOCAL_DATE)
            } else {
                val calendar = java.util.Calendar.getInstance()
                String.format(
                    "%04d-%02d-%02d",
                    calendar.get(java.util.Calendar.YEAR),
                    calendar.get(java.util.Calendar.MONTH) + 1,
                    calendar.get(java.util.Calendar.DAY_OF_MONTH)
                )
            }
        }
        
        // Utility function to extract date part from any date string (same as HomeScreenwidget)
        fun extractDatePart(dateString: String): String {
            return if (dateString.contains('T')) {
                dateString.split('T')[0]
            } else {
                dateString
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate() {
        loadGridState()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onDataSetChanged() {
        loadGridState()
    }

    override fun onDestroy() {
    }

    override fun getCount(): Int = gridItems.size

    @RequiresApi(Build.VERSION_CODES.O)
    override fun getViewAt(position: Int): RemoteViews {
        val rv = RemoteViews(context.packageName, R.layout.day_item)
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val habitColor = prefs.getString("widget_${appWidgetId}_habit_color", "#60A5FA")

        val dayIndex = gridItems[position]
        val isChecked = checkedDays.contains(dayIndex)
        
        if (isChecked) {
            try {
                rv.setInt(R.id.day_cell, "setBackgroundColor", Color.parseColor(habitColor))
            } catch (e: Exception) {
                rv.setInt(R.id.day_cell, "setBackgroundColor", Color.parseColor("#60A5FA"))
            }
        } else {
            rv.setInt(R.id.day_cell, "setBackgroundResource", R.drawable.day_unchecked)
        }

        return rv
    }

    override fun getLoadingView(): RemoteViews? = null
    override fun getViewTypeCount(): Int = 1
    override fun getItemId(position: Int): Long = position.toLong()
    override fun hasStableIds(): Boolean = true

    data class CheckedDay(val date: String, val status: Boolean)

    private fun loadCheckedDays(): List<CheckedDay> {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
        
        val type = object : TypeToken<List<CheckedDay>>() {}.type
        return try {
            Gson().fromJson(json, type) ?: emptyList()
        } catch (e: Exception) {
            Log.e("DaysRemoteViews", "Error parsing checkedDays JSON: $json", e)
            emptyList()
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun loadGridState() {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val startDateString = prefs.getString("widget_${appWidgetId}_habit_startDate", null)
        
        // Use stored start date or default to current Monday (simplified approach from version 2)
        val startDate = if (!startDateString.isNullOrBlank()) {
            try {
                LocalDate.parse(startDateString)
            } catch (e: Exception) {
                Log.e("DaysRemoteViews", "Error parsing start date: $startDateString", e)
                LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
            }
        } else {
            LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
        }

        val checked = loadCheckedDays()
        
        // Create grid items (0 to totalDays-1)
        gridItems.clear()
        for (i in 0 until totalDays) {
            gridItems.add(i)
        }

        // Map checked days to grid positions with date splitting like in HomeScreenwidget (version 2 approach)
        checkedDays = checked
            .filter { it.status == true }
            .mapNotNull { cd ->
                try {
                    // Extract only the date part (before 'T') for comparison - same as HomeScreenwidget
                    val dateOnly = if (cd.date.contains('T')) {
                        cd.date.split('T')[0]
                    } else {
                        cd.date
                    }
                    
                    val checkDate = LocalDate.parse(dateOnly)
                    val dayOffset = ChronoUnit.DAYS.between(startDate, checkDate).toInt()
                    
                    if (dayOffset >= 0 && dayOffset < totalDays) {
                        val col = dayOffset % 7
                        val row = dayOffset / 7
                        row + col * 10
                    } else {
                        null
                    }
                } catch (e: Exception) {
                    Log.e("DaysRemoteViews", "Date parsing error for: ${cd.date}", e)
                    null
                }
            }
        
        Log.d("DaysRemoteViews", "Loaded grid state: startDate=$startDate, checkedDays=${checkedDays.size}, totalItems=${gridItems.size}")
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun getDayOfWeekFromIndex(startDate: LocalDate, dayIndex: Int): DayOfWeek {
        return startDate.plusDays(dayIndex.toLong()).dayOfWeek
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun getDateFromIndex(startDate: LocalDate, dayIndex: Int): LocalDate {
        return startDate.plusDays(dayIndex.toLong())
    }
}