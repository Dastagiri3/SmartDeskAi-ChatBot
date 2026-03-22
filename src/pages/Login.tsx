import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Bot } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(t('welcome_back'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('error_occurred'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Bot className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{t('login')}</h1>
          <p className="text-slate-600 mt-2">{t('welcome_back')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />

            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" loading={loading}>
              {t('login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {t('new_user')}{' '}
              <Link to="/signup" className="text-primary hover:text-primary-600 font-medium">
                {t('signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
