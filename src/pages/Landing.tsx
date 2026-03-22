import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Bot, Zap, Globe, Clock, Shield } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <Bot className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            {t('app_name')}
          </h1>
          <p className="text-xl text-slate-600 mb-8">{t('tagline')}</p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="shadow-lg"
            >
              {t('login')}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="shadow-lg"
            >
              {t('signup')}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Instant AI Resolution
            </h3>
            <p className="text-slate-600 text-sm">
              Get immediate solutions powered by advanced AI technology for common IT issues
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Multilingual Support
            </h3>
            <p className="text-slate-600 text-sm">
              Submit tickets in English or Japanese with automatic translation
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="bg-warning-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              24/7 Availability
            </h3>
            <p className="text-slate-600 text-sm">
              Access help desk support anytime, anywhere with our AI assistant
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="bg-danger-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Enterprise Security
            </h3>
            <p className="text-slate-600 text-sm">
              Secure ticket management with role-based access control
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Submit Your Issue</h3>
              <p className="text-slate-600 text-sm">
                Describe your IT problem in English or Japanese
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Analysis</h3>
              <p className="text-slate-600 text-sm">
                Our AI analyzes your issue and searches the knowledge base
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Get Resolution</h3>
              <p className="text-slate-600 text-sm">
                Receive step-by-step solution or escalate to human support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
