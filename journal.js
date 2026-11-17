(() => {
 const cards=[...document.querySelectorAll('[data-journal-card]')];
 const search=document.querySelector('[data-journal-search]');
 const buttons=[...document.querySelectorAll('[data-journal-filter]')];
 let category=location.hash==='#news'?'News':'All';
 function update(){
  const words=(search?.value||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
  let count=0;
  cards.forEach(card=>{
   const matches=(category==='All'||card.dataset.category===category)&&words.every(word=>card.dataset.search.includes(word));
   card.hidden=!matches;
   if(matches){count++;card.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
  });
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.journalFilter===category)));
  document.querySelector('[data-journal-status]').textContent=count+(count===1?' article found':' articles found');
  document.querySelector('[data-journal-empty]').hidden=count!==0;
 }
 buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.journalFilter;update();}));
 search?.addEventListener('input',update);
 if(category==='News')update();
 window.addEventListener('hashchange',()=>{if(location.hash==='#news'){category='News';update();}});
 document.querySelector('[data-journal-reset]')?.addEventListener('click',()=>{category='All';search.value='';update();search.focus();});
})();
