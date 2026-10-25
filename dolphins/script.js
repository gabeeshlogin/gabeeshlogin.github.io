(function(){
  var WA='447832222533';
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  var site=document.getElementById('site');
  function onScroll(){site.classList.toggle('solid',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var btn=document.getElementById('menuBtn'), mnav=document.getElementById('mnav');
  function setMenu(open){btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');mnav.classList.toggle('open',open);}
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
  mnav.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});

  /* Booking form -> WhatsApp */
  var form=document.getElementById('book'), err=document.getElementById('formErr');
  var d=form.elements.date; if(d){var t=new Date();d.min=t.toISOString().slice(0,10);}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=new FormData(form), name=(f.get('name')||'').trim(), date=f.get('date'), time=f.get('time'), party=f.get('party'), msg=(f.get('msg')||'').trim();
    if(!name){err.textContent='Please add your name.';form.elements.name.focus();return;}
    if(!date){err.textContent='Please pick a date.';form.elements.date.focus();return;}
    err.textContent='';
    var nice=new Date(date+'T12:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    var lines=["Hi Dolphin's, I'd like to book a table.","","Name: "+name,"Date: "+nice+(time?" at "+time:""),"People: "+party];
    if(msg) lines.push("Notes: "+msg);
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
  });
})();
