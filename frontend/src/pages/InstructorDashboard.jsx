import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Waves, LogOut, Check, Calendar, MapPin, Users, RefreshCw, AlertCircle, Phone, CheckCircle, UserCheck } from 'lucide-react';

const InstructorDashboard = () => {
  const { user, logout, apiRequest } = useAuth();
  const [classes, setClasses] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const fetchInstructorClasses = async () => {
    try {
      setError(null);
      const data = await apiRequest('/instructor/classes');
      setClasses(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao carregar suas aulas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorClasses();
  }, []);

  const handleMarkAttendance = async (bookingId) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setActioningId(bookingId);

      const res = await apiRequest('/instructor/attendance', {
        method: 'POST',
        body: JSON.stringify({ bookingId })
      });

      setSuccessMsg(res.message || 'Presença marcada com sucesso!');
      await fetchInstructorClasses(); // Reload data
      
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setError(err.message || 'Falha ao confirmar presença.');
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando cronograma de aulas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-ocean-600 text-white rounded-xl shadow-md">
              <Waves className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">Surf<span className="text-ocean-600">Connect</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-slate-800">{user?.name}</p>
              <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">Instrutor</span>
            </div>
            <button 
              onClick={logout}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 rounded-xl transition-all cursor-pointer"
              title="Sair do sistema"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 animate-fade-in">
        
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erro</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Confirmado!</p>
              <p className="text-sm">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 font-sans">Quadro de Aulas</h2>
            <p className="text-slate-600">Monitore seus alunos inscritos e confirme a frequência nas atividades.</p>
          </div>
          <button 
            onClick={fetchInstructorClasses}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-ocean-600 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
            title="Atualizar Quadro"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="space-y-6">
          {classes.length === 0 ? (
            <div className="bg-white/50 border border-slate-200 p-12 text-center rounded-2xl">
              <p className="text-slate-500 font-semibold text-lg">Nenhuma aula atribuída a você.</p>
              <p className="text-slate-400 text-sm mt-1">Fale com o Administrador para cadastrar novas aulas com o seu perfil.</p>
            </div>
          ) : (
            classes.map((cls) => {
              const enrolledCount = cls.bookings.length;

              return (
                <div key={cls.id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                  
                  {/* Class Banner Info */}
                  <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-ocean-600" />
                        {cls.location}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(cls.datetime).toLocaleString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold text-slate-700">
                        {enrolledCount} de {cls.maxStudents} alunos matriculados
                      </span>
                    </div>
                  </div>

                  {/* Enrolled Students list */}
                  <div className="p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Lista de Alunos</h4>
                    
                    {enrolledCount === 0 ? (
                      <p className="text-slate-400 text-sm italic">Nenhum aluno agendado para esta aula até o momento.</p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {cls.bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                          >
                            <div className="space-y-1">
                              <p className="font-bold text-slate-800">{booking.student.name}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>{booking.student.email}</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  {booking.student.telefone}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Payment status badge inside instructor panel */}
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                booking.paymentStatus === 'PAID' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {booking.paymentStatus === 'PAID' ? 'Pago' : 'Pendente'}
                              </span>

                              {booking.paymentStatus === 'PAID' ? (
                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-4 h-4" /> Presença Confirmada
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMarkAttendance(booking.id)}
                                  disabled={actioningId === booking.id}
                                  className="px-3.5 py-1.5 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  {actioningId === booking.id ? 'Marcando...' : 'Marcar Presença'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
