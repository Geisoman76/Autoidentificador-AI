import React, { useState } from 'react';
import { UploadCloud, Camera as CameraIcon, CarFront, Loader2, AlertCircle } from 'lucide-react';
import { identifyVehicle, fileToGenerativePart } from './services/geminiService';
import { VehicleData, AppState } from './types';
import CameraCapture from './components/CameraCapture';
import ResultsView from './components/ResultsView';
import Button from './components/Button';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageAnalysis = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      
      // Create local preview
      const previewUrl = URL.createObjectURL(file);
      setImageSrc(previewUrl);

      // Get Base64
      const base64Data = await fileToGenerativePart(file);
      
      // Call Gemini API
      const data = await identifyVehicle(base64Data, file.type);
      setVehicleData(data);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMessage("Não foi possível analisar a imagem. Verifique sua conexão e tente novamente.");
      setAppState(AppState.ERROR);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageAnalysis(e.target.files[0]);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setVehicleData(null);
    setImageSrc(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#0f172a]/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={resetApp}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <CarFront className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">AutoIdentificador <span className="text-blue-500">AI</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col">
        
        {/* IDLE STATE: Upload or Camera */}
        {appState === AppState.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in my-auto">
            <div className="text-center mb-10 max-w-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Descubra qual é <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">esse carro</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Tire uma foto ou faça upload para identificar modelo, ano, especificações e curiosidades instantaneamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={onFileInputChange}
                />
                <div className="h-48 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 group-hover:bg-slate-800/50 group-hover:border-blue-500/50 transition-all flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-blue-600/20 flex items-center justify-center mb-3 transition-colors">
                    <UploadCloud className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200">Upload da Galeria</h3>
                  <p className="text-sm text-slate-500 mt-1">Arraste ou clique para escolher</p>
                </div>
              </div>

              <button 
                onClick={() => setAppState(AppState.CAMERA)}
                className="h-48 rounded-2xl border-2 border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-emerald-600/20 flex items-center justify-center mb-3 transition-colors">
                  <CameraIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-slate-200">Usar Câmera</h3>
                <p className="text-sm text-slate-500 mt-1">Tire uma foto agora</p>
              </button>
            </div>

            <div className="mt-12 flex gap-4 text-xs text-slate-600 uppercase tracking-widest font-semibold">
               <span>• Rápido</span>
               <span>• Preciso</span>
               <span>• Detalhado</span>
            </div>
          </div>
        )}

        {/* CAMERA STATE */}
        {appState === AppState.CAMERA && (
          <CameraCapture 
            onCapture={handleImageAnalysis} 
            onClose={() => setAppState(AppState.IDLE)} 
          />
        )}

        {/* ANALYZING STATE */}
        {appState === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
             <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <CarFront className="w-8 h-8 text-blue-500" />
                </div>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Analisando Veículo...</h2>
             <p className="text-slate-400">Identificando características visuais</p>
          </div>
        )}

        {/* RESULTS STATE */}
        {appState === AppState.RESULTS && vehicleData && imageSrc && (
          <ResultsView 
            data={vehicleData} 
            imageSrc={imageSrc} 
            onReset={resetApp} 
          />
        )}

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
             <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Ocorreu um erro</h2>
             <p className="text-slate-400 mb-8 max-w-md">{errorMessage}</p>
             <Button onClick={resetApp} variant="outline" icon={<CarFront />}>
                Voltar ao Início
             </Button>
          </div>
        )}

      </main>
      
      {/* Footer */}
      {appState !== AppState.CAMERA && (
        <footer className="w-full py-6 border-t border-slate-800 text-center">
            <p className="text-slate-600 text-sm">Powered by Gemini AI Vision</p>
        </footer>
      )}
    </div>
  );
};

export default App;