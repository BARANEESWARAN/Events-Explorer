import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockUser, setIsMockUser] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'password', 'biometric', 'google'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      
        setCurrentUser(user);
        setIsMockUser(false);
   
        if (user.providerData && user.providerData.length > 0) {
          const providerId = user.providerData[0].providerId;
          if (providerId === 'google.com') {
            setAuthMethod('google');
          } else {
            setAuthMethod('password');
          }
        } else {
          setAuthMethod('password');
        }
        localStorage.setItem('currentUserId', user.uid);
      } else {
    
        const mockUserId = localStorage.getItem('currentUserId');
        const mockUserData = localStorage.getItem('mockUserData');
        
        if (mockUserId && mockUserId.startsWith('demo-biometric-user') && mockUserData) {
  
          try {
            const userData = JSON.parse(mockUserData);
            setCurrentUser(userData);
            setIsMockUser(true);
            setAuthMethod('biometric');
          } catch (error) {
            console.error('Error parsing mock user data:', error);
            setCurrentUser(null);
            setIsMockUser(false);
            setAuthMethod(null);
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('mockUserData');
          }
        } else {
    
          setCurrentUser(null);
          setIsMockUser(false);
          setAuthMethod(null);
          localStorage.removeItem('currentUserId');
          localStorage.removeItem('mockUserData');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const signup = async (email, password, displayName) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };


  const login = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setAuthMethod('password');
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

 
  const loginWithBiometric = async (email, displayName = 'Biometric User') => {
    try {
    
      const mockUser = {
        uid: `demo-biometric-user-${Date.now()}`,
        email: email || 'biometric@example.com',
        displayName: displayName,
        emailVerified: false,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null
      };
      

      localStorage.setItem('currentUserId', mockUser.uid);
      localStorage.setItem('mockUserData', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setIsMockUser(true);
      setAuthMethod('biometric');
      
      return mockUser;
    } catch (error) {
      console.error('Biometric login failed:', error);
      throw new Error('Biometric authentication failed');
    }
  };


  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('mockUserData');
    if (isMockUser) {
   
      setCurrentUser(null);
      setIsMockUser(false);
      setAuthMethod(null);
      return Promise.resolve();
    } else {
  
      return signOut(auth);
    }
  };


  const updateUserProfile = async (profileData) => {
    if (!currentUser) throw new Error('No user logged in');
    
    if (isMockUser) {
 
      const updatedUser = {
        ...currentUser,
        displayName: profileData.displayName || currentUser.displayName,
        photoURL: profileData.photoURL || currentUser.photoURL
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('mockUserData', JSON.stringify(updatedUser));
      return Promise.resolve();
    } else {
   
      try {
        await updateProfile(auth.currentUser, profileData);
 
        setCurrentUser({
          ...currentUser,
          displayName: profileData.displayName || currentUser.displayName,
          photoURL: profileData.photoURL || currentUser.photoURL
        });
      } catch (error) {
        throw error;
      }
    }
  };

  const value = {
    currentUser,
    isMockUser,
    authMethod,
    signup,
    login,
    loginWithBiometric,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};