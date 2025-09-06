const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Transform hotel data to include parsed amenities
const transformHotel = (hotel) => ({
  ...hotel,
  amenities: JSON.parse(hotel.amenities)
});

class HotelService {
  async getAllHotels() {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return hotels.map(transformHotel);
  }

  async getHotelById(id) {
    const hotel = await prisma.hotel.findUnique({
      where: { id }
    });
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    
    return transformHotel(hotel);
  }

  async createHotel(data) {
    const hotel = await prisma.hotel.create({
      data: {
        ...data,
        amenities: JSON.stringify(data.amenities)
      }
    });
    return transformHotel(hotel);
  }

  async updateHotel(id, data) {
    const updateData = { ...data };
    if (data.amenities) {
      updateData.amenities = JSON.stringify(data.amenities);
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: updateData
    });
    return transformHotel(hotel);
  }

  async deleteHotel(id) {
    await prisma.hotel.delete({
      where: { id }
    });
  }
}

module.exports = new HotelService();
