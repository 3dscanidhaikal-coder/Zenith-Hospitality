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
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});});
 panels.forEach(panel=>{
  const steps=[...panel.querySelectorAll('[data-service-step]')],cards=[...panel.querySelectorAll('.process-service')];
  const grid=panel.querySelector('.process-services-rows'),clear=panel.querySelector('[data-service-clear]'),status=panel.querySelector('[data-spotlight-status]');
  let chosen=-1;
  const stepList=panel.querySelector('.service-step-list');
  const svgNS='http://www.w3.org/2000/svg';
  const connector=document.createElementNS(svgNS,'svg');
  connector.classList.add('service-connector');connector.setAttribute('aria-hidden','true');
  const track=document.createElementNS(svgNS,'path');
  track.classList.add('service-connector-track');connector.append(track);
  const segments=steps.slice(1).map(()=>{
   const segment=document.createElementNS(svgNS,'path');
   segment.classList.add('service-connector-progress');
   segment.setAttribute('pathLength','1');connector.append(segment);return segment;
  });
  stepList.prepend(connector);
  function updateConnector(){
   if(!stepList.clientWidth)return;
   const bounds=stepList.getBoundingClientRect();
   const points=steps.map(step=>{const circle=step.querySelector('.service-step-circle').getBoundingClientRect();return {x:circle.left-bounds.left+circle.width/2,y:circle.top-bounds.top+circle.height/2};});
   connector.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
   const coordinates=points.map((point,i)=>`${!i||Math.abs(point.y-points[i-1].y)>5?'M':'L'}${point.x},${point.y}`).join(' ');
   track.setAttribute('d',coordinates);
   segments.forEach((segment,i)=>{
    const from=points[i],to=points[i+1];
    const sameRow=Math.abs(from.y-to.y)<5;
    segment.setAttribute('d',sameRow?`M${from.x},${from.y} L${to.x},${to.y}`:'');
    segment.style.strokeDashoffset=chosen>=i+1?'0':'1';
   });
  }
  new ResizeObserver(updateConnector).observe(stepList);
  function spotlight(index,scroll=false){
   chosen=index;updateConnector();grid.classList.toggle('has-spotlight',index>=0);
   cards.forEach((card,i)=>card.classList.toggle('is-spotlit',i===index));
   steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));
   clear.hidden=index<0;status.textContent=index<0?'All services shown.':cards[index].getAttribute('aria-label')+' highlighted.';
   if(scroll&&index>=0){const card=cards[index],bounds=card.getBoundingClientRect();if(bounds.top<100||bounds.bottom>innerHeight){if(window.zenithMotion)window.zenithMotion.scrollTo(card);else card.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'});}}
  }
  steps.forEach((step,i)=>step.addEventListener('click',()=>spotlight(chosen===i?-1:i,true)));
  clear.addEventListener('click',()=>spotlight(-1));
  cards.forEach((card,i)=>card.addEventListener('focusin',()=>{if(chosen>=0&&chosen!==i)spotlight(i);}));
  cards.forEach((card,i)=>{
   card.addEventListener('click',event=>{
    if(event.target.closest('a,button,summary'))return;
    if(chosen===i)spotlight(-1);
   });
   card.addEventListener('keydown',event=>{
    if(event.target!==card||!['Enter',' '].includes(event.key))return;
    event.preventDefault();if(chosen===i)spotlight(-1);
   });
  });
 });
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
