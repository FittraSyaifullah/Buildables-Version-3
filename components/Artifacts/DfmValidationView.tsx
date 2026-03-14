import React from 'react';
import { DfmValidationData } from '../../types';
import { CheckCircle2, Settings, Wrench, Box, ArrowDownCircle, Info } from 'lucide-react';

interface DfmValidationViewProps {
  data: DfmValidationData;
}

export const DfmValidationView: React.FC<DfmValidationViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-mono text-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
            <Box size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white uppercase">DFM Validation Engine</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400 uppercase tracking-widest">Target: Bambu Lab A1</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 uppercase tracking-widest font-bold">Status: {data.dfm_status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Adjustments Made */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[11px] font-bold">
            <Settings size={14} />
            <span>Optimization Log</span>
          </div>
          <div className="space-y-2">
            {data.adjustments_made.map((adj, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg group hover:border-slate-600 transition-colors">
                <div className="mt-1 text-emerald-500">
                  <CheckCircle2 size={14} />
                </div>
                <p className="text-slate-300 leading-relaxed">{adj}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Slicer Settings */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[11px] font-bold">
            <Wrench size={14} />
            <span>Bambu Studio Configuration</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Material</div>
              <div className="text-white font-bold">{data.bambu_a1_slicer_settings.recommended_material}</div>
            </div>
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Layer Height</div>
              <div className="text-white font-bold">{data.bambu_a1_slicer_settings.layer_height}mm</div>
            </div>
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Wall Loops</div>
              <div className="text-white font-bold">{data.bambu_a1_slicer_settings.wall_loops}</div>
            </div>
            <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase mb-1">Infill</div>
              <div className="text-white font-bold">{data.bambu_a1_slicer_settings.infill_percentage}%</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <div className="mt-1 text-emerald-500">
              <ArrowDownCircle size={16} />
            </div>
            <div>
              <div className="text-[10px] text-emerald-500/70 uppercase font-bold mb-1">Print Orientation</div>
              <p className="text-emerald-100/90 text-xs leading-relaxed">{data.bambu_a1_slicer_settings.print_orientation}</p>
            </div>
          </div>
        </section>

        {/* Fastening Recommendation */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[11px] font-bold">
            <Info size={14} />
            <span>Fastening Strategy</span>
          </div>
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
            <p className="text-indigo-100/90 leading-relaxed italic">
              "{data.fastening_recommendation}"
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>Buildables DFM Engine v1.0</span>
          <span className="text-slate-700">|</span>
          <span>FDM Focus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Validated for Bambu A1</span>
        </div>
      </div>
    </div>
  );
};
