# JNGEC Sports Meet

**JNGEC Sports Meet** is a React Native Expo app built for my college **JNGEC Sundernagar** to manage and record sports events and matches.

## Features

### User Access
- **Read Access (No Login Required)**: View tournaments, matches, and live scores in real-time.
- **Admin Access**: Create, edit, delete tournaments and matches. Change match and tournament statuses. Access settings for password change and logout.

### Tournaments & Matches
- Tournaments can have statuses: **upcoming**, **live**, **completed**.
- Only **one tournament** can be live at a time.
- Matches belong to tournaments and have statuses: **upcoming**, **live**, **completed**.
- Matches can go live only if their tournament is live.
- Once all matches of a tournament are completed, the tournament moves to **Archives**.

### App Tabs
1. **Live**: Shows upcoming, live, and completed matches of the current live tournament with real-time scores.
2. **Tournaments**: Displays upcoming tournaments. Clicking a tournament shows its matches.
3. **Archives**: Displays completed tournaments. Clicking a tournament shows its matches.
4. **Settings (Admin Only)**: Change password, logout.

### Realtime Updates
- Live match scores are updated in real-time using **Firebase Firestore**.
- Admin updates scores, users see updates immediately.

## Tech Stack
- **Frontend**: React Native Expo
- **Backend & Database**: Firebase Firestore, Firebase Auth
- **Realtime Updates**: Firestore real-time listeners

## Installation
1. Clone the repo:  
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename `FirebaseConfig.example.ts` to `FirebaseConfig.ts` and add your Firebase config.

4. Start the Expo project:
   ```bash
   npx expo start
   ```

## Notes
- Admin functionality requires login.
- Users can view live scores without login.

## License
This project is licensed under the MIT License.