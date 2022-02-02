package com.app.cwcs;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class NotificationActionsBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action=intent.getStringExtra("action");

        if(action.equals("close")) {
            closeAction(context);
        }
        else if(action.equals("open")) {
            openAction(context);
        }

        //CLOSE NOTIFICATION TRAY AFTER CALL ACITON
        Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
        context.sendBroadcast(it);
    }

    public void closeAction(Context context){
        System.out.println("CWCS => close");
        //STOP BACKGROUND SERVICE
        Intent startServiceIntent = new Intent(context, BackgroundService.class);
        startServiceIntent.putExtra("stopBackgroundService", "true");
        context.startService(startServiceIntent);

        //CLOSE APP
        Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("com.app.cwcs.close");
        context.sendBroadcast(broadcastIntent);
    }

    public void openAction(Context context){
        System.out.println("CWCS => open");
        //OPEN APP
        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
}