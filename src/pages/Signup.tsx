import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Bot } from 'lucide-react';
import toast from 'react-hot-toast';

export const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('error_occurred'));
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
          <h1 className="text-3xl font-bold text-slate-900">{t('signup')}</h1>
          <p className="text-slate-600 mt-2">Create your SmartDesk AI account</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('full_name')}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
            />

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

            <Input
              label={t('confirm_password')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" loading={loading}>
              {t('signup')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {t('existing_user')}{' '}
              <Link to="/login" className="text-primary hover:text-primary-600 font-medium">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
