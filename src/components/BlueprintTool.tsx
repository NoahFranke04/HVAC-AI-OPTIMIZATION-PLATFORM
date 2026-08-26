import { useState } from 'react';
import { User } from 'firebase/auth';
import { analyzeBlueprint } from '../lib/gemini';
import { Upload, FileText, Map as MapIcon, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

export default function BlueprintTool({ user }: { user: User }) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const analysis = await analyzeBlueprint(image);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          Blueprint Analyzer
          <MapIcon className="w-7 h-7 text-blue-500" />
        </h1>
        <p className="text-slate-400 mt-1">Upload floor plans to extract room sizes and HVAC sizing requirements.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className={cn(
            "relative aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center",
            image ? "border-blue-500/50 bg-slate-900" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
          )}>
            {image ? (
              <img src={image} className="w-full h-full object-contain rounded-lg" alt="Blueprint" referrerPolicy="no-referrer" />
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-300 font-bold">Upload Floor Plan</p>
                <p className="text-slate-500 text-sm mt-1">Drag and drop or click to browse (JPG/PNG)</p>
              </>
            )}
            <input
              type="file"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || analyzing}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg",
              !image || analyzing ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-50 text-white shadow-blue-900/20"
            )}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI Analyzing Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Floor Plan
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl min-h-[400px]">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Analysis Results</h2>
          </div>

          {result ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert prose-sm max-w-none"
            >
              <div className="markdown-body">
                <Markdown>{result}</Markdown>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
              <Loader2 className={cn("w-8 h-8 mb-4", analyzing ? "animate-spin text-blue-500" : "opacity-20")} />
              <p className="text-sm font-medium">
                {analyzing ? "Gemini is processing your blueprint..." : "Upload and analyze a blueprint to see results here."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
        <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-blue-200 font-bold text-sm">Pro Tip</h3>
          <p className="text-blue-300/70 text-sm mt-1 leading-relaxed">
            Our AI can identify load-bearing walls and suggest optimal duct routing to minimize static pressure and increase efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}
