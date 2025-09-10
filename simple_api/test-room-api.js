#!/usr/bin/env node

/**
 * Room API Test Script
 * Tests all room endpoints to ensure they work correctly
 */

const BASE_URL = 'http://localhost:3001/api';

async function testAPI(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    console.log(`   Success: ${result.success}`);
    if (result.data && method === 'GET') {
      console.log(`   Results: ${Array.isArray(result.data) ? result.data.length : 1} item(s)`);
    }
    console.log('');
    
    return result;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    console.log('');
    return null;
  }
}

async function runRoomTests() {
  console.log('🏨 Room API Test Suite');
  console.log('=====================\n');

  // Test 1: Get all rooms
  console.log('📋 Testing: Get all rooms');
  await testAPI('GET', '/rooms');
  
  // Test 2: Get rooms for a specific hotel
  console.log('🏢 Testing: Get rooms for hotel-1');
  await testAPI('GET', '/rooms/hotel/hotel-1');
  
  // Test 3: Create a new room
  console.log('➕ Testing: Create new room');
  const newRoom = {
    hotelId: 'hotel-1',
    roomNumber: 'TEST-01',
    type: 'DOUBLE',
    pricePerNight: 199.99,
    isAvailable: true
  };
  
  const createdRoom = await testAPI('POST', '/rooms', newRoom);
  
  if (createdRoom && createdRoom.success) {
    const roomId = createdRoom.data.id;
    
    // Test 4: Get the created room
    console.log('🔍 Testing: Get created room by ID');
    await testAPI('GET', `/rooms/${roomId}`);
    
    // Test 5: Update the room
    console.log('✏️ Testing: Update room');
    const updateData = {
      pricePerNight: 249.99,
      isAvailable: false
    };
    await testAPI('PUT', `/rooms/${roomId}`, updateData);
    
    // Test 6: Delete the room
    console.log('🗑️ Testing: Delete room');
    await testAPI('DELETE', `/rooms/${roomId}`);
  }
  
  // Test 7: Test validation (should fail)
  console.log('❌ Testing: Invalid room creation (should fail)');
  const invalidRoom = {
    hotelId: 'non-existent-hotel',
    roomNumber: '',
    type: 'INVALID_TYPE',
    pricePerNight: -10
  };
  await testAPI('POST', '/rooms', invalidRoom);
  
  console.log('🎉 Room API tests completed!');
  console.log('📚 Check the integration guide: ROOM_API_INTEGRATION.md');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or install node-fetch');
  console.log('💡 Alternatively, test manually using the guide in ROOM_API_INTEGRATION.md');
  process.exit(1);
}

runRoomTests().catch(console.error);
