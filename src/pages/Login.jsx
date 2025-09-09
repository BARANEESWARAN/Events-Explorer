// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useLanguage } from '../contexts/LanguageContext';
// import BioMetricAuth from '../components/BioMetricAuth';
// import '../styles/Auth.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const { translate } = useLanguage();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       setError('');
//       setLoading(true);
//       await login(email, password);
//       navigate('/');
//     } catch (error) {
//       setError(translate('Failed to sign in', 'فشل تسجيل الدخول'));
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBiometricSuccess = () => {
//     navigate('/');
//   };

//   const handleBiometricError = (errorMessage) => {
//     setError(errorMessage);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h1>{translate('Sign In', 'تسجيل الدخول')}</h1>
//           <p>{translate('Welcome back to City Pulse', 'مرحبًا بعودتك إلى City Pulse')}</p>
//         </div>

//         {error && (
//           <div className="auth-error">
//             <i className="fas fa-exclamation-circle"></i>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label className="form-label">
//               {translate('Email', 'البريد الإلكتروني')}
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-input"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">
//               {translate('Password', 'كلمة المرور')}
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//               required
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="btn btn-primary auth-btn"
//             disabled={loading}
//           >
//             {loading ? translate('Signing In...', 'جاري تسجيل الدخول...') : translate('Sign In', 'تسجيل الدخول')}
//           </button>
//         </form>

//         <BioMetricAuth 
//           onSuccess={handleBiometricSuccess}
//           onError={handleBiometricError}
//         />

//         <div className="auth-footer">
//           <p>
//             {translate("Don't have an account?", 'ليس لديك حساب؟')}{' '}
//             <Link to="/signup">{translate('Sign Up', 'إنشاء حساب')}</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BioMetricAuth from '../components/BioMetricAuth';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(translate('Failed to sign in', 'فشل تسجيل الدخول'));
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = () => {
    navigate('/');
  };

  const handleBiometricError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{translate('Sign In', 'تسجيل الدخول')}</h1>
          <p>{translate('Welcome back to City Pulse', 'مرحبًا بعودتك إلى City Pulse')}</p>
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

          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? translate('Signing In...', 'جاري تسجيل الدخول...') : translate('Sign In', 'تسجيل الدخول')}
          </button>
        </form>

        <BioMetricAuth 
          onSuccess={handleBiometricSuccess}
          onError={handleBiometricError}
        />

        <div className="auth-footer">
          <p>
            {translate("Don't have an account?", 'ليس لديك حساب؟')}{' '}
            <Link to="/signup">{translate('Sign Up', 'إنشاء حساب')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;