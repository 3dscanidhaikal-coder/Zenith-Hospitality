(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let lenis,frame;
 function destroy(){cancelAnimationFrame(frame);lenis?.destroy();lenis=undefined;}
 function start(){
  destroy();
  if(reduced.matches||!window.Lenis)return;
  lenis=new Lenis({lerp:.085,smoothWheel:true,syncTouch:false,anchors:{offset:-90},prevent:node=>!!node.closest?.('.mobile-menu,input,textarea,select')});
  if(document.body.classList.contains('menu-open')||document.documentElement.classList.contains('intro-playing'))lenis.stop();
  function tick(time){lenis.raf(time);frame=requestAnimationFrame(tick);}
  frame=requestAnimationFrame(tick);
 }
 window.zenithMotion={scrollTo(target){
  if(lenis){lenis.start();lenis.scrollTo(target,{offset:-100,duration:1.5,easing:t=>1-Math.pow(1-t,4)});}
  else target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
 },setPaused(paused){if(paused)lenis?.stop();else lenis?.start();}};
 reduced.addEventListener('change',start);
 window.addEventListener('pagehide',destroy);
 window.addEventListener('pageshow',event=>{if(event.persisted)start();});
 // Keep homepage service navigation on the current document instead of reloading it.
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href]');
  if(!anchor||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const destination=new URL(anchor.href,location.href);
  if(destination.origin!==location.origin||destination.hash!=='#services'||!document.querySelector('#services'))return;
  if(!/\/(?:index\.html)?$/.test(destination.pathname))return;
  event.preventDefault();event.stopImmediatePropagation();
  const scroll=()=>{history.replaceState(history.state,'','#services');window.zenithMotion.scrollTo(document.querySelector('#services'));};
  const menu=anchor.closest('dialog');
  if(menu?.open){
   menu.addEventListener('close',()=>requestAnimationFrame(scroll),{once:true});
   menu.querySelector('.menu-close').click();
  }else scroll();
 },true);
 start();
})();
