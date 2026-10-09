(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const PHOTO={mitul:"mitul.jpg",mohammad:"mohammad.jpg",justin:"justin.jpg",nancy:"nancy.jpg",hani:"hani.jpg",amie:"amie.jpg",kat:"kat.jpg"};
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* Hours */
const HOURS=[{d:"Mon",n:"Monday",o:7.5,c:16},{d:"Tue",n:"Tuesday",o:7.5,c:18},{d:"Wed",n:"Wednesday",o:7.5,c:18},{d:"Thu",n:"Thursday",o:7.5,c:18},{d:"Fri",n:"Friday",o:7.5,c:16},{d:"Sat",n:"Saturday",o:8,c:13},{d:"Sun",n:"Sunday",o:null,c:null}];
const fmt=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);return (((H+11)%12)+1)+(M?":"+String(M).padStart(2,"0"):"")+(H>=12?"pm":"am")};
function londonNow(){
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const g=t=>p.find(x=>x.type===t).value;
  return {wd:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(g("weekday")),h:(+g("hour")%24)+(+g("minute"))/60,y:+g("year"),m:+g("month"),d:+g("day")};
}
function renderHours(){
  const n=londonNow(),t=HOURS[n.wd];let html;
  if(t.o!=null&&n.h>=t.o&&n.h<t.c)html=`<span class="dot on"></span><span>Open now <span class="sub">until ${fmt(t.c)}</span></span>`;
  else{let lbl="";if(t.o!=null&&n.h<t.o)lbl="today at "+fmt(t.o);else for(let k=1;k<=7;k++){const j=(n.wd+k)%7;if(HOURS[j].o!=null){lbl=(k===1?"tomorrow":HOURS[j].n)+" at "+fmt(HOURS[j].o);break}}
    html=`<span class="dot"></span><span>Closed now <span class="sub">· opens ${lbl}</span></span>`;}
  $("#openBadge").innerHTML=html;
  $("#vHours").innerHTML=HOURS.map((x,i)=>`<li${i===n.wd?' class="today"':""}><span>${x.n}${i===n.wd?" (today)":""}</span><span>${x.o==null?"Closed":fmt(x.o)+" – "+fmt(x.c)}</span></li>`).join("");
  $("#fHours").innerHTML=HOURS.map(x=>`<li><span>${x.d}</span><span>${x.o==null?"Closed":fmt(x.o)+" – "+fmt(x.c)}</span></li>`).join("");
}
renderHours();setInterval(renderHours,60000);

