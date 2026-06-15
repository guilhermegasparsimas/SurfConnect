import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [role, setRole] = useState('STUDENT');

  // Status states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setTelefone('');
    setRole('STUDENT');
    setError(null);
    setSuccess(null);
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        // Handle Login
        const user = await login(email, password);
        setSuccess('Login realizado com sucesso! Redirecionando...');
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'ADMIN') navigate('/admin');
          else if (user.role === 'INSTRUCTOR') navigate('/instructor');
          else navigate('/student');
        }, 1000);

      } else {
        // Handle Registration
        await register({ name, email, password, role, telefone });
        setSuccess('Cadastro realizado! Agora você já pode fazer login.');
        
        // Auto-switch to login tab and fill email
        setTimeout(() => {
          setIsLogin(true);
          setError(null);
          setSuccess(null);
          setPassword('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro no processo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Animated logo and title */}
        <div className="inline-flex items-center justify-center p-3 bg-ocean-600 text-white rounded-2xl shadow-lg animate-wave mb-4">
          <Waves className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
          Surf<span className="text-ocean-600">Connect</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Escola de Surf — Gestão & Agendamentos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="glass-card py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-white/40">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 pb-4 text-center font-semibold text-lg transition-all border-b-2 ${
                isLogin 
                  ? 'border-ocean-600 text-ocean-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 pb-4 text-center font-semibold text-lg transition-all border-b-2 ${
                !isLogin 
                  ? 'border-ocean-600 text-ocean-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Cadastrar-se
            </button>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded-r-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* NAME field (only for Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João da Silva"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMAIL field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Endereço de E-mail
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@surfconnect.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* TELEFONE field (only for Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  WhatsApp / Telefone
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* ROLE field (only for Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Perfil de Acesso (RBAC)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
                >
                  <option value="STUDENT">Aluno (STUDENT)</option>
                  <option value="INSTRUCTOR">Instrutor (INSTRUCTOR)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  Selecione o tipo de conta para testar o sistema RBAC completo.
                </p>
              </div>
            )}

            {/* PASSWORD field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                {submitting ? 'Aguarde...' : isLogin ? 'Entrar no Sistema' : 'Criar minha Conta'}
              </button>
            </div>
          </form>

          {/* Quick Helper for seed accounts */}
          {isLogin && (
            <div className="mt-8 pt-6 border-t border-slate-200/60 text-xs text-slate-500 space-y-1 bg-slate-50/50 p-3 rounded-xl">
              <span className="font-semibold text-slate-700 block mb-1">Contas de teste padrão:</span>
              <div>🧑‍🎓 Aluno: <code className="bg-slate-100 px-1 py-0.5 rounded text-ocean-700">lucas@surfconnect.com</code> / <code className="bg-slate-100 px-1">stud123</code></div>
              <div>🏄‍♂️ Instrutor: <code className="bg-slate-100 px-1 py-0.5 rounded text-ocean-700">joao@surfconnect.com</code> / <code className="bg-slate-100 px-1">inst123</code></div>
              <div>🔑 Admin: <code className="bg-slate-100 px-1 py-0.5 rounded text-ocean-700">admin@surfconnect.com</code> / <code className="bg-slate-100 px-1">admin123</code></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
