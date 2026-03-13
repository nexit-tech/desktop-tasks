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
    '#313338', '#2b2d31', '#1e1f22', '#111214', 
    '#ffffff', '#f2f3f5', '#e3e5e8', '#232428'
  ];

  const PRESET_ACCENTS = [
    'rgba(0,0,0,0.12)', '#5865F2', '#23a559', '#f1c40f', 
    '#da373c', '#eb459e', '#00b0f4', '#ffffff'
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
    <div className="flex flex-col h-full animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-4 pl-1">
        <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5" style={{ color: 'var(--theme-muted)' }}>
          <Paintbrush size={14} />
          Configurações
        </h2>
        <button 
          onClick={onClose}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--theme-subtle)' }}
          onMouseEnter={(e) => {
             e.currentTarget.style.backgroundColor = 'var(--theme-hover)';
             e.currentTarget.style.color = 'inherit';
          }}
          onMouseLeave={(e) => {
             e.currentTarget.style.backgroundColor = 'transparent';
             e.currentTarget.style.color = 'var(--theme-subtle)';
          }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-2 mb-4 border-b pb-2" style={{ borderColor: 'var(--theme-border)' }}>
        <button 
          onClick={() => setActiveTab('appearance')}
          className="text-[12px] font-medium px-3 py-1.5 rounded transition-colors"
          style={{ 
            backgroundColor: activeTab === 'appearance' ? 'var(--theme-hover)' : 'transparent',
            color: activeTab === 'appearance' ? 'inherit' : 'var(--theme-subtle)'
          }}
        >
          Aparência
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          className="text-[12px] font-medium px-3 py-1.5 rounded transition-colors"
          style={{ 
            backgroundColor: activeTab === 'account' ? 'var(--theme-hover)' : 'transparent',
            color: activeTab === 'account' ? 'inherit' : 'var(--theme-subtle)'
          }}
        >
          Conta & Nuvem
        </button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {activeTab === 'appearance' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px] font-medium">
                <span>Opacidade da Janela</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--theme-subtle)' }}>
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
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all"
                style={{ backgroundColor: 'var(--theme-border)', accentColor: '#5865F2' }}
              />
            </div>

            <div className="space-y-2">
              <span className="text-[13px] font-medium block">Cor de Destaque (Bordas)</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_ACCENTS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, accentColor: color })}
                    className={`h-8 rounded transition-all duration-200 border flex items-center justify-center
                      ${(config.accentColor || 'rgba(0,0,0,0.12)') === color ? 'scale-95 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ 
                      backgroundColor: color === 'rgba(0,0,0,0.12)' ? 'var(--theme-focus)' : color,
                      borderColor: (config.accentColor || 'rgba(0,0,0,0.12)') === color ? 'inherit' : 'transparent'
                    }}
                    title={color === 'rgba(0,0,0,0.12)' ? 'Padrão' : color}
                  >
                    {(config.accentColor || 'rgba(0,0,0,0.12)') === color && <Check size={14} color={color === '#ffffff' ? '#000' : '#fff'} className="drop-shadow-sm" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[13px] font-medium block">Cor de Fundo</span>
              
              <div className="grid grid-cols-4 gap-2 mb-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdateConfig({ ...config, bgColor: color })}
                    className={`h-8 rounded transition-all duration-200 border flex items-center justify-center
                      ${config.bgColor === color ? 'scale-95 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ 
                      backgroundColor: color,
                      borderColor: config.bgColor === color ? 'inherit' : 'var(--theme-border)'
                    }}
                  >
                    {config.bgColor === color && <Check size={14} color={['#ffffff', '#f2f3f5', '#e3e5e8'].includes(color) ? '#000' : '#fff'} className="drop-shadow-sm" strokeWidth={3} />}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--theme-focus)', borderColor: 'var(--theme-border)' }}>
                <HexColorPicker 
                  color={config.bgColor} 
                  onChange={(color) => onUpdateConfig({ ...config, bgColor: color })} 
                  style={{ width: '100%', height: '120px' }}
                />
                <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                  <div 
                    className="w-6 h-6 rounded shadow-inner"
                    style={{ backgroundColor: config.bgColor, border: '1px solid var(--theme-border)' }}
                  />
                  <input 
                    type="text" 
                    value={config.bgColor.toUpperCase()}
                    onChange={(e) => onUpdateConfig({ ...config, bgColor: e.target.value })}
                    className="flex-1 bg-transparent text-[12px] font-mono outline-none"
                    style={{ color: 'inherit' }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <span className="text-[13px] font-medium block">Sincronização na Nuvem</span>
            <p className="text-[11px] mb-3 leading-relaxed" style={{ color: 'var(--theme-subtle)' }}>
              Conecte-se para salvar suas tarefas e acessá-las em outros dispositivos.
            </p>
            {session ? (
              <div className="flex items-center justify-between p-3 rounded border" style={{ backgroundColor: 'var(--theme-focus)', borderColor: 'var(--theme-border)' }}>
                <span className="text-[12px] font-medium truncate mr-2" style={{ color: '#23a559' }}>{session.user.email}</span>
                <button 
                  onClick={handleLogout} 
                  className="p-1.5 rounded transition-colors hover:bg-red-500/10 hover:text-red-500"
                  style={{ color: 'var(--theme-subtle)' }}
                  title="Sair"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <form className="space-y-2 p-3 rounded border" style={{ backgroundColor: 'var(--theme-focus)', borderColor: 'var(--theme-border)' }}>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded px-3 py-2 text-[12px] outline-none transition-colors border"
                  style={{ 
                    backgroundColor: 'var(--theme-hover)', 
                    color: 'inherit',
                    borderColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5865F2'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded px-3 py-2 text-[12px] outline-none transition-colors border"
                  style={{ 
                    backgroundColor: 'var(--theme-hover)', 
                    color: 'inherit',
                    borderColor: 'transparent'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5865F2'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex-1 text-white text-[12px] font-medium py-2 rounded transition-colors disabled:opacity-50"
                    style={{ backgroundColor: '#5865F2' }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4752c4'; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#5865F2'; }}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="flex-1 text-[12px] font-medium py-2 rounded transition-colors disabled:opacity-50 border"
                    style={{ backgroundColor: 'transparent', borderColor: 'var(--theme-border)', color: 'inherit' }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--theme-hover)'; }}
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
    </div>
  );
}