import {TankObject} from './types';
export function freshComparisonItem(item:TankObject):TankObject{return {...item,inTank:false,outsideTank:false,damage:undefined,observed:'untested',settled:false,x:0,y:.45,z:0,vx:0,vy:0,vz:0,status:'basket'};}
