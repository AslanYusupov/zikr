import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";
import { APP_BUILD } from "@/lib/zikr/build";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "color-scheme", content: "dark" },
      { name: "theme-color", content: "#000000" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=overlays-content",
      },
      { title: "Зикр" },
      { name: "description", content: "Спокойное поминание Аллах1а. Онлайн счетчик зикра с рейтингом." },
      { property: "og:description", content: "Спокойное поминание Аллах1а. Онлайн счетчик зикра с рейтингом." },
      { name: "zikr-build", content: APP_BUILD },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: "Zikr" },
      { name: "application-name", content: "Zikr" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="ru" data-theme="black" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: "html{background:#000!important;color-scheme:dark;-webkit-text-size-adjust:100%;text-size-adjust:100%;position:fixed;inset:0;width:100%;overflow:hidden}html,body{margin:0;padding:0;background:#000!important;color:#f7f3ea;overflow:hidden;overscroll-behavior:none;width:100%;height:var(--app-h,100dvh);min-height:0;max-height:var(--app-h,100dvh);position:fixed;inset:0}body:before{content:'';position:absolute;z-index:0;inset:0;background:#000;pointer-events:none}.bismillah-splash{position:absolute;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;color:#f7f3ea}.bismillah-words{position:relative;z-index:2;margin:0;max-width:18rem;text-align:center;font:700 2rem/1.85 'Geeza Pro','Times New Roman',serif;color:#f7f3ea}.app-frame{position:relative;z-index:1;height:100%;max-height:100%;overflow:hidden}.app-column{visibility:visible}html.app-go .bismillah-splash{display:none;pointer-events:none}",
          }}
        />
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var android=/Android/i.test(navigator.userAgent||'');var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||'');var root=document.documentElement;if(android)root.setAttribute('data-os','android');if(ios)root.setAttribute('data-os','ios');function stand(){return window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches}function measure(){var vv=window.visualViewport;var ih=window.innerHeight||0;var vh=vv&&vv.height?vv.height:0;var h=vh&&ih?Math.min(vh,ih):(vh||ih||root.clientHeight||0);if(h<120)return 0;return Math.round(h)}function apply(){var h=measure();if(!h)return;root.style.setProperty('--app-h',h+'px');if(!android)return;var screenH=(window.screen&&window.screen.height)||h;var edge=stand()||screenH-h<40;root.style.setProperty('--nav-extra',edge?'24px':'12px');root.style.setProperty('--status-extra',edge?'18px':'0px')}apply();window.addEventListener('orientationchange',function(){setTimeout(apply,80);setTimeout(apply,360)});window.addEventListener('resize',apply);if(window.visualViewport)window.visualViewport.addEventListener('resize',apply);setTimeout(function(){root.classList.add('app-go');apply()},1500)})();",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
var last=0;
function allowScreen(){
  try{var raw=localStorage.getItem("nur-zikr-v1");if(!raw)return true;var s=JSON.parse(raw).state;return !s||s.screenTap!==false}catch(e){return true}
}
function hitOrb(x,y){
  var node=document.querySelector(".orb");if(!node)return false;
  var r=node.getBoundingClientRect();
  var dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),rad=Math.min(r.width,r.height)/2+28;
  return dx*dx+dy*dy<=rad*rad;
}
window.addEventListener("pointerdown",function(e){
  if(document.querySelector(".sheet, .names-sheet, .celebrate"))return;if(document.querySelector(".bismillah-splash")&&!document.documentElement.classList.contains("app-go"))return;
  if(!document.querySelector(".orb"))return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  var now=Date.now();if(now-last<300)return;
  var onOrb=hitOrb(e.clientX,e.clientY);
  var t=e.target;
  var blocked=t&&t.closest&&t.closest("button,a,input,textarea,.scroll-x,.side-slider,nav,header,.history-screen");
  if(!onOrb&&(!allowScreen()||blocked))return;
  last=now;
  if(window.__zikrLive&&window.__zikrPress){window.__zikrPress();return}
  window.__zikrEarly=(window.__zikrEarly||0)+1;
  var orb=document.querySelector(".orb");
  if(orb){orb.classList.add("orb-hit");setTimeout(function(){orb.classList.remove("orb-hit")},140)}
},true);
})();`,
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
