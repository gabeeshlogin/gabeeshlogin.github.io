(function(){
  var y=document.querySelector('.yr'); if(y) y.textContent=new Date().getFullYear();

  var burger=document.querySelector('.burger'), drawer=document.querySelector('.drawer');
  if(burger&&drawer){
    burger.addEventListener('click',function(){
      var open=drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded',open);
    });
    drawer.addEventListener('click',function(e){
      if(e.target.tagName==='A'){drawer.classList.remove('open');burger.setAttribute('aria-expanded','false');}
    });
  }

  var form=document.querySelector('.wa-form');
  if(!form) return;
  var dateInput=form.querySelector('[name=date]');
  var today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
  dateInput.min=today.toISOString().slice(0,10);

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var msg=form.querySelector('.form-msg');
    var name=form.name.value.trim(), date=form.date.value, time=form.time.value;
    if(!name||!date||!time){msg.textContent='Please add your name, a date and a time.';return;}
    var d=new Date(date+'T12:00:00');
    var nice=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    var size=form.querySelector('[name=size]:checked').value;
    var notes=form.notes.value.trim();
    var text="Hi La Famiglia, I'd like to book a table.\n\nName: "+name+"\nDate: "+nice+" at "+time+"\nPeople: "+size+(notes?"\nNotes: "+notes:"");
    msg.textContent='Opening WhatsApp...';
    window.open('https://wa.me/447916249066?text='+encodeURIComponent(text),'_blank');
  });
})();
