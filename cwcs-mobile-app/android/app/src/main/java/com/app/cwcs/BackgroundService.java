package com.app.cwcs;

import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.support.v4.app.NotificationCompat;
import android.widget.Toast;

import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import com.github.nkzawa.socketio.client.IO;

public class BackgroundService extends Service {
    private Timer timer;
    private TimerTask task;
    private String stopBackgroundService = null;
    private Handler handler;

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket(Constants.SERVER_URL);
        } catch (URISyntaxException e) {}
    }

    public BackgroundService() {

    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        System.out.println("CWCS => onCreate");
        //if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForeground();
        //}
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        System.out.println("CWCS => onStartCommand");
        if(intent != null) {
            stopBackgroundService = intent.getStringExtra("stopBackgroundService");
        }
        if(stopBackgroundService != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                stopForeground(true);
            }
                stopSelf();
        } else {
            //startTimer();
            startNotificationsListener();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        System.out.println("CWCS => onDestroy");
        //Toast.makeText(getApplicationContext(), "CWCS => onDestroy", Toast.LENGTH_SHORT).show();
        if(stopBackgroundService == null) {
            Intent broadcastIntent = new Intent(getApplicationContext(), BackgroundServiceBroadcastReceiver.class);
            sendBroadcast(broadcastIntent);
        }
        //stopTimer();
        stopNotificationsListener();
        stopBackgroundService = null;
    }


    private void startForeground() {
        String NOTIFICATION_CHANNEL_ID = "com.app.cwcs.background.service";
        String channelName = "BackgroundService";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_NONE);
            chan.setLightColor(Color.BLUE);
            chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            assert manager != null;
            manager.createNotificationChannel(chan);
        }

        //CLOSE APP
        Intent closeAction = new Intent(getApplicationContext(), NotificationActionsBroadcastReceiver.class);
        closeAction.putExtra("action","close");
        PendingIntent pCloseAction = PendingIntent.getBroadcast(getApplicationContext(), 1, closeAction, PendingIntent.FLAG_UPDATE_CURRENT);

        //OPEN APP
        Intent openAction = new Intent(getApplicationContext(), NotificationActionsBroadcastReceiver.class);
        openAction.putExtra("action","open");
        PendingIntent pOpenAction = PendingIntent.getBroadcast(getApplicationContext(), 2, openAction, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);
        Notification notification = notificationBuilder
                .setOngoing(true)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle("System kontroli stanowiska komputerowego")
                .setPriority(NotificationManager.IMPORTANCE_HIGH)
                .setCategory(Notification.CATEGORY_SERVICE)
                .addAction(R.drawable.ic_launcher_background, "WYŁĄCZ", pCloseAction)
                .addAction(R.drawable.ic_launcher_background, "OTWÓRZ", pOpenAction)
                .setGroup("com.app.cwcs.background.service")
                .build();
        startForeground(1, notification);
    }

    public void startNotificationsListener() {
        handler = new Handler();
        mSocket.connect();

        mSocket.on("NOTIFICATIONS", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                handler.post(() -> {
                    System.out.println("CWCS => NOTIFICATIONS");
                    addNewNotification();
                });
            }
        });
    }

    public void stopNotificationsListener() {
        handler.removeCallbacksAndMessages(null);
        mSocket.disconnect();
    }

    private void addNewNotification() {
        String NOTIFICATION_CHANNEL_ID = "com.app.cwcs.notifications";
        String CHANELL_NAME = "Notifications";
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL_ID, CHANELL_NAME, NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(notificationChannel);
        }

        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_launcher_foreground)
                        .setContentTitle("System kontroli stanowiska komputerowego")
                        .setContentText("Dodano nowe zgłoszenie")
                        .setDefaults(Notification.DEFAULT_ALL)
                        .setAutoCancel(true);

        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT);
        notificationBuilder.setContentIntent(contentIntent);

        int NOTIFICATION_ID = (int) (System.currentTimeMillis()%10000);
        notificationManager.notify("com.app.cwcs.notifications.group", NOTIFICATION_ID, notificationBuilder.build());
    }

    public void startTimer() {
        timer = new Timer();
        timer.scheduleAtFixedRate(task = new TimerTask() {
              @Override
              public void run() {
                  new Handler(Looper.getMainLooper()).post(new Runnable() {
                      @Override
                      public void run() {
                          Toast.makeText(getApplicationContext(),"Running...",Toast.LENGTH_SHORT).show();
                      }
                  });
              }
          }, 0, 3000);
    }

    public void stopTimer() {
        if (timer != null) {
            timer.cancel();
        }
        if (task != null) {
            task.cancel();
        }
    }
}
