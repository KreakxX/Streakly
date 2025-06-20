// Simplified CategoryDatamodule.kt - No sync, just save data
package com.kreakxx.loop

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.SharedPreferences
import android.content.Context
import android.content.Intent
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*

class CategoryDatamodule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CategoryDatamodule"

    @ReactMethod
    fun saveToPrefs(key: String, value: String, promise: Promise) {
        try {
            val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
            prefs.edit().putString(key, value).apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SAVE_ERROR", e)
        }
    }

    @ReactMethod
    fun updateWidget(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, HomeScreenwidget::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val appWidgetManager = AppWidgetManager.getInstance(reactApplicationContext)
            val componentName = ComponentName(reactApplicationContext, HomeScreenwidget::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds)
            reactApplicationContext.sendBroadcast(intent)
            
            for (appWidgetId in appWidgetIds) {
                appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.days_grid)
            }
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UPDATE_ERROR", e)
        }
    }

    @ReactMethod
    fun loadWidgetData(promise: Promise) {
        try {
            val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
            val habitStreak = prefs.getString("widget_habit_streak", "0")
            val checkedDays = prefs.getString("widget_habit_checkedDays", "[]")
            val result = Arguments.createMap()
            result.putString("habitStreak", habitStreak)
            result.putString("checkedDays", checkedDays)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("LOAD_ERROR", e)
        }
    }

    @ReactMethod
    fun loadWidgetDataForId(widgetId: Int, promise: Promise) {
        try {
            val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
            val habitStreak = prefs.getString("widget_${widgetId}_habit_streak", "0")
            val checkedDays = prefs.getString("widget_${widgetId}_habit_checkedDays", "[]")
            val habitName = prefs.getString("widget_${widgetId}_habit_name", "Habit")
            val habitColor = prefs.getString("widget_${widgetId}_habit_color", "#60A5FA")
            
            val result = Arguments.createMap()
            result.putString("habitStreak", habitStreak)
            result.putString("checkedDays", checkedDays)
            result.putString("habitName", habitName)
            result.putString("habitColor", habitColor)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("LOAD_ERROR", e)
        }
    }

    @ReactMethod
    fun getAllWidgetIds(promise: Promise) {
        try {
            val appWidgetManager = AppWidgetManager.getInstance(reactApplicationContext)
            val componentName = ComponentName(reactApplicationContext, HomeScreenwidget::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            
            val result = Arguments.createArray()
            for (id in appWidgetIds) {
                result.pushInt(id)
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_IDS_ERROR", e)
        }
    }
}