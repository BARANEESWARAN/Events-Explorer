import React, { useState } from 'react';
import { 
  initAuthentication, 
  verifyAuthentication,
  initRegistration,
  verifyRegistration,
  isWebAuthnSupported 
} from '../services/webauthn';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/BioMetricAuth.css';

const BioMetricAuth = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle');
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const { loginWithBiometric } = useAuth();
  const { translate } = useLanguage();

const handleBiometricLogin = async () => {
  if (!isWebAuthnSupported()) {
    if (onError) onError(translate('WebAuthn not supported in this browser', 'WebAuthn غير مدعوم في هذا المتصفح'));
    return;
  }

  setIsLoading(true);
  setAuthStatus('scanning');
  if (onError) onError('');

  try {
    // Prompt for email
    const email = prompt(translate('Please enter your email for biometric login', 'يرجى إدخال بريدك الإلكتروني للمصادقة البيومترية'));
    
    if (!email) {
      throw new Error(translate('Email is required', 'البريد الإلكتروني مطلوب'));
    }

    // Initialize authentication
    const options = await initAuthentication(email);
    
    // Start authentication with browser
    const assertionResponse = await startAuthentication(options);
    
    // Verify authentication
    const result = await verifyAuthentication(assertionResponse);
    
    if (result.verified) {
      setAuthStatus('success');
      
      // Use the biometric login function from auth context with REAL user data
      await loginWithBiometric(result.userId, result.email);
      
      if (onSuccess) onSuccess();
    } else {
      throw new Error(translate('Authentication failed', 'فشلت المصادقة'));
    }
  } catch (error) {
    setAuthStatus('error');
    console.error('Biometric login failed:', error);
    if (onError) onError(error.message);
  } finally {
    setIsLoading(false);
    setTimeout(() => setAuthStatus('idle'), 2000);
  }
};

  const handleBiometricRegistration = async () => {
    if (!registrationEmail) {
      if (onError) onError(translate('Email is required for registration', 'البريد الإلكتروني مطلوب للتسجيل'));
      return;
    }

    setIsLoading(true);
    setAuthStatus('registering');

    try {
   
      const options = await initRegistration(registrationEmail);
      
  
      const attestationResponse = await startRegistration(options);
      
   
      const result = await verifyRegistration(attestationResponse);
      
      if (result.verified) {
        setAuthStatus('registration-success');
        if (onSuccess) onSuccess();
      } else {
        throw new Error(translate('Registration failed', 'فشل التسجيل'));
      }
    } catch (error) {
      setAuthStatus('registration-error');
      console.error('Biometric registration failed:', error);
      if (onError) onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRegistration = () => {
    setNeedsRegistration(false);
    setRegistrationEmail('');
    setAuthStatus('idle');
  };

  if (!isWebAuthnSupported()) {
    return (
      <div className="biometric-not-supported">
        <i className="fas fa-info-circle"></i>
        <p>{translate('Biometric authentication not supported', 'المصادقة البيومترية غير مدعومة')}</p>
      </div>
    );
  }

  return (
    <div className="biometric-auth">
      <div className="or-divider">
        <span>{translate('Or', 'أو')}</span>
      </div>
      

      {authStatus === 'needs-registration' && (
        <div className="biometric-registration-prompt">
          <i className="fas fa-fingerprint"></i>
          <h4>{translate('Biometric Registration Required', 'مطلوب تسجيل البصمة')}</h4>
          <p>{translate('You need to register your biometric credentials before using this feature', 'تحتاج إلى تسجيل بياناتك البيومترية قبل استخدام هذه الميزة')}</p>
          <div className="registration-actions">
            <button 
              onClick={handleBiometricRegistration} 
              className="btn btn-primary"
            >
              {translate('Register Now', 'سجل الآن')}
            </button>
            <button 
              onClick={handleCancelRegistration} 
              className="btn btn-outline"
            >
              {translate('Cancel', 'إلغاء')}
            </button>
          </div>
        </div>
      )}

      {/* Registration in progress */}
      {authStatus === 'registering' && (
        <div className="biometric-scanning">
          <i className="fas fa-fingerprint fa-spin"></i>
          <p>{translate('Setting up biometric authentication...', 'جاري إعداد المصادقة البيومترية...')}</p>
        </div>
      )}

      {/* Registration success */}
      {authStatus === 'registration-success' && (
        <div className="biometric-success">
          <i className="fas fa-check-circle"></i>
          <p>{translate('Biometric registration successful!', 'تم تسجيل البصمة بنجاح!')}</p>
        </div>
      )}

      {/* Registration error */}
      {authStatus === 'registration-error' && (
        <div className="biometric-error">
          <i className="fas fa-times-circle"></i>
          <p>{translate('Registration failed', 'فشل التسجيل')}</p>
        </div>
      )}

      {/* Authentication in progress */}
      {authStatus === 'scanning' && (
        <div className="biometric-scanning">
          <i className="fas fa-fingerprint fa-spin"></i>
          <p>{translate('Waiting for biometric verification...', 'في انتظار التحقق البيومتري...')}</p>
        </div>
      )}

      {/* Authentication success */}
      {authStatus === 'success' && (
        <div className="biometric-success">
          <i className="fas fa-check-circle"></i>
          <p>{translate('Authentication successful!', 'تم المصادقة بنجاح!')}</p>
        </div>
      )}

      {/* Authentication error */}
      {authStatus === 'error' && (
        <div className="biometric-error">
          <i className="fas fa-times-circle"></i>
          <p>{translate('Authentication failed', 'فشلت المصادقة')}</p>
        </div>
      )}

      {/* Show login button when idle and not needing registration */}
      {authStatus === 'idle' && !needsRegistration && (
        <button 
          onClick={handleBiometricLogin} 
          disabled={isLoading}
          className="btn btn-biometric"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              {translate('Loading...', 'جاري التحميل...')}
            </>
          ) : (
            <>
              <i className="fas fa-fingerprint"></i>
              {translate('Login with Biometrics', 'تسجيل الدخول باستخدام البصمة')}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default BioMetricAuth;