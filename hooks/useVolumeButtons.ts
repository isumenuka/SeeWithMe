import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

export function useVolumeButtons(onVolumeUp?: () => void, onVolumeDown?: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const { VolumeManager } = NativeModules as any;
    if (!VolumeManager) return;
    const emitter = new NativeEventEmitter(VolumeManager);

    const upListener = emitter.addListener('VolumeUp', () => {
      onVolumeUp?.();
    });
    const downListener = emitter.addListener('VolumeDown', () => {
      onVolumeDown?.();
    });

    return () => {
      upListener.remove();
      downListener.remove();
    };
  }, [onVolumeUp, onVolumeDown]);
}
