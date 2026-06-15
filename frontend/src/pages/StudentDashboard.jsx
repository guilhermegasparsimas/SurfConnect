import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Waves, LogOut, CloudSun, MapPin, Calendar, User, CheckCircle2, AlertCircle, RefreshCw, X, CreditCard } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout, apiRequest } = useAuth();
  const [classes, setClasses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [weather, setWeather] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [activePixBooking, setActivePixBooking] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      // Fetch Weather, Available Classes, and Bookings concurrently
      const [weatherData, classesData, bookingsData] = await Promise.all([
        apiRequest('/weather'),
        apiRequest('/student/classes'),
        apiRequest('/student/bookings')
      ]);

      setWeather(weatherData);
      setClasses(classesData);
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao carregar dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBooking = async (classId) => {
    try {
      setError(null);
      setSuccessMsg(null);
      
      const res = await apiRequest('/student/bookings', {
        method: 'POST',
        body: JSON.stringify({ classId })
      });

      setSuccessMsg(res.message || 'Aula agendada com sucesso!');
      
      // Auto open mock payment dialog
      if (res.booking) {
        setActivePixBooking(res.booking);
      }

      // Refresh data
      await fetchDashboardData();
      
      // Clear success banner after 5s
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setError(err.message || 'Falha ao realizar agendamento.');
    }
  };

  // Helper: check if student has booked this class
  const isAlreadyBooked = (classId) => {
    return bookings.some(b => b.classId === classId && b.status === 'CONFIRMED');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando ondas e aulas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh pb-12">
      {/* Premium Header */}
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
              <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">Aluno</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 animate-fade-in">
        
        {/* Alerts Banner */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Atenção</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sucesso!</p>
              <p className="text-sm">{successMsg}</p>
            </div>
          </div>
        )}

        {/* 1. Dynamic Weather Card widget */}
        {weather && (
          <div className="glass-card p-6 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
              <CloudSun className="w-48 h-48" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-ocean-700">
                  <CloudSun className="w-6 h-6 animate-pulse" />
                  <span className="font-bold text-sm tracking-wide uppercase">Previsão das Ondas e Clima</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{weather.location}</h2>
                <p className="text-slate-600 max-w-2xl">{weather.summary}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/50 p-4 rounded-xl border border-white/80">
                <div className="text-center p-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Ondas</p>
                  <p className="text-lg font-bold text-ocean-600">{weather.waves}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Vento</p>
                  <p className="text-lg font-bold text-ocean-600">{weather.wind}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Água</p>
                  <p className="text-lg font-bold text-ocean-600">{weather.waterTemp}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Condição</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    {weather.condition}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Available Classes Schedule */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📅 Aulas Disponíveis
            </h3>
            <button 
              onClick={fetchDashboardData}
              className="p-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-ocean-600 rounded-xl border border-slate-200 shadow-sm transition-all"
              title="Atualizar Aulas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.length === 0 ? (
              <div className="col-span-full bg-white/50 border border-slate-200/60 p-8 text-center rounded-2xl">
                <p className="text-slate-500 font-medium">Nenhuma aula cadastrada no momento.</p>
              </div>
            ) : (
              classes.map((cls) => {
                const booked = isAlreadyBooked(cls.id);
                const isFull = cls.slotsLeft <= 0;

                return (
                  <div 
                    key={cls.id} 
                    className={`bg-white rounded-2xl shadow-md border hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                      booked ? 'border-ocean-300 ring-2 ring-ocean-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      {/* Class Spot availability indicator */}
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2.5 py-0.5 font-bold rounded-full ${
                          isFull 
                            ? 'bg-red-100 text-red-800' 
                            : cls.slotsLeft === 1 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isFull ? 'Lotada' : `${cls.slotsLeft} vagas restantes`}
                        </span>
                        
                        {booked && (
                          <span className="text-xs px-2.5 py-0.5 bg-ocean-100 text-ocean-800 font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Agendada
                          </span>
                        )}
                      </div>

                      {/* Location and Info */}
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-ocean-600 flex-shrink-0" />
                          {cls.location}
                        </h4>
                        
                        <p className="text-sm text-slate-600 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          {new Date(cls.datetime).toLocaleString('pt-BR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>

                        <p className="text-sm text-slate-600 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          Instrutor: <span className="font-medium">{cls.instructorName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100">
                      <button
                        onClick={() => handleBooking(cls.id)}
                        disabled={isFull || booked}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
                          booked 
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : isFull 
                              ? 'bg-red-50 text-red-400 cursor-not-allowed border border-red-200' 
                              : 'bg-ocean-600 hover:bg-ocean-700 text-white hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                        }`}
                      >
                        {booked ? 'Você já vai participar' : isFull ? 'Turma Esgotada' : 'Agendar Aula'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 3. Personal Booking History */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">
            🏄‍♂️ Meu Histórico de Agendamentos
          </h3>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase">
                    <th className="py-4 px-6">Local / Praia</th>
                    <th className="py-4 px-6">Data e Hora</th>
                    <th className="py-4 px-6">Instrutor</th>
                    <th className="py-4 px-6">Status Reserva</th>
                    <th className="py-4 px-6">Pagamento</th>
                    <th className="py-4 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 px-6 text-center text-slate-500 font-medium">
                        Você ainda não fez nenhum agendamento.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {booking.class.location}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {new Date(booking.class.datetime).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {booking.class.instructor.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            booking.paymentStatus === 'PAID' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {booking.paymentStatus === 'PAID' ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {booking.paymentStatus === 'PENDING' && booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => setActivePixBooking(booking)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Pagar Pix
                            </button>
                          )}
                          {booking.paymentStatus === 'PAID' && (
                            <span className="text-emerald-600 font-medium text-xs flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Vaga Garantida
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Mock PIX payment Modal */}
      {activePixBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden bg-white/95 border border-white">
            <button 
              onClick={() => setActivePixBooking(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center space-y-4 pt-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Pagamento Pix pendente</h3>
              <p className="text-sm text-slate-600">
                Para confirmar sua vaga na aula em <strong>{activePixBooking.class?.location || activePixBooking.class?.location}</strong>, realize o pagamento via Pix.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Valor da Aula:</span>
                  <strong className="text-slate-800">R$ 85,00</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Agendamento ID:</span>
                  <strong className="text-slate-800">#{activePixBooking.id}</strong>
                </div>
                
                {/* Mock QR code design */}
                <div className="pt-2">
                  <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Código Pix Copia e Cola:</p>
                  <textarea
                    readOnly
                    className="w-full text-xs font-mono bg-slate-100 border border-slate-200 rounded-lg p-2 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                    value={`00020126580014BR.GOV.BCB.PIX0114surfconnectpix030485005802BR5911SurfConnect6009SaoPaulo62070503#${activePixBooking.id}`}
                    onClick={(e) => {
                      e.target.select();
                      document.execCommand('copy');
                      alert('Código Pix copiado para a área de transferência!');
                    }}
                  />
                  <span className="text-[10px] text-slate-400 block mt-1 text-center font-medium">Clique dentro da caixa acima para copiar o código.</span>
                </div>
              </div>
              
              <div className="pt-2 text-xs text-slate-400 italic">
                *Nota: Ao simular "Marcar Presença" na tela do Instrutor, o status de pagamento mudará automaticamente para PAGO!
              </div>

              <button
                onClick={() => setActivePixBooking(null)}
                className="w-full py-2.5 px-4 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Concluído / Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
