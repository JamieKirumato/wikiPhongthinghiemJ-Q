import {TankObject} from './types';

export interface ViewRect {left:number;top:number;right:number;bottom:number}
export interface CameraPresentation {mode:'overview'|'follow'|'near'|'replay';canReplay:boolean;canNear:boolean;busy:boolean}
export interface ObservationFocus {itemId:string;itemIds?:string[];expiresAt:number;kind:'drop'|'near'|'replay';settledAt?:number}
export interface RecordedPose {t:number;x:number;y:number;z:number;angle:number;qx:number;qy:number;qz:number;qw:number;settled:boolean;status:TankObject['status']}
export interface DropRecording {item:TankObject;water:number;poses:RecordedPose[];startedAt:number;complete:boolean}

/** Largest unobscured rectangle, in canvas pixels. Off-canvas UI subtracts nothing. */
export function usableCameraRect(canvas:ViewRect,viewport:ViewRect,occluders:ViewRect[]):ViewRect|null {
  let area={left:Math.max(canvas.left,viewport.left),top:Math.max(canvas.top,viewport.top),right:Math.min(canvas.right,viewport.right),bottom:Math.min(canvas.bottom,viewport.bottom)};
  for(const box of occluders){
    const cut={left:Math.max(area.left,box.left-8),top:Math.max(area.top,box.top-8),right:Math.min(area.right,box.right+8),bottom:Math.min(area.bottom,box.bottom+8)};
    if(cut.right<=cut.left||cut.bottom<=cut.top)continue;
    const choices=[{...area,bottom:cut.top},{...area,top:cut.bottom},{...area,right:cut.left},{...area,left:cut.right}];
    area=choices.reduce((best,next)=>(next.right-next.left)*(next.bottom-next.top)>(best.right-best.left)*(best.bottom-best.top)?next:best);
  }
  if(area.right-area.left<80||area.bottom-area.top<80)return null;
  return {left:area.left-canvas.left,top:area.top-canvas.top,right:area.right-canvas.left,bottom:area.bottom-canvas.top};
}

/** Frame the actual pose and a patch of the actual surface, never a predicted outcome. */
export function observationContext(point:{x:number;y:number;z:number},radius:number,water:number,bed:number) {
  const margin=radius+.18,patch=Math.max(.65,radius*1.2);
  const bounds={minX:point.x-Math.max(margin,patch),maxX:point.x+Math.max(margin,patch),minZ:point.z-Math.max(margin,patch),maxZ:point.z+Math.max(margin,patch),minY:Math.min(point.y-margin,water-.08),maxY:Math.max(point.y+margin,water+.12)};
  if(point.y-radius<bed+.25)bounds.minY=Math.min(bounds.minY,bed-.1);
  return {bounds,target:{x:point.x,y:(point.y*2+water)/3,z:point.z}};
}

/** Resolve exact members from live state; removed or returned objects cannot widen the frame. */
export function observationGroupItems(focus:ObservationFocus,items:readonly TankObject[]) {
  const ids=new Set(focus.itemIds??[focus.itemId]);
  return items.filter(item=>ids.has(item.id)&&item.inTank&&!item.outsideTank);
}

/** Union actual object extents and their water references, without predicting any outcome. */
export function observationGroupContext(points:readonly {x:number;y:number;z:number;radius:number}[],water:number,bed:number) {
  if(!points.length)return null;
  const contexts=points.map(point=>observationContext(point,point.radius,water,bed));
  if(contexts.length===1)return contexts[0];
  const bounds={...contexts[0].bounds};
  for(const context of contexts.slice(1)){
    bounds.minX=Math.min(bounds.minX,context.bounds.minX);bounds.maxX=Math.max(bounds.maxX,context.bounds.maxX);
    bounds.minY=Math.min(bounds.minY,context.bounds.minY);bounds.maxY=Math.max(bounds.maxY,context.bounds.maxY);
    bounds.minZ=Math.min(bounds.minZ,context.bounds.minZ);bounds.maxZ=Math.max(bounds.maxZ,context.bounds.maxZ);
  }
  return {bounds,target:{x:(bounds.minX+bounds.maxX)/2,y:(bounds.minY+bounds.maxY)/2,z:(bounds.minZ+bounds.maxZ)/2}};
}

/** Fit context corners in the safe portion of a 40-degree camera frustum. */
export function contextCameraDistance(base:number,aspect:number,yaw:number,pitch:number,target:{x:number;y:number;z:number},bounds:ReturnType<typeof observationContext>['bounds'],safe:ViewRect,width:number,height:number) {
  const tanV=Math.tan(Math.PI/9)*(safe.bottom-safe.top)/height*.9;
  const tanH=Math.tan(Math.PI/9)*aspect*(safe.right-safe.left)/width*.9;
  let distance=base*.33;
  for(const worldX of [bounds.minX,bounds.maxX])for(const worldY of [bounds.minY,bounds.maxY])for(const worldZ of [bounds.minZ,bounds.maxZ]){
    const x=worldX-target.x,y=worldY-target.y,z=worldZ-target.z;
    const horizontal=x*Math.cos(yaw)-z*Math.sin(yaw);
    const vertical=-x*Math.sin(yaw)*Math.sin(pitch)+y*Math.cos(pitch)-z*Math.cos(yaw)*Math.sin(pitch);
    const depth=x*Math.sin(yaw)*Math.cos(pitch)+y*Math.sin(pitch)+z*Math.cos(yaw)*Math.cos(pitch);
    distance=Math.max(distance,depth+Math.abs(horizontal)/tanH,depth+Math.abs(vertical)/tanV);
  }
  return distance;
}

export function recordPose(record:DropRecording,pose:RecordedPose) {
  if(record.complete)return;
  const last=record.poses[record.poses.length-1];
  if(!last||pose.t-last.t>=1/60||pose.settled)record.poses.push({...pose});
  if(pose.settled||record.poses.length>=1200||pose.t>=24)record.complete=true;
}

/** Returns a visual pose only; playback never writes to the physics objects. */
export function replayPose(record:DropRecording,time:number):RecordedPose|null {
  const poses=record.poses;if(!poses.length)return null;
  if(time<=poses[0].t)return {...poses[0]};
  const index=poses.findIndex(pose=>pose.t>=time);
  if(index<0)return {...poses[poses.length-1]};
  const a=poses[Math.max(0,index-1)],b=poses[index],blend=(time-a.t)/Math.max(.00001,b.t-a.t);
  return {...a,t:time,x:a.x+(b.x-a.x)*blend,y:a.y+(b.y-a.y)*blend,z:a.z+(b.z-a.z)*blend,angle:a.angle+(b.angle-a.angle)*blend,
    qx:a.qx+(b.qx-a.qx)*blend,qy:a.qy+(b.qy-a.qy)*blend,qz:a.qz+(b.qz-a.qz)*blend,qw:a.qw+(b.qw-a.qw)*blend};
}
