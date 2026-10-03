'use strict';
const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('#main-nav');
function closeNav(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='+';}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'−':'+';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeNav();toggle.focus();}});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeNav();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeNav();});
const track=document.querySelector('.review-track');
if(track){const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;function move(direction){const card=track.querySelector('.review-card');const step=card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);const max=track.scrollWidth-track.clientWidth;let next=track.scrollLeft+direction*step;if(next>max+2)next=0;if(next< -2)next=max;track.scrollTo({left:next,behavior:reduced?'auto':'smooth'});}document.querySelector('[data-review-prev]')?.addEventListener('click',()=>move(-1));document.querySelector('[data-review-next]')?.addEventListener('click',()=>move(1));track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});}
