(() => {
 const hero=document.querySelector('.hero');if(!hero)return;
 const slides=[...hero.querySelectorAll('.hero-slide')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,timer,cleanupTimer,visible=true,disposed=false;
 let zoom;
 function startZoom(slide){
  if(reduced.matches)return;
  const scales=Math.random()<.5?[1.04,1.12]:[1.12,1.04];
  return slide.querySelector('img').animate(scales.map(scale=>({transform:`scale(${scale})`})),{duration:8400,fill:'both'});
 }
 async function next(){
  const index=(current+1)%slides.length,img=slides[index].querySelector('img');
  try{await img.decode();}catch{if(!img.naturalWidth){sync();return;}}
  if(disposed||reduced.matches||document.hidden||!visible)return;
  clearTimeout(cleanupTimer);
  slides.forEach(slide=>slide.classList.remove('is-leaving'));
  const outgoing=slides[current];
  outgoing.classList.add('is-leaving');outgoing.classList.remove('is-active');outgoing.setAttribute('aria-hidden','true');
  // The outgoing photograph stays fully opaque underneath the incoming fade.
  const outgoingZoom=zoom;
  zoom=startZoom(slides[index]);
  slides[index].classList.add('is-active');slides[index].removeAttribute('aria-hidden');current=index;
  cleanupTimer=setTimeout(()=>{outgoing.classList.remove('is-leaving');outgoingZoom?.cancel();},2300);sync();
 }
 function sync(){clearTimeout(timer);if(!disposed&&!reduced.matches&&!document.hidden&&visible)timer=setTimeout(next,6000);}
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0});observer.observe(hero);
 reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 addEventListener('pagehide',()=>{disposed=true;clearTimeout(timer);clearTimeout(cleanupTimer);observer.disconnect();});
 addEventListener('pageshow',event=>{if(event.persisted){disposed=false;observer.observe(hero);sync();}});
 zoom=startZoom(slides[current]);
 sync();
})();
