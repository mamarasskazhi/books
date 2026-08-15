
const beadTypes=['pearl','coral','star','shell','drop','spiral','flower','diamond','heart','dot'];
function beadSVG(type){
 const base='viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"';
 const m={
 pearl:`<svg ${base}><circle cx="50" cy="50" r="31" fill="#fff0c7" stroke="#e6b75c" stroke-width="6"/><circle cx="40" cy="39" r="10" fill="#fff" opacity=".75"/></svg>`,
 coral:`<svg ${base}><path d="M48 80V26m0 18L29 31m19 20 22-27M47 61l-24 10m25-3 22 10" fill="none" stroke="#ff8175" stroke-width="13" stroke-linecap="round"/></svg>`,
 star:`<svg ${base}><path d="M50 15l10 23 25 2-19 17 6 25-22-13-22 13 6-25-19-17 25-2z" fill="#f5bd3f" stroke="#d79f31" stroke-width="5" stroke-linejoin="round"/></svg>`,
 shell:`<svg ${base}><path d="M17 69c0-39 66-39 66 0z" fill="#ffe9d7" stroke="#df9f86" stroke-width="5"/><path d="M30 67L40 35m7 32 3-36m13 36-3-31m14 31-10-28" stroke="#df9f86" stroke-width="4" stroke-linecap="round"/></svg>`,
 drop:`<svg ${base}><path d="M50 14C37 35 25 47 25 62a25 25 0 0050 0c0-15-12-27-25-48z" fill="#63c3c5" stroke="#3b9fa6" stroke-width="5"/></svg>`,
 spiral:`<svg ${base}><circle cx="50" cy="50" r="34" fill="#d4c8fa" stroke="#7969b0" stroke-width="5"/><path d="M65 57c-7 13-29 10-29-6 0-13 17-19 26-9 11 13 3 32-14 37" fill="none" stroke="#7969b0" stroke-width="6" stroke-linecap="round"/></svg>`,
 flower:`<svg ${base}><g fill="#ffb2a7" stroke="#df746a" stroke-width="4"><circle cx="50" cy="29" r="16"/><circle cx="71" cy="47" r="16"/><circle cx="63" cy="72" r="16"/><circle cx="37" cy="72" r="16"/><circle cx="29" cy="47" r="16"/></g><circle cx="50" cy="52" r="15" fill="#f5bd3f"/></svg>`,
 diamond:`<svg ${base}><path d="M50 14L83 50 50 86 17 50z" fill="#83d6cc" stroke="#3daaa7" stroke-width="5"/></svg>`,
 heart:`<svg ${base}><path d="M50 82C21 62 17 43 29 31c9-9 20-6 27 3 8-9 20-12 29-2 12 13 6 31-35 50z" fill="#ff8d93" stroke="#dc686f" stroke-width="5"/></svg>`,
 dot:`<svg ${base}><circle cx="50" cy="50" r="29" fill="#24427b"/><circle cx="41" cy="39" r="8" fill="#4c69a0"/></svg>`
 };return m[type]||m.dot;
}

