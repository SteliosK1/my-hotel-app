# 🏨 Simple Hotel Listing Assignment

## What You're Building

A hotel management app where users can view hotels, see details, and edit hotel information.

## Core Concepts

You need to build a simple hotel management app with three main views:
- **Hotel Listings** - View all hotels in a list with basic info
- **Hotel Details** - View individual hotel information (full details)
- **Edit Hotel** - Update hotel name, description, and amenities

The app should load data from an API, display it nicely, and allow editing hotel information.

## Tech Stack

- **React + TypeScript** with Vite
- **Chakra UI** for components
- **React Hook Form** for forms
- **Zod** for validation
- **React Query** for data
- **Axios** for API calls

## Setup

```bash
npm create vite@latest my-hotel-app -- --template react-ts
cd my-hotel-app
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install @tanstack/react-query react-hook-form @hookform/resolvers zod axios
```

## What to Build

### 1. Hotel Domain Model
**File:** `src/features/hotels/domain/Hotel.ts`
```typescript
// Define what a hotel looks like using Zod schemas
```

### 2. Data Access Layer
**File:** `src/features/hotels/data-access/gateway/hotelsGateway.ts`
```typescript
// API calls using httpClient (axios) for hotels
```

**File:** `src/features/hotels/data-access/useHotelsQuery/useHotelsQuery.ts`
```typescript
// React Query hook for fetching all hotels (GET)
```

**File:** `src/features/hotels/data-access/useHotelQuery/useHotelQuery.ts`
```typescript
// React Query hook for fetching single hotel (GET)
```

**File:** `src/features/hotels/data-access/useUpdateMutation/useUpdateHotelMutation.ts`
```typescript
// React Query hook for updating hotel (PUT)
```

### 3. Feature Components
**File:** `src/features/hotels/feature/list/list-hotels/ListHotels.tsx`
```typescript
// Hotel list page component
```

**File:** `src/features/hotels/feature/view/view-hotel/ViewHotel.tsx`
```typescript
// Hotel details view component
```

**File:** `src/features/hotels/feature/update/hotel-update/HotelUpdate.tsx`
```typescript
// Hotel update page component
```

**File:** `src/features/hotels/feature/update/validationSchema/hotelUpdateSchema.ts`
```typescript
// Zod validation schema for hotel updates
```

**File:** `src/features/hotels/feature/update/useUpdateHandler/useHotelUpdateHandler.ts`
```typescript
// Form submission handler for hotel updates
```

### 4. UI Components
**File:** `src/features/hotels/ui/HotelCard/HotelCard.tsx`
```typescript
// Hotel card component for lists
```

**File:** `src/features/hotels/ui/HotelForm/HotelForm.tsx`
```typescript
// Reusable hotel form component
```

### 5. Main App
**File:** `src/App.tsx`
```typescript
// Put it all together with simple navigation
```

## Requirements

### Hotel Data Should Include:
- `id` - string
- `name` - string (required, 2-50 characters)
- `description` - string (required, 10-200 characters) 
- `amenities` - array of strings

### Hotel List Should:
- Show all hotels in a grid or list layout
- Display hotel name, short description, and key amenities
- Have a "View Details" button for each hotel
- Have an "Edit" button for each hotel

### Hotel Details Should:
- Show full hotel information
- Display all amenities nicely
- Have buttons to "Edit" or "Back to List"

### Edit Form Should:
- Load existing hotel data automatically
- Show validation errors
- Save changes when submitted
- Show loading states
- Show success message after saving
- Return to hotel details view after saving

### Use This Mock Data:
```typescript
const MOCK_HOTELS = [
  {
    id: "hotel-1",
    name: "Sunset Resort",
    description: "Beautiful beachfront hotel with amazing sunset views and luxury amenities",
    amenities: ["WiFi", "Pool", "Restaurant"]
  },
  {
    id: "hotel-2", 
    name: "Mountain Lodge",
    description: "Cozy mountain retreat perfect for skiing and hiking adventures",
    amenities: ["WiFi", "Gym", "Parking", "Pet Friendly"]
  },
  {
    id: "hotel-3",
    name: "City Center Hotel", 
    description: "Modern hotel in the heart of downtown with business facilities",
    amenities: ["WiFi", "Restaurant", "Gym"]
  }
];
```

### Available Amenities:
- WiFi
- Pool  
- Restaurant
- Gym
- Parking
- Pet Friendly

## Key Features Implementation

