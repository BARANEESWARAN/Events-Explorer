

export const authenticateBiometric = async (options = {}) => {
  const { checkOnly = false } = options;
  

  if (!('credentials' in navigator) || !navigator.credentials) {
    throw new Error('Biometric authentication not supported');
  }

  if (checkOnly) {
    return true;
  }


  return new Promise((resolve) => {
 
    setTimeout(() => {
   
      const success = Math.random() > 0.2;
      resolve(success);
    }, 1000);
  });
};