import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import BiometricSetup from '../components/BiometricSetup';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, isMockUser, updateUserProfile, authMethod } = useAuth();
  const { favorites, isLoading } = useFavorites();
  const { language, translate } = useLanguage();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateUserProfile({
        displayName,
        photoURL: photoURL || null
      });
      setMessage(translate('Profile updated successfully!', 'تم تحديث الملف الشخصي بنجاح!'));
      setEditMode(false);
    } catch (error) {
      setMessage(translate('Failed to update profile', 'فشل في تحديث الملف الشخصي'));
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                <img 
                  src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6c5ce7&color=fff`} 
                  alt={displayName}
                />
                {isMockUser && (
                  <div className="mock-user-badge">
                    <i className="fas fa-info-circle"></i>
                    <span>{translate('Demo Account', 'حساب تجريبي')}</span>
                  </div>
                )}
                {authMethod === 'biometric' && (
                  <div className="auth-method-badge">
                    <i className="fas fa-fingerprint"></i>
                    <span>{translate('Biometric Login', 'تسجيل دخول بيومتري')}</span>
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h1>{displayName || translate('User', 'مستخدم')}</h1>
                <p>{currentUser?.email}</p>
                {isMockUser && (
                  <p className="mock-user-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    {translate('This is a demo account. Profile changes will not be saved permanently.', 'هذا حساب تجريبي. التغييرات لن تحفظ بشكل دائم.')}
                  </p>
                )}
                <button 
                  className="btn btn-outline"
                  onClick={() => setEditMode(!editMode)}
                >
                  <i className="fas fa-edit"></i>
                  {editMode ? translate('Cancel', 'إلغاء') : translate('Edit Profile', 'تعديل الملف')}
                </button>
              </div>
            </div>

            {editMode && (
              <div className="profile-edit-form">
                <h2>{translate('Edit Profile', 'تعديل الملف الشخصي')}</h2>
                {isMockUser && (
                  <div className="demo-warning">
                    <i className="fas fa-info-circle"></i>
                    {translate('This is a demo account. Changes will be lost when you logout.', 'هذا حساب تجريبي. التغييرات ستفقد عند تسجيل الخروج.')}
                  </div>
                )}
                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label className="form-label">
                      {translate('Display Name', 'اسم العرض')}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {translate('Photo URL', 'رابط الصورة')}
                    </label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                      {message}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? translate('Saving...', 'جاري الحفظ...') : translate('Save Changes', 'حفظ التغييرات')}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Biometric Setup Section - Only show for real users who logged in with password */}
          {currentUser && !isMockUser && authMethod === 'password' && (
            <div className="profile-section">
              <BiometricSetup />
            </div>
          )}

          {/* Show message for biometric users */}
          {currentUser && !isMockUser && authMethod === 'biometric' && (
            <div className="profile-section">
              <div className="biometric-info-message">
                <i className="fas fa-fingerprint"></i>
                <h3>{translate('Logged in with Biometric Authentication', 'تم تسجيل الدخول باستخدام المصادقة البيومترية')}</h3>
                <p>{translate('To change biometric settings, please logout and login with your password.', 'لتغيير إعدادات البصمة، يرجى تسجيل الخروج وتسجيل الدخول باستخدام كلمة المرور.')}</p>
              </div>
            </div>
          )}

          <div className="favorites-section">
            <h2>{translate('Favorite Events', 'الأحداث المفضلة')}</h2>
            {isLoading ? (
              <div className="loading-favorites">
                <i className="fas fa-spinner fa-spin"></i>
                <p>{translate('Loading your favorites...', 'جاري تحميل مفضلتك...')}</p>
              </div>
            ) : favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="no-favorites">
                <i className="fas fa-heart"></i>
                <h3>{translate('No favorite events yet', 'لا توجد أحداث مفضلة بعد')}</h3>
                <p>{translate('Start exploring events and add them to your favorites!', 'ابدأ في استكشاف الأحداث وأضفها إلى مفضلتك!')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;