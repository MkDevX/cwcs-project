package com.app.cwcs;

import android.content.Intent;
import android.app.ActivityManager;
import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;


@NativePlugin()
public class PushNotificationsPlugin extends Plugin {

    @PluginMethod()
    public void start(PluginCall call) {
        try {
            if(!isServiceRunning(BackgroundService.class)) {
                Intent startServiceIntent = new Intent(getContext(), BackgroundService.class);
                getContext().startService(startServiceIntent);
            }
            System.out.println("CWCS => PushNotificationsPlugin has been started correctly.");
            JSObject result = new JSObject();
            result.put("message", "PushNotificationsPlugin has been started correctly.");
            call.success(result);
        } catch(Exception e) {
            System.out.println("CWCS => PushNotificationsPlugin has not been started.");
            call.error("PushNotificationsPlugin has not been started.");
        }
    }

    @PluginMethod()
    public void stop(PluginCall call) {
        try {
            if(isServiceRunning(BackgroundService.class)) {
                Intent startServiceIntent = new Intent(getContext(), BackgroundService.class);
                startServiceIntent.putExtra("stopBackgroundService", "true");
                getContext().startService(startServiceIntent);
            }
            System.out.println("CWCS => PushNotificationsPlugin has been stopped correctly.");
            JSObject result = new JSObject();
            result.put("message", "PushNotificationsPlugin has been stopped correctly.");
            call.success(result);
        } catch(Exception e) {
            System.out.println("CWCS => PushNotificationsPlugin has not been stopped.");
            call.error("PushNotificationsPlugin has not been stopped.");
        }
    }

    private boolean isServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getContext().getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}

