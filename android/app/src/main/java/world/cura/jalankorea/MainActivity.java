package world.cura.jalankorea;

import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        // 개발용 웹 셸이 앱을 다시 열 때마다 최신 버전을 받아오도록 WebView 캐시를 끈다.
        // 출시용은 앱에 내장된 로컬 자산을 쓰므로 이 설정의 영향을 받지 않는다.
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        }
    }
}
