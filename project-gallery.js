(() => {
 const track=document.querySelector('.project-gallery-track');if(!track)return;
 const slides=[...track.children],count=document.querySelector('[data-gallery-count]');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let current=0,frame;
 function go(index){current=(index+slides.length)%slides.length;track.scrollTo({left:slides[current].offsetLeft-slides[0].offsetLeft,behavior:reduce.matches?'instant':'smooth'});}
 document.querySelector('[data-gallery-prev]').addEventListener('click',()=>go(current-1));
 document.querySelector('[data-gallery-next]').addEventListener('click',()=>go(current+1));
 track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1));}});
 track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const position=track.scrollLeft;current=slides.reduce((closest,slide,i)=>Math.abs(slide.offsetLeft-slides[0].offsetLeft-position)<Math.abs(slides[closest].offsetLeft-slides[0].offsetLeft-position)?i:closest,0);count.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');});},{passive:true});
})();
(() => {
 const root=document.querySelector('.solvyn-destinations');if(!root)return;
 const slides=[...root.querySelectorAll('.solvyn-destination')],dots=[...root.querySelectorAll('[data-destination]')];let active=0,start;
 function show(index){active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===active);slide.inert=i!==active;slide.setAttribute('aria-hidden',String(i!==active));});dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===active)));root.querySelector('[data-destination-count]').textContent=String(active+1).padStart(2,'0')+' / 06';}
 root.querySelector('[data-destination-prev]').addEventListener('click',()=>show(active-1));
 root.querySelector('[data-destination-next]').addEventListener('click',()=>show(active+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
 root.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();show(active+(event.key==='ArrowRight'?1:-1));}});
 root.addEventListener('touchstart',event=>{start={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 root.addEventListener('touchend',event=>{if(!start)return;const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))show(active+(dx<0?1:-1));start=null;},{passive:true});
})();
