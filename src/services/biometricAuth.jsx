export const isBiometricSupported = () => {
  return !!(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function' &&
    window.isSecureContext
  );
};


export const registerBiometric = async (userEmail, userId) => {
  try {
    if (!isBiometricSupported()) {
      throw new Error('Biometric authentication not supported in this browser');
    }

 
    return new Promise((resolve, reject) => {
 
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      
      modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; max-width: 400px;">
          <h3>Register Biometric Authentication</h3>
          <p>Look at the camera or place your finger on the sensor</p>
          <div style="margin: 20px 0;">
            <i class="fas fa-fingerprint" style="font-size: 48px; color: #6c5ce7;"></i>
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="cancel-btn" style="padding: 10px 20px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button id="simulate-btn" style="padding: 10px 20px; background: #6c5ce7; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Simulate Success
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
  
      document.getElementById('cancel-btn').onclick = () => {
        document.body.removeChild(modal);
        reject(new Error('Biometric registration cancelled'));
      };
      
      document.getElementById('simulate-btn').onclick = () => {
        document.body.removeChild(modal);
        
        
        setTimeout(() => {
          const biometricData = {
            userId,
            userEmail,
            registeredAt: new Date().toISOString(),
            credentialId: `bio_${userId}_${Date.now()}`
          };
          
          localStorage.setItem(`biometric_${userId}`, JSON.stringify(biometricData));
          resolve({ success: true, message: 'Biometric registration successful' });
        }, 1500); // Simulate processing time
      };
    });
  } catch (error) {
    console.error('Biometric registration failed:', error);
    throw error;
  }
};

export const authenticateBiometric = async (userId) => {
  try {
    if (!isBiometricSupported()) {
      throw new Error('Biometric authentication not supported in this browser');
    }

 
    const biometricData = JSON.parse(localStorage.getItem(`biometric_${userId}`) || 'null');
    if (!biometricData) {
      throw new Error('No biometric credentials found');
    }

    
    return new Promise((resolve, reject) => {
    
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      
      modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; max-width: 400px;">
          <h3>Biometric Authentication</h3>
          <p>Look at the camera or place your finger on the sensor</p>
          <div style="margin: 20px 0; position: relative;">
            <i class="fas fa-fingerprint" style="font-size: 48px; color: #6c5ce7;"></i>
            <div class="scan-animation" style="
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 50px;
              height: 3px;
              background: #6c5ce7;
              animation: scan 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes scan {
              0% { top: 0; }
              50% { top: 45px; }
              100% { top: 0; }
            }
          </style>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="cancel-auth-btn" style="padding: 10px 20px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
   
      document.getElementById('cancel-auth-btn').onclick = () => {
        document.body.removeChild(modal);
        reject(new Error('Biometric authentication cancelled'));
      };
      
     
      setTimeout(() => {
        document.body.removeChild(modal);
        resolve({ 
          success: true, 
          user: { 
            id: biometricData.userId, 
            email: biometricData.userEmail 
          } 
        });
      }, 2000); 
    });
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    throw error;
  }
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