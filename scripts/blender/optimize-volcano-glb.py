import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'public/assets/volcano/blender-v3/volcano-approved-v3.glb'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(path))
for name in ['volcano-decor','volcano-cup','jug','spoon','dropper']:
    root=bpy.data.objects.get(name)
    if not root:raise RuntimeError('Missing exported group '+name)
    groups={}
    for ob in root.children_recursive:
        if ob.type=='MESH' and ob.name!='liquid':groups.setdefault(tuple(m.name for m in ob.data.materials),[]).append(ob)
    for group in groups.values():
        if len(group)<2:continue
        bpy.ops.object.select_all(action='DESELECT')
        for ob in group:ob.select_set(True)
        bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join()
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
report=json.loads((path.parent/'manifest.json').read_text())
report['meshParts']=sum(o.type=='MESH' for o in bpy.context.scene.objects)
report['bytes']=path.stat().st_size
(path.parent/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('OPTIMIZED',report,flush=True)
