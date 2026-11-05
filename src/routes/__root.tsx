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
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="ru" data-theme="black" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: "html{background:#000!important;color-scheme:dark;-webkit-text-size-adjust:100%;text-size-adjust:100%;position:fixed;inset:0;width:100%;overflow:hidden}html,body{margin:0;padding:0;background:#000!important;color:#f7f3ea;overflow:hidden;overscroll-behavior:none;width:100%;height:var(--app-h,100dvh);min-height:0;max-height:var(--app-h,100dvh);position:fixed;inset:0}body:before{content:'';position:absolute;z-index:0;inset:0;background:#000;pointer-events:none}.boot-mark{position:fixed;z-index:90;left:50%;top:50%;width:8.5rem;height:8.5rem;transform:translate(-50%,-50%);border-radius:1.7rem;pointer-events:none;object-fit:cover}html.boot-done .boot-mark{display:none}html:not(.boot-done) .bismillah-splash{visibility:hidden}.bismillah-splash{position:absolute;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;color:#f7f3ea}.bismillah-words{position:relative;z-index:2;margin:0;max-width:18rem;text-align:center;font:700 2rem/1.85 'Geeza Pro','Times New Roman',serif;color:#f7f3ea}.app-frame{position:relative;z-index:1;height:100%;max-height:100%;overflow:hidden}.app-column{visibility:visible}html.app-go .bismillah-splash{display:none;pointer-events:none}",
          }}
        />
        <HeadContent />
      </head>
      <body>
        <img className="boot-mark" src="/icon-180.png" alt="" width={136} height={136} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){function cut(){var n=document.querySelectorAll('script[src*=\"grok.com\"],script[src*=\"extensions.js\"]');for(var i=0;i<n.length;i++)if(n[i].parentNode)n[i].parentNode.removeChild(n[i]);}cut();var android=/Android/i.test(navigator.userAgent||'');var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||'');var root=document.documentElement;var passes=[[\"108vw\",\"8vh\",\"-36vw\",\"40vh\",\"-16deg\"],[\"112vw\",\"2vh\",\"-40vw\",\"16vh\",\"-8deg\"],[\"100vw\",\"-8vh\",\"-30vw\",\"58vh\",\"-28deg\"],[\"-40vw\",\"10vh\",\"112vw\",\"38vh\",\"-158deg\"],[\"-36vw\",\"-4vh\",\"108vw\",\"52vh\",\"-143deg\"],[\"-42vw\",\"32vh\",\"110vw\",\"64vh\",\"-155deg\"],[\"30vw\",\"-18vh\",\"64vw\",\"114vh\",\"-97deg\"],[\"72vw\",\"-16vh\",\"34vw\",\"114vh\",\"-81deg\"],[\"10vw\",\"-14vh\",\"80vw\",\"110vh\",\"-106deg\"],[\"90vw\",\"-12vh\",\"16vw\",\"110vh\",\"74deg\"]];var pass=passes[(Math.random()*passes.length)|0];root.style.setProperty(\"--pass-x\",pass[0]);root.style.setProperty(\"--pass-y\",pass[1]);root.style.setProperty(\"--pass-x2\",pass[2]);root.style.setProperty(\"--pass-y2\",pass[3]);root.style.setProperty(\"--pass-rot\",pass[4]);if(android)root.setAttribute('data-os','android');if(ios)root.setAttribute('data-os','ios');var probe=null;var locked=0;var lockedW=window.innerWidth||0;function stand(){return window.navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches}function large(){if(!android)return 0;if(!probe){probe=document.createElement('div');probe.style.cssText='position:fixed;left:0;top:0;height:100lvh;width:0;visibility:hidden;pointer-events:none';document.documentElement.appendChild(probe)}var n=probe.getBoundingClientRect().height;return n>120?n:0}function measure(){var vv=window.visualViewport;var ih=window.innerHeight||0;var vh=vv&&vv.height?vv.height:0;var h;if(ios){h=stand()?Math.max(ih,vh):(vh||ih)}else{var top=vv&&vv.offsetTop?vv.offsetTop:0;h=Math.max(ih,vh?vh+top:0,large())}if(h<120)return 0;return Math.round(h)}function apply(force){var h=measure();if(!h)return;if(ios&&!force&&locked&&Math.abs(h-locked)<70&&Math.abs((window.innerWidth||0)-lockedW)<40)return;locked=h;lockedW=window.innerWidth||0;root.style.setProperty('--app-h',h+'px');if(!android)return;root.style.setProperty('height',h+'px','important');root.style.setProperty('max-height',h+'px','important');document.body.style.setProperty('height',h+'px','important');document.body.style.setProperty('max-height',h+'px','important')}apply(true);window.addEventListener('orientationchange',function(){setTimeout(function(){apply(true)},160)});window.addEventListener('resize',function(){apply(false)});if(window.visualViewport)window.visualViewport.addEventListener('resize',function(){apply(false)});setTimeout(function(){apply(true)},1200);var opened=Date.now();function handoff(){if(!document.querySelector('.bismillah-splash')){if(Date.now()-opened<12000)setTimeout(handoff,80);return}var wait=Math.max(0,1000-(Date.now()-opened));setTimeout(function(){root.classList.add('boot-done')},wait)}handoff()})();",
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
