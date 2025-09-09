import React, { createContext, useContext, useState, useCallback } from 'react';
import { ticketmasterApi } from '../services/api';

const EventsContext = createContext();

export function useEvents() {
  return useContext(EventsContext);
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchEvents = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        size: 20,
        sort: 'date,asc'
      };
      
      const response = await ticketmasterApi.get('/events.json', { params });
      setEvents(response.data._embedded?.events || []);
      return response.data._embedded?.events || [];
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to fetch events');
      console.error('Error searching events:', err);
      setEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketmasterApi.get(`/events/${id}.json`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to fetch event details');
      console.error('Error fetching event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const now = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      const params = {
        startDateTime: `${now}T00:00:00Z`,
        endDateTime: `${futureDateStr}T23:59:59Z`,
        size: 20,
        sort: 'date,asc',
        classificationName: 'music'
      };
      
      const response = await ticketmasterApi.get('/events.json', { params });
      setFeaturedEvents(response.data._embedded?.events || []);
      return response.data._embedded?.events || [];
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to fetch featured events');
      console.error('Error fetching featured events:', err);
      setFeaturedEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    events,
    featuredEvents,
    loading,
    error,
    searchEvents,
    getEventById,
    getFeaturedEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}