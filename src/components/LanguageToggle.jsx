import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button className="language-toggle" onClick={toggleLanguage}>
      <span className={language === 'en' ? 'active' : ''}>EN</span>
      <span className="divider">|</span>
      <span className={language === 'ar' ? 'active' : ''}>AR</span>
    </button>
  );
};

export default LanguageToggle;