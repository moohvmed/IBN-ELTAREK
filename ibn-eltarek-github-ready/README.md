# IBN ELTAREK — History & Geography Center

React + TypeScript + Vite frontend with Firebase Authentication, Firestore-backed Cloud Functions API, and Firebase Hosting configuration. AI Studio-specific Gemini dependencies, environment placeholders, and demo login credentials have been removed.

## Important status before launch

- The login form uses real Firebase Email/Password and Google Authentication. A user must have a `users/{uid}` profile created by the center before the portal will open.
- Student registration submits a **pending registration request** to `/api/registration-requests`; it does not silently create an account or grant access.
- Phone OTP is intentionally disabled. Configure Firebase Phone Authentication + reCAPTCHA before enabling it. No demo OTP is accepted.
- The Cloud Functions API includes registration requests, profile lookup, grades, attendance, and educational content endpoints. The portal still contains legacy static presentation data in some dashboard/content screens; do not treat those screens as live records until those components are connected to the API and seeded with your real content.
- Firebase project setup and deployment are account-specific. This source package cannot include your private credentials or deploy to your account automatically.

## Requirements

- Node.js 20 or newer
- A Firebase project with Authentication (Email/Password and Google) and Cloud Firestore enabled
- Firebase CLI: `npm install -g firebase-tools`

## Configure

1. Create a Firebase project you control at https://console.firebase.google.com/.
2. In **Project settings → General → Your apps**, create a Web app and copy its config values.
3. Copy `.env.example` to `.env.local` and fill in the `VITE_FIREBASE_*` values. Do not commit `.env.local`.
4. Create `.firebaserc` from `.firebaserc.example`, replacing `YOUR_FIREBASE_PROJECT_ID` with your Firebase project ID.
5. Enable Email/Password and Google providers in **Authentication → Sign-in method**.
6. Install dependencies from the repository root and functions folder:

   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

## Local development

```bash
npm run dev
```

The frontend registration form calls `/api/registration-requests`. For end-to-end local API testing, run the Firebase emulators (after installing functions dependencies):

```bash
cd functions && npm run serve
```

Configure the Vite dev server proxy to the Functions emulator if you want the API to work across separate local ports, or use Firebase Hosting emulator for same-origin testing.

## Create the first tutor account safely

1. Create the tutor's account using Firebase Authentication (console or a controlled admin process).
2. Copy the Auth UID.
3. In Firestore, create `users/{UID}` with at least:

   ```json
   {
     "id": "THE_AUTH_UID",
     "name": "Tutor Name",
     "email": "tutor@example.com",
     "role": "tutor",
     "specializationOrGrade": "History and Geography"
   }
   ```

Do not allow public registration to assign `tutor` or `parent` roles. Parent/student linking must be done by the center after verifying the relationship.

## Deploy

From the repository root:

```bash
npm run build
firebase deploy --only firestore:rules,functions,hosting
```

If Firebase CLI asks for billing or API activation, review and approve those requirements in your own Google Cloud/Firebase account. Confirm the `/api/health` endpoint after deployment.

## API overview

All routes except `GET /api/health` and `POST /api/registration-requests` require `Authorization: Bearer <Firebase ID token>`.

- `GET /api/me` — current user's approved profile
- `GET /api/grades` — grades visible to the current user (tutor can filter by `studentId`)
- `POST /api/grades` — tutor-only grade creation
- `GET /api/attendance` — attendance visible to the current user
- `POST /api/attendance` — tutor-only attendance creation
- `GET /api/content` — published educational content
- `POST /api/content` — tutor-only content creation
- `PATCH /api/content/:id` — tutor-only content update
- `DELETE /api/content/:id` — tutor-only content deletion
- `POST /api/registration-requests` — creates a pending request for review
- `GET /api/registration-requests?status=pending` — tutor-only request queue
- `PATCH /api/registration-requests/:id` — tutor-only approve/reject action

## Security notes

- Never commit `.env.local`, Firebase service-account keys, or real student records.
- Firebase web API keys are public identifiers, not admin credentials; database security must be enforced with Authentication, Firestore rules, and server-side authorization.
- Cloud Functions use the Admin SDK and validate user roles from the Firestore profile. Keep tutor profile creation restricted to trusted administrators.
- Review data retention, parental consent, and privacy requirements before collecting real student data.
