import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, RefreshCw } from 'lucide-react';

const AdminFeedbackList = () => {
  const { apiRequest } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/feedbacks');
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" /> Feedbacks dos Usuários
        </h2>
        <button onClick={fetchFeedbacks} className="p-2 text-zinc-400 hover:text-white">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Carregando...</p>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map(f => (
            <div key={f.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <p className="text-white">{f.message}</p>
              <p className="text-xs text-zinc-500 mt-2">
                {f.user.name} ({f.user.email}) — {new Date(f.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackList;
