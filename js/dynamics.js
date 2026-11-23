/* Cursor, parallax, magnetic buttons, marquee and scroll effects */
(function(){
if(!window.gsap||!window.ScrollTrigger||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches,q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
/* progress bar */
const sp=document.createElement('div');sp.id='sp';document.body.appendChild(sp);
const spx=gsap.quickSetter(sp,'scaleX');
/* header hide/show */
const hdr=q('#hdr');let last=0;
/* velocity skew + marquee */
const skewEls=qa('.mods,.stats'),sk=skewEls.map(e=>gsap.quickSetter(e,'skewY','deg'));
const mt=gsap.to('.mt',{xPercent:-50,repeat:-1,duration:28,ease:'none'});
let sv=0;
ScrollTrigger.create({onUpdate:s=>{
  spx(s.progress);
  const y=scrollY;if(y>240&&y>last+4)hdr.classList.add('hide');else if(y<last-4||y<240)hdr.classList.remove('hide');last=y;
  const v=gsap.utils.clamp(-2.2,2.2,s.getVelocity()/-400);
  if(Math.abs(v)>Math.abs(sv))sv=v;
  mt.timeScale(1+Math.abs(s.getVelocity())/350*(s.direction>0?1:-1));
}});
gsap.ticker.add(()=>{sv*=.9;sk.forEach(f=>f(sv));if(Math.abs(sv)<.01)sv=0;mt.timeScale(gsap.utils.interpolate(mt.timeScale(),mt.timeScale()>0?1:-1,.06))});
/* hero scroll parallax */
gsap.to('#heroCv',{yPercent:14,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero .wrap',{y:-70,opacity:.15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 20%',scrub:true}});
['#storyCv','#insideCv'].forEach(id=>gsap.fromTo(id,{scale:1.1},{scale:1,ease:'none',scrollTrigger:{trigger:id.replace('Cv',''),start:'top bottom',end:'top top',scrub:true}}));
/* word reveals */
qa('.modules h2,.value h2,.final h2').forEach(h=>{
  h.innerHTML=h.textContent.trim().split(/\s+/).map(w=>'<span class="w"><span>'+w+'</span></span>').join(' ');
  gsap.from(h.querySelectorAll('.w>span'),{yPercent:115,duration:.9,ease:'power3.out',stagger:.05,scrollTrigger:{trigger:h,start:'top 85%'}});
});
/* section curtain */
['.modules','.value','.final'].forEach(s=>gsap.fromTo(s,{clipPath:'inset(6% 4% 0% 4% round 32px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:s,start:'top 100%',end:'top 55%',scrub:true}}));
/* count-up */
qa('.stats b').forEach(b=>{
  const m=b.textContent.match(/(\d+)(.*)/);if(!m)return;const o={n:0},end=+m[1];
  ScrollTrigger.create({trigger:b,start:'top 90%',once:true,onEnter:()=>gsap.to(o,{n:end,duration:1.8,ease:'power2.out',onUpdate:()=>b.textContent=Math.round(o.n)+m[2]})});
});
gsap.from('.stats>div',{y:30,opacity:0,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.stats',start:'top 85%'}});
if(!fine)return;
document.body.classList.add('fine');
/* cursor */
const dot=document.createElement('div'),ring=document.createElement('div');dot.className='cur';ring.className='cur-r';document.body.append(dot,ring);
const dx=gsap.quickTo(dot,'x',{duration:.08}),dy=gsap.quickTo(dot,'y',{duration:.08}),rx=gsap.quickTo(ring,'x',{duration:.45,ease:'power3'}),ry=gsap.quickTo(ring,'y',{duration:.45,ease:'power3'});
const hx=gsap.quickTo('.hero .wrap','x',{duration:1,ease:'power3'}),hy=gsap.quickTo('.hero .wrap','y',{duration:1,ease:'power3'}),cx=gsap.quickTo('#heroCv','x',{duration:1.2,ease:'power3'}),cy=gsap.quickTo('#heroCv','y',{duration:1.2,ease:'power3'});
const glow=document.createElement('div');glow.className='glow';q('.hero').appendChild(glow);
const gx=gsap.quickTo(glow,'x',{duration:.6,ease:'power3'}),gy=gsap.quickTo(glow,'y',{duration:.6,ease:'power3'});
let shown=false;
addEventListener('mousemove',e=>{
  if(!shown){shown=true;gsap.to([dot,ring],{opacity:1,duration:.3})}
  dx(e.clientX);dy(e.clientY);rx(e.clientX);ry(e.clientY);
  const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
  cx(-nx*34);cy(-ny*24);hx(nx*14);hy(ny*10);
  const r=q('.hero').getBoundingClientRect();gx(e.clientX-r.left);gy(e.clientY-r.top);
});
document.addEventListener('mouseleave',()=>gsap.to([dot,ring],{opacity:0,duration:.2}));
document.addEventListener('mouseenter',()=>shown&&gsap.to([dot,ring],{opacity:1,duration:.2}));
document.addEventListener('mouseover',e=>{const t=e.target.closest('a,button,.mod');ring.classList.toggle('act',!!t);const c=e.target.closest('canvas');ring.classList.toggle('drag',!!c&&!t)});
/* magnetic buttons */
qa('.btn,.logo').forEach(b=>{
  const x=gsap.quickTo(b,'x',{duration:.5,ease:'elastic.out(1,.6)'}),y=gsap.quickTo(b,'y',{duration:.5,ease:'elastic.out(1,.6)'});
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.28);y((e.clientY-r.top-r.height/2)*.4)});
  b.addEventListener('mouseleave',()=>{x(0);y(0)});
});
/* spotlight + tilt */
qa('.mod,.stats').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',px*100+'%');c.style.setProperty('--my',py*100+'%');
    if(c.classList.contains('mod'))gsap.to(c,{rotateY:(px-.5)*8,rotateX:-(py-.5)*8,transformPerspective:900,duration:.4,ease:'power2.out'});
  });
  c.addEventListener('mouseleave',()=>gsap.to(c,{rotateX:0,rotateY:0,duration:.6,ease:'power3.out'}));
});
})();
