import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
const FAVORITES_UPDATED_EVENT = 'favoritesUpdated';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();


  const getUserFavoritesKey = () => {
    return currentUser ? `userFavorites_${currentUser.uid}` : 'userFavorites';
  };


  const loadFavorites = () => {
    try {
      setIsLoading(true);
      const userFavoritesKey = getUserFavoritesKey();
      const storedFavorites = localStorage.getItem(userFavoritesKey);
      
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

 
  const saveFavorites = (newFavorites) => {
    try {
      const userFavoritesKey = getUserFavoritesKey();
      localStorage.setItem(userFavoritesKey, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      
   
      window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, {
        detail: { favorites: newFavorites }
      }));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  };

  useEffect(() => {
    loadFavorites();
    

    const handleFavoritesUpdated = () => {
      loadFavorites();
    };
    
    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated);
    
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated);
    };
  }, [currentUser]);

  const addFavorite = async (event) => {
    if (!currentUser) return false;
    
    try {
      if (favorites.some(fav => fav.id === event.id)) {
        return true;
      }
      const newFavorites = [...favorites, event];
      saveFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  };

  const removeFavorite = async (eventId) => {
    if (!currentUser) return false;
    
    try {
      const newFavorites = favorites.filter(fav => fav.id !== eventId);
      saveFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  };

  const isFavorite = (eventId) => {
    return favorites.some(fav => fav.id === eventId);
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};