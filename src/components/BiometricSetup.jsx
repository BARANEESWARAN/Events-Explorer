import React, { useState, useEffect } from 'react';
import { 
  initRegistration, 
  verifyRegistration, 
  isWebAuthnSupported, 
  getBiometricStatus, 
  removeBiometricCredentials,
  checkExistingCredentials
} from '../services/webauthn';
import { startRegistration } from '@simplewebauthn/browser';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/BioMetricAuth.css';

const BiometricSetup = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const { currentUser, authMethod } = useAuth();
  const { translate } = useLanguage();

  useEffect(() => {
    console.log('BiometricSetup mounted, currentUser:', currentUser?.email);
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      console.log('Checking biometric status for:', currentUser?.email);
      const status = await getBiometricStatus();
      console.log('Biometric status response:', status);
      setHasBiometric(status.hasBiometric);
      
      if (status.hasBiometric && authMethod === 'password') {
        setError(translate('User already has biometric credentials. Please use biometric login instead.', 'المستخدم لديه بالفعل بيانات اعتماد بيومترية. يرجى استخدام تسجيل الدخول البيومتري بدلاً من ذلك.'));
      }
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const handleSetupBiometric = async () => {
    console.log('Setup biometric clicked for:', currentUser?.email);
    
    if (!currentUser) {
      setError(translate('You must be logged in to setup biometric authentication', 'يجب تسجيل الدخول لتمكين المصادقة البيومترية'));
      return;
    }

    if (!isWebAuthnSupported()) {
      setError(translate('WebAuthn not supported in this browser', 'WebAuthn غير مدعوم في هذا المتصفح'));
      return;
    }

    try {
      console.log('Checking existing credentials for:', currentUser.email);
      const hasExistingCredentials = await checkExistingCredentials(currentUser.email);
      console.log('Existing credentials result:', hasExistingCredentials);
      
      if (hasExistingCredentials) {
        setError(translate('User already has biometric credentials. Please use biometric login instead.', 'المستخدم لديه بالفعل بيانات اعتماد بيومترية. يرجى استخدام تسجيل الدخول البيومتري بدلاً من ذلك.'));
        return;
      }
    } catch (error) {
      console.error('Error checking existing credentials:', error);
      // Don't return here - allow registration to proceed even if check fails
    }

    setIsSettingUp(true);
    setError('');
    setSuccess(false);
    setNeedsRegistration(false);

    try {
      alert(translate(
        'Please follow the browser prompts to set up biometric authentication. This may include using your fingerprint, face recognition, or security key.',
        'يرجى اتباع مطالبات المتصفح لإعداد المصادقة البيومترية. قد يشمل ذلك استخدام بصمة الإصبع أو التعرف على الوجه أو مفتاح الأمان.'
      ));

      console.log('Initializing registration for:', currentUser.email);
      const options = await initRegistration(currentUser.email);
      console.log('Registration options received');
      
      const attestationResponse = await startRegistration(options);
      console.log('Registration response received');
      
      const result = await verifyRegistration(attestationResponse);
      console.log('Verification result:', result);
      
      if (result.verified) {
        setSuccess(true);
        setHasBiometric(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(translate('Registration failed', 'فشل التسجيل'));
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      
   
      if (error.needsRegistration) {
        setNeedsRegistration(true);
        setError(translate('No biometric credentials found. Please register your biometrics first.', 'لم يتم العثور على بيانات اعتماد بيومترية. يرجى تسجيل بياناتك البيومترية أولاً.'));
      } else {
        setError(error.message);
      }
      
      setTimeout(() => {
        setError('');
        setNeedsRegistration(false);
      }, 5000);
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleRemoveBiometric = async () => {
    if (!currentUser) return;

    setIsRemoving(true);
    setError('');
    setShowConfirm(false);
    setNeedsRegistration(false);

    try {
      await removeBiometricCredentials();
      setHasBiometric(false);
      setSuccess(translate('Biometric authentication removed successfully!', 'تم إزالة المصادقة البيومترية بنجاح!'));
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(translate('Failed to remove biometric', 'فشل في إزالة المصادقة البيومترية'));
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsRemoving(false);
    }
  };

  const confirmRemove = () => {
    setShowConfirm(true);
  };

  const cancelRemove = () => {
    setShowConfirm(false);
  };

  const clearError = () => {
    setError('');
    setNeedsRegistration(false);
  };

  if (!isWebAuthnSupported()) {
    return (
      <div className="biometric-not-supported">
        <div className="biometric-icon">
          <i className="fas fa-info-circle"></i>
        </div>
        <div className="biometric-content">
          <h4>{translate('Biometric Authentication Not Supported', 'المصادقة البيومترية غير مدعومة')}</h4>
          <p>{translate('Your browser or device does not support biometric authentication.', 'متصفحك أو جهازك لا يدعم المصادقة البيومترية.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="biometric-settings">
      <div className="biometric-header">
        <div className="biometric-icon">
          <i className="fas fa-fingerprint"></i>
        </div>
        <div className="biometric-title">
          <h3>{translate('Biometric Authentication', 'المصادقة البيومترية')}</h3>
          <p>{translate('Secure login using fingerprint, face recognition, or security key', 'تسجيل دخول آمن باستخدام بصمة الإصبع أو التعرف على الوجه أو مفتاح الأمان')}</p>
        </div>
      </div>

      {hasBiometric ? (
        <div className="biometric-status enabled">
          <div className="status-indicator">
            <div className="status-dot enabled"></div>
            <span>{translate('Enabled', 'مفعل')}</span>
          </div>
          
          <div className="status-message">
            <i className="fas fa-check-circle"></i>
            <span>{translate('Biometric authentication is active', 'المصادقة البيومترية مفعلة')}</span>
          </div>

          {showConfirm ? (
            <div className="confirmation-dialog">
              <p>{translate('Are you sure you want to remove biometric authentication?', 'هل أنت متأكد من أنك تريد إزالة المصادقة البيومترية؟')}</p>
              <div className="confirmation-actions">
                <button 
                  onClick={handleRemoveBiometric}
                  disabled={isRemoving}
                  className="btn btn-danger"
                >
                  {isRemoving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {translate('Removing...', 'جاري الإزالة...')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash"></i>
                      {translate('Yes, Remove', 'نعم، إزالة')}
                    </>
                  )}
                </button>
                <button 
                  onClick={cancelRemove}
                  className="btn btn-outline"
                >
                  <i className="fas fa-times"></i>
                  {translate('Cancel', 'إلغاء')}
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={confirmRemove}
              className="btn btn-outline btn-remove"
            >
              <i className="fas fa-trash"></i>
              {translate('Remove Biometric', 'إزالة البصمة')}
            </button>
          )}
        </div>
      ) : (
        <div className="biometric-status disabled">
          <div className="status-indicator">
            <div className="status-dot disabled"></div>
            <span>{translate('Disabled', 'معطل')}</span>
          </div>
          
          <div className="status-message">
            <i className="fas fa-info-circle"></i>
            <span>
              {needsRegistration 
                ? translate('Biometric registration required', 'مطلوب تسجيل بيومتري')
                : translate('Biometric authentication is not set up', 'المصادقة البيومترية غير مثبتة')
              }
            </span>
          </div>

          <button 
            onClick={handleSetupBiometric}
            disabled={isSettingUp}
            className="btn btn-primary btn-setup"
          >
            {isSettingUp ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {translate('Setting up...', 'جاري الإعداد...')}
              </>
            ) : (
              <>
                <i className="fas fa-fingerprint"></i>
                {needsRegistration 
                  ? translate('Register Biometric', 'تسجيل البصمة')
                  : translate('Set Up Biometric', 'إعداد البصمة')
                }
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={clearError} className="alert-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
        </div>
      )}

      <div className="biometric-help">
        <h4>{translate('How it works:', 'كيف تعمل:')}</h4>
        <ul>
          <li>
            <i className="fas fa-fingerprint"></i>
            {translate('Use fingerprint or face recognition', 'استخدم بصمة الإصبع أو التعرف على الوجه')}
          </li>
          <li>
            <i className="fas fa-key"></i>
            {translate('Works with security keys', 'تعمل مع مفاتيح الأمان')}
          </li>
          <li>
            <i className="fas fa-shield-alt"></i>
            {translate('More secure than passwords', 'أكثر أمانًا من كلمات المرور')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BiometricSetup;