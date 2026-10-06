import type {TrialRecord} from '../SimSinkOrFloatLab';
const kind=(id:string)=>id.split('#')[0];

// One recent, actually settled observation per kind; repeated supplies do not crowd the panel.
export function reflectionObservations(history:TrialRecord[]):TrialRecord[]{
  const latest=new Map<string,TrialRecord>();
  for(const trial of history)latest.set(kind(trial.itemId),trial);
  return [...latest.values()];
}

export function eggComparison(history:TrialRecord[],itemId?:string){
  for(let i=history.length-1;i>=0;i--){
    const after=history[i];
    if(kind(after.itemId)!=='item-egg'||(itemId&&after.itemId!==itemId)||!Number.isFinite(after.waterDensity)||after.waterDensity<=1.00001)continue;
    // The latest observation of this physical egg must still be the salt-water trial.
    if(history.slice(i+1).some(t=>t.itemId===after.itemId))continue;
    for(let j=i-1;j>=0;j--){
      const before=history[j];
      if(before.itemId===after.itemId&&Number.isFinite(before.waterDensity)&&before.waterDensity<=1.00001&&before.timestamp<=after.timestamp){
        return {before,after};
      }
    }
  }
  return null;
}
