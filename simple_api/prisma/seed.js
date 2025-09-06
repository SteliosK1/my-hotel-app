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

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.hotel.deleteMany();

  // Create hotels
  for (const hotel of MOCK_HOTELS) {
    await prisma.hotel.create({
      data: hotel
    });
    console.log(`✅ Created hotel: ${hotel.name}`);
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
