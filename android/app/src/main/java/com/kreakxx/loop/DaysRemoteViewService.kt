
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

   private fun loadCheckedays(): List<CheckedDay> {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        // Verwende die spezifische Widget-ID wie im zweiten File
        val json = prefs.getString("widget_${appWidgetId}_habit_checkedDays", "[]") ?: "[]"
        val type = object : TypeToken<List<CheckedDay>>() {}.type
        return Gson().fromJson(json, type)
    }

    @RequiresApi(Build.VERSION_CODES.O)
private fun loadStartDate(): LocalDate {
    val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
    val startDateString = prefs.getString("widget_habit_startDate", null)

    return if (!startDateString.isNullOrBlank()) {
        LocalDate.parse(startDateString)
    } else {
        LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
    }
}

    @RequiresApi(Build.VERSION_CODES.O)
    private fun needsReset(startDate: LocalDate): Boolean {
        val today = LocalDate.now(ZoneId.systemDefault())
        return ChronoUnit.DAYS.between(startDate, today) >= totalDays
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun saveNewStartDate() {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE).edit()
        val monday = LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
        prefs.putString("widget_habit_startDate", monday.toString())
        prefs.apply()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun loadGridState() {
        var startDate = loadStartDate()
        if (needsReset(startDate)) {
            saveNewStartDate()
            startDate = loadStartDate()
        }

        val checked = loadCheckedays()
        gridItems.clear()
        for (i in 0 until totalDays) {
            gridItems.add(i)
        }

        checkedDays = checked
            .filter { cd ->
                cd.status &&
                        !LocalDate.parse(cd.date).isBefore(startDate) &&
                        !LocalDate.parse(cd.date).isAfter(startDate.plusDays(totalDays.toLong()))
            }
            .map {
                val dayOffset = ChronoUnit.DAYS.between(startDate, LocalDate.parse(it.date)).toInt()
                val col = dayOffset % 7
                val row = dayOffset / 7
                row + col * 10
            }
    }
}