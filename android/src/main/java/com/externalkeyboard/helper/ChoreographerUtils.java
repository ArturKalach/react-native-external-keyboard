package com.externalkeyboard.helper;

import android.view.Choreographer;

import androidx.annotation.NonNull;

public class ChoreographerUtils {

  public static void run(@NonNull Runnable task) {
    runAfterFrames(2, task);
  }

  private static void runAfterFrames(int frameCount, @NonNull Runnable task) {
    Choreographer choreographer = Choreographer.getInstance();

    choreographer.postFrameCallback(new Choreographer.FrameCallback() {
      private int frameCounter = frameCount;

      @Override
      public void doFrame(long frameTimeNanos) {
        if (--frameCounter <= 0) {
          task.run();
        } else {
          choreographer.postFrameCallback(this);
        }
      }
    });
  }
}
