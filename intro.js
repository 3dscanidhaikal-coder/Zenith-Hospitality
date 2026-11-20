(() => {
 'use strict';
 function playIntro(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduce.matches)return;
 const overlay=document.createElement('div');overlay.className='site-intro';overlay.setAttribute('aria-hidden','true');
 const backdrop=document.createElement('div');backdrop.className='intro-backdrop';overlay.append(backdrop);
 const logo=document.createElement('div');logo.className='intro-logo intro-logo-blend intro-mountain-flight';
 const mountain=document.createElement('img');mountain.src='assets/mark-white.svg';mountain.alt='';mountain.className='intro-mountain-layer';
 const white=document.createElement('img');white.src='assets/mark-white.svg';white.alt='';white.className='intro-destination-layer';
 const wordmark=document.createElement('img');wordmark.className='intro-navbar-wordmark';wordmark.alt='';
 logo.append(mountain,white);overlay.append(logo,wordmark);document.body.append(overlay);
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
  white.src=onHero?'assets/mark-white.svg':'assets/mountain-navy.svg';
  wordmark.src=onHero?'assets/wordmark-white.svg':'assets/wordmark-navy.svg';
  await Promise.allSettled([white.decode(),wordmark.decode()]);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(finished)return;
  const destination=target.querySelector(onHero?'.brand-white':'.brand-navy');
  await destination?.decode().catch(()=>{});
  const from=logo.getBoundingClientRect(),brandBounds=(destination||target).getBoundingClientRect();
  // The stationary lettering uses the exact full-logo canvas, with its mountain removed.
  Object.assign(wordmark.style,{left:brandBounds.left+'px',top:brandBounds.top+'px',width:brandBounds.width+'px',height:brandBounds.height+'px'});
  wordmark.classList.add('is-ready');
  // Fly to the mountain's actual bounds, not the full logo's rectangle.
  const fit=Math.min(brandBounds.width/1858,brandBounds.height/1299);
  const to={left:brandBounds.left+(brandBounds.width-1858*fit)/2,top:brandBounds.top+(brandBounds.height-1299*fit)/2,width:1858*fit,height:681*fit};
  animations.push(logo.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${to.left+to.width/2-from.left-from.width/2}px,${to.top+to.height/2-from.top-from.height/2}px) scale(${to.width/from.width},${to.height/from.height})`}],{duration:2100,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'}));
  // Only the mountain changes colour on a light navbar; the lettering never travels.
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
