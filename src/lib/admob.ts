import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712';

export async function showInterstitialAd(): Promise<void> {
  try {
    const listener = await AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      AdMob.showInterstitial().catch(() => {});
    });

    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_AD_ID,
    });

    setTimeout(async () => {
      try {
        await AdMob.showInterstitial();
      } catch {}
      listener.remove();
    }, 600);
  } catch {
    try { await AdMob.showInterstitial(); } catch {}
  }
}
