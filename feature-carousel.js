(() => {
 const root=document.querySelector('.feature-carousel');if(!root)return;
 const chips=[...root.querySelectorAll('.feature-chip')],cards=[...root.querySelectorAll('.feature-card')],pause=root.querySelector('.feature-pause');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let current=0,manualPause=false,hover=false,focused=false,visible=false,timer;
 function render(){
  chips.forEach((chip,i)=>{let distance=(i-current+chips.length)%chips.length;if(distance>=chips.length/2)distance-=chips.length;chip.style.transform=`translateY(${distance*(innerWidth<768?68:82)}px)`;chip.style.opacity=String(Math.max(0,1-Math.abs(distance)*.24));chip.setAttribute('aria-pressed',String(i===current));});
  cards.forEach((card,i)=>{const diff=(i-current+cards.length)%cards.length;card.dataset.status=diff===0?'active':diff===1?'next':diff===cards.length-1?'prev':'hidden';card.inert=i!==current;card.setAttribute('aria-hidden',String(i!==current));});
 }
 function schedule(){clearInterval(timer);if(!manualPause&&!hover&&!focused&&visible&&!document.hidden&&!reduce.matches)timer=setInterval(()=>{current=(current+1)%chips.length;render();},3000);}
 chips.forEach((chip,i)=>chip.addEventListener('click',()=>{current=i;render();schedule();}));
 root.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hover=true;schedule();}});root.addEventListener('pointerleave',()=>{hover=false;schedule();});
 root.addEventListener('focusin',()=>{focused=true;schedule();});root.addEventListener('focusout',()=>requestAnimationFrame(()=>{focused=root.contains(document.activeElement);schedule();}));
 pause.addEventListener('click',()=>{manualPause=!manualPause;pause.textContent=manualPause?'Play':'Pause';pause.setAttribute('aria-label',manualPause?'Play service carousel':'Pause service carousel');schedule();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(root);
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);addEventListener('resize',render);render();
})();
