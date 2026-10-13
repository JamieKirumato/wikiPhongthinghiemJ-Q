import type {TankShape} from './types';

/** Photo illustrations for the selector; the large preview renders live geometry. */
export function TankThumbnail({shape,compact=false}:{shape:TankShape;compact?:boolean}){
  return <img className={compact?'teacher-tank-photo teacher-tank-photo-small':'teacher-tank-photo'} src={`/assets/sink-float/tank-${shape}.webp`} alt="" draggable={false}/>;
}
