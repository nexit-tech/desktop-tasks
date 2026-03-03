import { AppConfig } from '@/types';
import { X, Check, LogOut, Paintbrush, Monitor, Cloud } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface SettingsProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onClose: () => void;
}

const getContrastYIQ = (hexcolor: string) => {
  const color = hexcolor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 2), 16);
  const b = parseInt(color.substring(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'light' : 'dark';
};

export default function Settings({ config, onUpdateConfig, onClose }: SettingsProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'account'>('appearance');

  const theme = getContrastYIQ(config.bgColor);
  const isLight = theme === 'light';

  const colors = {
    text: isLight ? '#060607' : '#f2f3f5',
    muted: isLight ? '#4e5058' : '#b5bac1',
    bg: isLight ? '#f2f3f5' : '#2b2d31',
    bgSecondary: isLight ? '#e3e5e8' : '#1e1f22',
    border: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
    hover: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
    active: isLight ? '#fff' : '#313338',
    blurple: '#5865F2',
    blurpleHover: '#4752C4',
    danger: '#da373c',
    dangerHover: '#a12828',
    success: '#23a559'
  };

  const PRESET_COLORS = [
    '#313338', '#2b2d31', '#1e1f22', '#ffffff', 
    '#f2f3f5', '#2e1065', '#450a0a', '#052e16'
  ];

  const PRESET_ACCENTS = [
    'rgba(255,255,255,0.05)', '#5865F2', '#23a559', '#f0b232', 
    '#da373c', '#eb459e', '#00a8fc', '#5c6bc0'
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
    <div className="flex flex-col h-full animate-in fade-in duration-300 font-sans">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 
          className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ color: colors.text }}
        >
          {activeTab === 'appearance' ? <Monitor size={16} /> : <Cloud size={16} />}
          Configurações
        </h2>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-md transition-all duration-200"
          style={{ color: colors.muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text;
            e.currentTarget.style.backgroundColor = colors.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.muted;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div 
        className="flex gap-1 mb-6 p-1 rounded-lg"
        style={{ backgroundColor: colors.bgSecondary }}
      >
        <button 
          onClick={() => setActiveTab('appearance')}
          className="flex-1 text-xs font-semibold px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: activeTab === 'appearance' ? colors.active : 'transparent',
            color: activeTab === 'appearance' ? colors.text : colors.muted,
            boxShadow: activeTab === 'appearance' ? `0 1px 3px ${colors.border}` : 'none'
          }}
        >
          <Paintbrush size={14} />
          Aparência
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          className="flex-1 text-xs font-semibold px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: activeTab === 'account' ? colors.active : 'transparent',
            color: activeTab === 'account' ? colors.text : colors.muted,
            boxShadow: activeTab === 'account' ? `0 1px 3px ${colors.border}` : 'none'
          }}
        >
          <Cloud size={14} />
          Conta
        </button>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {activeTab === 'appearance' ? (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.muted }}>
                  Opacidade da Janela
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: colors.bgSecondary, color: colors.text }}>
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
                className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  accentColor: colors.blurple
                }}
              />
            </div>

            <div className="space-y-4 border-t pt-6" style={{ borderColor: colors.border }}>
              <span className="text-xs font-bold uppercase tracking-wide block" style={{ color: colors.muted }}>
                Cor de Destaque
              </span>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_ACCENTS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, accentColor: color })}
                    className="h-10 rounded-lg transition-all duration-200 border-2 flex items-center justify-center hover:scale-105"
                    style={{ 
                      backgroundColor: color === 'rgba(255,255,255,0.05)' ? colors.bgSecondary : color,
                      borderColor: (config.accentColor || 'rgba(255,255,255,0.05)') === color ? colors.text : 'transparent'
                    }}
                  >
                    {(config.accentColor || 'rgba(255,255,255,0.05)') === color && (
                      <Check size={16} color={color === 'rgba(255,255,255,0.05)' ? colors.text : '#fff'} className="drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t pt-6" style={{ borderColor: colors.border }}>
              <span className="text-xs font-bold uppercase tracking-wide block" style={{ color: colors.muted }}>
                Cor de Fundo
              </span>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, bgColor: color })}
                    className="h-10 rounded-lg transition-all duration-200 border-2 flex items-center justify-center hover:scale-105"
                    style={{ 
                      backgroundColor: color,
                      borderColor: config.bgColor === color ? colors.blurple : colors.border
                    }}
                  >
                    {config.bgColor === color && (
                      <Check size={16} color={getContrastYIQ(color) === 'light' ? '#000' : '#fff'} className="drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                <HexColorPicker 
                  color={config.bgColor} 
                  onChange={(color) => onUpdateConfig({ ...config, bgColor: color })} 
                  style={{ width: '100%', height: '140px' }}
                />
                <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <div 
                    className="w-8 h-8 rounded-md border shadow-inner"
                    style={{ backgroundColor: config.bgColor, borderColor: colors.border }}
                  />
                  <input 
                    type="text" 
                    value={config.bgColor.toUpperCase()}
                    onChange={(e) => onUpdateConfig({ ...config, bgColor: e.target.value })}
                    className="flex-1 text-sm font-mono px-3 py-2 rounded-md outline-none transition-all"
                    style={{ 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.blurple}
                    onBlur={(e) => e.target.style.borderColor = colors.border}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wide block" style={{ color: colors.muted }}>
              Sincronização na Nuvem
            </span>
            <p className="text-sm" style={{ color: colors.muted }}>
              Conecte-se para salvar suas tarefas e acessá-las de qualquer lugar.
            </p>
            
            {session ? (
              <div className="flex items-center justify-between p-4 rounded-xl border mt-4" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase mb-1" style={{ color: colors.muted }}>Conta Conectada</span>
                  <span className="text-sm font-medium" style={{ color: colors.text }}>{session.user.email}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-md transition-colors flex items-center justify-center"
                  style={{ backgroundColor: 'transparent', color: colors.danger }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.danger;
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.danger;
                  }}
                  title="Sair da conta"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <form className="space-y-3 p-4 rounded-xl border mt-4" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase" style={{ color: colors.muted }}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md px-3 py-2.5 text-sm outline-none transition-all"
                    style={{ 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.blurple}
                    onBlur={(e) => e.target.style.borderColor = colors.border}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase" style={{ color: colors.muted }}>Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md px-3 py-2.5 text-sm outline-none transition-all"
                    style={{ 
                      backgroundColor: colors.bg, 
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.blurple}
                    onBlur={(e) => e.target.style.borderColor = colors.border}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex-1 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-50"
                    style={{ backgroundColor: colors.blurple }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = colors.blurpleHover; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = colors.blurple; }}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="flex-1 text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 border"
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: colors.text,
                      borderColor: colors.border
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = colors.hover; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Registrar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
      
      <div className="pt-4 mt-2 border-t flex justify-between items-center text-xs font-medium" style={{ borderColor: colors.border, color: colors.muted }}>
        <span>Nexit Tech</span>
        <span>v0.1.3</span>
      </div>
    </div>
  );
}