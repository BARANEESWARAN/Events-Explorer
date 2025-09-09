import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const { language, translate } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() || location.trim()) {
      onSearch({ keyword: searchTerm, city: location });
    } else {
      // If both fields are empty, clear the search
      handleClear();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    onClear(); // Call the clear function from parent
  };

  const hasSearchValues = searchTerm.trim() || location.trim();

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder={translate('Search events...', 'ابحث عن الأحداث...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder={translate('City', 'المدينة')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input location-input"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
            {translate('Search', 'بحث')}
          </button>
          
          {hasSearchValues && (
            <button 
              type="button" 
              className="clear-btn"
              onClick={handleClear}
              title={translate('Clear search', 'مسح البحث')}
            >
              <i className="fas fa-times"></i>
              {translate('Clear', 'مسح')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;