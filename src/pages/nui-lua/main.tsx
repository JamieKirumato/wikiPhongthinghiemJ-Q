import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { SimVolcanoLab } from '../../components/preschool/SimVolcanoLab';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><main className="volcano-standalone" style={{height:'100dvh',padding:0,background:'#dcece6'}}><SimVolcanoLab/></main></React.StrictMode>
);
