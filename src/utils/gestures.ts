import { GestureResponderEvent, PanResponder, PanResponderGestureState } from 'react-native';

// Minimum distance for swipe detection
const SWIPE_THRESHOLD = 50;
// Minimum velocity for swipe detection
const SWIPE_VELOCITY_THRESHOLD = 0.3;

// Gesture utility functions
const gestures = {
  /**
   * Create a swipe detector for horizontal swipes
   * @param onSwipeLeft Callback for left swipe
   * @param onSwipeRight Callback for right swipe
   * @returns PanResponder instance
   */
  createHorizontalSwipeDetector: (
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD && Math.abs(gestureState.vx) > SWIPE_VELOCITY_THRESHOLD) {
          onSwipeLeft?.();
        } else if (gestureState.dx > SWIPE_THRESHOLD && Math.abs(gestureState.vx) > SWIPE_VELOCITY_THRESHOLD) {
          onSwipeRight?.();
        }
      },
    });
  },

  /**
   * Create a swipe detector for vertical swipes
   * @param onSwipeUp Callback for up swipe
   * @param onSwipeDown Callback for down swipe
   * @returns PanResponder instance
   */
  createVerticalSwipeDetector: (
    onSwipeUp?: () => void,
    onSwipeDown?: () => void
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dy < -SWIPE_THRESHOLD && Math.abs(gestureState.vy) > SWIPE_VELOCITY_THRESHOLD) {
          onSwipeUp?.();
        } else if (gestureState.dy > SWIPE_THRESHOLD && Math.abs(gestureState.vy) > SWIPE_VELOCITY_THRESHOLD) {
          onSwipeDown?.();
        }
      },
    });
  },

  /**
   * Create a detector for all swipe directions
   * @param onSwipeLeft Callback for left swipe
   * @param onSwipeRight Callback for right swipe
   * @param onSwipeUp Callback for up swipe
   * @param onSwipeDown Callback for down swipe
   * @returns PanResponder instance
   */
  createSwipeDetector: (
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    onSwipeUp?: () => void,
    onSwipeDown?: () => void
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy, vx, vy } = gestureState;
        
        // Determine if the swipe is horizontal or vertical
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx < -SWIPE_THRESHOLD && Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD) {
            onSwipeLeft?.();
          } else if (dx > SWIPE_THRESHOLD && Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD) {
            onSwipeRight?.();
          }
        } else {
          // Vertical swipe
          if (dy < -SWIPE_THRESHOLD && Math.abs(vy) > SWIPE_VELOCITY_THRESHOLD) {
            onSwipeUp?.();
          } else if (dy > SWIPE_THRESHOLD && Math.abs(vy) > SWIPE_VELOCITY_THRESHOLD) {
            onSwipeDown?.();
          }
        }
      },
    });
  },

  /**
   * Create a double tap detector
   * @param onDoubleTap Callback for double tap
   * @param delay Maximum delay between taps (ms)
   * @returns Object with handlers for touch events
   */
  createDoubleTapDetector: (onDoubleTap: () => void, delay = 300) => {
    let lastTap = 0;
    
    return {
      onTouchStart: () => {
        const now = Date.now();
        if (now - lastTap < delay) {
          onDoubleTap();
        }
        lastTap = now;
      },
    };
  },

  /**
   * Create a long press detector
   * @param onLongPress Callback for long press
   * @param duration Long press duration (ms)
   * @returns Object with handlers for touch events
   */
  createLongPressDetector: (onLongPress: () => void, duration = 500) => {
    // Use ReturnType<typeof setTimeout> for proper typing
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    
    return {
      onPressIn: () => {
        pressTimer = setTimeout(() => {
          onLongPress();
        }, duration);
      },
      onPressOut: () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      },
    };
  },
};

export default gestures;
