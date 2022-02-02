package com.app.cwcs;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(PushNotificationsPlugin.class);
    }});

    closeAppBroadcastReceiver();
  }

   public void closeAppBroadcastReceiver() {
     IntentFilter intentFilter = new IntentFilter();
     intentFilter.addAction("com.app.cwcs.close");
     BroadcastReceiver CloseAppBroadcastReceiver = new BroadcastReceiver() {
       @Override
       public void onReceive(Context context, Intent intent) {
         finish();
       }
     };
     registerReceiver(CloseAppBroadcastReceiver, intentFilter);
   }
}
