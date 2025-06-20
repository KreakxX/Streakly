// Simplified Version - DaysRemoteViewsService.kt
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
            rv.setInt(R.id.day_cell, "setBackgroundColor", Color.parseColor(habitColor))
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
            emptyList()
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun loadGridState() {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val startDateString = prefs.getString("widget_${appWidgetId}_habit_startDate", null)
        
        // Use stored start date or default to current Monday
        val startDate = if (!startDateString.isNullOrBlank()) {
            try {
                LocalDate.parse(startDateString)
            } catch (e: Exception) {
                LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
            }
        } else {
            LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
        }

        val checked = loadCheckedDays()
        
        gridItems.clear()
        for (i in 0 until totalDays) {
            gridItems.add(i)
        }

        // Simply map checked days to grid positions
        checkedDays = checked
            .filter { it.status == true }
            .mapNotNull { cd ->
                try {
                    val checkDate = LocalDate.parse(cd.date)
                    val dayOffset = ChronoUnit.DAYS.between(startDate, checkDate).toInt()
                    
                    if (dayOffset >= 0 && dayOffset < totalDays) {
                        val col = dayOffset % 7
                        val row = dayOffset / 7
                        row + col * 10
                    } else {
                        null
                    }
                } catch (e: Exception) {
                    null
                }
            }
    }
}