(() => {
  const containers=[...document.querySelectorAll('[data-lottie-squares]')];
  if(!containers.length||!window.lottie)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const items=[];
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const item=items.find(i=>i.container===entry.target);if(!item)return;item.visible=entry.isIntersecting;sync(item)});
  },{threshold:.05});
  function sync(item){
    if(reduced.matches){item.animation.goToAndStop(0,true);return}
    if(item.visible&&!document.hidden)item.animation.play();else item.animation.pause();
  }
  containers.forEach(container=>{
    const fallback=container.querySelector('img');
    const canvas=document.createElement('span');canvas.className='lottie-canvas';container.append(canvas);
    const animation=lottie.loadAnimation({container:canvas,renderer:'svg',loop:true,autoplay:false,path:'assets/zenith-squares.json?v=3',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
    const item={container,animation,visible:false};items.push(item);
    animation.addEventListener('DOMLoaded',()=>{fallback.hidden=true;canvas.hidden=false;sync(item)});
    animation.addEventListener('data_failed',()=>{fallback.hidden=false;canvas.hidden=true});
    observer.observe(container);
  });
  reduced.addEventListener('change',()=>items.forEach(sync));
  document.addEventListener('visibilitychange',()=>items.forEach(sync));
  window.addEventListener('pagehide',()=>{observer.disconnect();items.forEach(i=>i.animation.destroy())},{once:true});
})();