/* Treatments */
const GROUPS=[{id:"all",name:"All treatments"},{id:"everyday",name:"Everyday care"},{id:"restore",name:"Restoring teeth"},{id:"cosmetic",name:"Straightening & cosmetic"},{id:"specialist",name:"Specialist care"},{id:"face",name:"Facial aesthetics"}];
const TX=[
 {id:"checkups",g:"everyday",name:"Check-ups",sum:"Routine examinations for adults and children to catch problems early.",
  body:"A routine check looks at the health of your teeth, gums and mouth, so small problems can be spotted before they become bigger ones. It's also a good time to ask about anything you've noticed.",
  inv:["Examination of teeth, gums and soft tissues","X-rays if your dentist thinks they're needed","Advice on looking after your teeth at home"],good:["Keeping on top of routine care","Children's check-ups"],
  fees:[["Routine dental health check","£53.50"],["Child examination","£29.50"],["Child under 5 (with paying adult)","Free"],["Small X-ray","£16"]]},
 {id:"hygiene",g:"everyday",name:"Hygiene appointments",sum:"A professional clean with EMS Airflow to remove build-up and staining.",
  body:"A hygiene appointment removes plaque, tartar and staining that brushing can't reach. We use EMS Airflow, which cleans with a fine spray of air, water and powder.",
  inv:["Cleaning around and just under the gum line","Removing surface staining","Tips on brushing and cleaning between teeth"],good:["Regular upkeep alongside check-ups","Two visits a year are included in the Pearl Plan"],
  fees:[["30 min hygiene session with EMS Airflow","£115"]],who:["amie","Amie Allen and Kat Thetford-Haine","Our hygienists"]},
 {id:"fillings",g:"everyday",name:"White fillings",sum:"Tooth-coloured fillings that repair decay or chips and blend in.",
  body:"White (composite) fillings repair teeth damaged by decay or small chips using a tooth-coloured material matched to the shade of your tooth.",
  inv:["Removing decay and preparing the tooth","Building up the filling in layers","Shaping and polishing to fit your bite"],good:["Small to medium cavities","Replacing old fillings when advised"],
  fees:[["Composite white fillings","from £195"]]},
 {id:"guards",g:"everyday",name:"Mouth guards",sum:"Custom-made guards to protect your teeth, for example during sport.",
  body:"A custom mouth guard is made to fit your teeth, so it's more comfortable than an off-the-shelf one. Your dentist will talk through which type suits what you need.",
  inv:["A chat about what you need the guard for","Records of your teeth","A fitting appointment"],good:["Contact sports","Talking about teeth grinding"],fees:[]},
 {id:"cerec",g:"restore",name:"CEREC same-day crowns",sum:"Ceramic crowns, inlays and onlays made and fitted in one appointment.",
  body:"With CEREC, we design, make and fit a ceramic crown, inlay or onlay in a single appointment. Your tooth is scanned digitally and the restoration is milled from a solid block of ceramic in the practice, then fitted and polished the same day.",
  inv:["Digital scan, so no impression trays","Designing the crown on screen","Milling in the practice, then fitting and polishing"],good:["Repairing a damaged or weakened tooth","Avoiding a temporary crown and second visit"],
  fees:[["CEREC 3D crown","from £975"],["CEREC 3D inlay","from £975"]]},
 {id:"implants",g:"restore",name:"Dental implants",sum:"A permanent way to replace one or more missing teeth.",
  body:"A dental implant replaces the root of a missing tooth and holds a crown, bridge or denture. Your dentist will explain at a consultation whether implants are an option for you.",
  inv:["Consultation and assessment","Planning, which may include a CBCT scan","Placing the implant, then fitting the crown once healed"],good:["Replacing a single missing tooth","Securing a loose denture"],
  fees:[["Single implant including crown","from £3,100"],["Implant-retained denture (incl. implants)","from £15,000"],["CBCT scan","£225"]],who:["mohammad","Mohammad Husban","Restorative & Implant Dental Surgeon, member of the International Team for Implantology"]},
 {id:"bridges",g:"restore",name:"Bridges",sum:"A fixed replacement tooth, held by the teeth either side of the gap.",
  body:"A bridge fills a gap by attaching a replacement tooth to crowns on the neighbouring teeth. It's fixed in place, so you don't take it out.",
  inv:["Checking the neighbouring teeth","Preparing the supporting teeth","Fitting the bridge"],good:["Replacing a missing tooth when the teeth either side are suitable"],
  fees:[["Metal-free porcelain bridge","from £995"],["Porcelain bonded to gold bridge","from £995"]]},
 {id:"dentures",g:"restore",name:"Dentures",sum:"Removable full or partial dentures in acrylic, flexible or cobalt-chrome.",
  body:"Dentures replace missing teeth with a removable plate. We offer acrylic, flexible and cobalt-chrome dentures, as well as implant-retained dentures for extra stability.",
  inv:["Talking through the options","Impressions and fitting appointments","Adjustments so they feel comfortable"],good:["Replacing several or all teeth","People who prefer a removable option"],
  fees:[["Acrylic dentures","from £795"],["Flexible dentures","from £795"],["Cobalt-chrome dentures","from £1,450"]]},
 {id:"straight",g:"cosmetic",name:"Invisalign teeth straightening",sum:"Clear, removable aligners from an Invisalign Platinum Provider.",
  body:"Invisalign uses a series of clear, removable aligners to gradually move your teeth. We're an Invisalign Platinum Provider, which reflects the number of aligner cases we complete.",
  inv:["Consultation and digital scan","A plan showing how your teeth should move","Regular check-ins while you wear your aligners"],good:["Crooked, crowded or gappy teeth","Adults who'd rather not have fixed braces"],
  fees:[["Teeth straightening / clear braces","from £3,250"],["Cosmetic consultation (redeemable)","£95"]],who:["mitul","Mitul Patel","Clinical Director"]},
 {id:"whitening",g:"cosmetic",name:"Teeth whitening",sum:"Professional whitening at home, or started in the clinic.",
  body:"Professional whitening lightens the natural shade of your teeth using trays made for you. We check your teeth are healthy first and explain what's realistic for you.",
  inv:["A check that whitening is suitable","Custom trays made for your teeth","At-home whitening, or a clinic session plus trays"],good:["Brightening natural teeth"],
  fees:[["Teeth whitening (at home)","£395"],["Teeth whitening (in clinic + trays)","£750"]]},
 {id:"veneers",g:"cosmetic",name:"Porcelain veneers",sum:"Thin porcelain facings to change the colour or shape of front teeth.",
  body:"Veneers are thin porcelain facings bonded to the front of your teeth to change their shade, shape or size. We plan them with you at a cosmetic consultation.",
  inv:["Cosmetic consultation","Planning the shape and shade","Preparing the teeth and fitting the veneers"],good:["Stained, chipped or uneven front teeth"],
  fees:[["Porcelain veneers","from £995"],["Cosmetic consultation (redeemable)","£95"]]},
 {id:"rootcanal",g:"specialist",name:"Root canal treatment",sum:"Treatment to save an infected or damaged tooth.",
  body:"Root canal treatment removes infection or damaged tissue from inside a tooth, then cleans and seals it. It's often a way to keep a tooth that might otherwise need to come out.",
  inv:["Assessment and X-rays","Cleaning and shaping the root canals","Sealing the tooth, then restoring it, often with a crown"],good:["A tooth with an infected or inflamed nerve"],
  fees:[["Root canal consultation (specialist)","from £125"],["Root canal treatment with specialist","from £1,155"]],who:["justin","Justin Underwood","Endodontic Dentist"]},
 {id:"gums",g:"specialist",name:"Gum treatment",sum:"Assessment and treatment for gum disease.",
  body:"Gum (periodontal) treatment deals with gum disease, which can affect your gums and the bone that supports your teeth. It starts with a detailed assessment, then treatment and a follow-up to check progress.",
  inv:["Periodontal assessment","Treatment by section of the mouth or all at once","A reassessment afterwards"],good:["Bleeding or receding gums"],
  fees:[["Periodontal assessment","from £295"],["Treatment per quadrant","£495"],["Treatment, full mouth","£1,900"],["Reassessment","from £175"]],who:["nancy","Nancy Girgis","General Dentist & Periodontology Specialist"]},
 {id:"extract",g:"specialist",name:"Extractions & oral surgery",sum:"Tooth removal, including surgical extractions.",
  body:"When a tooth can't be saved, or needs to come out for another reason, we can remove it at the practice. More complex cases are seen by our oral surgeon.",
  inv:["Assessment and X-rays","Talking through options and aftercare","The extraction, with written aftercare advice"],good:["Teeth that can't be repaired"],
  fees:[["Extractions","from £295"]],who:["hani","Hani Dajani","Oral Surgeon"]},
 {id:"tmd",g:"specialist",name:"Jaw pain (TMD)",sum:"Help with jaw aching, clicking or stiffness.",
  body:"Temporomandibular disorders (TMD) affect the jaw joint and the muscles that move it. If your jaw aches, clicks or feels stiff, your dentist can assess it and talk through options.",
  inv:["A chat about your symptoms","Examining the jaw joint, muscles and bite","Discussing ways to manage it"],good:["Jaw aching, clicking or stiffness"],fees:[]},
 {id:"lines",g:"face",name:"Lines & wrinkles",sum:"Non-surgical treatment to soften facial lines.",
  body:"Treatment for lines and wrinkles is part of our facial aesthetics service. It always starts with a consultation to talk about what you'd like and whether treatment is right for you.",
  inv:["Consultation and medical history","Agreeing a plan","Treatment and a follow-up review"],good:["Adults considering facial aesthetics"],fees:[]},
 {id:"fillers",g:"face",name:"Dermal fillers",sum:"Fillers to restore volume, planned at a consultation.",
  body:"Dermal fillers are part of our facial aesthetics service. We start with a consultation to talk through what you'd like and whether fillers are suitable.",
  inv:["Consultation and medical history","Agreeing a plan","Treatment and a follow-up review"],good:["Adults considering facial aesthetics"],fees:[]}
];
let curG="all";
function priceTxt(t){if(!t.fees.length)return"Price at consultation";const f=t.fees[0][1];return /^from/.test(f)?"From "+f.slice(5):f}
function renderFilters(){$("#filters").innerHTML=GROUPS.map(g=>`<button type="button" aria-pressed="${g.id===curG}" data-g="${g.id}">${esc(g.name)}</button>`).join("")}
function renderTx(){
  const list=TX.filter(t=>curG==="all"||t.g===curG);
  $("#txGrid").innerHTML=list.map(t=>`<li><button type="button" class="tx-card" data-open-tx="${t.id}" aria-haspopup="dialog"><span class="grp">${esc(GROUPS.find(g=>g.id===t.g).name)}</span><h3>${esc(t.name)}</h3><p>${esc(t.sum)}</p><span class="foot"><b>${esc(priceTxt(t))}</b><span class="more">Details ${arrow}</span></span></button></li>`).join("");
}
renderFilters();renderTx();
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b)return;curG=b.dataset.g;renderFilters();renderTx();$(`#filters [data-g="${curG}"]`).focus()});

