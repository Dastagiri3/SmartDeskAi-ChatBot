import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Ticket, Clock, CheckCircle, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';

type TicketRow = Database['public']['Tables']['tickets']['Row'];

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolvedToday: 0,
    avgResponseTime: 12,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTickets();
  }, [user, navigate]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets(data || []);

      const total = data?.length || 0;
      const open = data?.filter((t) => t.status === 'Open').length || 0;
      const today = new Date().toISOString().split('T')[0];
      const resolvedToday =
        data?.filter(
          (t) => t.status === 'Resolved' && t.resolved_at?.split('T')[0] === today
        ).length || 0;

      setStats({
        total,
        open,
        resolvedToday,
        avgResponseTime: 12,
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: 'open' | 'resolved' | 'escalated' } = {
      Open: 'open',
      Resolved: 'resolved',
      Escalated: 'escalated',
    };
    return statusMap[status] || 'open';
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Open: t('status_open'),
      Resolved: t('status_resolved'),
      Escalated: t('status_escalated'),
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('dashboard')}</h1>
            <p className="text-slate-600 mt-1">
              {language === 'en' ? 'Welcome back' : 'おかえりなさい'}, {profile?.full_name}
            </p>
          </div>
          <Button onClick={() => navigate('/submit-ticket')} className="shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            {t('new_ticket')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{t('total_tickets')}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{t('open_tickets')}</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.open}</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <Ticket className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{t('resolved_today')}</p>
                <p className="text-3xl font-bold text-accent mt-1">{stats.resolvedToday}</p>
              </div>
              <div className="bg-accent-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{t('avg_response_time')}</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {stats.avgResponseTime}
                  <span className="text-base font-normal ml-1">{t('minutes')}</span>
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t('recent_tickets')}</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-slate-600 mt-2">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">{t('no_tickets_yet')}</p>
              <p className="text-sm text-slate-500 mb-4">{t('create_first_ticket')}</p>
              <Button onClick={() => navigate('/submit-ticket')}>
                <Plus className="w-4 h-4 mr-2" />
                {t('new_ticket')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('ticket_id')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('category')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('issue_summary')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('language')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('submitted_at')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-primary font-medium">
                          {ticket.ticket_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">{ticket.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">
                          {ticket.issue_description.substring(0, 60)}
                          {ticket.issue_description.length > 60 ? '...' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadge(ticket.status)}>
                          {getStatusText(ticket.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={ticket.language === 'en' ? 'en' : 'ja'}>
                          {ticket.language.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-600">
                          {format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
