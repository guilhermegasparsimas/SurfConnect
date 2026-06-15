import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Waves, LogOut, Users, Calendar, DollarSign, Plus, RefreshCw, AlertCircle, CheckCircle, MapPin, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, apiRequest } = useAuth();
  
  // Dashboard states
  const [metrics, setMetrics] = useState({ totalStudents: 0, classesToday: 0, totalEarnings: 0 });
  const [instructors, setInstructors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [classesList, setClassesList] = useState([]);

  // Form states
  const [datetime, setDatetime] = useState('');
  const [location, setLocation] = useState('');
  const [maxStudents, setMaxStudents] = useState('5');
  const [instructorId, setInstructorId] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAdminData = async () => {
    try {
      setError(null);
      const [metricsData, instructorsData, bookingsData, classesData] = await Promise.all([
        apiRequest('/admin/metrics'),
        apiRequest('/admin/instructors'),
        apiRequest('/admin/bookings'),
        apiRequest('/admin/classes')
      ]);

      setMetrics(metricsData);
      setInstructors(instructorsData);
      setBookings(bookingsData);
      setClassesList(classesData);

      // Pre-select first instructor in list if form select is empty
      if (instructorsData.length > 0 && !instructorId) {
        setInstructorId(instructorsData[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      await apiRequest('/admin/classes', {
        method: 'POST',
        body: JSON.stringify({
          datetime,
          location,
          maxStudents,
          instructorId
        })
      });

      setSuccessMsg('Aula de surf criada com sucesso!');
      
      // Reset form
      setDatetime('');
      setLocation('');
      setMaxStudents('5');
      if (instructors.length > 0) {
        setInstructorId(instructors[0].id.toString());
      }

      // Reload lists and metrics
      await loadAdminData();

      // Clear success notification
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setError(err.message || 'Erro ao criar nova aula.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando painel de controle...</p>
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
              <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-800 font-bold rounded-full">Administrador</span>
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
        
        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erro no Servidor</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl flex items-start gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sucesso!</p>
              <p className="text-sm">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Title & Refresh */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 font-sans">Painel de Administração</h2>
            <p className="text-slate-600">Gerencie a agenda, instrutores e visualize as estatísticas financeiras.</p>
          </div>
          <button 
            onClick={loadAdminData}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-ocean-600 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer animate-none"
            title="Atualizar Painel"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Metrics Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Alunos */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total de Alunos</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.totalStudents}</p>
            </div>
          </div>

          {/* Card 2: Aulas de Hoje */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Aulas Hoje</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.classesToday}</p>
            </div>
          </div>

          {/* Card 3: Faturamento */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-6 flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Previsão Faturamento</p>
              <p className="text-2xl font-bold text-slate-800">
                {metrics.totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </section>

        {/* Two Columns: Create Class and Classes Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Create New Class Form */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-ocean-600" />
                <h3 className="font-bold text-slate-800">Agendar Nova Aula</h3>
              </div>
              <form onSubmit={handleCreateClass} className="p-5 space-y-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Praia / Localização</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Praia da Joaquina (SC)"
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 text-sm transition-all"
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Data e Horário</label>
                  <input
                    type="datetime-local"
                    required
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 text-sm transition-all"
                  />
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Instrutor Responsável</label>
                  <select
                    required
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 text-sm transition-all"
                  >
                    {instructors.length === 0 ? (
                      <option value="">Nenhum instrutor cadastrado</option>
                    ) : (
                      instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.telefone})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Max Students Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Limite de Vagas (Alunos)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="15"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || instructors.length === 0}
                  className="w-full py-2.5 px-4 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Criando...' : 'Adicionar Aula'}
                </button>
              </form>
            </div>
          </section>

          {/* 3. Existing Surf Classes List */}
          <section className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-slate-400" /> Agenda Escolar
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classesList.length === 0 ? (
                <div className="col-span-full bg-white/50 border border-slate-200/60 p-8 text-center rounded-2xl">
                  <p className="text-slate-400 text-sm italic">Nenhuma aula na agenda ainda.</p>
                </div>
              ) : (
                classesList.map((c) => {
                  const bookedCount = c.bookings.length;

                  return (
                    <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Aula #{c.id}</span>
                          <span className="text-xs px-2.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-800 font-bold rounded-full">
                            {bookedCount} / {c.maxStudents} Vagas
                          </span>
                        </div>
                        
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-ocean-600 flex-shrink-0" />
                          {c.location}
                        </h5>

                        <p className="text-xs text-slate-500">
                          <strong>Data:</strong> {new Date(c.datetime).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                        <strong>Instrutor:</strong> {c.instructor.name}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* 4. Bookings Management Table */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-1.5">
            <ClipboardList className="w-6 h-6 text-slate-400" /> Todos os Agendamentos do Sistema
          </h3>
          
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Aluno</th>
                    <th className="py-4 px-6">WhatsApp</th>
                    <th className="py-4 px-6">Aula / Local</th>
                    <th className="py-4 px-6">Horário da Aula</th>
                    <th className="py-4 px-6">Instrutor</th>
                    <th className="py-4 px-6">Matrícula</th>
                    <th className="py-4 px-6">Financeiro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 px-6 text-center text-slate-500 font-medium italic">
                        Nenhum agendamento realizado no sistema.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-400">#{b.id}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{b.student.name}</td>
                        <td className="py-4 px-6 text-slate-500 font-mono text-xs">{b.student.telefone}</td>
                        <td className="py-4 px-6">{b.class.location}</td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {new Date(b.class.datetime).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-6">{b.class.instructor.name}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            b.status === 'CONFIRMED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            b.paymentStatus === 'PAID' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.paymentStatus === 'PAID' ? 'Pago' : 'Pendente'}
                          </span>
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
    </div>
  );
};

export default AdminDashboard;