/* Info dialog */
const info=$("#info");let infoCtx=null,lastOpener=null;
function openDlg(d,opener){lastOpener=opener||document.activeElement;if(!d.open)d.showModal();document.documentElement.style.overflow="hidden"}
$$("dialog").forEach(d=>{
  d.addEventListener("close",()=>{if(!$$("dialog").some(x=>x.open)){document.documentElement.style.overflow="";if(lastOpener&&document.contains(lastOpener)){try{lastOpener.focus({preventScroll:true})}catch(e){}}}if(d.id==="book")resetBooking();});
  d.addEventListener("click",e=>{if(e.target===d&&d.id!=="menu")d.close()});
  $$("[data-close]",d).forEach(b=>b.addEventListener("click",()=>d.close()));
});
function openTx(id,opener){
  const t=TX.find(x=>x.id===id);infoCtx=t.id;
  $("#infoLbl").textContent=GROUPS.find(g=>g.id===t.g).name;$("#infoTitle").textContent=t.name;
  const fees=t.fees.length?`<div class="txd-fees"><h3>Guide prices</h3><table>${t.fees.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join("")}</table></div>`:`<div class="txd-fees"><h3>Guide prices</h3><p class="muted">We don't publish a set fee for this. We'll explain the cost at your consultation, before any treatment.</p></div>`;
  const who=t.who?`<p class="txd-who"><img src="${PHOTO[t.who[0]]}" alt=""><span><b>${esc(t.who[1])}</b><br>${esc(t.who[2])}</span></p>`:"";
  $("#infoBody").innerHTML=`<div class="txd"><p>${esc(t.body)}</p><div class="txd-cols"><div><h3>What's involved</h3><ul>${t.inv.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div><h3>Often used for</h3><ul>${t.good.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>${fees}${who}<p class="muted">Your dentist will confirm whether this is right for you after an examination, and you'll get a quote before treatment begins.</p></div>`;
  $("#infoBook").textContent="Book an appointment";
  openDlg(info,opener);$("#infoBody").scrollTop=0;
}
const BIOS={
 mitul:{name:"Mitul Patel",role:"Clinical Director & Principal Dental Surgeon",creds:["BDS (Prague)","MSc (London)","GDC No. 101417"],text:["Mitul is the Clinical Director and Principal Dentist at Waterden. He qualified in 2003 and has worked in both NHS and private practice, building particular experience in restorative and cosmetic dentistry.","In 2011 he completed a Master's in Conservative Dentistry at the UCL Eastman Dental Institute in London. That training shaped his interest in minimally invasive dentistry: keeping as much natural tooth as possible while getting long-lasting, natural-looking results.","He leads the clinical team and keeps up regular continuing professional development."]},
 mohammad:{name:"Mohammad Husban",role:"Restorative & Implant Dental Surgeon",creds:["BDS (Belfast)","MFDS (Dublin)","MSc (London)","MFDS RCS Ed","GDC No. 85913"],text:["Mohammad qualified from Queen's University Belfast in 2005 and gained Membership of the Faculty of Dental Surgery from the Royal College of Surgeons in Ireland in 2009.","He completed a Master's in Conservative Dentistry with merit at the UCL Eastman Dental Institute in 2011, and has worked across hospital dentistry, NHS care, teaching and private practice.","His particular interests are dental implants, restorative and cosmetic dentistry. He's a member of the International Team for Implantology (ITI)."]}
};
function openBio(id,opener){
  const b=BIOS[id];infoCtx=null;
  $("#infoLbl").textContent="Our team";$("#infoTitle").textContent=b.name;
  $("#infoBody").innerHTML=`<div class="bio"><img src="${PHOTO[id]}" width="222" height="288" alt="${esc(b.name)}"><div><p style="color:var(--teal-ink);font-weight:600">${esc(b.role)}</p><div class="creds">${b.creds.map(c=>`<span>${esc(c)}</span>`).join("")}</div></div></div><div class="bio-text">${b.text.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`;
  $("#infoBook").textContent="Book with the team";
  openDlg(info,opener);$("#infoBody").scrollTop=0;
}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-open-tx]");if(t){openTx(t.dataset.openTx,t);return}
  const b=e.target.closest("[data-bio]");if(b){openBio(b.dataset.bio,b);return}
  const k=e.target.closest("[data-book]");if(k){if(menu.open)menu.close();openBooking(k.dataset.book||null,k)}
});
$("#infoBook").addEventListener("click",()=>{const ctx=infoCtx,op=lastOpener;info.close();openBooking(ctx,op)});

