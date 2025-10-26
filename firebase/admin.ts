import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";


function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Check if required environment variables are present
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing required Firebase environment variables. Please check your .env.local file and ensure all Firebase credentials are properly set."
      );
    }

    // Validate that these are not placeholder values
    if (
      projectId === "your-firebase-project-id" ||
      clientEmail.includes("xxxxx") ||
      privateKey.includes("YOUR_PRIVATE_KEY_HERE")
    ) {
      throw new Error(
        "Firebase environment variables contain placeholder values. Please replace them with your actual Firebase credentials from the Firebase Console."
      );
    }

    // Validate private key format
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") || !privateKey.includes("-----END PRIVATE KEY-----")) {
      throw new Error(
        "Invalid Firebase private key format. The private key must be a valid PEM formatted key starting with '-----BEGIN PRIVATE KEY-----' and ending with '-----END PRIVATE KEY-----'."
      );
    }

    try {
      // Create service account object with proper typing
      const serviceAccount: ServiceAccount = {
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      };

      initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error: unknown) {
      console.error("Firebase Admin initialization error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Invalid PEM formatted message")) {
        throw new Error(
          "Failed to parse Firebase private key. Please ensure:\n" +
          "1. The private key is properly formatted with \\n for line breaks\n" +
          "2. The key is enclosed in quotes in your .env.local file\n" +
          "3. The key includes the full PEM header and footer\n" +
          "4. No extra spaces or characters are added to the key"
        );
      }
      
      throw new Error(`Firebase Admin initialization failed: ${errorMessage}`);
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();
