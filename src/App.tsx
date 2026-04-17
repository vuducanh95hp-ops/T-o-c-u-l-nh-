/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RefreshCcw, 
  MessageSquare, 
  Image as ImageIcon, 
  Cpu, 
  Zap,
  Layers,
  Info,
  Video,
  Music,
  Search,
  PenTool
} from 'lucide-react';
import { generatePrompts, PromptResult } from './services/gemini';

const PLATFORMS = [
  { id: 'ChatGPT/Claude', name: 'ChatGPT / Claude', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'Midjourney', name: 'Midjourney', icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'Stable Diffusion', name: 'Stable Diffusion', icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'DALL-E', name: 'DALL-E 3', icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'Leonardo.ai', name: 'Leonardo.ai', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'Adobe Firefly', name: 'Adobe Firefly', icon: Sparkles, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'Runway/Pika', name: 'Runway / Pika', icon: Video, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'Suno/Udio', name: 'Suno / Udio', icon: Music, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'Perplexity', name: 'Perplexity', icon: Search, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

const STYLES = [
  { id: 'Detailed', name: 'Chi tiết', desc: 'Nhiều bối cảnh & thông số' },
  { id: 'Creative', name: 'Sáng tạo', desc: 'Độc đáo & phá cách' },
  { id: 'Concise', name: 'Ngắn gọn', desc: 'Trực tiếp & súc tích' },
  { id: 'Professional', name: 'Chuyên nghiệp', desc: 'Chuẩn mực & tối ưu' },
];

const LENGTHS = [
  { id: 'Short', name: 'Ngắn' },
  { id: 'Medium', name: 'Vừa' },
  { id: 'Long', name: 'Dài' },
];

export default function App() {
  const [idea, setIdea] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ChatGPT/Claude']);
  const [selectedStyle, setSelectedStyle] = useState('Detailed');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [results, setResults] = useState<PromptResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim() || selectedPlatforms.length === 0) return;
    
    setLoading(true);
    setResults([]);
    try {
      const data = await generatePrompts(idea, selectedPlatforms, selectedStyle, selectedLength);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Top: Description Area */}
        <section className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-400/20 p-2 rounded-xl border border-yellow-500/30">
              <Sparkles className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-red-600">
              Prompt<span className="text-red-700">Master</span>
            </h1>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-red-500 uppercase tracking-widest block">
              Mô tả ý tưởng của bạn
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Nhập ý tưởng của bạn (ví dụ: Logo cho quán trà sữa hiện đại...)"
              className="w-full h-32 bg-white/50 border-2 border-lime-300 rounded-2xl p-4 text-red-600 placeholder:text-red-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all resize-none text-base leading-relaxed"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* Sidebar: Settings */}
          <aside className="glass-panel p-8 flex flex-col gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-red-500 uppercase tracking-widest block">
                Phong cách yêu cầu
              </label>
              <div className="grid grid-cols-1 gap-2">
                {STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'bg-yellow-400 border-yellow-500 text-red-700' 
                          : 'bg-white/40 border-lime-200 text-red-500 hover:bg-white/60'
                      }`}
                    >
                      <span className="text-sm font-bold">{style.name}</span>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-red-500 uppercase tracking-widest block">
                Độ dài mong muốn
              </label>
              <div className="flex bg-white/40 p-1 rounded-xl border-2 border-lime-200">
                {LENGTHS.map((length) => {
                  const isSelected = selectedLength === length.id;
                  return (
                    <button
                      key={length.id}
                      onClick={() => setSelectedLength(length.id)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-yellow-400 text-red-700 shadow-md shadow-yellow-400/20' 
                          : 'text-red-400 hover:text-red-600'
                      }`}
                    >
                      {length.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Area: Platforms and Button and Results */}
          <div className="flex flex-col gap-8">
            {/* Platforms */}
            <section className="glass-panel p-6">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6">
                Chọn ứng dụng AI (có thể chọn nhiều)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'bg-yellow-400 border-yellow-500 shadow-lg' 
                          : 'bg-white/40 border-lime-200 hover:border-lime-300 opacity-80'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-red-600/10' : 'bg-white/50'}`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-red-600' : 'text-red-300'}`} />
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase ${isSelected ? 'text-red-700' : 'text-red-400'}`}>
                        {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Generate Button: "xuống trước phần kết quả" */}
            <button
              onClick={handleGenerate}
              disabled={loading || !idea.trim() || selectedPlatforms.length === 0}
              className="w-full py-5 bg-yellow-400 hover:bg-yellow-300 text-red-700 rounded-2xl font-black text-lg shadow-xl shadow-yellow-400/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group border-2 border-yellow-500"
            >
              {loading ? (
                <RefreshCcw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  BẮT ĐẦU TẠO CÂU LỆNH
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>

            {/* Results Area */}
            <section className="glass-panel p-8 flex-1 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-red-600" />
                  <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">
                    Kết quả câu lệnh tối ưu
                  </h2>
                </div>
                {results.length > 0 && !loading && (
                  <div className="flex items-center gap-2 text-red-700 text-[10px] font-bold px-3 py-1 bg-yellow-400 rounded-full border border-yellow-500">
                    <Zap className="w-3 h-3 text-red-600" />
                    HOÀN TẤT
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {!loading && results.length === 0 && (
                  <div className="col-span-full h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Sparkles className="w-12 h-12 text-red-600 mb-4" />
                    <p className="text-lg font-bold text-red-600">Câu lệnh sẽ xuất hiện tại đây</p>
                  </div>
                )}

                {loading && (
                  <div className="col-span-full h-full flex flex-col items-center justify-center">
                    <RefreshCcw className="w-12 h-12 text-red-600 animate-spin mb-4" />
                    <p className="text-red-700 font-bold animate-pulse">ĐANG PHÂN TÍCH Ý TƯỞNG...</p>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {results.map((res) => (
                    <motion.div
                      key={res.platform}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass-card p-6 flex flex-col group hover:border-yellow-400 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-red-700 border border-yellow-500">
                          {res.platform}
                        </span>
                      </div>

                      <div className="relative flex-1 group/code overflow-hidden">
                        <pre className="p-4 rounded-xl text-xs leading-relaxed text-red-700 font-mono h-full bg-lime-50/50 border-2 border-lime-200 group-hover/code:border-yellow-400 transition-colors whitespace-pre-wrap">
                          {res.prompt}
                        </pre>
                      </div>

                      <div className="mt-6 flex flex-col gap-4 pt-4 border-t border-lime-200">
                        <div className="flex items-start gap-3">
                          <Info className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[11px] text-red-500 leading-relaxed italic">
                            {res.explanation}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(res.prompt, res.platform)}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
                            copiedId === res.platform
                              ? 'bg-lime-200 text-red-700 border-2 border-lime-400'
                              : 'bg-yellow-400 hover:bg-yellow-300 text-red-700 border-2 border-yellow-500 shadow-sm'
                          }`}
                        >
                          {copiedId === res.platform ? (
                            <>
                              <Check className="w-4 h-4" />
                              ĐÃ SAO CHÉP
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              SAO CHÉP NGAY
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );



}

