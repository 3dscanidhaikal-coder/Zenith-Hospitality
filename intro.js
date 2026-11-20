(() => {
 'use strict';
 function playIntro(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduce.matches)return;
 const overlay=document.createElement('div');overlay.className='site-intro';overlay.setAttribute('aria-hidden','true');
 const backdrop=document.createElement('div');backdrop.className='intro-backdrop';overlay.append(backdrop);
 const logo=document.createElement('div');logo.className='intro-logo intro-logo-blend';
 const mountain=document.createElement('img');mountain.src='assets/mark-white.svg';mountain.alt='';mountain.className='intro-mountain-layer';
 const white=document.createElement('img');white.src='assets/logo-white.svg';white.alt='';white.className='intro-destination-layer';
 logo.append(mountain,white);overlay.append(logo);document.body.append(overlay);
 document.documentElement.classList.add('intro-playing');
 let finished=false;const animations=[];
 function finish(){if(finished)return;finished=true;animations.forEach(animation=>animation.cancel());document.documentElement.classList.add('intro-settled');overlay.remove();document.documentElement.classList.remove('intro-playing');window.zenithMotion?.setPaused(false);}
 const safety=setTimeout(finish,10000);
 async function enter(){
  const target=document.querySelector('.brand');if(!target){finish();return;}
  window.zenithMotion?.setPaused(true);
  // Let refresh scroll restoration finish behind the opaque loading screen.
  if(document.readyState!=='complete')await Promise.race([new Promise(resolve=>window.addEventListener('load',resolve,{once:true})),new Promise(resolve=>setTimeout(resolve,2000))]);
  await Promise.race([Promise.allSettled([document.fonts.ready,document.querySelector('.hero img')?.decode(),mountain.decode(),white.decode()]),new Promise(resolve=>setTimeout(resolve,1600))]);
  await new Promise(resolve=>setTimeout(resolve,700));if(finished)return;
  // Refresh may restore a position below the hero before the flight begins.
  const header=document.querySelector('.site-header'),hero=document.querySelector('.hero');
  const heroBounds=hero?.getBoundingClientRect();
  const onHero=!!heroBounds && heroBounds.bottom>80 && heroBounds.top<innerHeight;
  header?.classList.toggle('on-hero',onHero);
  white.src=onHero?'assets/logo-white.svg':'assets/logo-navy.svg';
  await white.decode().catch(()=>{});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(finished)return;
  const destination=target.querySelector(onHero?'.brand-white':'.brand-navy');
  await destination?.decode().catch(()=>{});
  const from=logo.getBoundingClientRect(),to=(destination||target).getBoundingClientRect();
  animations.push(logo.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${to.left+to.width/2-from.left-from.width/2}px,${to.top+to.height/2-from.top-from.height/2}px) scale(${to.width/from.width},${to.height/from.height})`}],{duration:2100,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'}));
  // Blend directly into the exact asset used by the destination navbar.
  animations.push(mountain.animate([{opacity:1},{opacity:0}],{duration:1450,delay:350,easing:'ease-in-out',fill:'forwards'}));
  animations.push(white.animate([{opacity:0},{opacity:1}],{duration:1450,delay:350,easing:'ease-in-out',fill:'forwards'}));
  animations.push(backdrop.animate([{opacity:1},{opacity:0}],{duration:1900,delay:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
  await Promise.allSettled(animations.map(animation=>animation.finished));
  if(finished)return;
  // Replace the matching flight logo in one paint. Overlapping both copies creates
  // a double edge, and restarting the header entrance moves the destination.
  clearTimeout(safety);finish();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enter,{once:true});
 else enter();
 reduce.addEventListener('change',()=>{if(reduce.matches){clearTimeout(safety);finish();}});
 addEventListener('pagehide',finish,{once:true});
 }
 playIntro();
 // A history-restored homepage is a new visit too.
 addEventListener('pageshow',event=>{if(event.persisted)playIntro();});
})();
