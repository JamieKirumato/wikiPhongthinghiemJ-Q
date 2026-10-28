const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript'),THREE=require('three');
function load(path){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports});return module.exports;}
const observation=load('src/components/preschool/sink-float/cameraObservation.ts');
const framing=load('src/components/preschool/sink-float/cameraFraming.ts');
const canvas={left:10,top:100,right:400,bottom:700};
const safe=observation.usableCameraRect(canvas,{left:0,top:0,right:390,bottom:844},[
 {left:0,top:0,right:390,bottom:90}, // Header already outside the canvas.
 {left:15,top:115,right:385,bottom:190},
 {left:10,top:710,right:390,bottom:840}, // Dock below the canvas.
 {left:20,top:630,right:380,bottom:690}
]);
assert.ok(safe.left>=0&&safe.right<=380&&safe.top>=98&&safe.bottom<=522);
assert.equal(observation.usableCameraRect(canvas,{left:0,top:0,right:390,bottom:844},[{...canvas}]),null);
console.log('Passed: usable framing subtracts intersecting overlays and viewport clipping, without double-subtracting header/dock.');
for(const [width,height] of [[920,620],[370,470],[390,610],[700,350]]){
 const dims={width:9.6,height:4.8,depth:4.6,waterHeight:2.5},aspect=width/height;
 for(const yaw of [-1.4,.12,2.4])for(const pitch of [.08,.7,1.4]){
 const safe={left:12,top:105,right:width-12,bottom:height-82};
 for(const radius of [.2,.55,1.32])for(const point of [{x:2,y:6,z:1},{x:-2,y:2.5,z:-1},{x:1,y:.41+radius,z:.7}]){
  const context=observation.observationContext(point,radius,2.5,.41);
  const distance=observation.contextCameraDistance(framing.tankOrbitDistance(dims,aspect,pitch),aspect,yaw,pitch,context.target,context.bounds,safe,width,height);
  const camera=new THREE.PerspectiveCamera(40,aspect,.1,100);
  camera.position.set(context.target.x+distance*Math.sin(yaw)*Math.cos(pitch),context.target.y+distance*Math.sin(pitch),context.target.z+distance*Math.cos(yaw)*Math.cos(pitch));
  camera.lookAt(context.target.x,context.target.y,context.target.z);
  camera.setViewOffset(width,height,width/2-(safe.left+safe.right)/2,height/2-(safe.top+safe.bottom)/2,width,height);camera.updateMatrixWorld();
  for(const x of [context.bounds.minX,context.bounds.maxX])for(const y of [context.bounds.minY,context.bounds.maxY])for(const z of [context.bounds.minZ,context.bounds.maxZ]){
   const projected=new THREE.Vector3(x,y,z).project(camera),px=(projected.x+1)*width/2,py=(1-projected.y)*height/2;
   assert.ok(px>=safe.left-.01&&px<=safe.right+.01&&py>=safe.top-.01&&py<=safe.bottom+.01,`context clipped at ${width}x${height}`);
  }
 }
}
}
console.log('Passed: complete object and real water reference fit in safe desktop/portrait frames at entry, descent and rest, including large objects.');
const members=[
 {id:'egg',inTank:true,x:-3.2,y:.83,z:1.3,radius:.42},
 {id:'ball',inTank:true,x:3.1,y:3.3,z:-1.2,radius:1.32},
 {id:'stone',inTank:true,x:.4,y:5.8,z:.7,radius:.3},
 {id:'returned',inTank:false}, {id:'outside',inTank:true,outsideTank:true}
];
const groupFocus={itemId:'stone',itemIds:['egg','ball','stone','returned','outside','missing'],kind:'drop',expiresAt:999};
const snapshot=JSON.stringify(members);
assert.deepEqual(Array.from(observation.observationGroupItems(groupFocus,members),item=>item.id),['egg','ball','stone']);
assert.deepEqual(Array.from(observation.observationGroupItems(groupFocus,members.filter(item=>item.id!=='stone')),item=>item.id),['egg','ball']);
assert.equal(observation.observationGroupContext([],2.5,.41),null);
assert.equal(JSON.stringify(observation.observationGroupContext([members[0]],2.5,.41)),JSON.stringify(observation.observationContext(members[0],members[0].radius,2.5,.41)));
for(const [width,height] of [[942,534],[370,493],[700,350]]){
 const aspect=width/height,safe={left:10,top:104,right:width-10,bottom:height-74};
 for(const yaw of [-1.4,.12,2.4])for(const pitch of [.08,.7,1.4]){
  const context=observation.observationGroupContext(members.slice(0,3),2.5,.41);
  const distance=observation.contextCameraDistance(18,aspect,yaw,pitch,context.target,context.bounds,safe,width,height);
  const camera=new THREE.PerspectiveCamera(40,aspect,.1,100);
  camera.position.set(context.target.x+distance*Math.sin(yaw)*Math.cos(pitch),context.target.y+distance*Math.sin(pitch),context.target.z+distance*Math.cos(yaw)*Math.cos(pitch));
  camera.lookAt(context.target.x,context.target.y,context.target.z);
  camera.setViewOffset(width,height,width/2-(safe.left+safe.right)/2,height/2-(safe.top+safe.bottom)/2,width,height);camera.updateMatrixWorld();
  for(const item of members.slice(0,3)){
   const bounds=observation.observationContext(item,item.radius,2.5,.41).bounds;
   for(const x of [bounds.minX,bounds.maxX])for(const y of [bounds.minY,bounds.maxY])for(const z of [bounds.minZ,bounds.maxZ]){
    const point=new THREE.Vector3(x,y,z).project(camera),px=(point.x+1)*width/2,py=(1-point.y)*height/2;
    assert.ok(px>=safe.left-.01&&px<=safe.right+.01&&py>=safe.top-.01&&py<=safe.bottom+.01,`group clips ${item.id} at ${width}x${height}`);
   }
  }
 }
}
assert.equal(JSON.stringify(members),snapshot,'group framing must not modify physical objects');
console.log('Passed: mixed sinking/floating/airborne groups fit desktop and portrait safe frames, ignore removed objects, and leave physics untouched.');
const record={item:{id:'exact-drop-id'},water:2.5,startedAt:0,complete:false,poses:[]};
for(let n=0;n<=60;n++)observation.recordPose(record,{t:n/60,x:n/60,y:6-n/12,z:-n/100,angle:n,qx:0,qy:0,qz:0,qw:1,status:n<30?'falling':'sunk',settled:n===60});
const before=JSON.stringify(record);
const played=observation.replayPose(record,.5);
assert.ok(Math.abs(played.x-.5)<.0001);assert.ok(Math.abs(played.y-3.5)<.0001);
played.x=100;
assert.equal(JSON.stringify(record),before,'playback must not mutate recorded poses or the source item');
assert.equal(record.item.id,'exact-drop-id');assert.equal(record.complete,true);
assert.deepEqual(observation.replayPose(record,999),record.poses[record.poses.length-1]);
const capped={...record,complete:false,poses:[]};
for(let n=0;n<3000;n++)observation.recordPose(capped,{t:n/60,x:0,y:3,z:0,angle:0,qx:0,qy:0,qz:0,qw:1,status:'floating',settled:false});
assert.ok(capped.poses.length<=1200&&capped.complete);
console.log('Passed: replay interpolates the recorded motion without mutating physical state, and never grows an unbounded recording.');
