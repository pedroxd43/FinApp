import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { TestIds, useInterstitialAd as useRNGoogleInterstitialAd } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = TestIds.INTERSTITIAL;

export function useInterstitialAd() {
  const ad = useRNGoogleInterstitialAd(Platform.OS === 'web' ? null : AD_UNIT_ID);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!ad.isLoaded) {
      ad.load();
    }
  }, [ad]);

  const showAd = useCallback(async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    if (ad.isLoaded) {
      ad.show();
    } else {
      ad.load();
    }
  }, [ad]);

  return { showAd };
}
