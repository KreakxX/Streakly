// WidgetConfigurationActivity.kt
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
import java.lang.reflect.Type


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
        val streak: Int = 0
    ) {
        override fun toString(): String = name
    }
    
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
        
        // Initialize adapter
        categoryAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            mutableListOf<Category>()
        )
        categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        categorySpinner.adapter = categoryAdapter
    }
    
    private fun loadCategories() {
        // TODO: Replace with your actual data loading logic
        // This could be from Room Database, Repository, or API
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
            val type = object : TypeToken<List<Category>>() {}.type
            val categoriesWithoutIds: List<Category> = gson.fromJson(habitsJson, type)
            
            categoriesWithoutIds.mapIndexed { index, category ->
                category.copy(id = (index + 1).toString())
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
        Category("1", "Workout", "#60A5FA", 5),
        Category("2", "Reading", "#34D399", 3),
        Category("3", "Meditation", "#F59E0B", 7),
        Category("4", "Water Drinking", "#8B5CF6", 2)
    )
}
    
    private fun setupListeners() {
        confirmButton.setOnClickListener {
            saveConfiguration()
        }
    }
    
    private fun saveConfiguration() {
        val selectedCategory = categorySpinner.selectedItem as? Category
        
        if (selectedCategory == null) {
            Toast.makeText(this, "Please select a category", Toast.LENGTH_SHORT).show()
            return
        }
        
        // Save configuration to SharedPreferences
        val prefs = getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        prefs.edit().apply {
            putString("widget_${appWidgetId}_category_id", selectedCategory.id)
            putString("widget_${appWidgetId}_habit_name", selectedCategory.name)
            putString("widget_${appWidgetId}_habit_color", selectedCategory.color)
            putString("widget_${appWidgetId}_habit_streak", selectedCategory.streak.toString())
            putString("widget_${appWidgetId}_habit_checkedDays", "[]")
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