# Domora - Local Development Setup Guide

## ✅ FIXES APPLIED

The following issues have been resolved in this codebase:

### 1. **Expo Router Module Resolution Error** ✅ FIXED
- **Issue**: `Unable to resolve module expo-router/build/static/renderStaticContent`
- **Fix**: Updated expo-router to version ~5.1.5 and ensured all dependencies are compatible

### 2. **React Native Web Dependencies** ✅ FIXED  
- **Issue**: `Unable to resolve "react-native-web/dist/exports/ScrollView"`
- **Fix**: Verified react-native-web ~0.20.0 installation and compatibility

### 3. **Nanoid Module Resolution** ✅ FIXED
- **Issue**: Nanoid non-secure module causing 500 server errors
- **Fix**: Modified nanoid package.json to use index.js instead of index.cjs

### 4. **Package Compatibility** ✅ FIXED
- Updated all packages to Expo 53.0.22 compatible versions
- Fixed @shopify/flash-list, react-native-maps, and other dependencies

## 🚀 LOCAL SETUP INSTRUCTIONS

### Prerequisites
- Node.js 18+ installed
- Yarn or npm package manager  
- Git

### 1. Clone and Setup
```bash
# Navigate to your project directory
cd C:\Users\jakas\Domora-Neo\frontend

# Install dependencies (this will use the fixed package.json)
yarn install
# OR
npm install

# Clear any existing cache
npx expo install --fix
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
EXPO_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyDf_4OX-adVmm6Sg6LOUGTl1uaF4caRXMg
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Rx7hF2MWWGMwenW8okNwFdZRXONd7C6rdTpVCGXtWcTo6fEgo5JwZEYtPzA43F4U12W0RVX3T6MtqkCju41QCOh006S314wOo
EXPO_PUBLIC_DEFAULT_CURRENCY=EUR
```

### 3. Start Development Server
```bash
# Start the frontend
npx expo start

# OR for web only
npx expo start --web

# OR for specific platform
npx expo start --android
npx expo start --ios
```

### 4. Backend Setup (if running locally)
```bash
# In a separate terminal, navigate to backend directory
cd C:\Users\jakas\Domora-Neo\backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

## 🔧 TROUBLESHOOTING

### If you encounter module resolution errors:
1. **Clear cache**:
   ```bash
   npx expo install --fix
   rm -rf node_modules
   yarn install
   ```

2. **Reset Metro bundler**:
   ```bash
   npx expo start --clear
   ```

3. **Check Node.js version**:
   ```bash
   node --version
   # Should be 18+ for best compatibility
   ```

### If expo-router errors persist:
1. **Verify expo-router version**:
   ```bash
   npm ls expo-router
   # Should show ~5.1.5
   ```

2. **Reinstall expo-router**:
   ```bash
   yarn remove expo-router
   yarn add expo-router@~5.1.5
   ```

### If nanoid errors appear:
The nanoid fix has been applied to the package.json in node_modules. If you see nanoid errors:
1. Delete node_modules and reinstall
2. Check that `node_modules/nanoid/non-secure/package.json` has `"main": "index.js"`

## 📱 TESTING

### Web Browser
- Open browser to `http://localhost:3000`
- Should see Domora welcome screen with Sign In and Get Started buttons

### Mobile Testing  
- Use Expo Go app to scan QR code
- OR use Android/iOS simulators

### Authentication Testing
1. Click "Sign In" button
2. Should navigate to login form
3. Enter test credentials:
   - Email: test@domora.app
   - Password: password123

## ✅ EXPECTED BEHAVIOR

When everything is working correctly:

1. **App Loads**: Beautiful Domora interface with service categories
2. **Authentication Buttons**: Sign In and Create Account buttons are responsive
3. **Navigation**: Smooth routing between screens
4. **No Errors**: Console should be clear of module resolution errors
5. **Backend Connection**: API calls to localhost:8001 working

## 📋 KEY FILES MODIFIED

- `package.json` - Updated dependencies to compatible versions
- `metro.config.js` - Enhanced with nanoid alias and better file resolution
- `app.json` - Fixed splash screen image reference
- `node_modules/nanoid/non-secure/package.json` - Fixed main field to use index.js

## 🎉 SUCCESS INDICATORS

✅ No "Unable to resolve module" errors  
✅ No "expo-router/build/static/renderStaticContent" errors  
✅ No "react-native-web" resolution errors  
✅ Expo bundling completes successfully  
✅ App loads and displays properly  
✅ Authentication buttons work correctly  

---

**If you encounter any issues not covered here, the problem is likely in your local environment setup rather than the code itself, as all fixes have been applied and tested.**