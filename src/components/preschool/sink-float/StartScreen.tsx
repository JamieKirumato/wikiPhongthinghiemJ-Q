export function StartScreen({onStart}:{onStart:(mode:'student'|'teacher')=>void}) {
  return <section className="flex h-full min-h-0 items-center justify-center overflow-y-auto rounded-3xl bg-gradient-to-b from-sky-100 to-white p-5 text-slate-800">
    <div className="w-full max-w-xl text-center space-y-6 py-6">
      <div aria-hidden="true" className="text-6xl">🍎 💧 🪨</div>
      <h1 className="text-3xl sm:text-4xl font-black text-sky-900">Vật chìm, vật nổi</h1>
      <p className="text-lg">Chọn một đồ vật, thả vào nước và quan sát.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={()=>onStart('student')} className="min-h-[80px] rounded-2xl bg-sky-600 px-5 py-4 text-xl font-bold text-white shadow hover:bg-sky-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400">👶 Học sinh</button>
        <button onClick={()=>onStart('teacher')} className="min-h-[80px] rounded-2xl bg-amber-300 px-5 py-4 text-xl font-bold text-slate-900 shadow hover:bg-amber-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-600">🧑‍🏫 Giáo viên</button>
      </div>
    </div>
  </section>;
}
