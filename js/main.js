/* Rudra Real Estate: frame sequences, header, menu and scroll story */
(function(){
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const conn=navigator.connection||{};
const lite=!!conn.saveData||/2g/.test(conn.effectiveType||'');
const mobile=innerWidth<768||lite;
const N={frames:mobile?33:66,bridges:mobile?27:54};
const url=(n,i)=>'assets/sequence/'+(mobile?'mobile/':'')+n+'/'+n+'-'+String(i+1).padStart(3,'0')+'.webp';
const mk=n=>Array.from({length:N[n]},()=>new Image());
const F=mk('frames'),B=mk('bridges');
const WIN={frames:[0,1],bridges:[0,1]};   /* full range, linear with scroll */   /* first visible frame .. last: skips the empty opening */

/* canvas */
function setup(c){
  const d=Math.min(devicePixelRatio||1,mobile?1.5:2),r=c.getBoundingClientRect();
  c.width=Math.max(1,Math.round(r.width*d));c.height=Math.max(1,Math.round(r.height*d));
  const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x,w:r.width,h:r.height};
}
const ok=im=>im&&im.complete&&im.naturalWidth>0;
function near(arr,i){
  const a=Math.min(arr.length-1,Math.max(0,i));
  for(let d=0;d<arr.length;d++)for(const j of [a-d,a+d]){if(ok(arr[j]))return arr[j]}
  return null;
}
function paint(S,img,zoom,cxf,al){
  if(!img)return;
  const {x,w,h}=S,r=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom,iw=img.naturalWidth*r,ih=img.naturalHeight*r;
  const x0=Math.min(0,Math.max(w-iw,cxf*w-.48*iw));
  x.imageSmoothingQuality='high';x.globalAlpha=al==null?1:al;x.drawImage(img,x0,(h-ih)/2,iw,ih);x.globalAlpha=1;
}
/* portrait phones: show the whole building instead of a huge centre crop */
const tmp=document.createElement('canvas');tmp.width=tmp.height=1;const tx=tmp.getContext('2d',{willReadFrequently:true});
function edge(img,top){
  const k=top?'_et':'_eb';if(img[k])return img[k];
  tx.clearRect(0,0,1,1);tx.drawImage(img,0,top?0:img.naturalHeight-4,img.naturalWidth,4,0,0,1,1);
  const d=tx.getImageData(0,0,1,1).data;return img[k]='rgb('+d[0]+','+d[1]+','+d[2]+')';
}
function paintFit(S,img,cy,al,sc){
  const {x,w,h}=S,r=w*(sc||2.1)/img.naturalWidth,iw=img.naturalWidth*r,ih=img.naturalHeight*r,y0=h*cy-ih/2;
  if(al==null){x.fillStyle=edge(img,true);x.fillRect(0,0,w,Math.max(0,y0)+1);x.fillStyle=edge(img,false);x.fillRect(0,y0+ih-1,w,h)}
  x.imageSmoothingQuality='high';x.globalAlpha=al==null?1:al;x.drawImage(img,w/2-.48*iw,y0,iw,ih);x.globalAlpha=1;
}
const fit=()=>!wide();
function pf(S,arr,f,useFit,cy){
  const i=Math.min(arr.length-1,Math.floor(f)),t=f-i;
  S.x.clearRect(0,0,S.w,S.h);
  const b=near(arr,i);if(useFit&&fit()){if(b)paintFit(S,b,cy);if(t>.02&&ok(arr[i+1]))paintFit(S,arr[i+1],cy,t);return}
  paint(S,b,1,.5);
  if(t>.02&&ok(arr[i+1]))paint(S,arr[i+1],1,.5,t);
}
const wide=()=>innerWidth>767;
const hero=document.getElementById('heroCv'),s1=document.getElementById('storyCv'),s2=document.getElementById('insideCv');
let H,A,C,fa=reduce?F.length-1:0,fb=reduce?Math.floor(B.length*.45):0,heroDone=false,rq=0;
function drawHero(){
  const img=F[F.length-1];if(!ok(img)||!H)return;
  H.x.clearRect(0,0,H.w,H.h);if(fit())paintFit(H,img,.88,null,1.7);else paint(H,img,1.2,.7);
  if(!heroDone){heroDone=true;hero.parentElement.classList.add('ready')}
}
function draw(){rq=0;drawHero();if(A)pf(A,F,fa,true,.4);if(C)pf(C,B,fb)}
function redraw(){if(!rq)rq=requestAnimationFrame(draw)}
function sizeAll(){H=setup(hero);A=setup(s1);C=setup(s2);redraw()}
let lw=0,lh=0;
sizeAll();lw=innerWidth;lh=innerHeight;
let rt;addEventListener('resize',()=>{
  /* ignore mobile URL-bar height jitter: only rebuild on real size changes */
  if(innerWidth===lw&&Math.abs(innerHeight-lh)<140)return;
  clearTimeout(rt);rt=setTimeout(()=>{lw=innerWidth;lh=innerHeight;sizeAll();window.ScrollTrigger&&ScrollTrigger.refresh()},150);
});

/* loading: hero frame first, then the rest in idle batches */
const heroImg=F[F.length-1];
heroImg.onload=()=>{redraw();start()};heroImg.src=url('frames',F.length-1);
let started=false;
function start(){
  if(started)return;started=true;
  if(reduce){const i=B[fb];i.onload=redraw;i.src=url('bridges',fb);return}   /* reduced motion: only the two stills */
  const q=[];F.forEach((im,i)=>{if(im!==heroImg)q.push([im,'frames',i])});B.forEach((im,i)=>q.push([im,'bridges',i]));
  const idle=window.requestIdleCallback||(f=>setTimeout(f,60));
  (function pump(){
    for(let k=0;k<8&&q.length;k++){const [im,n,i]=q.shift();im.onload=redraw;im.src=url(n,i)}
    if(q.length)idle(pump,{timeout:250});
  })();
}
setTimeout(start,2000);

/* header + menu */
const hdr=document.getElementById('hdr'),menu=document.getElementById('menu'),panel=document.getElementById('panel');
const inertEls=[document.getElementById('main'),document.querySelector('footer')];
const onScroll=()=>hdr.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(o){
  panel.classList.toggle('open',o);menu.setAttribute('aria-expanded',o);menu.setAttribute('aria-label',o?'Close menu':'Open menu');
  document.body.style.overflow=o?'hidden':'';inertEls.forEach(e=>e&&(e.inert=o));
  if(o){hdr.classList.remove('hide');const a=panel.querySelector('a');a&&setTimeout(()=>a.focus(),50)}
}
menu.addEventListener('click',()=>setMenu(!panel.classList.contains('open')));
panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open')){setMenu(false);menu.focus()}});

/* scroll story: eased playhead, frames remapped past the empty opening */
const T={story:{t:0,c:0},inside:{t:0,c:0}};
const remap=(p,a,b)=>{if(a===0&&b===1)return p;const s=.06;return p<s?a*(p/s):p>1-s?b+(1-b)*((p-(1-s))/s):a+(b-a)*((p-s)/(1-2*s))};
function bind(id,bar){
  const el=document.getElementById(id),caps=[...el.querySelectorAll('.cap-i')],b=document.getElementById(bar);
  ScrollTrigger.create({trigger:el,start:'top top',end:'bottom bottom',onUpdate:s=>{
    const p=s.progress;T[id].t=p;
    const i=Math.min(caps.length-1,Math.floor(p*caps.length));
    caps.forEach((c,k)=>c.classList.toggle('on',k===i));b.style.transform='scaleX('+p+')';
  }});
}
const play=[['story',F,'frames',v=>fa=v],['inside',B,'bridges',v=>fb=v]];
(function loop(){
  if(!document.hidden){
    let d=false;
    for(const [id,arr,n,set] of play){
      const o=T[id],g=o.t-o.c;
      if(Math.abs(g)>.0002){o.c+=g*.14;set(remap(o.c,WIN[n][0],WIN[n][1])*(arr.length-1));d=true}
    }
    if(d)redraw();
  }
  requestAnimationFrame(loop);
})();

if(window.gsap&&window.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  gsap.fromTo('.h-in',{y:28,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',stagger:.12,delay:.1});
  gsap.from('.ln>span',{yPercent:110,duration:1,ease:'power3.out',stagger:.14,scrollTrigger:{trigger:'#problem',start:'top 65%'}});
  bind('story','progBar');bind('inside','progBar2');
  if(wide())gsap.from('.mod',{y:40,opacity:0,duration:.9,ease:'power3.out',stagger:.1,scrollTrigger:{trigger:'.mods',start:'top 80%'}});
  gsap.from('.val',{y:24,opacity:0,duration:.8,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:'.vals',start:'top 85%'}});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
}else{root.classList.remove('js')}
})();
