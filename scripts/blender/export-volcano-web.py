"""Export the user-approved Blender model into interactive, normalized web parts."""
import bpy,math,json,random
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/assets/volcano/blender-v3';OUT.mkdir(exist_ok=True)
scene=bpy.context.scene
bpy.context.view_layer.update()
original=list(scene.objects)
rim=next(o for o in original if o.name=='Cup • fine pale rolled rim')
deps=bpy.context.evaluated_depsgraph_get()
def world_vertices(ob):
    ev=ob.evaluated_get(deps);me=ev.to_mesh();pts=[ob.matrix_world@v.co for v in me.vertices];ev.to_mesh_clear();return pts
rp=world_vertices(rim);cupx=(min(p.x for p in rp)+max(p.x for p in rp))/2;cupy=(min(p.y for p in rp)+max(p.y for p in rp))/2
rimz=(min(p.z for p in rp)+max(p.z for p in rp))/2
floor=.185;hero_scale=(2.575-.13)/(rimz-floor)
def hero(p):return Vector((.09+(p.x-cupx)*hero_scale,(p.y-cupy)*hero_scale,.13+(p.z-floor)*hero_scale))
def centered(x,y,z,scale):return lambda p:Vector(((p.x-x)*scale,(p.y-y)*scale,(p.z-z)*scale))
export=bpy.data.collections.new('WEB • exported interactive parts');scene.collection.children.link(export)
made=[]
def duplicate(ob,name,transform,ratio=1):
    ev=ob.evaluated_get(deps);me=bpy.data.meshes.new_from_object(ev,depsgraph=deps)
    for v in me.vertices:v.co=transform(ob.matrix_world@v.co)
    obj=bpy.data.objects.new(name,me);export.objects.link(obj)
    for p in me.polygons:p.use_smooth=True
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    if ratio<1:
        dec=obj.modifiers.new('Web geometry budget','DECIMATE');dec.ratio=ratio
        bpy.ops.object.modifier_apply(modifier=dec.name)
    obj.select_set(False);made.append(obj);return obj
def parent(name,parts):
    root=bpy.data.objects.new(name,None);export.objects.link(root)
    for ob in parts:ob.parent=root
    made.append(root);return root
def pick(substr):return [o for o in original if substr in o.name]
body_source=next(o for o in original if o.name=='Volcano • sculpted overlapping clay volumes')
body=duplicate(body_source,'volcano-body',hero,.20)
tray=duplicate(next(o for o in original if o.name=='Tray • shallow rectangular jade ceramic'),'volcano-tray',hero,.65)
decor=parent('volcano-decor',[duplicate(o,'clay-detail-%02d'%i,hero,.45) for i,o in enumerate(original) if ('rounded leaf' in o.name or 'loose pressed foot piece' in o.name)])
cup=parent('volcano-cup',[duplicate(o,'cup-part-%d'%i,hero,.55) for i,o in enumerate(original) if o.name.startswith('Cup •') and ('plastic' in o.name or 'rolled rim' in o.name)])

# The main geometry is also the source of the editable surface/flow height grid.
bvh=BVHTree.FromPolygons([tuple(v.co) for v in body.data.vertices],[tuple(p.vertices) for p in body.data.polygons])
grid=[]
for row in range(49):
    y=.13+row/48*2.3
    for col in range(128):
        a=col/128*math.tau
        # Three x=.09+r*cos(a), z=r*sin(a), Blender y=-z.
        d=Vector((math.cos(a),-math.sin(a),0));start=Vector((.09,0,y))+d*3.2
        hit,n,idx,dist=bvh.ray_cast(start,-d,3.6)
        r=math.hypot(hit.x-.09,hit.y) if hit else (.48+(1-row/48)*1.43)
        grid.append(round(r,5))
# A descending envelope makes edits and height inversion stable on small lips.
for col in range(128):
    for row in range(47,-1,-1):grid[row*128+col]=round(max(grid[row*128+col],grid[(row+1)*128+col]+.002),5)
grid_path=ROOT/'src/components/preschool/volcano/blenderClayGrid.ts'
grid_path.write_text('// Generated from the approved Blender mesh; rows 49 × columns 128.\nexport const BLENDER_CLAY_GRID = '+json.dumps(grid,separators=(',',':'))+';\n',encoding='utf-8')

# Tools use local coordinates matching their existing interactive pivots.
jugx=2.15+.40;jugy=.48;js=1.1/(1.726-.14)
jt=centered(jugx,jugy,.14,js)
jug_parts=[duplicate(o,'jug-glass-%d'%i,jt,.45) for i,o in enumerate(original) if o.name.startswith('Vinegar jug •') and ('body' in o.name or 'handle' in o.name)]
liquid_source=next(o for o in original if o.name=='Vinegar jug • transparent vinegar / level')
liquid=duplicate(liquid_source,'liquid',centered(jugx,jugy,.30,js),.65);liquid.location.z=.16*js
jug=parent('jug',jug_parts+[liquid])
bx=3.54+.40;by=.02;bs=.94
bowl=parent('bowl',[duplicate(next(o for o in original if o.name.startswith('Bowl • deep blue')),'bowl-ceramic',centered(bx,by,.14,bs),.55)])
stock_parts=[duplicate(o,'soda-%d'%i,centered(bx,by,.28,bs),.20 if 'grains' in o.name else .40) for i,o in enumerate(original) if o.name.startswith('Baking soda •')]
stock=parent('soda-stock',stock_parts);stock.location.z=.14*bs

