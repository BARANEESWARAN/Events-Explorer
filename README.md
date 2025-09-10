# City Pulse - Event Discovery Application

City Pulse is a modern event discovery application that helps users find, save, and manage events in their city with ease. The app features secure authentication, event browsing by name or city, favorite event management, and interactive maps.

---

## 🚀 Live Demo

Check out the live application: [https://city-pulse-m866.onrender.com](https://city-pulse-m866.onrender.com)


---

# 🔐 Advanced Authentication Features

## Biometric Authentication System
<img width="1920" height="874" alt="image" src="https://github.com/user-attachments/assets/cf0e1601-2ba9-4f60-a7aa-21a292f28a80" />
<img width="1918" height="1038" alt="image" src="https://github.com/user-attachments/assets/3e23e6da-8b5d-4946-b706-a0ed4c1e9de2" />
<img width="1902" height="866" alt="image" src="https://github.com/user-attachments/assets/f10fbdef-f02f-47e5-bb89-a553bc671276" />
<img width="1892" height="866" alt="image" src="https://github.com/user-attachments/assets/755ffd7f-4ac3-4957-bde1-5dcdf7916989" />
<img width="1889" height="884" alt="image" src="https://github.com/user-attachments/assets/84b081de-addc-4082-b982-a1219d23fe5f" />



- **Fingerprint/Face ID Login**: Seamless biometric authentication using WebAuthn standards  
- **Multiple Device Support**: Register biometric credentials on multiple devices  
- **Secure Enrollment**: One-time biometric registration process  
- **Fallback Options**: Traditional email/password login always available  

## Biometric Registration Flow


1. User signs up with email/password first  
2. Navigates to **Profile → Biometric Settings**  
3. One-click registration captures biometric data  
4. Credentials securely stored in Firebase  
5. Future logins can use fingerprint/face recognition  

## Biometric Management
- **Enable/Disable**: Toggle biometric login in profile settings  
- **Multiple Devices**: Register biometrics on different devices  
- **Secure Storage**: Biometric data never leaves your device  
- **Revocation**: Easily remove biometric credentials if needed  

---

## 📱 Application Features

1. **Authentication System**  
   - Sign Up/Login with email and password  
   - Simulated biometric authentication for demo  
   - Secure user profiles using Firebase Authentication  

2. **Event Discovery**  
   - Browse featured events on the home page  
   - Search events by **event name or city**  
   - Clicking search without input shows **all default events**  
   - Click events to view detailed information  
   - Add events to favorites with one click  

3. **Favorites Management**  
   - Save favorite events easily  
   - View all favorites in your profile  
    - Persistent storage via Firebase, synced with **localStorage** for quick access  

4. **User Profiles**  
   - Edit profile info (name, photo URL)  
   - Manage biometric authentication settings  
   - View and manage favorite events  

5. **Event Details**  
   - Comprehensive details including date, venue, and pricing  
   - Interactive maps with Google Maps integration  

---

## 🛠️ Technology Stack

- **Frontend:** React.js with React Router  
- **Authentication:** Firebase Auth  
- **Database:** Firebase Firestore  
- **Events API:** Ticketmaster Discovery API  
- **Maps:** Google Maps API  
- **Styling:** CSS3 with responsive design  
- **Icons:** Font Awesome  
- **State Management:** React Context API  

---

## 📦 Installation & Setup

Since the `.env` file is already configured with Firebase and API keys, you just need to follow these steps:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/city-pulse-app.git
   cd city-pulse-app
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Run the development server**  
   ```bash
   npm run dev
   ```

4. **Open your browser**  
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🎯 Usage Guide

### For Users
- Sign up or login with your credentials  
- Browse events on the home page  
- Use the search bar to find events **by event name or city**  
- Click search without typing anything to view **all default events**  
- Add events to favorites using the heart icon  
- Visit your profile to manage favorites and update personal info  
- Enable or disable biometric login in profile settings  

---

## 📖 Page Overview

### 🔐 Sign Up / Login Page
<img width="1915" height="880" alt="image" src="https://github.com/user-attachments/assets/b81cdaee-a318-4580-a16c-ec17df5be785" />                            <img width="1915" height="881" alt="image" src="https://github.com/user-attachments/assets/7eb57dd5-ca0b-47a4-a467-1621453384bc" />


- Secure Firebase authentication  
- Email/password login or simulated biometric login  

### 🏠 Home Page - Event Discovery
<img width="1917" height="2893" alt="image" src="https://github.com/user-attachments/assets/82e498bd-1421-4b50-8430-16bb9e2013c4" />

- Browse featured events  
- Search events by **event name or city**  
- Clicking search with no input shows **all default events**  
- View event cards with quick access to details  
- Switch between **English (EN)** and **Arabic (AR)** for localized experience
- <img width="1918" height="2279" alt="image" src="https://github.com/user-attachments/assets/18a2b6ac-6fad-4e1c-a4d1-648a509d9219" />


### 📅 Event Details Page
<img width="1918" height="1127" alt="image" src="https://github.com/user-attachments/assets/3159331e-5ea9-4346-9fec-69a96a39b3e8" />

- View complete info: date, time, venue, pricing  
- Interactive Google Map location  
- Add/remove favorites  

### 🗺️ Map View
<img width="1920" height="942" alt="image" src="https://github.com/user-attachments/assets/b17691a4-4677-4d96-bcca-cbcf2d68ab4b" />

- Google Maps integration with event location pins  
- Zoom and directions enabled  

### 👤 Profile Page
<img width="1918" height="1197" alt="image" src="https://github.com/user-attachments/assets/2bf4c0bb-8a66-4713-bb7a-e4a1e8d186ff" />

<img width="1918" height="1641" alt="image" src="https://github.com/user-attachments/assets/55cf5130-9d8c-40b6-9721-3509efb152ca" />


- Edit name and photo URL  
- Manage favorites  
- Enable/disable biometric login  
- Secure logout  

### ❤️ Favorites Management
<img width="1918" height="822" alt="image" src="https://github.com/user-attachments/assets/66a44fc5-47de-439a-9f53-719243eeb073" />
<img width="1918" height="1996" alt="image" src="https://github.com/user-attachments/assets/8ff042ff-1e13-4184-be96-14a487e33c2f" />


- View all saved events  
- Remove favorites easily  
- Favorites synced across sessions  

---

> **Note:**  
> 🔗 [Live Demo](https://city-pulse-m866.onrender.com)  
> This is a **static site**.  
> - If you refresh on an inner page, the page will not be visible.  
> - To reload correctly, go back to the **default URL** and refresh from there.  

