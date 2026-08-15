
const colors=['#7969b0','#62beb8','#ff8175','#f5bd3f','#d77a9b','#59b996','#8cb7ef','#ffb98f'];let current=colors[0];
const sw=document.querySelector('#swatches'),svg=document.querySelector('#mermaid'),finish=document.querySelector('#finishCard');
colors.forEach((c,i)=>{const b=document.createElement('button');b.className='swatch'+(i===0?' active':'');b.style.background=c;b.dataset.c=c;sw.appendChild(b)});
sw.onclick=e=>{const b=e.target.closest('.swatch');if(!b)return;current=b.dataset.c;document.querySelectorAll('.swatch').forEach(x=>x.classList.toggle('active',x===b))}
svg.addEventListener('click',e=>{const p=e.target.closest('.fillable');if(!p)return;p.setAttribute('fill',current)});
document.querySelector('#reset').onclick=()=>{svg.querySelectorAll('.fillable').forEach(x=>x.setAttribute('fill','#ffffff'));finish.classList.remove('show')};
document.querySelector('#finish').onclick=()=>{finish.classList.add('show');Site.win('Русалка раскрашена! ✦')};
document.querySelector('#save').onclick=()=>{const clone=svg.cloneNode(true);clone.removeAttribute('class');const data=new XMLSerializer().serializeToString(clone);const blob=new Blob([data],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=1040;c.height=1240;const x=c.getContext('2d');x.fillStyle='#eefbf9';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(async b=>{const file=new File([b],'moya-rusalka.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Моя русалка'})}else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='moya-rusalka.png';a.click()}}catch(e){}})};img.src=url};
