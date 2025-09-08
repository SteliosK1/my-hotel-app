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
  
async listHotelsPaged({ page = 1, per_page = 10, order = 'desc' }) {
  const skip = (page - 1) * per_page;
  const orderBy = [{ createdAt: order }, { id: order }];

  const [rows, total] = await Promise.all([
    prisma.hotel.findMany({ skip, take: per_page, orderBy }),
    prisma.hotel.count(),
  ]);

  const data = rows.map(transformHotel);

  const totalPages = total === 0 ? 0 : Math.ceil(total / per_page);
  const hasPrev = page > 1;
  const hasNext = skip + data.length < total;

  return {
    data,
    meta: {
      page,
      per_page,
      total,
      totalPages,
      hasPrev,
      hasNext,
      prevPage: hasPrev ? page - 1 : null,
      nextPage: hasNext ? page + 1 : null,
      order,
    },
  };
}

}

module.exports = new HotelService();