const palette=document.querySelector('#palette'),stage=document.querySelector('#stage');
const items=[],history=[];let drag=null,suppressClick=false;
beadTypes.forEach(t=>{const b=document.createElement('button');b.className='bead-button';b.dataset.type=t;b.innerHTML=beadSVG(t);palette.appendChild(b)});
function snap(){history.push(JSON.stringify(items));if(history.length>30)history.shift()}
function render(){stage.querySelectorAll('.placed').forEach(x=>x.remove());items.forEach(it=>{const d=document.createElement('div');d.className='placed';d.dataset.id=it.id;d.style.left=it.x*100+'%';d.style.top=it.y*100+'%';d.style.transform=`translate(-50%,-50%) rotate(${it.r}deg)`;d.innerHTML=beadSVG(it.type);stage.appendChild(d)})}
function add(type,x=.5,y=.62){snap();items.push({id:String(Date.now()+Math.random()),type,x,y,r:Math.random()*18-9});render()}
palette.addEventListener('click',e=>{const b=e.target.closest('.bead-button');if(!b)return;if(suppressClick){suppressClick=false;return}add(b.dataset.type,.36+Math.random()*.28,.54+Math.random()*.22)});
palette.addEventListener('pointerdown',e=>{const b=e.target.closest('.bead-button');if(!b)return;e.preventDefault();drag={newOne:true,type:b.dataset.type}});
stage.addEventListener('pointerdown',e=>{const p=e.target.closest('.placed');if(!p)return;e.preventDefault();snap();drag={newOne:false,id:p.dataset.id}});
function pos(e){const r=stage.getBoundingClientRect();return{x:Math.max(.04,Math.min(.96,(e.clientX-r.left)/r.width)),y:Math.max(.05,Math.min(.95,(e.clientY-r.top)/r.height)),inside:e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}}
window.addEventListener('pointermove',e=>{if(!drag||drag.newOne)return;const it=items.find(x=>x.id===drag.id);if(!it)return;const p=pos(e);it.x=p.x;it.y=p.y;render()});
window.addEventListener('pointerup',e=>{if(!drag)return;const p=pos(e);if(drag.newOne&&p.inside){add(drag.type,p.x,p.y);suppressClick=true;setTimeout(()=>suppressClick=false,350)}drag=null});
stage.addEventListener('dblclick',e=>{const p=e.target.closest('.placed');if(!p)return;snap();const i=items.findIndex(x=>x.id===p.dataset.id);if(i>=0)items.splice(i,1);render()});
document.querySelector('#undo').onclick=()=>{if(!history.length)return Site.toast('Нечего отменять');const prev=JSON.parse(history.pop());items.splice(0,items.length,...prev);render()};
document.querySelector('#clear').onclick=()=>{if(!items.length)return;snap();items.length=0;render();document.querySelector('#finishCard').classList.remove('show')};
document.querySelector('#finish').onclick=()=>{if(items.length<3)return Site.toast('Добавь хотя бы 3 украшения');document.querySelector('#finishCard').classList.add('show');Site.win('Ожерелье готово! ✦')};
function drawSimple(ctx,type,x,y){ctx.save();ctx.translate(x,y);ctx.lineWidth=6;ctx.lineJoin='round';ctx.lineCap='round';if(type==='pearl'){ctx.fillStyle='#fff0c7';ctx.strokeStyle='#e6b75c';ctx.beginPath();ctx.arc(0,0,30,0,Math.PI*2);ctx.fill();ctx.stroke()}else if(type==='star'){ctx.fillStyle='#f5bd3f';ctx.strokeStyle='#d79f31';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?14:31,px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.fill();ctx.stroke()}else if(type==='heart'){ctx.fillStyle='#ff8d93';ctx.strokeStyle='#dc686f';ctx.beginPath();ctx.moveTo(0,28);ctx.bezierCurveTo(-36,6,-34,-17,-15,-20);ctx.bezierCurveTo(-4,-22,0,-12,0,-6);ctx.bezierCurveTo(8,-18,21,-22,29,-12);ctx.bezierCurveTo(42,4,22,19,0,28);ctx.fill();ctx.stroke()}else{ctx.fillStyle={coral:'#ff8175',shell:'#ffe9d7',drop:'#63c3c5',spiral:'#d4c8fa',flower:'#ffb2a7',diamond:'#83d6cc',dot:'#24427b'}[type]||'#9fddd6';ctx.strokeStyle='#14264f';ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.restore()}
document.querySelector('#save').onclick=()=>{const c=document.createElement('canvas');c.width=1000;c.height=1000;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,1000);g.addColorStop(0,'#f4fffd');g.addColorStop(1,'#b7e3da');x.fillStyle=g;x.fillRect(0,0,1000,1000);x.fillStyle='#14264f';x.font='700 48px sans-serif';x.fillText('Моё ожерелье',70,90);x.strokeStyle='#d9a94c';x.lineWidth=12;x.beginPath();x.moveTo(220,300);x.bezierCurveTo(260,740,740,740,780,300);x.stroke();items.forEach(it=>drawSimple(x,it.type,90+it.x*820,180+it.y*650));c.toBlob(async blob=>{const file=new File([blob],'moe-ozherelie.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Моё ожерелье'})}else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='moe-ozherelie.png';a.click()}}catch(e){}})}
