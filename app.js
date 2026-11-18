(() => {
 'use strict';
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
 // Use the same reversible timeline as the Casa Momo design.
 document.querySelectorAll('.button, .menu-panel nav a, .footer-top nav a, .footer-top>div:last-child>a').forEach(control => {
  const labels = [...control.querySelectorAll('.nav-full, .nav-short')];
  if (!labels.length) {
   const text = [...control.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
   if (!text) return;
   const label = document.createElement('span');
   label.textContent = text.textContent.trim();
   text.replaceWith(label);
   labels.push(label);
  }
  if (!control.hasAttribute('aria-label')) control.setAttribute('aria-label', labels[0].textContent.trim());
  labels.forEach(label => {
   label.classList.add('roll-label');
   label.setAttribute('aria-hidden', 'true');
   label.replaceChildren(...Array.from(label.textContent, character => {
    const mask = document.createElement('span');
    mask.className = 'roll-mask';
    const track = document.createElement('span');
    track.className = 'roll-track';
    for (let copy = 0; copy < 2; copy++) {
     const glyph = document.createElement('span');
     glyph.textContent = character === ' ' ? '\u00a0' : character;
     track.append(glyph);
    }
    mask.append(track);
    return mask;
   }));
  });
  if (!window.gsap) return;
  const wave = window.gsap.timeline({paused: true});
  labels.forEach(label => {
   wave.to([...label.querySelectorAll('.roll-track')], {
    yPercent: -50, duration: .62, stagger: .018, ease: 'power3.inOut'
   }, 0);
  });
  let hovered = false;
  function updateWave() {
   if (reduce.matches) wave.pause(0);
   else if (hovered || control.matches(':focus-visible')) wave.play();
   else wave.reverse();
  }
  control.addEventListener('pointerenter', event => {
   if (event.pointerType !== 'touch') { hovered = true; updateWave(); }
  });
  function clearHover() { hovered = false; updateWave(); }
  control.addEventListener('pointerleave', clearHover);
  control.addEventListener('pointercancel', clearHover);
  control.addEventListener('focus', updateWave);
  control.addEventListener('blur', () => requestAnimationFrame(updateWave));
  reduce.addEventListener('change', updateWave);
 });
 const careerRoles=[...document.querySelectorAll('[data-career-department]')];
 const careerSearch=document.querySelector('[data-career-search]');
 const careerSelects=[...document.querySelectorAll('[data-role-filter]')];
 function applyCareerFilters(){
  let count=0;
  careerRoles.forEach(role=>{
   const matches=careerSelects.every(select=>!select.value||role.getAttribute('data-'+select.dataset.roleFilter)===select.value)&&(!careerSearch?.value.trim()||careerSearch.value.trim().toLowerCase().split(/\s+/).every(word=>(role.querySelector('h2').textContent+' '+role.dataset.careerDepartment+' '+role.dataset.jobType).toLowerCase().includes(word)));
   role.hidden=!matches;if(matches){count++;role.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
  });
  const status=document.querySelector('[data-career-status]');if(status)status.textContent=count+(count===1?' role found':' roles found');
  const empty=document.querySelector('[data-career-empty]');if(empty)empty.hidden=count!==0;
 }
 careerSelects.forEach(select=>select.addEventListener('change',applyCareerFilters));
 careerSearch?.addEventListener('input',applyCareerFilters);
 if(careerRoles.length)applyCareerFilters();
 const principleCards = [...document.querySelectorAll('.about-principle-grid article')];
 if(principleCards.length && 'IntersectionObserver' in window){
  const started=new Set();
  const syncIcons=()=>started.forEach(card=>card.classList.toggle('icon-loop-active',!document.hidden&&!reduce.matches));
  const iconObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting||started.has(entry.target)||reduce.matches)return;
    started.add(entry.target);
    entry.target.classList.add('icon-once-started');
    iconObserver.unobserve(entry.target);
   });
   syncIcons();
  },{threshold:.1});
  principleCards.forEach(card=>iconObserver.observe(card));
  document.addEventListener('visibilitychange',syncIcons);
  reduce.addEventListener('change',syncIcons);
 }
 const header = document.querySelector('.site-header');
 const hero = document.querySelector('.hero, .expertise-hero');
 if(hero){new IntersectionObserver(([entry])=>header.classList.toggle('on-hero',entry.isIntersecting),{rootMargin:'-80px 0px 0px 0px'}).observe(hero);}
 const dialog = document.querySelector('#mobile-menu');
 const opener = document.querySelector('.menu-button');
 let closeTimer;
 opener.addEventListener('click',()=>{clearTimeout(closeTimer);window.zenithMotion?.setPaused(true);dialog.classList.remove('is-closing');dialog.showModal();opener.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');});
 function closeMenu(){if(!dialog.open||dialog.classList.contains('is-closing'))return;dialog.classList.add('is-closing');closeTimer=setTimeout(()=>dialog.close(),reduce.matches?0:420);}
 dialog.querySelector('.menu-close').addEventListener('click',closeMenu);
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeMenu();});
 dialog.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');window.zenithMotion?.setPaused(false);opener.focus({preventScroll:true});});
 // Native dialog provides modal focus containment, Escape and background inertness.
 if('IntersectionObserver' in window && !reduce.matches){
  // Reveal individual content instead of hiding entire sections behind one trigger.
  document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('reveal','is-visible'));
  const candidates=[...document.querySelectorAll('main h1,main h2,main h3,main p,main figcaption,main .breadcrumb,main .text-link,main .button,main .service-detail summary,main .field,main .filters button,main .service-anchor-nav a,main .topic-list span,main .concept-label,main .publication-note strong,main .experience-number,main img,footer .footer-logo,footer p,footer h2,footer address,footer nav a,footer .footer-top>div:last-child>a,footer .footer-bottom span')].filter(el=>!el.closest('.hero,.slide,.zenith-squares,#draft-fallback')&&!el.matches('.service-photo img, .careers-office-photo img, .about-team-photo img, .people-home .portrait-frame img, .service-scene-image img'));
  const candidateSet=new Set(candidates);
  const targets=candidates.filter(el=>{let parent=el.parentElement;while(parent){if(candidateSet.has(parent))return false;parent=parent.parentElement;}return true;});
  targets.forEach(el=>{
   el.classList.add('reveal');
   if(el.tagName==='IMG')el.classList.add('reveal-media');
   const siblings=[...el.parentElement.children].filter(child=>candidateSet.has(child));
   el.style.setProperty('--reveal-delay',`${Math.min(Math.max(siblings.indexOf(el),0)*55,165)}ms`);
  });
  document.querySelectorAll('.expertise-hero-content, .page-intro').forEach(group => {
   [...group.children].filter(el => el.matches('h1,p,.button,.breadcrumb')).forEach((el,index) => {
    el.style.setProperty('--reveal-delay', (index * 150) + 'ms');
   });
  });
  // Observe the unmasked figure so the image mask cannot block its own trigger.
  const photoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('photo-visible');photoObserver.unobserve(entry.target);}
  }),{threshold:.08});
  document.querySelectorAll('.service-photo, .careers-office-photo').forEach(photo=>photoObserver.observe(photo));
  // Team portraits reveal once per page load on Home and About.
  const teamCards = [...document.querySelectorAll('.about-team-member, .people-home .person')];
  const teamObserver = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) {
    entry.target.classList.add('team-visible');
    teamObserver.unobserve(entry.target);
   }
  }), {threshold: .22});
  teamCards.forEach((card, index) => {
   card.style.setProperty('--team-delay', (index * 140) + 'ms');
   card.querySelectorAll('h3,p').forEach(text => text.classList.remove('reveal', 'is-visible'));
   teamObserver.observe(card);
  });
  const textObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     entry.target.classList.add('text-visible');
     textObserver.unobserve(entry.target);
    }
   });
  }, {threshold: .15});
  document.querySelectorAll('.service-section-top, .service-section-grid>div, .engagement-heading, .engagement-steps article, .about-principle-grid article, .about-property-grid article, .about-purpose-copy article').forEach(group => {
   group.classList.add('expertise-text-group');
   group.querySelectorAll('h2,h3,p').forEach((text, index) => {
    text.classList.remove('reveal', 'is-visible');
    text.classList.add('expertise-text');
    text.style.setProperty('--text-delay', (index * 100) + 'ms');
   });
   if(!group.closest('.about-purpose-copy'))textObserver.observe(group);
  });
  const purposeSequence = document.querySelector('.about-purpose-copy');
  if(purposeSequence){
   const purposeObserver = new IntersectionObserver(entries => {
    if(entries.some(entry => entry.isIntersecting)){
     purposeSequence.classList.add('purpose-sequence-visible');
     purposeObserver.disconnect();
    }
   }, {threshold:.15});
   purposeObserver.observe(purposeSequence);
  }
  reduce.addEventListener('change', event => {
   if (event.matches) textObserver.disconnect();
  });
  const lineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('line-visible');lineObserver.unobserve(entry.target);}
  }),{threshold:0});
  document.querySelectorAll('.about-purpose, .about-principles, .about-experience, .about-team, .about-careers, .about-principle-grid article, .about-property-grid article, .about-purpose-copy article+article').forEach(line=>{
   line.classList.add('about-line-reveal');
   lineObserver.observe(line);
  });
  reduce.addEventListener('change',event=>{if(event.matches)lineObserver.disconnect();});
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  // Keyboard navigation always exposes its target immediately.
  document.addEventListener('focusin',event=>{const target=event.target.closest('.reveal');if(target)target.classList.add('is-visible');});
  reduce.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect();}});
 }
 dialog.querySelectorAll('nav a').forEach((link,i)=>link.style.setProperty('--menu-index',i));
 document.querySelectorAll('[data-count-to]').forEach(counter=>{
  const target=Number(counter.dataset.countTo);let frame,started=false;
  const finish=()=>{cancelAnimationFrame(frame);counter.textContent=String(target);};
  if(reduce.matches||!('IntersectionObserver' in window))return;
  const countObserver=new IntersectionObserver(entries=>{
   if(started||!entries.some(entry=>entry.isIntersecting))return;
   started=true;countObserver.disconnect();let start;
   function tick(time){start??=time;const progress=Math.min((time-start)/1500,1);const value=Math.floor(target*progress);if(counter.textContent!==String(value))counter.textContent=String(value);if(progress<1)frame=requestAnimationFrame(tick);else finish();}
   counter.textContent='0';frame=requestAnimationFrame(tick);
  },{threshold:.6});
  countObserver.observe(counter);
  reduce.addEventListener('change',()=>{if(reduce.matches){started=true;countObserver.disconnect();finish();}});
  addEventListener('pagehide',()=>{countObserver.disconnect();finish();},{once:true});
 });
 // Track disclosure opening order within each FAQ list.
 const disclosureControllers=new Map(),disclosureQueues=new Map();
 function trackDisclosure(details,open){
  const list=details.closest('.service-list')||details.parentElement;
  const queue=(disclosureQueues.get(list)||[]).filter(item=>item!==details);
  if(open)queue.push(details);
  disclosureQueues.set(list,queue);
  while(queue.length>3){const oldest=queue.shift();disclosureControllers.get(oldest)?.(false);}
 }
 // Keep native disclosure semantics while animating the actual panel height.
 document.querySelectorAll('.service-detail').forEach(details=>{
  const summary=details.querySelector('summary'),content=details.querySelector('.detail-body');
  let expansion,contentMotion,wantsOpen=details.open;
  function setOpen(open){
   wantsOpen=open;
   trackDisclosure(details,open);
   if(reduce.matches||!details.animate){details.open=open;content.inert=!open;return;}
   const startHeight=details.getBoundingClientRect().height;
   expansion?.cancel();contentMotion?.cancel();
   details.style.height='';
   if(wantsOpen)details.open=true;
   const style=getComputedStyle(details);
   const closedHeight=summary.getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
   const endHeight=wantsOpen?details.getBoundingClientRect().height:closedHeight;
   content.inert=!wantsOpen;
   content.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
   details.style.overflow='hidden';
   expansion=details.animate({height:[`${startHeight}px`,`${endHeight}px`]},{duration:650,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
   contentMotion=content.animate(wantsOpen?{opacity:[0,1],translate:['0 10px','0 0']}:{opacity:[1,0],translate:['0 0','0 -5px']},{duration:wantsOpen?550:280,delay:wantsOpen?90:0,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
   const active=expansion;
   active.finished.then(()=>{
    if(expansion!==active)return;
    details.open=wantsOpen;
    expansion.cancel();expansion=undefined;
    contentMotion?.cancel();contentMotion=undefined;
    details.style.height='';details.style.overflow='';
   }).catch(()=>{});
  }
  disclosureControllers.set(details,setOpen);
  if(details.open)trackDisclosure(details,true);
  content.inert=!details.open;
  summary.addEventListener('click',event=>{event.preventDefault();setOpen(!wantsOpen);});
  details.addEventListener('toggle',()=>{if(!expansion){wantsOpen=details.open;content.inert=!details.open;const list=details.closest('.service-list')||details.parentElement;const tracked=(disclosureQueues.get(list)||[]).includes(details);if(tracked!==details.open)trackDisclosure(details,details.open);}});
  reducedReset();
  function reducedReset(){reduce.addEventListener('change',()=>{if(reduce.matches){expansion?.cancel();contentMotion?.cancel();expansion=undefined;contentMotion=undefined;details.open=wantsOpen;content.inert=!wantsOpen;details.style.height='';details.style.overflow='';}});}
 });
 const slides=[...document.querySelectorAll('.slide')];let current=0;
 function showSlide(next){current=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('active',active);slide.inert=!active;slide.setAttribute('aria-hidden',String(!active));});document.querySelector('.slider-category').textContent=slides[current].querySelector('h3').textContent;}
 document.querySelector('.slider-prev')?.addEventListener('click',()=>showSlide(current-1));
 document.querySelector('.slider-next')?.addEventListener('click',()=>showSlide(current+1));
 document.querySelector('.project-slider')?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showSlide(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();showSlide(current-1);}});
 const gallery=document.querySelector('.project-slider');
 if(gallery&&slides.length>1){
  let timer,visible=false,hovered=false;
  const schedule=()=>{clearTimeout(timer);if(visible&&!document.hidden&&!reduce.matches&&!gallery.contains(document.activeElement))timer=setTimeout(()=>{showSlide(current+1);schedule();},7000);};
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.2}).observe(gallery);
  gallery.addEventListener('mouseenter',()=>{hovered=true;schedule();});gallery.addEventListener('mouseleave',()=>{hovered=false;schedule();});
  gallery.addEventListener('focusin',schedule);gallery.addEventListener('focusout',()=>setTimeout(schedule,0));gallery.addEventListener('click',schedule);
  document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);addEventListener('pagehide',()=>clearTimeout(timer),{once:true});
 }
 document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;let count=0;
  document.querySelectorAll('.filters button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('.project-card').forEach(card=>{card.hidden=category!=='All'&&card.dataset.category!==category;if(!card.hidden){count++;card.classList.add('is-visible');}});
  document.querySelector('.portfolio-grid').classList.toggle('is-filtered',category!=='All');
  document.querySelector('.filter-status').textContent=`Showing ${count} ${category==='All'?'':category.toLowerCase()+' '}concept${count===1?'':'s'}`;
  document.querySelector('.portfolio-empty').hidden=count!==0;
 }));
 const form=document.querySelector('#enquiry-form');
 form?.addEventListener('submit',e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form);const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject location: ${data.get('location')}\nProject type: ${data.get('type')}\nProject stage: ${data.get('stage')}\n\n${data.get('message')}`;
  document.querySelector('#draft-text').value=body;
  document.querySelector('#draft-fallback').hidden=false;
  document.querySelector('#form-status').textContent='Your draft is ready. Complete sending in your email app, or copy the draft below. No enquiry has been sent by this website.';
  document.querySelector('#open-email').href=`mailto:hello@zenith-hospitality.com?subject=${encodeURIComponent('Project enquiry - '+data.get('type'))}&body=${encodeURIComponent(body)}`;
 });
 document.querySelector('#copy-draft')?.addEventListener('click',async()=>{
  const draft=document.querySelector('#draft-text');try{await navigator.clipboard.writeText(draft.value);document.querySelector('#form-status').textContent='Draft copied. Paste it into your email to hello@zenith-hospitality.com.';}catch{draft.focus();draft.select();document.querySelector('#form-status').textContent='Select and copy the draft below, then paste it into your email app.';}
 });
})();