/* Menu */
const menu=$("#menu");
$("#menuOpen").addEventListener("click",e=>{lastOpener=e.currentTarget;menu.showModal();document.documentElement.style.overflow="hidden";e.currentTarget.setAttribute("aria-expanded","true")});
menu.addEventListener("close",()=>$("#menuOpen").setAttribute("aria-expanded","false"));
$$("#menu nav a").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();const tg=$(a.getAttribute("href"));lastOpener=null;menu.close();document.documentElement.style.overflow="";requestAnimationFrame(()=>{tg.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});tg.setAttribute("tabindex","-1");tg.focus({preventScroll:true})})}));
addEventListener("resize",()=>{if(innerWidth>960&&menu.open)menu.close()});

/* Header */
const hdr=$("header.site");const onS=()=>hdr.classList.toggle("scrolled",scrollY>10);onS();addEventListener("scroll",onS,{passive:true});
if("IntersectionObserver" in window){const links=$$("nav.primary a");const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)links.forEach(l=>l.setAttribute("aria-current",l.getAttribute("href")==="#"+en.target.id?"true":"false"))}),{rootMargin:"-45% 0px -50% 0px"});["treatments","team","reviews","fees","new-patients","visit"].forEach(id=>io.observe(document.getElementById(id)))}

/* Reviews */
const REVIEWS=[
 {q:"I am new to the practice but have been blown away by the professional service. The reception staff are so welcoming and friendly, I was put at ease from the moment I walked in.",a:"Joanne Sutcliffe"},
 {q:"Big thank you to Mitul and his team for their care and professionalism. I had a 45 minute appointment which I hadn't been looking forward to and every care was given to put me at my ease.",a:"Debby Vellam"},
 {q:"I had my teeth straightened and whitened by Mitul and I'm really happy with the results. I just wish I had done it sooner. Everyone is very friendly and helpful.",a:"Amanda L."},
 {q:"Mo was so understanding & kind & assured me implants were possible… Everyone at Waterden is professional & they care. I can't speak more highly of them.",a:"Jenny D."},
 {q:"I've always received the best treatment possible from friendly, efficient and thoroughly professional staff. Where specialist care has been required, Waterden Dental have available speedy and exceptionally well qualified experts.",a:"Drew Smith"},
 {q:"Absolutely delighted with Mitul Patel, he's competent, kind & friendly. Going to Waterden Dental is in fact a great experience. Everyone there made me really welcome.",a:"Pat Tait"},
 {q:"All the staff have treated me with professionalism and friendliness. I have always felt at ease during my treatment and would not hesitate to recommend them.",a:"Ian Hoddell"}
];
const track=$("#rvTrack");
track.innerHTML=REVIEWS.map(r=>`<li><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote><p>“${esc(r.q)}”</p></blockquote><div class="rv-who"><span class="av" aria-hidden="true">${esc(r.a.charAt(0))}</span><span><b>${esc(r.a)}</b><span>Google review</span></span></div></li>`).join("");
const step=()=>{const li=track.querySelector("li");return li?li.getBoundingClientRect().width+20:300};
const upd=()=>{$("#rvPrev").disabled=track.scrollLeft<=4;$("#rvNext").disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-4};
$("#rvPrev").addEventListener("click",()=>track.scrollBy({left:-step()}));
$("#rvNext").addEventListener("click",()=>track.scrollBy({left:step()}));
track.addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);upd();
track.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();track.scrollBy({left:step()})}if(e.key==="ArrowLeft"){e.preventDefault();track.scrollBy({left:-step()})}});

