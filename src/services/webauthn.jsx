import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


export const isWebAuthnSupported = () => {
  return !!(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function' &&
    window.isSecureContext
  );
};


export const getSupportedAuthenticators = async () => {
  const results = {
    platform: false,
    securityKey: false,
    hybrid: false
  };
  
  try {
    if (isWebAuthnSupported()) {
      results.platform = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      results.securityKey = await PublicKeyCredential.isExternalCTAP2SecurityKeyAvailable();
      results.hybrid = results.platform || results.securityKey;
    }
  } catch (error) {
    console.error('Error getting supported authenticators:', error);
  }
  
  return results;
};


const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  return await currentUser.getIdToken();
};


export const initRegistration = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/init-register?email=${encodeURIComponent(email)}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initialize registration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Init registration error:', error);
    throw error;
  }
};


export const verifyRegistration = async (attestationResponse) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attestationResponse),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify registration');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Verify registration error:', error);
    throw error;
  }
};


export const initAuthentication = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/init-auth?email=${encodeURIComponent(email)}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      
 
      if (errorData.needsRegistration) {
        const error = new Error(errorData.error || 'No biometric credentials found');
        error.needsRegistration = true;
        error.email = email;
        throw error;
      }
      
      throw new Error(errorData.error || 'Failed to initialize authentication');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Init authentication error:', error);
    throw error;
  }
};

// Verify authentication
export const verifyAuthentication = async (assertionResponse) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-auth`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assertionResponse),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify authentication');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Verify authentication error:', error);
    throw error;
  }
};

// Check biometric status 
export const getBiometricStatus = async () => {
  try {
    const idToken = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/biometric-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get biometric status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get biometric status error:', error);
    throw error;
  }
};

// Remove biometric credentials 
export const removeBiometricCredentials = async () => {
  try {
    const idToken = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/biometric-credentials`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove biometric credentials');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Remove credentials error:', error);
    throw error;
  }
};


export const isBiometricSupported = isWebAuthnSupported;


export const registerBiometric = async (userEmail, userId) => {

  console.warn('Using fallback biometric registration');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const biometricData = {
        userId,
        userEmail,
        registeredAt: new Date().toISOString(),
        credentialId: `bio_${userId}_${Date.now()}`
      };
      
      localStorage.setItem(`biometric_${userId}`, JSON.stringify(biometricData));
      resolve({ success: true, message: 'Biometric registration successful' });
    }, 1000);
  });
};

export const authenticateBiometric = async (userId) => {

  console.warn('Using fallback biometric authentication');
  
  return new Promise((resolve, reject) => {
    const biometricData = JSON.parse(localStorage.getItem(`biometric_${userId}`) || 'null');
    if (!biometricData) {
      reject(new Error('No biometric credentials found'));
      return;
    }
    
    setTimeout(() => {
      resolve({ 
        success: true, 
        user: { 
          id: biometricData.userId, 
          email: biometricData.userEmail 
        } 
      });
    }, 1000);
  });
};

export const hasBiometricCredential = (userId) => {
  return localStorage.getItem(`biometric_${userId}`) !== null;
};

export const removeBiometricCredential = (userId) => {
  localStorage.removeItem(`biometric_${userId}`);
};

export const getBiometricUsers = () => {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('biometric_')) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data) {
        users.push(data);
      }
    }
  }
  return users;
};