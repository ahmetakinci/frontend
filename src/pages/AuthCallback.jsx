import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh_token');

    if (token && refreshToken) {
      // Token'ları kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refreshToken);

      // Dashboard'a yönlendir
      navigate('/dashboard');
    } else {
      // Hata durumunda login'e yönlendir
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <Loading message="Completing Google sign in..." />;
};

export default AuthCallback;
