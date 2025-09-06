# Hotel API Test Requests

## Test the API endpoints using curl or your favorite HTTP client

### 1. Get All Hotels
```bash
curl -X GET http://localhost:3001/api/hotels
```

### 2. Get Hotel by ID
```bash
curl -X GET http://localhost:3001/api/hotels/hotel-1
```

### 3. Create New Hotel
```bash
curl -X POST http://localhost:3001/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ocean View Hotel",
    "description": "Stunning ocean views and premium amenities for a perfect getaway",
    "amenities": ["WiFi", "Pool", "Restaurant", "Gym"]
  }'
```

### 4. Update Hotel
```bash
curl -X PUT http://localhost:3001/api/hotels/hotel-1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunset Resort & Spa",
    "description": "Beautiful beachfront hotel with amazing sunset views, luxury amenities, and world-class spa",
    "amenities": ["WiFi", "Pool", "Restaurant", "Spa", "Gym"]
  }'
```

### 5. Delete Hotel
```bash
curl -X DELETE http://localhost:3001/api/hotels/hotel-3
```

## Expected Response Format

### Success Response
```json
{
  "data": {
    "id": "hotel-1",
    "name": "Sunset Resort",
    "description": "Beautiful beachfront hotel...",
    "amenities": ["WiFi", "Pool", "Restaurant"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

### Error Response
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 2,
      "type": "string",
      "path": ["name"],
      "message": "String must contain at least 2 character(s)"
    }
  ],
  "success": false
}
```