S=Vector((3.54+.14+.40,.02-.06,.665));D=Vector((.76,.40,.64)).normalized();T=D.cross(Vector((0,0,1))).normalized();N=T.cross(D).normalized()
def spoon_transform(p):
    r=p-S
    return Vector((r.dot(T)*1.1,-r.dot(D)*1.1,r.dot(N)*1.1))
spoon=parent('spoon',[duplicate(o,'spoon-metal-%d'%i,spoon_transform,.65) for i,o in enumerate(original) if o.name.startswith('Teaspoon •')])
fx=4.57+.40;fy=.27;ds=.855/(1.34-.14)
dropper=parent('dropper',[duplicate(o,'dropper-part-%d'%i,centered(fx,fy,.14,ds),.28 if 'rib' in o.name else .6) for i,o in enumerate(original) if o.name.startswith('Food coloring •') or o.name.startswith('Cap • rib')])
lump=parent('clay-lump',[duplicate(next(o for o in original if o.name=='Clay • spare lump with thumb depression'),'lump-mesh',centered(2.13+.4,-.73,.11,.78),.5)])
stick=parent('modeling-stick',[duplicate(next(o for o in original if o.name.startswith('Modeling stick •')),'stick-mesh',centered(3.635+.4,-.78,.14,.78),.5)])

# Bake Blender's box-projected clay into UV textures that Three.js can display.
clay=body.data.materials[0]
bpy.ops.object.select_all(action='DESELECT');body.select_set(True);bpy.context.view_layer.objects.active=body
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.012);bpy.ops.object.mode_set(mode='OBJECT')
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=8;scene.render.bake.margin=8
nodes=clay.node_tree.nodes
target=nodes.new('ShaderNodeTexImage');target.label='Web baked atlas'
color=bpy.data.images.new('clay-color-web',width=1024,height=1024,alpha=False);target.image=color;nodes.active=target
bpy.ops.object.bake(type='DIFFUSE',pass_filter={'COLOR'})
color.filepath_raw=str(OUT/'clay-color.png');color.file_format='PNG';color.save()
normal=bpy.data.images.new('clay-normal-web',width=1024,height=1024,alpha=False);normal.colorspace_settings.name='Non-Color';target.image=normal;nodes.active=target
bpy.ops.object.bake(type='NORMAL')
normal.filepath_raw=str(OUT/'clay-normal.png');normal.file_format='PNG';normal.save()
# Replace unsupported procedural node graphs with a portable PBR material.
webclay=bpy.data.materials.new('Baked cocoa clay');webclay.use_nodes=True
nd=webclay.node_tree.nodes;ln=webclay.node_tree.links;p=next(n for n in nd if n.type=='BSDF_PRINCIPLED');p.inputs['Roughness'].default_value=.83
im=nd.new('ShaderNodeTexImage');im.image=color;ln.new(im.outputs['Color'],p.inputs['Base Color'])
nm=nd.new('ShaderNodeTexImage');nm.image=normal;normalmap=nd.new('ShaderNodeNormalMap');normalmap.inputs['Strength'].default_value=.75
ln.new(nm.outputs['Color'],normalmap.inputs['Color']);ln.new(normalmap.outputs[0],p.inputs['Normal'])
body.data.materials.clear();body.data.materials.append(webclay)
# Small clay pieces retain the same tactile swatch without reusing the body atlas.
simpleclay=bpy.data.materials.new('Cocoa clay details');simpleclay.diffuse_color=(.27,.105,.047,1);simpleclay.use_nodes=True
pc=next(n for n in simpleclay.node_tree.nodes if n.type=='BSDF_PRINCIPLED');pc.inputs['Base Color'].default_value=(.27,.105,.047,1);pc.inputs['Roughness'].default_value=.84
for ob in made:
    if ob.type=='MESH' and ob!=body:
        for i,m in enumerate(ob.data.materials):
            if m==clay:ob.data.materials[i]=simpleclay

bpy.ops.object.select_all(action='DESELECT')
for ob in made:ob.select_set(True)
report={'source':'assets/volcano-source/approved-v3.blend','scale':hero_scale,'cupRadius':.51*1.08*hero_scale,'cupFloor':.13+(2.075-floor)*1.08*hero_scale,'vertices':sum(len(o.data.vertices) for o in made if o.type=='MESH'),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in made if o.type=='MESH'),'meshParts':sum(o.type=='MESH' for o in made)}
bpy.ops.export_scene.gltf(filepath=str(OUT/'volcano-approved-v3.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_texcoords=True,export_normals=True,export_materials='EXPORT')
(OUT/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('VOLCANO_WEB_EXPORTED',json.dumps(report),flush=True)
