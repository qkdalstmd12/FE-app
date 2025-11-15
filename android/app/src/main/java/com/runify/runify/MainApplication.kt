package com.runify.runify

import android.app.Application
import android.content.Context
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.PackageList
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper
import com.facebook.react.ReactPackage

class MainApplication : Application(), ReactApplication {

    private val reactNativeHost: ReactNativeHost =
        ReactNativeHostWrapper(this, object : DefaultReactNativeHost(this) { 
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override fun getPackages(): List<ReactPackage> {
                // DefaultNewArchitectureEntryPoint.getPackages() 호출은 제외
                return PackageList(this).packages 
            }

            override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry" 
        })

    override fun getReactNativeHost(): ReactNativeHost = reactNativeHost

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