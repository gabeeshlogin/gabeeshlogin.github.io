(function(){
  var PHONE='447388833394', EMAIL='thesecretgardensservices@outlook.com';

  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  var site=document.getElementById('site');
  function onScroll(){site.classList.toggle('solid',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var btn=document.getElementById('menuBtn'), mnav=document.getElementById('mnav');
  function setMenu(open){btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');mnav.classList.toggle('open',open);}
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
  mnav.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});

  /* Seasons */
  var U=function(id){return 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w=1000&h=1100&q=72';};
  var seasons={
    spring:{img:U('1654028829490-af9c5b060429'),alt:'A path under hanging purple wisteria',jobs:['First lawn cuts and edging','Borders weeded and tidied after winter','Wisteria and shrubs pruned and trained','New turf laid']},
    summer:{img:U('1740409283994-4bcd7a5c8775'),alt:'A garden full of summer flowers',jobs:['Regular mowing and maintenance','Hedges kept trim','Summer bedding planted','Garden tidied before parties and guests']},
    autumn:{img:U('1728889153657-5730575c0931'),alt:'Fallen leaves across a lawn under trees',jobs:['Leaf clearance','The last hedge cuts of the year','Turfing, a good time for a new lawn','Winter bedding planted']},
    winter:{img:U('1654077013685-afa2b47fba79'),alt:'A row of clipped evergreen hedges',jobs:['Garden clearances','Pruning and structural tidy-ups','Artificial lawn installs','Planning next year with Chris']}
  };
  var m=new Date().getMonth(), current=m<2||m===11?'winter':m<5?'spring':m<8?'summer':'autumn';
  var tabs=document.querySelectorAll('.tabs [role=tab]'), list=document.getElementById('seasonList'), img=document.getElementById('seasonImg'), tag=document.getElementById('seasonTag');
  function show(s,focus){
    var d=seasons[s];
    tabs.forEach(function(t){var on=t.dataset.s===s;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(on&&focus)t.focus();});
    document.getElementById('p-season').setAttribute('aria-labelledby','t-'+s);
    list.innerHTML=d.jobs.map(function(j){return '<li>'+j+'</li>';}).join('');
    if(tag) tag.textContent=s.charAt(0).toUpperCase()+s.slice(1);
    if(s===current&&list.firstChild) list.firstChild.insertAdjacentHTML('beforeend','<span class="now">Now</span>');
    if(img.dataset.s!==s){img.classList.add('fading');var pre=new Image();pre.onload=pre.onerror=function(){img.src=d.img;img.alt=d.alt;img.dataset.s=s;img.classList.remove('fading');};pre.src=d.img;}
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){show(t.dataset.s);});
    t.addEventListener('keydown',function(e){var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;e.preventDefault();show(tabs[(i+k+tabs.length)%tabs.length].dataset.s,true);});
  });
  img.dataset.s='autumn'; show(current);

  /* Quote form -> WhatsApp or email */
  var form=document.getElementById('quote'), err=document.getElementById('formErr');
  function compose(){
    var f=new FormData(form), name=(f.get('name')||'').trim(), area=(f.get('area')||'').trim(), msg=(f.get('msg')||'').trim(), svc=f.getAll('svc');
    if(!name){err.textContent='Please add your name so Chris knows who to reply to.';form.elements.name.focus();return null;}
    err.textContent='';
    var lines=['Hi Chris, I found you through your website and would like a quote.','','Name: '+name];
    if(area) lines.push('Garden: '+area);
    if(svc.length) lines.push('Looking for: '+svc.join(', '));
    if(msg) lines.push('','Details: '+msg);
    return lines.join('\n');
  }
  form.addEventListener('submit',function(e){e.preventDefault();var t=compose();if(t)window.open('https://wa.me/'+PHONE+'?text='+encodeURIComponent(t),'_blank','noopener');});
  document.getElementById('emailInstead').addEventListener('click',function(){var t=compose();if(t)location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Garden quote request')+'&body='+encodeURIComponent(t);});
})();
