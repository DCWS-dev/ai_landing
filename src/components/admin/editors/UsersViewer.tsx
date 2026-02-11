import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Mail, Phone, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface User {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  telegram: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
  createdAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  paid: number;
}

const statusConfig = {
  paid: { label: 'Оплачен', icon: CheckCircle, color: 'text-green-400 bg-green-400/10' },
  pending: { label: 'Ожидание', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10' },
  failed: { label: 'Ошибка', icon: XCircle, color: 'text-red-400 bg-red-400/10' },
};

export function UsersViewer() {
  const { getToken } = useAuth();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Ошибка загрузки');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted">
        <Loader2 size={24} className="animate-spin" />
        <span className="ml-2">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchUsers} className="text-accent hover:underline cursor-pointer">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Пользователи</h2>
          <p className="text-text-secondary text-sm mt-1">
            Всего: {data?.total ?? 0} &nbsp;·&nbsp; Оплатили: {data?.paid ?? 0}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          Обновить
        </button>
      </div>

      {!data?.users.length ? (
        <div className="card-glass rounded-xl p-12 text-center text-text-muted">
          Пока нет зарегистрированных пользователей
        </div>
      ) : (
        <div className="space-y-3">
          {data.users.map((user) => {
            const st = statusConfig[user.status];
            const Icon = st.icon;
            return (
              <div
                key={user.orderId}
                className="card-glass rounded-xl p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold truncate">{user.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                      <Icon size={12} />
                      {st.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={12} />
                      {user.email}
                    </span>
                    {user.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={12} />
                        {user.phone}
                      </span>
                    )}
                    {user.telegram && (
                      <span className="inline-flex items-center gap-1.5">
                        <Send size={12} />
                        {user.telegram}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-text-muted whitespace-nowrap">
                  <div>{user.amount?.toLocaleString('ru-RU')} ₽</div>
                  <div className="mt-1">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="font-mono mt-1 opacity-50">{user.orderId}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
