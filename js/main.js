/* Rudra Real Estate: frame sequences, header, menu and scroll story */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mk=(n,c)=>Array.from({length:c},(_,i)=>{const im=new Image();im.decoding='async';im.src='assets/sequence/'+n+'/'+n+'-'+String(i+1).padStart(3,'0')+'.webp';return im});
const F=mk('frames',66),B=mk('bridges',54);
function setup(c){const d=Math.min(devicePixelRatio||1,2),r=c.getBoundingClientRect();c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x,w:r.width,h:r.height}}
function paint(S,img,zoom,cxf,al){
  if(!img||!img.complete||!img.naturalWidth)return;
  const {x,w,h}=S,r=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom,iw=img.naturalWidth*r,ih=img.naturalHeight*r;
  const x0=Math.min(0,Math.max(w-iw,cxf*w-.48*iw));
  x.imageSmoothingQuality='high';x.globalAlpha=al==null?1:al;x.drawImage(img,x0,(h-ih)/2,iw,ih);x.globalAlpha=1;
}
function pf(S,arr,f){const i=Math.min(arr.length-1,Math.floor(f)),t=f-i;paint(S,arr[i],1,.5);if(t>.02&&arr[i+1])paint(S,arr[i+1],1,.5,t)}
const wide=()=>innerWidth>767;
const hero=document.getElementById('heroCv'),s1=document.getElementById('storyCv'),s2=document.getElementById('insideCv');
let H,A,C,fa=F.length-1,fb=0;
const zoomH=()=>wide()?1.2:1,cxH=()=>wide()?.7:.5;
function redraw(){paint(H,F[F.length-1],zoomH(),cxH());pf(A,F,fa);pf(C,B,fb)}
function sizeAll(){H=setup(hero);A=setup(s1);C=setup(s2);redraw()}
sizeAll();
F[F.length-1].onload=()=>paint(H,F[F.length-1],zoomH(),cxH());
F.concat(B).forEach(i=>i.onload=redraw);
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{sizeAll();window.ScrollTrigger&&ScrollTrigger.refresh()},150)});

const hdr=document.getElementById('hdr'),menu=document.getElementById('menu'),panel=document.getElementById('panel');
const onScroll=()=>hdr.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(o){panel.classList.toggle('open',o);menu.setAttribute('aria-expanded',o);menu.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.style.overflow=o?'hidden':''}
menu.addEventListener('click',()=>setMenu(!panel.classList.contains('open')));
panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

const T={story:{t:0,c:0},inside:{t:0,c:0}};
function bind(id,frames,bar,set){
  const root=document.getElementById(id),caps=[...root.querySelectorAll('.cap-i')],b=document.getElementById(bar);
  ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',onUpdate:s=>{
    const p=s.progress;T[id].t=p;
    const i=Math.min(caps.length-1,Math.floor(p*caps.length));
    caps.forEach((c,k)=>c.classList.toggle('on',k===i));b.style.width=p*100+'%';
  }});
}
(function loop(){
  let d=false;
  for(const [id,arr,set] of [['story',F,v=>fa=v],['inside',B,v=>fb=v]]){
    const o=T[id],g=o.t-o.c;
    if(Math.abs(g)>.0002){o.c+=g*.14;set(o.c*(arr.length-1));d=true}
  }
  if(d)redraw();
  requestAnimationFrame(loop);
})();
if(window.gsap&&window.ScrollTrigger&&!reduce){
  gsap.registerPlugin(ScrollTrigger);
  fa=0;fb=0;redraw();
  gsap.from('.h-in',{y:28,opacity:0,duration:1,ease:'power3.out',stagger:.12,delay:.15});
  gsap.from('.ln>span',{yPercent:110,duration:1,ease:'power3.out',stagger:.14,scrollTrigger:{trigger:'#problem',start:'top 65%'}});
  bind('story',F,'progBar');
  bind('inside',B,'progBar2');
  if(wide())gsap.from('.mod',{y:40,opacity:0,duration:.9,ease:'power3.out',stagger:.1,scrollTrigger:{trigger:'.mods',start:'top 80%'}});
  gsap.from('.val',{y:24,opacity:0,duration:.8,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:'.vals',start:'top 85%'}});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
}else{fb=Math.floor(B.length*.45);redraw()}
})();
