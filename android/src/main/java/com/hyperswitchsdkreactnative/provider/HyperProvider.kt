package com.hyperswitchsdkreactnative.provider

import android.app.Activity
import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.ReadableArray
import com.hyperswitchsdkreactnative.internal.ReactFragment
import org.json.JSONObject
import org.json.JSONArray

internal class HyperProvider internal constructor(private val activity: Activity) {

  private var customBackendUrl: String? = null
  private var customLogUrl: String? = null
  private var customParams: ReadableMap? = null
  private var clientSecret: String? = null



  fun initialise(
    publishableKey: String?,
    customBackendUrl: String?,
    customLogUrl: String?,
    customParams: ReadableMap?
  ) {
    Companion.publishableKey = publishableKey
    this.customBackendUrl = customBackendUrl
    this.customLogUrl = customLogUrl
    this.customParams = customParams
    try {
      ReactFragment.initOTAServices(context = activity)
    }catch (_: Exception){
    }
  }

  fun initPaymentSession(clientSecret: String) {
    this.clientSecret = clientSecret
  }


  fun presentPaymentSheet(readableMap: ReadableMap) {
    val activity = activity as? FragmentActivity
    removeSheetView(true) // remove any existing payment sheet
    activity?.let {
      val propsBundle = Bundle().apply {
        putString("type", "payment")
        putString("from", "rn")
        putString("publishableKey", publishableKey ?: "")
        putString("clientSecret", clientSecret ?: "")
        putBundle("configuration", readableMapToBundle(readableMap))
        customBackendUrl?.let { url -> putString("customBackendUrl", url) }
        customLogUrl?.let { url -> putString("customLogUrl", url) }
        customParams?.let { params -> putString("customParams", readableMapToJSON(params).toString()) }
      }

      val bundle = Bundle().apply {
        putBundle("props", propsBundle)
      }

      reactFragment = ReactFragment.Builder()
        .setComponentName("hyperSwitch")
        .setLaunchOptions(bundle)
        .build()

      val fragmentManager: FragmentManager = it.supportFragmentManager
      val fragmentTransaction: FragmentTransaction = fragmentManager.beginTransaction()
      fragmentTransaction.add(android.R.id.content, reactFragment!!, "HyperPaymentSheet")
      fragmentTransaction.addToBackStack("HyperPaymentSheet")
      fragmentTransaction.commit()
    } ?: run {
//      callback(PaymentResult(status = "failed", message = "Activity is not a FragmentActivity"))
    }
  }

  fun removeSheetView(reset : Boolean){
    val activity = activity as? FragmentActivity
    activity?.let {
      if (reactFragment != null) {
        it.supportFragmentManager
          .beginTransaction()
          .remove(reactFragment!!)
          .commit()
      }
      if (reset){
        reactFragment = null
      }

    }
  }
  companion object {
    @JvmStatic
    var reactFragment: Fragment? = null

    @JvmStatic
    private var publishableKey: String? = null

    fun publishableKey() : String {
      return publishableKey ?: ""
    }

    fun readableMapToJSON(readableMap: ReadableMap?): JSONObject {
      val json = JSONObject()
      if (readableMap == null) return json

      val iterator = readableMap.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val type = readableMap.getType(key)

        when (type) {
          ReadableType.Null -> json.put(key, JSONObject.NULL)
          ReadableType.Boolean -> json.put(key, readableMap.getBoolean(key))
          ReadableType.Number -> json.put(key, readableMap.getDouble(key))
          ReadableType.String -> json.put(key, readableMap.getString(key))
          ReadableType.Map -> json.put(key, readableMapToJSON(readableMap.getMap(key)))
          ReadableType.Array -> json.put(key, readableArrayToJSON(readableMap.getArray(key)))
        }
      }
      return json
    }

    fun readableArrayToJSON(readableArray: ReadableArray?): JSONArray {
      val json = JSONArray()
      if (readableArray == null) return json

      for (i in 0 until readableArray.size()) {
        val type = readableArray.getType(i)
        when (type) {
          ReadableType.Null -> json.put(JSONObject.NULL)
          ReadableType.Boolean -> json.put(readableArray.getBoolean(i))
          ReadableType.Number -> json.put(readableArray.getDouble(i))
          ReadableType.String -> json.put(readableArray.getString(i))
          ReadableType.Map -> json.put(readableMapToJSON(readableArray.getMap(i)))
          ReadableType.Array -> json.put(readableArrayToJSON(readableArray.getArray(i)))
        }
      }
      return json
    }

    fun readableMapToBundle(readableMap: ReadableMap?): Bundle {
      val bundle = Bundle()
      if (readableMap == null) return bundle

      val iterator = readableMap.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val type = readableMap.getType(key)

        when (type) {
          ReadableType.Null -> bundle.putString(key, null)
          ReadableType.Boolean -> bundle.putBoolean(key, readableMap.getBoolean(key))
          ReadableType.Number -> {
            val value = readableMap.getDouble(key)
            if (value % 1 == 0.0) {
              bundle.putInt(key, value.toInt())
            } else {
              bundle.putDouble(key, value)
            }
          }
          ReadableType.String -> bundle.putString(key, readableMap.getString(key))
          ReadableType.Map -> bundle.putBundle(key, readableMapToBundle(readableMap.getMap(key)))
          ReadableType.Array -> {
            // Convert array to JSON string for simplicity
            bundle.putString(key, readableMap.getArray(key)?.toString())
          }
        }
      }
      return bundle
    }
  }
}
