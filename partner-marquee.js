(() => {
 const viewport=document.querySelector('.partner-marquee');if(!viewport)return;
 const track=viewport.querySelector('.partner-marquee-track');
 const group=track.querySelector('.partner-marquee-group');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let animation,width=0,drag=null,visible=true,suppressClick=false;
 const duration=65000;
 function resume(){
  if(!animation)return;
  const keyboardFocus=viewport.querySelector(':focus-visible');
  if(visible&&!document.hidden&&!drag&&!keyboardFocus)animation.play();else animation.pause();
 }
 function setup(){
  const nextWidth=group.getBoundingClientRect().width;
  if(!nextWidth)return;
  const phase=animation?((animation.currentTime||0)%duration)/duration:0;
  animation?.cancel();animation=null;width=nextWidth;
  viewport.classList.add('is-interactive');
  if(!reduce.matches){
   animation=track.animate([{transform:'translateX(0)'},{transform:`translateX(-${width}px)`}],{duration,iterations:Infinity,easing:'linear'});
   animation.currentTime=phase*duration;resume();
  }
 }
 viewport.addEventListener('pointerdown',event=>{
  if(event.button!==0||drag)return;
  drag={id:event.pointerId,x:event.clientX,time:animation?.currentTime||0,scroll:viewport.scrollLeft,moved:false};
  animation?.pause();
 });
 viewport.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x;
  if(!drag.moved&&Math.abs(dx)<6)return;
  if(!drag.moved){drag.moved=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging');}
  if(animation){const time=drag.time-dx/width*duration;animation.currentTime=((time%duration)+duration)%duration;}
  else viewport.scrollLeft=drag.scroll-dx;
 });
 function finish(event){
  if(!drag||event.pointerId!==drag.id)return;
  suppressClick=drag.moved;
  const id=drag.id;drag=null;viewport.classList.remove('is-dragging');
  if(viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);
  resume();
  // The click following a drag must not open a partner page.
  setTimeout(()=>{suppressClick=false;},0);
 }
 viewport.addEventListener('pointerup',finish);
 viewport.addEventListener('pointercancel',finish);
 viewport.addEventListener('lostpointercapture',finish);
 viewport.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();}},true);
 viewport.addEventListener('dragstart',event=>event.preventDefault());
 viewport.addEventListener('focusin',()=>requestAnimationFrame(resume));
 viewport.addEventListener('focusout',()=>requestAnimationFrame(resume));
 document.addEventListener('visibilitychange',resume);
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();}).observe(viewport);
 new ResizeObserver(()=>{if(Math.abs(group.getBoundingClientRect().width-width)>1)setup();}).observe(group);
 reduce.addEventListener('change',setup);
 setup();
})();
