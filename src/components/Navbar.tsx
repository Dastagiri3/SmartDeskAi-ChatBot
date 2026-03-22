import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bot, LogOut, Settings, User, LayoutDashboard, Shield } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-primary border-b border-primary-600 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">{t('app_name')}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              className="px-3 py-1.5 bg-primary-700 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {language === 'en' ? 'EN' : 'JA'}
            </button>

            {user && profile && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary-700 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.full_name}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-slate-200">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('dashboard')}</span>
                      </Link>
                      {profile.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>{t('admin_panel')}</span>
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>{t('settings')}</span>
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
