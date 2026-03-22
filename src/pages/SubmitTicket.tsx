import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Input, Textarea, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Bot, CheckCircle, AlertCircle } from 'lucide-react';
import { getAIResolution, simulateTranslation } from '../mock/aiMock';
import toast from 'react-hot-toast';

export const SubmitTicket = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    ticketLanguage: language,
    category: 'Network',
    description: '',
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [resolution, setResolution] = useState<{
    text: string;
    confidence: 'High' | 'Medium' | 'Low';
  } | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'Network', label: t('category_network') },
    { value: 'Software', label: t('category_software') },
    { value: 'Hardware', label: t('category_hardware') },
    { value: 'Access', label: t('category_access') },
    { value: 'Other', label: t('category_other') },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const { data: ticketNumberData } = await supabase
        .rpc('generate_ticket_number')
        .single();

      const ticketNumber = ticketNumberData || `TKT-${Date.now().toString().slice(-6)}`;

      let translatedDescription = formData.description;
      if (formData.ticketLanguage === 'ja') {
        translatedDescription = await simulateTranslation(formData.description, 'en');
      }

      const aiResponse = await getAIResolution(
        formData.category,
        translatedDescription
      );

      let translatedResolution = aiResponse.resolution;
      if (formData.ticketLanguage === 'ja') {
        translatedResolution = await simulateTranslation(aiResponse.resolution, 'ja');
      }

      const { data: ticketData, error } = await supabase
        .from('tickets')
        .insert({
          user_id: user!.id,
          ticket_number: ticketNumber,
          full_name: formData.fullName,
          email: formData.email,
          language: formData.ticketLanguage as 'en' | 'ja',
          category: formData.category as any,
          issue_description: formData.description,
          issue_description_translated:
            formData.ticketLanguage === 'ja' ? translatedDescription : null,
          ai_resolution: aiResponse.resolution,
          ai_resolution_translated:
            formData.ticketLanguage === 'ja' ? translatedResolution : null,
          confidence_score: aiResponse.confidence,
          status: 'Open',
        })
        .select()
        .single();

      if (error) throw error;

      setTicketId(ticketData.id);
      setResolution({
        text: formData.ticketLanguage === 'ja' ? translatedResolution : aiResponse.resolution,
        confidence: aiResponse.confidence,
      });

      toast.success(t('ticket_submitted'));
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error(t('error_occurred'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!ticketId) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: 'Resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(t('ticket_updated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(t('error_occurred'));
    }
  };

  const handleEscalate = async () => {
    if (!ticketId) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'Escalated' })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(t('ticket_updated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(t('error_occurred'));
    }
  };

  const getConfidenceBadge = (
    confidence: 'High' | 'Medium' | 'Low'
  ): 'high' | 'medium' | 'low' => {
    const map = { High: 'high', Medium: 'medium', Low: 'low' } as const;
    return map[confidence];
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t('new_ticket')}</h1>
          <p className="text-slate-600 mt-1">
            {language === 'en'
              ? 'Describe your IT issue and get instant AI-powered resolution'
              : 'IT問題を説明して、即座にAIによる解決策を取得'}
          </p>
        </div>

        {!resolution ? (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('full_name')}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />

                <Input
                  label={t('email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('language')}
                  options={languageOptions}
                  value={formData.ticketLanguage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketLanguage: e.target.value as 'en' | 'ja',
                    })
                  }
                  required
                />

                <Select
                  label={t('category')}
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>

              <Textarea
                label={t('issue_description')}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                required
                placeholder={
                  language === 'en'
                    ? 'Please describe your IT issue in detail...'
                    : 'IT問題を詳しく説明してください...'
                }
              />

              <Button type="submit" className="w-full" loading={analyzing}>
                {analyzing ? t('ai_analyzing') : t('submit_ticket')}
              </Button>
            </form>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {t('ai_resolution')}
                    </h2>
                    <Badge variant={getConfidenceBadge(resolution.confidence)}>
                      {t(`confidence_${resolution.confidence.toLowerCase()}` as any)}
                    </Badge>
                  </div>
                  <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                    {resolution.text}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="success"
                onClick={handleMarkResolved}
                className="w-full"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('mark_resolved')}
              </Button>
              <Button
                variant="danger"
                onClick={handleEscalate}
                className="w-full"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                {t('escalate')}
              </Button>
            </div>
          </>
        )}

        {analyzing && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
            <span className="text-slate-600 text-sm">{t('ai_analyzing')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
