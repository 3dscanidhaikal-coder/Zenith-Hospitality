(() => {
 'use strict';
 const here=new URL(location.href);
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
  // Keep normal anchor behavior, including keyboard and modified clicks.
  // No preventDefault or history.go: the destination works without animation scripts.
 });
})();
