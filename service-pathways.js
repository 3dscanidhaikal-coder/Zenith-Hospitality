(() => {
 const root=document.querySelector('.service-pathways');if(!root)return;
 root.querySelectorAll('.service-hover-image').forEach(image=>{
  image.decode().then(()=>image.closest('.process-service').classList.add('hover-image-ready')).catch(()=>{});
 });
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
 let active=0,request=0,motions=[];
 async function select(index,focus=false){
  if(index===active){if(focus)tabs[index].focus();return;}
  const token=++request;motions.forEach(motion=>motion.cancel());motions=[];
  const previous=panels.find(panel=>!panel.hidden);
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});active=index;if(focus)tabs[index].focus();
  if(previous&&!reduce.matches){
   const fade=previous.animate([{opacity:getComputedStyle(previous).opacity},{opacity:0}],{duration:280,easing:'ease-in-out',fill:'forwards'});motions.push(fade);await fade.finished.catch(()=>{});
  }
  if(token!==request)return;
  panels.forEach((panel,i)=>{panel.hidden=i!==index;});motions.forEach(motion=>motion.cancel());motions=[];
  const paragraph=panels[index].querySelector('.pathway-card-intro');paragraph?.classList.add('is-visible');
  if(!reduce.matches){
   motions.push(panels[index].animate([{opacity:0},{opacity:1}],{duration:650,easing:'ease-in-out'}));
   if(paragraph)motions.push(paragraph.animate([{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:800,easing:'cubic-bezier(.22,.61,.36,1)'}));
  }
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=(i+1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});});
 panels.forEach(panel=>{
  const controls=new Map();
  panel.querySelectorAll('.pathway-feature').forEach(details=>{
   const summary=details.querySelector('summary'),body=details.querySelector('.pathway-feature-body');let motion,wanted=details.open;
   function setOpen(open){const from=details.getBoundingClientRect().height;motion?.cancel();wanted=open;details.style.height='';if(open)details.open=true;body.inert=!open;if(reduce.matches){details.open=open;details.style.overflow='';return;}const to=open?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;details.style.overflow='hidden';motion=details.animate({height:[from+'px',to+'px']},{duration:600,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});const current=motion;current.finished.then(()=>{if(motion!==current)return;details.open=wanted;motion.cancel();motion=null;details.style.height='';details.style.overflow='';}).catch(()=>{});}
   controls.set(details,setOpen);body.inert=!wanted;
   summary.addEventListener('click',event=>{event.preventDefault();const opening=!wanted;if(opening)controls.forEach((close,other)=>{if(other!==details)close(false);});setOpen(opening);});
  });
 });
})();
