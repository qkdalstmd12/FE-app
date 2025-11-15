package com.runify.runify

import android.app.Application
import android.content.Context
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.PackageList
import com.facebook.soloader.SoLoader
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  private val mReactNativeHost: ReactNativeHost =
    ReactNativeHostWrapper(this, object : ReactNativeHost(this) {
      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
      override fun getPackages(): List<com.facebook.react.ReactPackage> =
        PackageList(this).packages
      override fun getJSMainModuleName(): String = "index"
      override fun getApplication(): Application = this@MainApplication
    })

  override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun attachBaseContext(base: Context) {
    super.attachBaseContext(base)
    ApplicationLifecycleDispatcher.onApplicationAttachBaseContext(this, base)
  }
}