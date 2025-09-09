import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/MapPreview.css';

const MapPreview = ({ latitude, longitude, venueName }) => {
  const [mapError, setMapError] = useState(false);
  const { translate } = useLanguage();

  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  const handleMapError = () => {
    setMapError(true);
  };

  if (mapError) {
    return (
      <div className="map-fallback">
        <p>{translate('Map could not be loaded', 'تعذر تحميل الخريطة')}</p>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <i className="fas fa-map-marker-alt"></i>
          {translate('View on Google Maps', 'عرض على خرائط جوجل')}
        </a>
      </div>
    );
  }

  return (
    <div className="map-preview">
      <iframe
        title={`Map of ${venueName}`}
        src={mapUrl}
        width="100%"
        height="300"
        frameBorder="0"
        style={{ border: 0, borderRadius: '8px' }}
        allowFullScreen=""
        aria-hidden="false"
        tabIndex="0"
        onError={handleMapError}
        loading="lazy"
      />
      <div className="map-actions">
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <i className="fas fa-external-link-alt"></i>
          {translate('Open in Maps', 'فتح في الخرائط')}
        </a>
      </div>
    </div>
  );
};

export default MapPreview;