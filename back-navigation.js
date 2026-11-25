(() => {
 'use strict';
 const here=new URL(location.href);
 history.scrollRestoration='auto';
 const returning=performance.getEntriesByType('navigation')[0]?.type==='back_forward';
 const saved=history.state?.zenithScroll;
 let saveTimer;
 function savePosition(){
  history.replaceState({...history.state,zenithScroll:{x:scrollX,y:scrollY}},'');
 }
 addEventListener('scroll',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(savePosition,150);},{passive:true});
 document.addEventListener('click',event=>{if(event.target.closest('a[href]'))savePosition();},true);
 addEventListener('pagehide',savePosition);
 if(returning&&saved){
  const restore=()=>window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
  addEventListener('pageshow',event=>{if(!event.persisted)requestAnimationFrame(restore);},{once:true});
 }
 function isDifferentPage(url){return url.origin===here.origin && (url.pathname!==here.pathname || url.search!==here.search);}
 function destination(fallback){
  try{
   const current=window.navigation?.currentEntry;
   const entries=window.navigation?.entries?.()||[];
   if(current){
    for(let i=entries.length-1;i>=0;i--){
     const entry=entries[i];if(entry.index>=current.index||!entry.url)continue;
     const previous=new URL(entry.url);
     if(previous.origin!==here.origin)break;
     if(isDifferentPage(previous))return previous.href;
    }
   }
   if(document.referrer){const previous=new URL(document.referrer);if(isDifferentPage(previous))return previous.href;}
  }catch{}
  return fallback;
 }
 document.querySelectorAll('[data-back-link]').forEach(link=>{
  const fallback=link.href;
  link.href=destination(fallback);
  link.addEventListener('click',event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const current=window.navigation?.currentEntry;
   const previous=(window.navigation?.entries?.()||[]).filter(entry=>entry.index<current?.index&&entry.url&&isDifferentPage(new URL(entry.url))).at(-1);
   if(previous&&new URL(previous.url).origin===here.origin){event.preventDefault();history.go(previous.index-current.index);}
   else if(document.referrer&&isDifferentPage(new URL(document.referrer))&&history.length>1){event.preventDefault();history.back();}
  });
 });
})();
