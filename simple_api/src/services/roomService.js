const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class RoomService {
  async getAllRooms(filters = {}) {
    const where = {};
    
    // Apply filters
    if (filters.hotelId) where.hotelId = filters.hotelId;
    if (filters.type) where.type = filters.type;
    if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable;
    if (filters.minPrice || filters.maxPrice) {
      where.pricePerNight = {};
      if (filters.minPrice) where.pricePerNight.gte = filters.minPrice;
      if (filters.maxPrice) where.pricePerNight.lte = filters.maxPrice;
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        hotel: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return rooms;
  }

  async getRoomById(id) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return room;
  }

  async createRoom(data) {
    // Check if hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: data.hotelId }
    });
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    // Check if room number already exists in this hotel
    const existingRoom = await prisma.room.findFirst({
      where: {
        hotelId: data.hotelId,
        roomNumber: data.roomNumber
      }
    });

    if (existingRoom) {
      throw new Error('Room number already exists in this hotel');
    }

    const room = await prisma.room.create({
      data,
      include: {
        hotel: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return room;
  }

  async updateRoom(id, data) {
    // If updating room number, check for duplicates
    if (data.roomNumber) {
      const existingRoom = await prisma.room.findFirst({
        where: {
          id: { not: id },
          hotelId: data.hotelId,
          roomNumber: data.roomNumber
        }
      });

      if (existingRoom) {
        throw new Error('Room number already exists in this hotel');
      }
    }

    const room = await prisma.room.update({
      where: { id },
      data,
      include: {
        hotel: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return room;
  }

  async deleteRoom(id) {
    await prisma.room.delete({
      where: { id }
    });
  }

  async getRoomsByHotel(hotelId) {
    // Check if hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId }
    });
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const rooms = await prisma.room.findMany({
      where: { hotelId },
      orderBy: { roomNumber: 'asc' }
    });
    
    return {
      hotel: {
        id: hotel.id,
        name: hotel.name
      },
      rooms
    };
  }
}

module.exports = new RoomService();
