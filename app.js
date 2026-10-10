(function(){
  // header
  const hdr=document.getElementById('hdr');
  const onScroll=()=>hdr.classList.toggle('solid',window.scrollY>40);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  document.getElementById('menuBtn').addEventListener('click',()=>hdr.classList.toggle('open'));
  document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>hdr.classList.remove('open')));

  // active nav
  const links=[...document.querySelectorAll('#nav a')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  const spy=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id));}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(s=>s&&spy.observe(s));

  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  // counters
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    const el=e.target,to=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),from=to>1000?to-20:0,t0=performance.now(),D=1600;
    const step=t=>{const p=Math.min(1,(t-t0)/D),k=1-Math.pow(1-p,3);el.textContent=(from+(to-from)*k).toFixed(dec);if(p<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  }),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  // tabs
  function tabs(btnSel,attr,prefix){
    const btns=document.querySelectorAll(btnSel);
    btns.forEach(b=>b.addEventListener('click',()=>{
      btns.forEach(x=>x.classList.toggle('on',x===b));
      document.querySelectorAll('[id^="'+prefix+'"]').forEach(p=>p.classList.toggle('on',p.id===prefix+b.dataset[attr]));
    }));
  }
  tabs('.biz-tabs button','biz','biz-');
  tabs('#siteNav button','site','site-');

  // patents
  const P=[
    ['이중파이프의 완충장치','2010.08.26','10-0979547'],
    ['연소장치용 냉각자켓','2014.02.13','10-1365277'],
    ['연소장치용 화격자','2013.12.19','10-1345425'],
    ['다중구조의 냉각재킷이 구비된 연소장치','2020.03.18','10-2093034'],
    ['파이프형 냉각재킷이 구비된 연소장치','2019.07.02','10-1997505'],
    ['스크러버가 구비된 연소장치','2019.04.01','10-1966290'],
    ['리볼버식 연속 열분해장치','2022.05.13','10-2399530'],
    ['연속식 열분해장치','2024.11.22','10-2735006'],
    ['응축수 왁스오일 연속식 분리장치 및 폐플라스틱 열분해 응축수·왁스오일 연속식 분리 시스템','2024.07.05','10-2683639'],
    ['폐기물 고형원료 보일러 청소장치','2023.12.22','20-2023-0002651',1],
    ['폐플라스틱 열분해 유화공정의 왁스오일 불순물 연속식 분리장치','2025.07.31','10-2842646'],
    ['열분해유내 염소 성분 제거를 위한 흡착제','2025.11.07','10-2884967'],
    ['열분해 반응로 내부 스크류와 로타리킬른 2중 구조를 갖는 폐스티로폼 연속유화장치','2025.10.27','10-2878688'],
    ['열분해 반응 가스 회수를 통한 폐스티로폼 연속유화장치의 에너지 절감 방법','2025.10.27','10-2878697'],
    ['도심형 이동식 스티로폼 감용 및 잉곳 재생 장치','2026.08.20','10-3009257'],
    ['폐플라스틱 연속식 열분해 공정에서 발생하는 재의 연속적 배출 방법','2025.11.13','10-2025-0171393',1],
  ];
  const tb=document.getElementById('ptBody');
  tb.innerHTML=P.map((p,i)=>`<tr class="${p[3]?'pend':''} ${i>=8?'hide':''}"><td>${String(i+1).padStart(2,'0')}</td><td>${p[0]}</td><td class="d">${p[1]}</td><td class="n">${p[2]}</td></tr>`).join('');
  const ptw=document.getElementById('ptw'),more=document.getElementById('ptMore');
  more.addEventListener('click',()=>{const o=ptw.classList.toggle('open');more.innerHTML=o?'접기 <span class="mono">−</span>':'전체 16건 보기 <span class="mono">+</span>'});
  const wall=document.getElementById('patWall');
  wall.innerHTML=[27,29,30,32,33,34,35,36,37,38,39,40,41,42,31,28].slice(0,16).map(n=>`<img src="img/pat-${n}.jpg" alt="특허증" data-lb="특허증" loading="lazy">`).join('');

  // strip
  const strip=document.getElementById('strip');
  const by=d=>strip.scrollBy({left:d*Math.min(576,strip.clientWidth*.85),behavior:'smooth'});
  document.getElementById('stripPrev').onclick=()=>by(-1);
  document.getElementById('stripNext').onclick=()=>by(1);
  let down=false,sx=0,sl=0;
  strip.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=strip.scrollLeft;strip.style.scrollSnapType='none'});
  window.addEventListener('pointermove',e=>{if(down)strip.scrollLeft=sl-(e.clientX-sx)});
  window.addEventListener('pointerup',()=>{if(down){down=false;strip.style.scrollSnapType=''}});

  // lightbox
  const lb=document.getElementById('lb'),lbi=lb.querySelector('img'),lbp=lb.querySelector('p');
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-lb]')||(e.target.closest('figure')&&e.target.closest('figure').querySelector('[data-lb]'));
    if(!t||e.target.closest('.strip'))return;
    lbi.src=t.src;lbp.textContent=t.dataset.lb;lb.classList.add('on');
  });
  lb.addEventListener('click',()=>lb.classList.remove('on'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

  // form
  document.getElementById('form').addEventListener('submit',e=>{e.preventDefault();document.getElementById('contactCard').classList.add('done')});
})();
