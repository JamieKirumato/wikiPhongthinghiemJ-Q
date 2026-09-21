import React from 'react';
import { X, Code, BookOpen, Copy, Check } from 'lucide-react';
import { SimulationItem } from '../../types/curriculum';

interface Props {
  simulation: SimulationItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeInspectorModal: React.FC<Props> = ({ simulation, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(simulation.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161f30]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
                Inspect Code & First-Principles
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">Karpathy Mode</span>
              </h3>
              <p className="text-xs text-slate-400">{simulation.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Explanation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4">
            <h4 className="text-sky-400 font-medium text-xs tracking-wider uppercase flex items-center gap-1.5 mb-2 font-mono">
              <BookOpen className="w-3.5 h-3.5" /> Bản chất nguyên lý sơ khởi (First Principles)
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm">
              {simulation.firstPrinciplesExplanation}
            </p>
            {simulation.mathLatex && (
              <div className="mt-3 p-2.5 bg-[#0b0f17] border border-slate-800 rounded font-mono text-emerald-400 text-xs overflow-x-auto">
                <span className="text-slate-500 mr-2">Equation:</span>
                {simulation.mathLatex}
              </div>
            )}
          </div>

          {/* Code View */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Simulation Engine Logic (TypeScript)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded transition font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-[#0b0f17] border border-slate-800 text-sky-200/90 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{simulation.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1524] flex items-center justify-between text-xs text-slate-400">
          <span>Triết lý: Hiểu bản chất bằng cách mở bung mã nguồn.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
