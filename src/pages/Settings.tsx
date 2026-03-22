import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    preferredLanguage: profile?.preferred_language || 'en',
    emailNotifications: profile?.email_notifications ?? true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setFormData({
        fullName: profile.full_name,
        email: profile.email,
        preferredLanguage: profile.preferred_language,
        emailNotifications: profile.email_notifications,
      });
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          email: formData.email,
          preferred_language: formData.preferredLanguage as 'en' | 'ja',
          email_notifications: formData.emailNotifications,
        })
        .eq('id', user!.id);

      if (error) throw error;

      await refreshProfile();
      toast.success(t('profile_updated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-slate-900">{t('settings')}</h1>
          </div>
          <p className="text-slate-600 mt-1">
            {language === 'en'
              ? 'Manage your account settings and preferences'
              : 'アカウント設定と環境設定を管理'}
          </p>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('user_profile')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('full_name')}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label={t('email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Select
              label={t('preferred_language')}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
              ]}
              value={formData.preferredLanguage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredLanguage: e.target.value as 'en' | 'ja',
                })
              }
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={formData.emailNotifications}
                onChange={(e) =>
                  setFormData({ ...formData, emailNotifications: e.target.checked })
                }
                className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="emailNotifications" className="text-slate-700 font-medium">
                {t('email_notifications')}
              </label>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {t('save_changes')}
            </Button>
          </form>
        </Card>

        {profile?.role === 'admin' && (
          <Card className="mt-6 border-primary-200 bg-primary-50">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-white p-2 rounded-full">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-primary-900">
                  {language === 'en' ? 'Administrator Account' : '管理者アカウント'}
                </p>
                <p className="text-sm text-primary-700">
                  {language === 'en'
                    ? 'You have access to the admin panel'
                    : '管理パネルにアクセスできます'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
