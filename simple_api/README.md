# Simple Hotel API

A simple REST API for hotel management built with Node.js, Prisma, and SQLite.

## Features

- ✅ CRUD operations for hotels
- ✅ SQLite database with Prisma ORM
- ✅ Data validation with Zod
- ✅ CORS enabled for frontend integration
- ✅ Mock data seeding

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed with mock data
npm run db:seed
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Hotels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | Get all hotels |
| GET | `/api/hotels/:id` | Get hotel by ID |
| POST | `/api/hotels` | Create new hotel |
| PUT | `/api/hotels/:id` | Update hotel |
| DELETE | `/api/hotels/:id` | Delete hotel |

### Example Requests

#### Get All Hotels
```bash
GET http://localhost:3001/api/hotels
```

#### Get Hotel by ID
```bash
GET http://localhost:3001/api/hotels/hotel-1
```

#### Create Hotel
```bash
POST http://localhost:3001/api/hotels
Content-Type: application/json

{
  "name": "New Hotel",
  "description": "A wonderful place to stay",
  "amenities": ["WiFi", "Pool"]
}
```

#### Update Hotel
```bash
PUT http://localhost:3001/api/hotels/hotel-1
Content-Type: application/json

{
  "name": "Updated Hotel Name",
  "description": "Updated description",
  "amenities": ["WiFi", "Pool", "Gym"]
}
```

## Data Model

### Hotel
```typescript
{
  id: string
  name: string (2-50 characters)
  description: string (10-200 characters)
  amenities: string[] (array of amenity names)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Available Amenities
- WiFi
- Pool
- Restaurant
- Gym
- Parking
- Pet Friendly

## Mock Data

The API comes with 3 pre-seeded hotels:
- Sunset Resort
- Mountain Lodge
- City Center Hotel

## Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Reset and reseed database
npm run db:push
npm run db:seed
```

## CORS Configuration

The API is configured to accept requests from any origin, making it suitable for local development with frontend applications.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "success": false,
  "details": [] // For validation errors
}
```

## Success Response Format

```json
{
  "data": {}, // Response data
  "success": true
}
```
