import * as THREE from 'three';

// The glass transmission pass cannot sample the photograph in the CSS layer.
// Supply the same screen-space plate to that pass while the marble is visible.
export function createTransmissionBackdrop(setting:string,width:number,height:number){
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
  const image=new Image();let ready=false;
  function resize(w:number,h:number){
    canvas.width=w;canvas.height=h;if(!ready)return;
    const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight);
    const iw=image.naturalWidth*scale,ih=image.naturalHeight*scale,x=(w-iw)/2,y=(h-ih)/2;
    const table=Math.max(0,Math.min(h,y+ih*.58));
    ctx.drawImage(image,x,y,iw,ih);
    ctx.save();ctx.translate(0,-h*.05+table);ctx.scale(1,1.55);ctx.translate(0,-table);
    ctx.beginPath();ctx.rect(0,table,w,h-table);ctx.clip();ctx.drawImage(image,x,y,iw,ih);ctx.restore();
    texture.needsUpdate=true;
  }
  image.onload=()=>{ready=true;resize(canvas.width,canvas.height);};
  function setSetting(next:string){ready=false;image.src=`/assets/sink-float/scenes/${next}.webp`;}
  setSetting(setting);resize(width,height);
  return {texture,get ready(){return ready;},resize,setSetting,dispose(){image.onload=null;texture.dispose();}};
}
