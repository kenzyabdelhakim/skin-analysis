import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { DermaStationWebsite } from './components/DermaStationWebsite';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';

export default function App() {
  const { user, isLoading } = useAuth();
  const [page, setPage] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return page === 'login'
      ? <LoginPage onGoToRegister={() => setPage('register')} />
      : <RegisterPage onGoToLogin={() => setPage('login')} />;
  }

  return <DermaStationWebsite />;
}
