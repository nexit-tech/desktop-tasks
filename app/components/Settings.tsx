import { AppConfig } from '@/types';
import { X, Check, LogOut, Paintbrush } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface SettingsProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onClose: () => void;
}

export default function Settings({ config, onUpdateConfig, onClose }: SettingsProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'account'>('appearance');

  const PRESET_COLORS = [
    '#191919', '#1e1e2e', '#0f172a', '#171717', 
    '#27272a', '#2e1065', '#450a0a', '#052e16'
  ];

  const PRESET_ACCENTS = [
    'rgba(255,255,255,0.05)', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signUp({ email, password });
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4 pl-1">
        <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase flex items-center gap-2">
          <Paintbrush size={14} />
          Configurações
        </h2>
        <button 
          onClick={onClose}
          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex gap-2 mb-4 border-b border-white/5 pb-2">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${activeTab === 'appearance' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
        >
          Aparência
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${activeTab === 'account' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
        >
          Conta & Nuvem
        </button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {activeTab === 'appearance' ? (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300 font-medium">Opacidade da Janela</span>
                <span className="text-white/40 font-mono text-xs">
                  {Math.round(config.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1"
                step="0.01"
                value={config.opacity}
                onChange={(e) => onUpdateConfig({ ...config, opacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200 transition-all"
              />
            </div>

            <div className="space-y-3">
              <span className="text-sm text-gray-300 font-medium block">Cor de Destaque (Bordas)</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_ACCENTS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, accentColor: color })}
                    className={`h-8 rounded-md transition-all duration-200 border flex items-center justify-center
                      ${(config.accentColor || 'rgba(255,255,255,0.05)') === color ? 'border-white/50 scale-95 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color === 'rgba(255,255,255,0.05)' ? '#2a2a2a' : color }}
                    title={color === 'rgba(255,255,255,0.05)' ? 'Padrão' : color}
                  >
                    {(config.accentColor || 'rgba(255,255,255,0.05)') === color && <Check size={12} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-sm text-gray-300 font-medium block">Cor de Fundo</span>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, bgColor: color })}
                    className={`h-8 rounded-md transition-all duration-200 border flex items-center justify-center
                      ${config.bgColor === color ? 'border-white/50 scale-95 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  >
                    {config.bgColor === color && <Check size={12} className="text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <HexColorPicker 
                  color={config.bgColor} 
                  onChange={(color) => onUpdateConfig({ ...config, bgColor: color })} 
                  style={{ width: '100%', height: '120px' }}
                />
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <div 
                    className="w-6 h-6 rounded border border-white/10 shadow-inner"
                    style={{ backgroundColor: config.bgColor }}
                  />
                  <input 
                    type="text" 
                    value={config.bgColor.toUpperCase()}
                    onChange={(e) => onUpdateConfig({ ...config, bgColor: e.target.value })}
                    className="flex-1 bg-transparent text-xs font-mono text-white/60 focus:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <span className="text-sm text-gray-300 font-medium block">Sincronização na Nuvem</span>
            <p className="text-xs text-white/40 mb-3">Conecte-se para salvar suas tarefas e acessá-las na versão web.</p>
            {session ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                <span className="text-xs text-emerald-400 truncate mr-2 font-medium">{session.user.email}</span>
                <button 
                  onClick={handleLogout} 
                  className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <form className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-md transition-colors disabled:opacity-50 font-medium"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-white text-xs py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      
      <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20">
        <span>Nexit Tech</span>
        <span>v0.1.3</span>
      </div>
    </div>
  );
}