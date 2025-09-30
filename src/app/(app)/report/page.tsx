'use client';
import { useEffect, useState } from 'react';

export default function ReportPreview(){
  const [running, setRunning] = useState(true);
  const [p, setP] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=> setP(v => (v>=100?100:v+5)), 200);
    const d = setTimeout(()=> setRunning(false), 4200);
    return ()=> { clearInterval(t); clearTimeout(d); };
  },[]);

  return (
    <section className={running ? "report-shell running" : "report-shell"} style={{position:'relative', padding:24, borderRadius:16, background:'#fff'}}>
      <style>{`
        @keyframes gradient-pan {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        .report-shell.running::before {
          content: "";
          position: absolute; inset: -2px; border-radius: 16px;
          filter: blur(8px); pointer-events: none; opacity: 0.9;
          background: linear-gradient(90deg,#2dd4bf,#06b6d4,#60a5fa);
          background-size: 200% 200%; animation: gradient-pan 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce){
          .report-shell.running::before { animation: none; }
        }
        .tiles { display:grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap:16px; margin:16px 0; }
        .tile { background:#fff; border-radius:12px; padding:16px; border:1px solid #eee; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
        .progress { height:8px; background:#eee; border-radius:4px; overflow:hidden; }
        .bar { height:100%; background:#6b5bff; width:0 }
      `}</style>

      <h1>DriftWatch Report</h1>
      <p>Quality analysis for example.com</p>

      <div className="tiles">
        {["Flows","Accessibility","Performance","Visual","AI"].map((t,i)=>(
          <div className="tile" key={i}>
            <strong>{t}</strong>
            <div className="progress" style={{marginTop:8}}>
              <div className="bar" style={{width:`${p}%`}}/>
            </div>
            <p style={{opacity:.7, fontSize:12, marginTop:6}}>{p < 100 ? "Running..." : "Done"}</p>
          </div>
        ))}
      </div>

      <h2>Executive Summary</h2>
      <p>Overall status, critical issues, performance score, and what to fix first.</p>
    </section>
  );
}
