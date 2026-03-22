import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Bot, CheckCircle, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type TicketRow = Database['public']['Tables']['tickets']['Row'];

export const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) {
      navigate('/login');
      return;
    }
    fetchTicket();
  }, [user, id, navigate]);

  const fetchTicket = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;

      setTicket(data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error(t('error_occurred'));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!ticket) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'Resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', ticket.id);

      if (error) throw error;

      toast.success(t('ticket_updated'));
      fetchTicket();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(t('error_occurred'));
    }
  };

  const handleEscalate = async () => {
    if (!ticket) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'Escalated' })
        .eq('id', ticket.id);

      if (error) throw error;

      toast.success(t('ticket_updated'));
      fetchTicket();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(t('error_occurred'));
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

  const getConfidenceBadge = (
    confidence: string
  ): 'high' | 'medium' | 'low' => {
    const map: { [key: string]: 'high' | 'medium' | 'low' } = {
      High: 'high',
      Medium: 'medium',
      Low: 'low',
    };
    return map[confidence] || 'low';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-slate-600 mt-2">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Ticket not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {ticket.ticket_number}
            </h1>
            <Badge variant={getStatusBadge(ticket.status)}>
              {getStatusText(ticket.status)}
            </Badge>
          </div>
          <p className="text-slate-600">
            {t('submitted_at')}: {format(new Date(ticket.created_at), 'MMMM dd, yyyy HH:mm')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {language === 'en' ? 'Ticket Information' : 'チケット情報'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">{t('full_name')}</p>
                <p className="text-slate-900 font-medium">{ticket.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('email')}</p>
                <p className="text-slate-900 font-medium">{ticket.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('category')}</p>
                <p className="text-slate-900 font-medium">{ticket.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('language')}</p>
                <Badge variant={ticket.language === 'en' ? 'en' : 'ja'}>
                  {ticket.language.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {t('issue_description')}
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap">{ticket.issue_description}</p>
            {ticket.issue_description_translated && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  {language === 'en' ? 'English Translation' : '英語翻訳'}
                </p>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {ticket.issue_description_translated}
                </p>
              </div>
            )}
          </Card>

          {ticket.ai_resolution && (
            <Card>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {t('ai_resolution')}
                    </h2>
                    {ticket.confidence_score && (
                      <Badge variant={getConfidenceBadge(ticket.confidence_score)}>
                        {t(`confidence_${ticket.confidence_score.toLowerCase()}` as any)}
                      </Badge>
                    )}
                  </div>
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    {ticket.language === 'ja' && ticket.ai_resolution_translated
                      ? ticket.ai_resolution_translated
                      : ticket.ai_resolution}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {language === 'en' ? 'Status Timeline' : 'ステータスタイムライン'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary p-2 rounded-full">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {language === 'en' ? 'Ticket Submitted' : 'チケット提出'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {format(new Date(ticket.created_at), 'MMMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              {ticket.ai_resolution && (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary p-2 rounded-full">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {language === 'en' ? 'AI Analysis Completed' : 'AI分析完了'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(ticket.created_at), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
              {ticket.status === 'Resolved' && ticket.resolved_at && (
                <div className="flex items-start space-x-3">
                  <div className="bg-accent p-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {language === 'en' ? 'Ticket Resolved' : 'チケット解決'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(ticket.resolved_at), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
              {ticket.status === 'Escalated' && (
                <div className="flex items-start space-x-3">
                  <div className="bg-danger p-2 rounded-full">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {language === 'en' ? 'Escalated to Human Support' : '人間サポートにエスカレート'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {format(new Date(ticket.updated_at), 'MMMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {ticket.status === 'Open' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="success"
                onClick={handleMarkResolved}
                className="w-full"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('mark_resolved')}
              </Button>
              <Button variant="danger" onClick={handleEscalate} className="w-full">
                <AlertCircle className="w-5 h-5 mr-2" />
                {t('escalate')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
