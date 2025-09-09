import React, { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import '../styles/Home.css';

const Home = () => {
  const { events, featuredEvents, loading, error, searchEvents, getFeaturedEvents } = useEvents();
  const { language, translate } = useLanguage();
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (!searchPerformed) {
      getFeaturedEvents();
    }
  }, [getFeaturedEvents, searchPerformed]);

  const handleSearch = async (searchParams) => {
    setSearchPerformed(true);
    await searchEvents({
      keyword: searchParams.keyword,
      city: searchParams.city,
      countryCode: 'US'
    });
  };

  const handleClearSearch = () => {
    setSearchPerformed(false);
  };

  const displayEvents = searchPerformed ? events : featuredEvents;

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1>{translate('Discover Amazing Events', 'اكتشف الأحداث المدهشة')}</h1>
            <p>{translate('Find the best events happening in your city', 'ابحث عن أفضل الأحداث التي تقام في مدينتك')}</p>
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
        </div>

        <div className="events-section">
          <div className="container">
            <h2 className="section-title">
              {searchPerformed 
                ? translate('Search Results', 'نتائج البحث') 
                : translate('Featured Events', 'الأحداث المميزة')
              }
            </h2>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>{translate('Loading events...', 'جاري تحميل الأحداث...')}</p>
              </div>
            ) : displayEvents.length > 0 ? (
              <div className="events-grid">
                {displayEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="no-events">
                <i className="fas fa-calendar-times"></i>
                <h3>{translate('No events found', 'لم يتم العثور على أحداث')}</h3>
                <p>{translate('Try adjusting your search criteria', 'حاول تعديل معايير البحث الخاصة بك')}</p>
                {searchPerformed && (
                  <button 
                    className="btn btn-primary"
                    onClick={handleClearSearch}
                  >
                    {translate('Show All Events', 'عرض جميع الأحداث')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;