/* Fees */
const FEES=[
 {id:"general",name:"General",rows:[["New patient consultation","Including two X-rays","£97.50"],["Routine dental health check","","£53.50"],["Child examination","","£29.50"],["Small X-ray","","£16"],["Full mouth X-ray","","£85"],["Hygiene session with EMS Airflow","30 minutes","£115"],["Composite white fillings","","from £195"],["Extractions","","from £295"]]},
 {id:"cosmetic",name:"Cosmetic",rows:[["Cosmetic consultation","Redeemable against future treatment","£95"],["Teeth whitening","At home","£395"],["Teeth whitening","In clinic + trays","£750"],["Teeth straightening / clear braces","","from £3,250"],["CEREC 3D crown","","from £975"],["CEREC 3D inlay","","from £975"],["Porcelain veneers","","from £995"]]},
 {id:"restorative",name:"Dentures & crowns",rows:[["Acrylic dentures","","from £795"],["Flexible dentures","","from £795"],["Cobalt-chrome dentures","","from £1,450"],["Metal-free porcelain crown","","from £995"],["Porcelain bonded to gold crown","","from £995"],["Metal-free porcelain bridge","","from £995"],["Porcelain bonded to gold bridge","","from £995"]]},
 {id:"specialist",name:"Specialist",rows:[["Root canal consultation","Specialist","from £125"],["Root canal treatment","With specialist","from £1,155"],["Periodontal assessment","","from £295"],["Periodontal treatment","Per quadrant","£495"],["Periodontal treatment","Full mouth","£1,900"],["Periodontal reassessment","","from £175"],["CBCT scan","","£225"]]},
 {id:"implants",name:"Implants",rows:[["Single dental implant","Including crown","from £3,100"],["Implant-retained denture","Including implants","from £15,000"]]}
];
let fCur="general";
function renderFees(){
  $("#fTabs").innerHTML=FEES.map(f=>`<button type="button" role="tab" id="ft-${f.id}" aria-controls="fPanel" aria-selected="${f.id===fCur}" tabindex="${f.id===fCur?0:-1}" data-f="${f.id}">${esc(f.name)}</button>`).join("");
  const f=FEES.find(x=>x.id===fCur);$("#fPanel").setAttribute("aria-labelledby","ft-"+f.id);$("#fCap").textContent=f.name+" fees";
  $("#fTable tbody").innerHTML=f.rows.map(r=>{const m=r[2].match(/^from (.+)$/);return `<tr><td>${esc(r[0])}${r[1]?`<small>${esc(r[1])}</small>`:""}</td><td>${m?`<small>from</small>${esc(m[1])}`:esc(r[2])}</td></tr>`}).join("");
}
renderFees();
$("#fTabs").addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(!b)return;fCur=b.dataset.f;renderFees();$("#ft-"+fCur).focus()});
$("#fTabs").addEventListener("keydown",e=>{const ids=FEES.map(f=>f.id);let i=ids.indexOf(fCur);if(e.key==="ArrowRight")i=(i+1)%ids.length;else if(e.key==="ArrowLeft")i=(i-1+ids.length)%ids.length;else return;e.preventDefault();fCur=ids[i];renderFees();$("#ft-"+fCur).focus()});

