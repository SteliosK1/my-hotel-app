const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MOCK_HOTELS = [
  {
    id: "hotel-1",
    name: "Sunset Resort",
    description: "Beautiful beachfront hotel with amazing sunset views and luxury amenities",
    amenities: JSON.stringify(["WiFi", "Pool", "Restaurant"])
  },
  {
    id: "hotel-2", 
    name: "Mountain Lodge",
    description: "Cozy mountain retreat perfect for skiing and hiking adventures",
    amenities: JSON.stringify(["WiFi", "Gym", "Parking", "Pet Friendly"])
  },
  {
    id: "hotel-3",
    name: "City Center Hotel", 
    description: "Modern hotel in the heart of downtown with business facilities",
    amenities: JSON.stringify(["WiFi", "Restaurant", "Gym"])
  }
];

const MOCK_ROOMS = [
  // Sunset Resort rooms
  {
    hotelId: "hotel-1",
    roomNumber: "101",
    type: "SINGLE",
    pricePerNight: 120.00,
    isAvailable: true
  },
  {
    hotelId: "hotel-1", 
    roomNumber: "201",
    type: "DOUBLE",
    pricePerNight: 180.00,
    isAvailable: true
  },
  {
    hotelId: "hotel-1",
    roomNumber: "301",
    type: "SUITE",
    pricePerNight: 350.00,
    isAvailable: false
  },
  
  // Mountain Lodge rooms
  {
    hotelId: "hotel-2",
    roomNumber: "A1",
    type: "FAMILY",
    pricePerNight: 250.00,
    isAvailable: true
  },
  {
    hotelId: "hotel-2",
    roomNumber: "A2", 
    type: "DOUBLE",
    pricePerNight: 160.00,
    isAvailable: true
  },
  {
    hotelId: "hotel-2",
    roomNumber: "B1",
    type: "SINGLE",
    pricePerNight: 100.00,
    isAvailable: true
  },

  // City Center Hotel rooms
  {
    hotelId: "hotel-3",
    roomNumber: "1001",
    type: "SUITE",
    pricePerNight: 400.00,
    isAvailable: true
  },
  {
    hotelId: "hotel-3",
    roomNumber: "1002",
    type: "DOUBLE", 
    pricePerNight: 200.00,
    isAvailable: false
  },
  {
    hotelId: "hotel-3",
    roomNumber: "1003",
    type: "SINGLE",
    pricePerNight: 140.00,
    isAvailable: true
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (rooms will be deleted automatically due to cascade)
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  // Create hotels
  for (const hotel of MOCK_HOTELS) {
    await prisma.hotel.create({
      data: hotel
    });
    console.log(`✅ Created hotel: ${hotel.name}`);
  }

  // Create rooms
  for (const room of MOCK_ROOMS) {
    await prisma.room.create({
      data: room
    });
    console.log(`✅ Created room: ${room.roomNumber} in hotel ${room.hotelId}`);
  }

  console.log('🎉 Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
