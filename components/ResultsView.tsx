import React from 'react';
import { VehicleData } from '../types';
import { Share2, Gauge, Calendar, Activity, Zap, Info, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ResultsViewProps {
  data: VehicleData;
  imageSrc: string;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, imageSrc, onReset }) => {
  if (!data.isVehicle) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-32 h-32 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <Info className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Ops!</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Não conseguimos identificar um veículo nesta imagem com clareza suficiente. Tente uma foto mais nítida ou de outro ângulo.
        </p>
        <Button onClick={onReset} variant="outline" icon={<RotateCcw />}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in pb-12">
      {/* Header Image */}
      <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-8">
        <img src={imageSrc} alt="Vehicle" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-sm font-bold text-blue-400 tracking-wider uppercase mb-1">{data.make}</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{data.model}</h1>
                </div>
                <div className="bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700">
                    <span className="text-xs text-slate-300 font-medium">{data.confidenceScore}% Confiança</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        
        {/* Main Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" /> Sobre o Veículo
            </h3>
            <p className="text-slate-300 leading-relaxed text-justify">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                    <Calendar className="w-4 h-4" /> Ano
                </div>
                <div className="text-xl font-bold text-white">{data.yearRange}</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                    <Activity className="w-4 h-4" /> Carroceria
                </div>
                <div className="text-xl font-bold text-white">{data.bodyType}</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                    <Zap className="w-4 h-4" /> Motor
                </div>
                <div className="text-xl font-bold text-white truncate" title={data.engine}>{data.engine}</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                    <Gauge className="w-4 h-4" /> Performance
                </div>
                <div className="text-xl font-bold text-white truncate" title={data.performance}>{data.performance}</div>
             </div>
          </div>
        </div>

        {/* Sidebar / Features */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Destaques</h3>
            <ul className="space-y-3">
              {data.keyFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={onReset} variant="outline" fullWidth icon={<RotateCcw />}>
                Analisar Outro
            </Button>
            <Button 
                variant="secondary" 
                fullWidth 
                icon={<Share2 />}
                onClick={() => {
                   if (navigator.share) {
                       navigator.share({
                           title: `${data.make} ${data.model}`,
                           text: `Olha esse ${data.make} ${data.model} que eu identifiquei!`,
                       }).catch(console.error);
                   }
                }}
            >
                Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;