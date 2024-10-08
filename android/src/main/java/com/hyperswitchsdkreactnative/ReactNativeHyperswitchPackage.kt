package com.hyperswitchsdkreactnative

import ReactNativeHyperswitchModule
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.hyperswitchsdkreactnative.react.GooglePayButtonManager

import io.hyperswitch.react.HyperHeadlessModule


class ReactNativeHyperswitchPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(ReactNativeHyperswitchModule(reactContext), HyperHeadlessModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(GooglePayButtonManager())
  }
}
