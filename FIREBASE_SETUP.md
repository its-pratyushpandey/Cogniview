# Firebase Setup Guide

This guide will help you set up Firebase authentication and Firestore for the AI Voice Interview application.

## Prerequisites

1. A Firebase project
2. Firebase CLI installed (optional)
3. Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard to create your project

## Step 2: Enable Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally, enable other sign-in providers as needed

## Step 3: Enable Firestore Database

1. Go to **Firestore Database** in the Firebase Console
2. Click "Create database"
3. Choose your security rules (start in test mode for development)
4. Select a location for your database

## Step 4: Generate Service Account Key

1. Go to **Project Settings** > **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file and keep it secure
4. **Never commit this file to version control**

## Step 5: Get Web App Configuration

1. Go to **Project Settings** > **General** > **Your apps**
2. If you don't have a web app, click **"Add app"** > **Web**
3. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in the Firebase Admin SDK variables from the downloaded JSON:
   - `FIREBASE_PROJECT_ID`: The `project_id` from the JSON
   - `FIREBASE_CLIENT_EMAIL`: The `client_email` from the JSON
   - `FIREBASE_PRIVATE_KEY`: The `private_key` from the JSON (keep the quotes and \n characters)

3. Fill in the Firebase Client SDK variables from the web app config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Important Notes

### Private Key Formatting

The `FIREBASE_PRIVATE_KEY` must be properly formatted:

```bash
# ✅ Correct format
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ❌ Incorrect format (will cause PEM parsing errors)
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

### Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Keep your service account JSON file secure**
3. **Use environment variables in production**
4. **Regularly rotate your service account keys**
5. **Set up proper Firestore security rules**

## Troubleshooting

### "Invalid PEM formatted message" Error

This error occurs when the private key is not properly formatted:

1. Ensure the private key is enclosed in quotes
2. Check that `\n` characters are present for line breaks
3. Verify the key starts with `-----BEGIN PRIVATE KEY-----`
4. Make sure there are no extra spaces or characters

### "Service account object must contain a string project_id property" Error

This error occurs when environment variables are missing or contain placeholder values:

1. Check that all required environment variables are set
2. Ensure you've replaced placeholder values with actual credentials
3. Verify the variable names match exactly

### Application Won't Start

1. Check that all environment variables are properly set
2. Verify your Firebase project is properly configured
3. Ensure Firestore and Authentication are enabled
4. Check the console for detailed error messages

## Example .env.local File

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=my-awesome-project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@my-awesome-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-awesome-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-awesome-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-awesome-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

## Testing Your Setup

Once you've configured your environment variables:

1. Start the development server: `npm run dev`
2. Try to sign up for a new account
3. Check the Firebase Console to see if users are being created
4. Verify that authentication is working properly

If you encounter any issues, check the console logs for detailed error messages.