import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const { language, translate } = useLanguage();
  const { currentUser } = useAuth();
  const [isFav, setIsFav] = useState(false);

  // Update isFav state when favorites change or component mounts
  useEffect(() => {
    setIsFav(checkIsFavorite(event.id));
    
    // Listen for favorites updates
    const handleFavoritesUpdated = () => {
      setIsFav(checkIsFavorite(event.id));
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
  }, [event.id, checkIsFavorite]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert(translate('Please login to manage favorites', 'يرجى تسجيل الدخول لإدارة المفضلة'));
      return;
    }
    
    if (isFav) {
      await removeFavorite(event.id);
      setIsFav(false);
    } else {
      await addFavorite(event);
      setIsFav(true);
    }
  };

  const startDate = new Date(event.dates.start.dateTime);
  const imageUrl = event.images?.[0]?.url || '/default-event.jpg';
  const venue = event._embedded?.venues?.[0];

  return (
    <Link to={`/event/${event.id}`} className="event-card">
      <div className="event-image-container">
        <img src={imageUrl} alt={event.name} className="event-image" />
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          disabled={!currentUser}
          title={currentUser ? 
            translate('Toggle favorite', 'تبديل المفضلة') : 
            translate('Login to add favorites', 'سجل الدخول لإضافة إلى المفضلة')
          }
        >
          <i className={`fas ${isFav ? 'fa-heart' : 'fa-heart-o'}`}></i>
        </button>
        <div className="event-date">
          <span className="date-day">{startDate.getDate()}</span>
          <span className="date-month">{startDate.toLocaleString(language, { month: 'short' }).toUpperCase()}</span>
        </div>
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>
        
        <div className="event-details">
          <div className="event-info">
            <i className="fas fa-clock"></i>
            <span>{startDate.toLocaleTimeString(language, { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          
          {venue && (
            <div className="event-info">
              <i className="fas fa-map-marker-alt"></i>
              <span>{venue.name}</span>
            </div>
          )}
          
          {event.priceRanges && (
            <div className="event-info">
              <i className="fas fa-tag"></i>
              <span>
                {translate('From', 'من')} {event.priceRanges[0].min} {event.priceRanges[0].currency}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;