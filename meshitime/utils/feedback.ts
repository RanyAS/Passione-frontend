import { Platform, Vibration } from 'react-native';

type FeedbackType = 'light' | 'success' | 'error';

export function triggerFeedback(type: FeedbackType = 'light') {
  if (Platform.OS === 'web') {
    return;
  }

  if (type === 'error') {
    Vibration.vibrate([0, 50, 50, 50]);
    return;
  }

  if (type === 'success') {
    Vibration.vibrate(35);
    return;
  }

  Vibration.vibrate(20);
}
