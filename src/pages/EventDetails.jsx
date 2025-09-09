import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import MapPreview from '../components/MapPreview';
import Navbar from '../components/Navbar';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { language, translate } = useLanguage();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, getEventById]);

  const handleToggleFavorite = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isFavorite(event.id)) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{translate('Loading event details...', 'جاري تحميل تفاصيل الحدث...')}</p>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>{translate('Event not found', 'الحدث غير موجود')}</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              {translate('Back to Home', 'العودة إلى الرئيسية')}
            </button>
          </div>
        </div>
      </>
    );
  }

  const venue = event._embedded?.venues?.[0];
  const startDate = new Date(event.dates.start.dateTime);
  const imageUrl = imageError || !event.images?.[0]?.url 
    ? '/default-event.jpg' 
    : event.images[0].url;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="event-details">
          <div className="event-header">
            <img 
              src={imageUrl} 
              alt={event.name} 
              className="event-image"
              onError={handleImageError}
            />
            <button 
              className={`favorite-btn ${isFavorite(event.id) ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              aria-label={translate('Add to favorites', 'إضافة إلى المفضلة')}
            >
              <i className={`fas ${isFavorite(event.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
            </button>
          </div>
          
          <div className="event-content">
            <h1 className="event-title">{event.name}</h1>
            
            <div className="event-info-grid">
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <div>
                  <h4>{translate('Date', 'التاريخ')}</h4>
                  <span>{startDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')}</span>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>{translate('Time', 'الوقت')}</h4>
                  <span>{startDate.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
              
              {venue && (
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>{translate('Venue', 'المكان')}</h4>
                    <span>{venue.name}</span>
                    {venue.city && <span>{venue.city.name}, {venue.state?.stateCode || venue.country?.name}</span>}
                  </div>
                </div>
              )}
              
              {event.priceRanges && (
                <div className="info-item">
                  <i className="fas fa-tag"></i>
                  <div>
                    <h4>{translate('Price Range', 'نطاق السعر')}</h4>
                    <span>
                      {event.priceRanges[0].min} - {event.priceRanges[0].max} {event.priceRanges[0].currency}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {event.info && (
              <div className="event-description">
                <h2>{translate('Description', 'الوصف')}</h2>
                <p>{event.info}</p>
              </div>
            )}
            
            {venue?.location && (
              <div className="event-map">
                <h2>{translate('Location', 'الموقع')}</h2>
                <MapPreview 
                  latitude={venue.location.latitude} 
                  longitude={venue.location.longitude}
                  venueName={venue.name}
                />
                {venue.address && (
                  <p className="venue-address">
                    <i className="fas fa-map-pin"></i>
                    {venue.address.line1}, {venue.city.name}
                  </p>
                )}
              </div>
            )}
            
            <div className="event-actions">
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                <i className="fas fa-ticket-alt"></i>
                {translate('Buy Tickets', 'شراء التذاكر')}
              </a>
              
              <button 
                className="btn btn-outline"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left"></i>
                {translate('Go Back', 'العودة')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;