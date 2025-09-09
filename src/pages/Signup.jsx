import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      return setError(translate('Passwords do not match', 'كلمات المرور غير متطابقة'));
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError(translate('Failed to create account', 'فشل في إنشاء الحساب'));
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{translate('Sign Up', 'إنشاء حساب')}</h1>
          <p>{translate('Join City Pulse today', 'انضم إلى City Pulse اليوم')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              {translate('Email', 'البريد الإلكتروني')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {translate('Password', 'كلمة المرور')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {translate('Password Confirmation', 'تأكيد كلمة المرور')}
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? translate('Creating Account...', 'جاري إنشاء الحساب...') : translate('Sign Up', 'إنشاء حساب')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {translate('Already have an account?', 'لديك حساب بالفعل؟')}{' '}
            <Link to="/login">{translate('Sign In', 'تسجيل الدخول')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;