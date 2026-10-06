import { useEffect, useRef, useState } from 'react';
import { Lightbulb, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { speechEngine } from '../../utils/speechUtils';
import { addTablet, advanceLamp, createLamp, forces, PHYSICS } from './lava-lamp/lavaPhysics';
import { drawLamp } from './lava-lamp/drawLamp';

const colors = [{ name: 'Đỏ', value: '#e94a57' }, { name: 'Xanh', value: '#329ed2' }, { name: 'Tím', value: '#a873d5' }, { name: 'Không dùng màu', value: '#c7e4ed' }];
const steps = ['Rót nước', 'Rót dầu ăn', 'Thêm màu (tùy chọn)'];
const prompts = ['Con hãy rót một ít nước vào bình.', 'Con thử thêm dầu ăn. Con thấy mấy lớp?', 'Con chọn màu hoặc bỏ qua màu, rồi quan sát.'];
const button = 'min-h-11 rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400';

export function SimLavaLampLab() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const lamp = useRef(createLamp(17));
  const settings = useRef({ paused: false, slow: false, light: false, color: colors[0].value, step: 3, showForces: false });
  const [step, setStep] = useState(3);
  const [paused, setPaused] = useState(false);
  const [slow, setSlow] = useState(false);
  const [light, setLight] = useState(false);
  const [color, setColor] = useState(colors[0].value);
  const [dose, setDose] = useState(0.25);
  const [showForces, setShowForces] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [voice, setVoice] = useState(() => speechEngine.isVoiceEnabled());
  const [message, setMessage] = useState('Bình mẫu đã có nước màu và dầu. Con đoán điều gì xảy ra khi thả mẩu viên sủi?');
  const [stats, setStats] = useState({ remaining: 0, drops: 0, cycles: 0, rising: 0, sinking: 0, net: 0, hasRun: false, tablets: 0, bubbles: 0 });

  useEffect(() => { settings.current = { paused, slow, light, color, step, showForces }; }, [paused, slow, light, color, step, showForces]);
  useEffect(() => { if (voice) speechEngine.speak(message); }, [message, voice]);
  useEffect(() => {
    let frame = 0, previous = 0, lastStats = 0;
    const tick = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
      previous = now;
      const options = settings.current;
      if (!options.paused && options.step >= 3) advanceLamp(lamp.current, dt * (options.slow ? 0.25 : 1));
      const context = canvas.current?.getContext('2d');
      if (context) drawLamp(context, lamp.current, options);
      if (now - lastStats > 150) {
        const state = lamp.current;
        const sample = state.drops[0];
        setStats({ remaining: state.tablets.reduce((sum, tablet) => sum + tablet.remaining, 0), drops: state.drops.length, cycles: state.cycles,
          rising: state.drops.filter(drop => drop.vy > 0.001).length, sinking: state.drops.filter(drop => drop.vy < -0.001).length,
          net: sample ? forces(sample).net : 0, hasRun: state.gasProduced > 0, tablets: state.tablets.length, bubbles: state.bubbles.length });
        lastStats = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const restart = (fromEmpty: boolean) => {
    lamp.current = createLamp(17);
    const next = fromEmpty ? 0 : 3;
    settings.current.step = next; settings.current.paused = false;
    setStep(next); setPaused(false); setPrediction(''); setShowForces(false);
    setStats({ remaining: 0, drops: 0, cycles: 0, rising: 0, sinking: 0, net: 0, hasRun: false, tablets: 0, bubbles: 0 });
    setMessage(fromEmpty ? prompts[0] : 'Bình mẫu đã sẵn sàng. Con muốn thử mẩu viên sủi nhỏ hay lớn?');
  };
  const add = () => {
    addTablet(lamp.current, dose);
    setPaused(false); settings.current.paused = false;
    setMessage('Con nhìn mẩu viên sủi chìm xuống. Bọt bắt đầu xuất hiện ở đâu? Hãy theo dõi một giọt nước màu.');
  };
  const next = () => {
    const value = Math.min(3, step + 1); setStep(value); settings.current.step = value;
    setMessage(value < 3 ? prompts[value] : 'Con thấy dầu và nước màu ở đâu? Hãy đoán rồi thả một mẩu viên sủi.');
  };
  const status = paused ? 'Đã tạm dừng' : stats.remaining > 0 ? 'Viên sủi đang chìm / tan' : stats.drops || stats.bubbles ? 'Quan sát các giọt còn lại' : stats.hasRun ? 'Bình đã lắng lại' : 'Chờ con thả viên sủi';

  return <section className="mx-auto max-w-6xl rounded-3xl border border-slate-700 bg-[#0e1826] p-4 text-slate-100 shadow-xl sm:p-7" aria-label="Thí nghiệm đèn dung nham tại nhà">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Phòng thí nghiệm tại nhà</p>
        <h2 className="text-2xl font-bold sm:text-3xl">Chế tạo đèn dung nham</h2>
        <p className="mt-2 text-sm text-slate-400">Một bình nhỏ. Những giọt nước chuyển động. Con thử nhé!</p></div>
      <button className={button + ' border border-slate-600 text-slate-300'} onClick={() => setVoice(speechEngine.toggleVoice())} aria-label={voice ? 'Tắt giọng hướng dẫn' : 'Bật giọng hướng dẫn'}>
        {voice ? <Volume2 className="mr-2 inline h-4 w-4" /> : <VolumeX className="mr-2 inline h-4 w-4" />}Giọng hướng dẫn
      </button>
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#08121f]">
        <div className="flex items-center justify-between gap-2 px-5 pt-4 text-xs text-slate-400"><span className="rounded-full bg-slate-800 px-3 py-1.5">Bản thử chuyển động</span><span>{status}</span></div>
        <canvas ref={canvas} width={480} height={600} className="mx-auto block max-h-[560px] w-full max-w-[448px]" role="img" aria-label="Bình mở có nước màu bên dưới và dầu ăn bên trên; viên sủi tạo bọt nâng giọt nước rồi giọt chìm về đáy" />
        <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
          <button className={button + ' bg-slate-800 hover:bg-slate-700'} onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play className="mr-1 inline h-4 w-4" /> : <Pause className="mr-1 inline h-4 w-4" />}{paused ? 'Tiếp tục' : 'Tạm dừng'}</button>
          <button className={button + (slow ? ' bg-amber-300 text-slate-950' : ' bg-slate-800')} onClick={() => setSlow(!slow)} aria-pressed={slow}>Xem chậm ×¼</button>
          <button className={button + (light ? ' bg-amber-300 text-slate-950' : ' bg-slate-800')} onClick={() => setLight(!light)} aria-pressed={light}><Lightbulb className="mr-1 inline h-4 w-4" />Đèn pin</button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-600 bg-slate-800/70 p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-300">Con thử và quan sát</p>
          <p className="text-base leading-relaxed" aria-live="polite">{message}</p>
          {!stats.hasRun && step >= 3 && <div className="mt-4 flex flex-wrap gap-2" aria-label="Dự đoán trước khi thử">{['Đi lên', 'Đi xuống', 'Đứng yên'].map(value => <button key={value} className={button + (prediction === value ? ' bg-amber-300 text-slate-950' : ' border border-slate-600 text-slate-300')} aria-pressed={prediction === value} onClick={() => setPrediction(value)}>{value}</button>)}</div>}
          {stats.hasRun && prediction && <p className="mt-3 text-sm text-slate-400">Con đã đoán: {prediction.toLowerCase()}. Điều con thấy có giống không?</p>}
        </div>
        {step < 3 ? <div className="rounded-3xl border border-slate-700 p-5"><p className="mb-3 text-sm text-slate-400">Chuẩn bị bình · bước {step + 1}/3</p><button className={button + ' w-full bg-amber-300 text-slate-950'} onClick={next}>{steps[step]}</button></div> : <div className="rounded-3xl border border-slate-700 p-5">
          <fieldset><legend className="mb-3 text-sm font-semibold">Chọn mẩu viên sủi</legend><div className="grid grid-cols-2 gap-2">{[{ value: 0.25, name: 'Mẩu nhỏ' }, { value: 0.5, name: 'Mẩu lớn hơn' }].map(item => <button key={item.value} className={button + (dose === item.value ? ' border border-amber-300 bg-amber-300/10 text-amber-200' : ' border border-slate-700 text-slate-400')} aria-pressed={dose === item.value} onClick={() => setDose(item.value)}>{item.name}</button>)}</div></fieldset>
          <button onClick={add} disabled={stats.tablets >= 4} className={button + ' mt-4 w-full bg-amber-300 text-slate-950 hover:bg-amber-200 disabled:opacity-40'}>＋ Thả một mẩu viên sủi</button>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">Thử từng mẩu. Đợi bình lắng rồi làm lại để so sánh.</p>
        </div>}
        <fieldset className="rounded-3xl border border-slate-700 p-5"><legend className="px-1 text-sm font-semibold">Màu nước · có thể bỏ qua</legend><div className="flex flex-wrap gap-2">{colors.map(item => <button key={item.name} className={button + ' border ' + (color === item.value ? 'border-slate-200 bg-slate-700' : 'border-slate-700 text-slate-400')} aria-pressed={color === item.value} onClick={() => setColor(item.value)}><span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: item.value }} />{item.name}</button>)}</div></fieldset>
        <div className="flex flex-wrap gap-2"><button className={button + ' border border-slate-700 text-slate-300'} onClick={() => restart(false)}><RotateCcw className="mr-1 inline h-4 w-4" />Làm lại với bình mẫu</button><button className={button + ' border border-slate-700 text-slate-300'} onClick={() => restart(true)}>Tự pha từ đầu</button></div>
        <details className="rounded-2xl border border-slate-700 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-300">Sau khi quan sát · Vì sao giọt lên rồi xuống?</summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Dầu ăn có khối lượng riêng nhỏ hơn nước và không hòa vào nước nên nằm ở trên. Mẩu viên sủi gặp nước tạo khí CO₂. Đủ bọt khí bám vào giọt nước thì cả cụm nổi qua dầu. Ở mặt dầu, khí thoát ra; giọt nước mất khí lại chìm xuống và nhập vào lớp nước. Viên sủi hết, bọt giảm rồi bình lắng lại.</p>
          <p className="mt-2 text-xs text-slate-400">Đèn pin chỉ chiếu sáng. Đèn sáp bán ngoài cửa hàng dùng nhiệt và có cơ chế khác.</p>
          <button className={button + ' mt-3 bg-slate-800'} onClick={() => setShowForces(!showForces)} aria-pressed={showForces}>{showForces ? 'Ẩn' : 'Xem'} lực trên giọt</button>
          {showForces && <div className="mt-3 space-y-2 text-xs text-slate-300"><p>↑ Lực nổi · ↓ Trọng lực · lực cản ngược chiều chuyển động.</p><p>Giọt đang lên: {stats.rising} · đang xuống: {stats.sinking} · trở về nước: {stats.cycles}</p><p>Lực tổng trên giọt được đánh dấu: {(stats.net * 1000).toFixed(3)} mN</p><p className="text-slate-400">Mô hình vật lý rút gọn; tốc độ phản ứng phụ thuộc loại viên sủi và dầu thực tế. Không dùng thời gian ở đây để dự đoán thời gian thí nghiệm tại nhà.</p><p className="text-slate-400">ρ nước ≈ {PHYSICS.rhoWater} kg/m³ · ρ dầu ≈ {PHYSICS.rhoOil} kg/m³</p></div>}
        </details>
      </div>
    </div>
    <details className="mt-6 rounded-3xl border border-slate-700 p-5" open><summary className="cursor-pointer font-semibold">Mang thí nghiệm về nhà</summary>
      <div className="mt-4 grid gap-5 text-sm leading-relaxed text-slate-300 sm:grid-cols-2">
        <div><p className="mb-2 font-semibold text-amber-200">Tìm trong nhà</p><p>Bình hoặc chai nhựa trong đã rửa sạch, nước, một ít dầu ăn và khay hứng. Người lớn chuẩn bị một mẩu viên sủi có thành phần tạo bọt khi gặp nước.</p><p className="mt-2"><strong>Tùy chọn:</strong> màu thực phẩm giúp nhìn rõ giọt; đèn pin giúp chiếu sáng. Không có màu vẫn thử được.</p></div>
        <div><p className="mb-2 font-semibold text-amber-200">Thử với người lớn</p><p>Rót nước khoảng ¼ bình, thêm dầu và chừa khoảng trống phía trên. Thêm vài giọt màu nếu có. Để các lớp lắng rồi thả một mẩu viên sủi nhỏ.</p><p className="mt-2">Luôn để bình mở; không uống hỗn hợp, không đun nóng. Trẻ nhỏ cần người lớn chuẩn bị và hỗ trợ. Thu gom dầu vào hộp bỏ rác, không đổ xuống cống.</p></div>
      </div>
      <p className="mt-4 border-t border-slate-700 pt-4 text-sm text-slate-300">Thử thách: con chọn hai mẩu khác nhau, thử từng lần và đếm bọt trong cùng một khoảng thời gian. Con muốn tìm hiểu thêm điều gì?</p>
      <p className="mt-3 text-xs text-slate-400">Tài liệu cho người lớn: <a className="underline underline-offset-2" href="https://warwick.ac.uk/fac/sci/chemistry/outreach/primary/lavalamp/lava_lamp_experiment_instructions.pdf" target="_blank" rel="noreferrer">Đại học Warwick</a> · <a className="underline underline-offset-2" href="https://www.acs.org/content/dam/acsorg/education/resources/highschool/chemmatters/issues/2015-2016/february2016/chemmatters-feb2016-chemclub-activity.pdf" target="_blank" rel="noreferrer">American Chemical Society</a></p>
    </details>
  </section>;
}
