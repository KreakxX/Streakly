// Simplified WidgetConfigurationActivity.kt - Just save data as-is
package com.kreakxx.loop

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.time.LocalDate
import java.time.ZoneId
import java.time.DayOfWeek
import android.os.Build
import androidx.annotation.RequiresApi

class WidgetConfigurationActivity : AppCompatActivity() {
    
    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private lateinit var categorySpinner: Spinner
    private lateinit var confirmButton: Button
    private lateinit var categoryAdapter: ArrayAdapter<Category>
    private var categories: List<Category> = emptyList()
    
    data class Category(
        val id: String,
        val name: String,
        val color: String,
        val streak: Int = 0,
        val checkedDays: List<CheckedDay> = emptyList()
    ) {
        override fun toString(): String = name
    }
    
    data class CheckedDay(
        val date: String,
        val status: Boolean
    )
    
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_widget_configuration)
        
        setResult(Activity.RESULT_CANCELED)
        
        appWidgetId = intent?.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID
        
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }
        
        initViews()
        loadCategories()
        setupListeners()
    }
    
    private fun initViews() {
        categorySpinner = findViewById(R.id.category_spinner)
        confirmButton = findViewById(R.id.confirm_button)
        
        categoryAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            mutableListOf<Category>()
        )
        categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        categorySpinner.adapter = categoryAdapter
    }
    
    private fun loadCategories() {
        categories = loadCategoriesFromDataSource()
        
        categoryAdapter.clear()
        categoryAdapter.addAll(categories)
        categoryAdapter.notifyDataSetChanged()
        
        if (categories.isEmpty()) {
            Toast.makeText(this, "No categories found", Toast.LENGTH_SHORT).show()
            confirmButton.isEnabled = false
        }
    }
    
    private fun loadCategoriesFromDataSource(): List<Category> {
        val prefs = getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val habitsJson = prefs.getString("habits", null)
        
        return if (habitsJson != null && habitsJson != "LMAO") {
            try {
                val gson = Gson()
                val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                val habitsData: List<Map<String, Any>> = gson.fromJson(habitsJson, type)
                
                habitsData.mapIndexed { index, habitMap ->
                    val id = when (val idValue = habitMap["id"]) {
                        is Number -> idValue.toString()
                        is String -> idValue
                        else -> (index + 1).toString()
                    }
                    
                    val name = habitMap["name"] as? String ?: "Habit ${index + 1}"
                    val color = habitMap["color"] as? String ?: "#60A5FA"
                    val streak = (habitMap["streak"] as? Number)?.toInt() ?: 0
                    
                    val checkedDays = try {
                        val checkedDaysData = habitMap["checkedDays"]
                        when (checkedDaysData) {
                            is List<*> -> {
                                checkedDaysData.mapNotNull { dayData ->
                                    when (dayData) {
                                        is Map<*, *> -> {
                                            val date = dayData["date"] as? String
                                            val status = dayData["status"] as? Boolean
                                            if (date != null && status != null) {
                                                CheckedDay(date, status)
                                            } else null
                                        }
                                        else -> null
                                    }
                                }
                            }
                            else -> emptyList()
                        }
                    } catch (e: Exception) {
                        emptyList<CheckedDay>()
                    }
                    
                    Category(id, name, color, streak, checkedDays)
                }
            } catch (e: Exception) {
                getDefaultCategories()
            }
        } else {
            getDefaultCategories()
        }
    }

    private fun getDefaultCategories(): List<Category> {
        return listOf(
            Category("1", "Workout", "#60A5FA", 0),
            Category("2", "Reading", "#34D399", 0),
            Category("3", "Meditation", "#F59E0B", 0),
            Category("4", "Water Drinking", "#8B5CF6", 0)
        )
    }
    
    private fun setupListeners() {
        confirmButton.setOnClickListener {
            saveConfiguration()
        }
    }
    
    @RequiresApi(Build.VERSION_CODES.O)
    private fun saveConfiguration() {
        val selectedCategory = categorySpinner.selectedItem as? Category
        
        if (selectedCategory == null) {
            Toast.makeText(this, "Please select a category", Toast.LENGTH_SHORT).show()
            return
        }
        
        // Save EXACT data from app - no modifications
        val gson = Gson()
        val checkedDaysJson = gson.toJson(selectedCategory.checkedDays)
        
        val prefs = getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        prefs.edit().apply {
            putString("widget_${appWidgetId}_category_id", selectedCategory.id)
            putString("widget_${appWidgetId}_habit_name", selectedCategory.name)
            putString("widget_${appWidgetId}_habit_color", selectedCategory.color)
            putString("widget_${appWidgetId}_habit_streak", selectedCategory.streak.toString())
            putString("widget_${appWidgetId}_habit_checkedDays", checkedDaysJson)
            
            // Set start date to current Monday
            val monday = LocalDate.now(ZoneId.systemDefault()).with(DayOfWeek.MONDAY)
            putString("widget_${appWidgetId}_habit_startDate", monday.toString())
            
            apply()
        }
        
        val context = this@WidgetConfigurationActivity
        val appWidgetManager = AppWidgetManager.getInstance(context)
        updateAppWidget(context, appWidgetManager, appWidgetId)
        
        val resultValue = Intent().apply {
            putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        }
        setResult(Activity.RESULT_OK, resultValue)
        finish()
    }
}