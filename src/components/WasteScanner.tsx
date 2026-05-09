import { useState, useRef, useCallback } from 'react';
import type { WasteResult } from '../types/waste';
import { buildResult } from '../lib/wasteData';
import { supabase } from '../lib/supabase';
import ResultCard from './ResultCard';

type Mode = 'idle' | 'uploading' | 'analyzing' | 'result' | 'error';

interface Props {
  user?: any;
}

export default function WasteScanner(_: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<WasteResult | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraActive, setCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const analyzeImage = useCallback(async (imageBase64: string, mimeType: string) => {
    setMode('analyzing');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-waste`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ image: imageBase64, mimeType }),
      });

      if (!response.ok) throw new Error('Classification failed');

      const data = await response.json();
      const wasteResult = buildResult(data.category, data.confidence);
      setResult(wasteResult);
      setMode('result');

      // Save to history
      try {
        await supabase.from('scan_history').insert({
          category: data.category,
          confidence: data.confidence,
          image_url: null,
        });
      } catch {
        // Non-critical: don't fail if history save fails
      }
    } catch (err) {
      setError('Failed to classify waste. Please try again.');
      setMode('error');
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setMode('error');
      return;
    }
    setMode('uploading');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      analyzeImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  }, [analyzeImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setError('Camera access denied. Please allow camera permissions.');
      setMode('error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    setPreview(dataUrl);
    const base64 = dataUrl.split(',')[1];
    analyzeImage(base64, 'image/jpeg');
  };

  const reset = () => {
    setMode('idle');
    setPreview(null);
    setResult(null);
    setError('');
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="scanner" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
            AI Scanner
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Classify Your Waste</h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Upload an image or use your camera to instantly identify the waste type and get disposal guidance.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-green-100 border border-green-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {mode === 'result' && result ? (
              <ResultCard result={result} onReset={reset} />
            ) : mode === 'analyzing' || mode === 'uploading' ? (
              <div className="py-12 text-center animate-fade-in">
                {preview && (
                  <div className="relative w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-green-900/40 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {mode === 'uploading' ? 'Processing image…' : 'Analyzing waste…'}
                </p>
                <p className="text-sm text-gray-400">AI is identifying the waste type</p>
                <div className="mt-6 h-1.5 bg-green-100 rounded-full max-w-xs mx-auto overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full shimmer w-3/4" />
                </div>
              </div>
            ) : mode === 'error' ? (
              <div className="py-12 text-center animate-scale-in">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</p>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                <button
                  onClick={reset}
                  className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : cameraActive ? (
              <div className="animate-fade-in">
                <div className="relative rounded-2xl overflow-hidden bg-black mb-4 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-h-72 object-cover"
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-green-400 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* Upload drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-4 ${
                    dragOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-200 hover:border-green-400 hover:bg-green-50/50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">Drop an image here</p>
                  <p className="text-sm text-gray-400 mb-3">or click to browse</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  onClick={startCamera}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 text-white font-bold rounded-2xl transition-all duration-150 shadow-md shadow-green-200 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Use Camera
                </button>

                {/* Supported waste types */}
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { label: 'Plastic', color: '#FBBF24', icon: '♻' },
                    { label: 'Organic', color: '#84CC16', icon: '🌱' },
                    { label: 'Metal', color: '#6B7280', icon: '🥫' },
                    { label: 'E-Waste', color: '#EF4444', icon: '📱' },
                    { label: 'Paper', color: '#3B82F6', icon: '📄' },
                    { label: 'Glass', color: '#06B6D4', icon: '🫙' },
                  ].map((item) => (
                    <div key={item.label} className="text-center py-2 px-1 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