/* FAQ */
$$("#faq button[aria-controls]").forEach(b=>b.addEventListener("click",()=>{const o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!o));$("#"+b.getAttribute("aria-controls")).hidden=o}));

/* Copy */
$$("[data-copy]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.copy;const ok=()=>{b.textContent="Copied";b.classList.add("done");setTimeout(()=>{b.textContent="Copy";b.classList.remove("done")},1600)};const fb=()=>{const a=b.previousElementSibling,r=document.createRange();r.selectNodeContents(a);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Selected";setTimeout(()=>b.textContent="Copy",1600)};try{navigator.clipboard.writeText(v).then(ok).catch(fb)}catch(e){fb()}}));

/* Validation */
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const setErr=(el,er,msg)=>{if(el)el.setAttribute("aria-invalid",msg?"true":"false");er.textContent=msg||""};
const okPhone=v=>{const d=v.replace(/\D/g,"");return d.length>=10&&d.length<=13};
$$("input,textarea").forEach(i=>i.addEventListener("input",()=>{if(i.getAttribute("aria-invalid")==="true"){i.setAttribute("aria-invalid","false");const d=i.getAttribute("aria-describedby");if(d)$("#"+d).textContent=""}}));

/* Ask form */
$("#askForm").addEventListener("submit",e=>{
  e.preventDefault();const n=$("#aName"),m=$("#aEmail"),q=$("#aMsg");let first=null;
  const c=(el,er,msg)=>{setErr(el,$(er),msg);if(msg&&!first)first=el};
  c(n,"#aNameErr",n.value.trim()?"":"Please enter your name.");
  c(m,"#aEmailErr",!m.value.trim()?"Please enter your email address.":EMAIL.test(m.value.trim())?"":"Please check your email address, for example name@example.co.uk.");
  c(q,"#aMsgErr",q.value.trim().length<5?"Please type your question.":"");
  if(first){first.focus();$("#askResult").innerHTML="";return}
  $("#askResult").innerHTML=`<div class="demo-result"><b>Demo only: this message hasn't been sent.</b>On the live website it would go to the team at info@waterdendental.co.uk. Your text has been cleared.</div>`;
  e.target.reset();
});