### Data Fetching & Caching
- Use React Query hooks in the data-access layer
- Separate hooks for different operations (fetch all, fetch one, update)
- Cache the data so it doesn't refetch unnecessarily
- Handle loading and error states in each hook

### Form Management & Validation  
- Use React Hook Form in the update feature
- Create Zod validation schemas in validationSchema folder
- Create form handlers in useUpdateHandler folder
- Pre-fill form with fetched data
- Show validation errors under each field

### Data Mutation
- Use React Query mutation hooks in data-access layer
- Update the cache when save succeeds
- Show loading state on save button
- Show toast notification on success/error

### Feature-Based Architecture
- Keep each feature (hotels) in its own folder
- Separate concerns: data-access, domain, feature components, UI components
- Use gateway pattern for API calls
- Create reusable components in ui folder
- Keep business logic in domain folder

### Simple Navigation
- Use React state to track current view (list/details/edit)
- Pass hotel ID when switching to details/edit views
- Use buttons to navigate between views
- No need for React Router - keep it simple with conditional rendering

## Folder Structure
```
src/
├── features/
│   └── hotels/
│       ├── 📡 data-access/
│       │   ├── gateway/
│       │   │   └── hotelsGateway.ts           # API calls using httpClient
│       │   ├── useHotelsQuery/
│       │   │   └── useHotelsQuery.ts          # Fetch all hotels
│       │   ├── useHotelQuery/
│       │   │   └── useHotelQuery.ts           # Fetch single hotel
│       │   └── useUpdateMutation/
│       │       └── useUpdateHotelMutation.ts  # Update hotel
│       ├── 🎁 feature/
│       │   ├── list/
│       │   │   └── list-hotels/
│       │   │       └── ListHotels.tsx         # Hotel list page
│       │   ├── update/
│       │   │   ├── hotel-update/
│       │   │   │   └── HotelUpdate.tsx        # Hotel update page
│       │   │   ├── validationSchema/
│       │   │   │   └── hotelUpdateSchema.ts   # Zod validation
│       │   │   └── useUpdateHandler/
│       │   │       └── useHotelUpdateHandler.ts # Form handler
│       │   └── view/
│       │       └── view-hotel/
│       │           └── ViewHotel.tsx          # Hotel details view
│       ├── 🏢 domain/
│       │   └── Hotel.ts                       # Hotel domain model
│       ├── 🎨 ui/
│       │   ├── HotelCard/
│       │   │   └── HotelCard.tsx              # Hotel card component
│       │   └── HotelForm/
│       │       └── HotelForm.tsx              # Reusable form component
│       ├── 🧩 components/                     # Other reusable components
│       └── 🪝 hooks/                          # Feature-specific hooks
├── shared/
│   └── httpClient/                            # Axios configuration
│       └── httpClient.ts
└── App.tsx
```

## What This Tests

- **Feature-Based Architecture** - Can you organize code into logical feature folders?
- **Data Access Layer** - Can you separate API calls and React Query hooks properly?
- **React Query** - Can you fetch and cache data for lists and individual items?
- **Forms** - Can you handle form state and validation in a structured way?
- **TypeScript** - Can you type your data correctly across different layers?
- **Component Design** - Can you build clean, reusable components?
- **Separation of Concerns** - Can you keep domain, UI, and data access separate?
- **Navigation** - Can you handle switching between different views?

## Success Criteria

✅ Hotel list displays all hotels with basic info  
✅ Clicking "View Details" shows full hotel information  
✅ Hotel details page displays all data nicely  
✅ Edit form loads with existing hotel data  
✅ Validation works (try submitting empty fields)  
✅ Save button shows loading state  
✅ Success message appears after saving  
✅ Can navigate between list, details, and edit views  

## Getting Started

1. **Setup shared infrastructure**
   - Create `src/shared/httpClient/httpClient.ts` with axios configuration

2. **Start with the domain model**
   - Create `src/features/hotels/domain/Hotel.ts` with Zod schemas

3. **Build the data access layer**
   - Create gateway with API functions
   - Create React Query hooks for fetching and mutations

4. **Build feature components**
   - Start with the list hotels component
   - Build the view hotel component  
   - Build the update hotel component and its validation

5. **Create UI components**
   - Build reusable HotelCard and HotelForm components

6. **Connect everything in App.tsx**
   - Set up simple navigation between views
   - Add React Query provider and Chakra UI provider

Follow the feature-based structure - keep each concern separated and organized!
