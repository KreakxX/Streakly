package com.kreakxx.loop

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.SharedPreferences
import android.content.Context
import android.content.Intent
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

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UPDATE_ERROR", e)
        }
}

    @ReactMethod
    fun loadWidgetData(promise:Promise) {
        val prefs: SharedPreferences = reactApplicationContext.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val habitStreak = prefs.getString("widget_habit_streak", "0")
        val checkedDays = prefs.getString("widget_habit_checkedDays", "[]")
        val result = Arguments.createMap()
        result.putString("habitStreak", habitStreak)
        result.putString("checkedDays", checkedDays)

        promise.resolve(result)
    }
}