/* Booking */
const REASONS=[{v:"newpt",l:"New patient consultation",s:"Examination and two X-rays"},{v:"checkup",l:"Check-up",s:"Routine dental health check"},{v:"hygiene",l:"Hygiene appointment",s:"Clean with EMS Airflow"},{v:"urgent",l:"Pain or an urgent problem",s:"We'll advise you by phone"},{v:"cosmetic",l:"Cosmetic consultation",s:"Invisalign, whitening, veneers"},{v:"treatment",l:"A specific treatment",s:"Choose from the list"},{v:"plan",l:"Joining the Pearl Plan",s:"Membership questions"},{v:"child",l:"Child's check-up",s:"Under-5s free with a paying adult"}];
const MAP={plan:"plan",new:"newpt"};
let step_=1;const days=$("#days"),times=$("#times");
$("#reasons").innerHTML=REASONS.map(r=>`<label class="choice"><input type="radio" name="reason" value="${r.v}"><span>${esc(r.l)}<small>${esc(r.s)}</small></span></label>`).join("")+`<div class="field" id="txPickWrap" hidden style="grid-column:1/-1"><label for="txPick">Which treatment?</label><select id="txPick" aria-describedby="txPickErr"><option value="">Choose a treatment</option>${GROUPS.slice(1).map(g=>`<optgroup label="${esc(g.name)}">${TX.filter(t=>t.g===g.id).map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join("")}</optgroup>`).join("")}</select><p class="err" id="txPickErr"></p></div>`;
const txPick=$("#txPick");
$("#reasons").addEventListener("change",e=>{if(e.target.name==="reason"){$("#txPickWrap").hidden=e.target.value!=="treatment";$("#urgentNote").hidden=e.target.value!=="urgent";setErr(null,$("#reasonErr"),"")}if(e.target===txPick)setErr(txPick,$("#txPickErr"),"")});
function buildDays(){
  const n=londonNow(),base=Date.UTC(n.y,n.m-1,n.d);const out=[];let k=1;
  while(out.length<12){const dt=new Date(base+k*864e5);k++;const wd=(dt.getUTCDay()+6)%7;if(HOURS[wd].o==null)continue;out.push({iso:dt.toISOString().slice(0,10),wd,label:dt.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"}),dn:dt.getUTCDate(),dw:HOURS[wd].d,mo:dt.toLocaleDateString("en-GB",{month:"short",timeZone:"UTC"})})}
  days.innerHTML=out.map(d=>`<label class="choice"><input type="radio" name="day" value="${d.iso}" data-wd="${d.wd}" data-label="${esc(d.label)}" aria-label="${esc(d.label)}"><span><small>${d.dw}</small><b>${d.dn}</b><small>${d.mo}</small></span></label>`).join("");
  times.innerHTML=`<p class="muted" style="grid-column:1/-1">Pick a day to see example times.</p>`;
}
function buildTimes(wd){const h=HOURS[wd];const s=[];for(let t=h.o;t<=h.c-.75;t+=.75)s.push(t);
  times.innerHTML=s.map(t=>{const H=Math.floor(t),M=Math.round((t-H)*60),v=String(H).padStart(2,"0")+":"+String(M).padStart(2,"0");return `<label class="choice"><input type="radio" name="time" value="${v}"><span>${v}</span></label>`}).join("")+`<label class="choice" style="grid-column:1/-1"><input type="radio" name="time" value="Any time"><span>Any time that day</span></label>`}
days.addEventListener("change",e=>{if(e.target.name==="day"){buildTimes(+e.target.dataset.wd);setErr(null,$("#dayErr"),"")}});
times.addEventListener("change",()=>setErr(null,$("#timeErr"),""));
const LABELS=["What you'd like to book","Day and time","Your details","Check and preview"];
function showStep(n,focus=true){
  step_=n;$$("#bkForm .step").forEach(s=>{const on=+s.dataset.step===n;s.hidden=!on;s.classList.toggle("enter",on)});
  $$("#book .progress span").forEach((s,i)=>s.classList.toggle("done",i<Math.min(n,4)));
  $("#bkStepL").textContent=n<=4?`Step ${n} of 4: ${LABELS[n-1]}`:"Done";
  $("#bkBack").textContent=n===1?"Cancel":n===5?"Close":"Back";
  const nx=$("#bkNext");nx.disabled=false;nx.innerHTML=n===4?"Preview request":n===5?"Start again":"Continue "+arrow;
  $("#bkForm").scrollTop=0;
  if(focus){const s=$(`#bkForm .step[data-step="${n}"]`);const f=n===5?$("#bkDone"):s.querySelector("input,select,textarea");if(f)setTimeout(()=>f.focus({preventScroll:true}),30)}
}
const val=n=>{const el=$(`#bkForm [name="${n}"]:checked`);return el?el.value:""};
function validate(n){
  let first=null;const f=(el,er,msg,tg)=>{setErr(el,$(er),msg);if(msg&&!first)first=tg||el};
  if(n===1){const r=val("reason");f(null,"#reasonErr",r?"":"Please choose what you'd like to book.",$('#reasons input'));if(r==="treatment")f(txPick,"#txPickErr",txPick.value?"":"Please choose a treatment.")}
  if(n===2){f(null,"#dayErr",val("day")?"":"Please choose a day.",$('#days input'));if(val("day"))f(null,"#timeErr",val("time")?"":"Please choose a time, or any time that day.",$('#times input'))}
  if(n===3){const F=$("#bFirst"),L=$("#bLast"),P=$("#bPhone"),E=$("#bEmail");
    f(F,"#bFirstErr",F.value.trim()?"":"Please enter your first name.");f(L,"#bLastErr",L.value.trim()?"":"Please enter your last name.");
    f(P,"#bPhoneErr",!P.value.trim()?"Please enter a phone number.":okPhone(P.value)?"":"Please check the number, for example 07700 900123.");
    f(E,"#bEmailErr",!E.value.trim()?"Please enter your email address.":EMAIL.test(E.value.trim())?"":"Please check your email address, for example name@example.co.uk.")}
  if(first){first.focus();return false}return true;
}
function summary(){
  const r=REASONS.find(x=>x.v===val("reason"));const reason=r.v==="treatment"?TX.find(t=>t.id===txPick.value).name:r.l;const d=$('#days input:checked');
  const rows=[["Appointment",`${esc(reason)}<br><small>${esc(val("ptype"))}</small>`,1],["When",`${esc(d.dataset.label)}, ${esc(val("time")==="Any time"?"any time":val("time"))}`,2],["Name",esc($("#bFirst").value.trim()+" "+$("#bLast").value.trim()),3],["Contact",`${esc($("#bPhone").value.trim())}<br>${esc($("#bEmail").value.trim())}<br><small>Prefers a ${esc(val("contact").toLowerCase())}</small>`,3]];
  if($("#bNervous").checked)rows.push(["Note","Feels nervous about dental visits",3]);
  if($("#bNote").value.trim())rows.push(["Message",esc($("#bNote").value.trim()),3]);
  $("#summary").innerHTML=rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd><button type="button" class="edit" data-goto="${r[2]}">Edit<span class="sr-only"> ${r[0]}</span></button></div>`).join("");
}
$("#summary").addEventListener("click",e=>{const b=e.target.closest("[data-goto]");if(b)showStep(+b.dataset.goto)});
$("#bkNext").addEventListener("click",()=>{
  if(step_===5){resetBooking();showStep(1);return}
  if(step_<4){if(!validate(step_))return;if(step_===3)summary();showStep(step_+1);return}
  const btn=$("#bkNext");btn.disabled=true;btn.innerHTML='<span class="spinner" aria-hidden="true"></span>Preparing preview';
  setTimeout(()=>{$("#doneH").textContent="Thank you, "+$("#bFirst").value.trim();clearFields();showStep(5)},700);
});
$("#bkForm").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.tagName==="INPUT"&&!["checkbox","radio"].includes(e.target.type)){e.preventDefault();$("#bkNext").click()}});
$("#bkForm").addEventListener("submit",e=>e.preventDefault());
$("#bkBack").addEventListener("click",()=>{if(step_===1||step_===5){$("#book").close();return}showStep(step_-1)});
function clearFields(){$("#bkForm").reset();txPick.value="";$("#txPickWrap").hidden=true;$("#urgentNote").hidden=true;$$("#bkForm .err").forEach(e=>e.textContent="");$$("#bkForm [aria-invalid]").forEach(e=>e.setAttribute("aria-invalid","false"));$("#summary").innerHTML="";buildDays()}
function resetBooking(){clearFields();showStep(1,false)}
function openBooking(pre,opener){
  resetBooking();
  if(pre){if(TX.find(t=>t.id===pre)){$('#reasons input[value="treatment"]').checked=true;$("#txPickWrap").hidden=false;txPick.value=pre}else if(MAP[pre])$(`#reasons input[value="${MAP[pre]}"]`).checked=true}
  openDlg($("#book"),opener);showStep(1);
}
buildDays();showStep(1,false);
})();
