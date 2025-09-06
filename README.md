# 🏨 My Hotel App

Μια απλή εφαρμογή **Hotel Management** όπου οι χρήστες μπορούν:
- να δουν όλα τα ξενοδοχεία,
- να δουν αναλυτικά στοιχεία ενός ξενοδοχείου,
- να δημιουργήσουν, να επεξεργαστούν και να διαγράψουν ξενοδοχεία.

Το project αποτελείται από **frontend (React + TS)** και **backend (Express + Prisma/SQLite)**.

---

## 🚀 Tech Stack

### Frontend
- [React + TypeScript](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Chakra UI](https://chakra-ui.com/) για UI components
- [TanStack React Query](https://tanstack.com/query) για data fetching & caching
- [React Hook Form](https://react-hook-form.com/) για φόρμες
- [Zod](https://zod.dev/) για validation
- [Axios](https://axios-http.com/) για API κλήσεις

### Backend
- [Express](https://expressjs.com/) REST API
- [Prisma](https://www.prisma.io/) ORM με SQLite
- [Nodemon](https://nodemon.io/) για development
- Seed scripts για mock δεδομένα

---

## 📂 Folder Structure

my-hotel-app/
├── server/ # Express API backend
│ ├── src/
│ │ ├── server.js
│ │ ├── routes/
│ │ │ └── hotels.js
│ │ ├── services/
│ │ └── schemas/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── package.json
│ └── ...
├── src/ # React frontend
│ ├── features/hotels/
│ │ ├── components/ # UI components (HotelCard, DeleteConfirm κλπ.)
│ │ ├── ui/ # Reusable UI (HotelForm, HotelsGrid)
│ │ ├── domain/ # Zod domain schema
│ │ ├── data-access/ # gateways + react-query hooks
│ │ └── feature/ # list, view, create, update
│ ├── shared/ # κοινά helpers (httpClient, toaster)
│ ├── App.tsx
│ └── main.tsx
├── package.json # frontend
└── README.md


---

## ⚙️ Setup

### 1. Clone το repo
```bash
git clone https://github.com/SteliosK1/my-hotel-app.git
cd my-hotel-app
npm install
cd simple_api
npm install
```
▶️ Run the App
Τρέξε backend
cd server
npm run dev
Server στο: http://localhost:3001
API endpoints: http://localhost:3001/api/hotels
Τρέξε frontend
cd ..
npm run dev
Frontend στο: http://localhost:5173
🔑 Features
Hotel List: Όλα τα ξενοδοχεία σε grid με βασικές πληροφορίες.
Hotel Details: Ονομασία, περιγραφή, amenities, κουμπιά για Edit/Delete.
Create Hotel: Φόρμα με validation (όνομα 2–50 χαρακτήρες, περιγραφή 10–200).
Edit Hotel: Προσυμπληρωμένη φόρμα, validation, save με toast + επιστροφή στο details.
Delete Hotel: Confirm dialog, optimistic update, redirect στη λίστα.
React Query: Caching, placeholder data, loading & error states.
Form Validation: Zod schemas + RHF integration.
✅ Success Criteria
 Λίστα με όλα τα hotels
 Προβολή πλήρους ξενοδοχείου
 Edit με validation & loading state
 Create με navigation στο νέο detail
 Delete με confirm & επιστροφή στη λίστα
 Reusable components & feature-based αρχιτεκτονική
🔮 Μελλοντικές Βελτιώσεις
Αναζήτηση & φίλτρα στα hotels
Pagination / infinite scroll
User authentication (login/logout)
Tests (unit & integration)
