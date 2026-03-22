import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Select } from '../components/Input';
import { Shield, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type TicketRow = Database['public']['Tables']['tickets']['Row'];

export const AdminPanel = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    language: 'all',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile?.role !== 'admin') {
      toast.error('Access denied - Admin only');
      navigate('/dashboard');
      return;
    }

    fetchAllTickets();
  }, [user, profile, navigate]);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter((ticket) => {
      if (filter.status !== 'all' && ticket.status !== filter.status) return false;
      if (filter.category !== 'all' && ticket.category !== filter.category)
        return false;
      if (filter.language !== 'all' && ticket.language !== filter.language)
        return false;
      return true;
    });
  };

  const exportToCSV = () => {
    const filteredTickets = getFilteredTickets();

    const headers = [
      'Ticket ID',
      'Name',
      'Email',
      'Category',
      'Status',
      'Language',
      'Confidence',
      'Submitted',
    ];

    const rows = filteredTickets.map((ticket) => [
      ticket.ticket_number,
      ticket.full_name,
      ticket.email,
      ticket.category,
      ticket.status,
      ticket.language,
      ticket.confidence_score || 'N/A',
      format(new Date(ticket.created_at), 'yyyy-MM-dd HH:mm'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast.success('Export completed');
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

  const filteredTickets = getFilteredTickets();
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-slate-900">{t('admin_panel')}</h1>
            </div>
            <p className="text-slate-600 mt-1">
              {language === 'en' ? 'Manage all support tickets' : 'すべてのサポートチケットを管理'}
            </p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="w-5 h-5 mr-2" />
            {t('export_csv')}
          </Button>
        </div>

        {escalatedCount > 0 && (
          <Card className="mb-6 border-danger-200 bg-danger-50">
            <div className="flex items-center space-x-3">
              <div className="bg-danger text-white p-2 rounded-full">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-danger-900">
                  {escalatedCount} {t('escalated_tickets')}
                </p>
                <p className="text-sm text-danger-700">
                  {language === 'en'
                    ? 'These tickets require immediate attention'
                    : 'これらのチケットは早急な対応が必要です'}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">{t('filter')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={t('status')}
              options={[
                { value: 'all', label: language === 'en' ? 'All Status' : '全ステータス' },
                { value: 'Open', label: t('status_open') },
                { value: 'Resolved', label: t('status_resolved') },
                { value: 'Escalated', label: t('status_escalated') },
              ]}
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            />
            <Select
              label={t('category')}
              options={[
                { value: 'all', label: language === 'en' ? 'All Categories' : '全カテゴリ' },
                { value: 'Network', label: t('category_network') },
                { value: 'Software', label: t('category_software') },
                { value: 'Hardware', label: t('category_hardware') },
                { value: 'Access', label: t('category_access') },
                { value: 'Other', label: t('category_other') },
              ]}
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            />
            <Select
              label={t('language')}
              options={[
                { value: 'all', label: language === 'en' ? 'All Languages' : '全言語' },
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
              ]}
              value={filter.language}
              onChange={(e) => setFilter({ ...filter, language: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {t('all_tickets')} ({filteredTickets.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-slate-600 mt-2">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No tickets found</p>
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
                      {t('full_name')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('category')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      {t('confidence')}
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
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                        ticket.status === 'Escalated' ? 'bg-danger-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-primary font-medium">
                          {ticket.ticket_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">{ticket.full_name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">{ticket.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadge(ticket.status)}>
                          {getStatusText(ticket.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">
                          {ticket.confidence_score || 'N/A'}
                        </span>
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
