const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class BookingService {
  // Calculate total price based on room price and nights
  calculateTotalPrice(pricePerNight, checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  }

  // Check if room is available for given dates
  async checkRoomAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (!room.isAvailable) {
      throw new Error('Room is not available for booking');
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        OR: [
          // New booking starts during existing booking
          {
            checkIn: { lte: checkInDate },
            checkOut: { gt: checkInDate }
          },
          // New booking ends during existing booking
          {
            checkIn: { lt: checkOutDate },
            checkOut: { gte: checkOutDate }
          },
          // New booking completely contains existing booking
          {
            checkIn: { gte: checkInDate },
            checkOut: { lte: checkOutDate }
          }
        ]
      }
    });

    return {
      available: conflictingBookings.length === 0,
      conflictingBookings
    };
  }

  async getAllBookings(filters = {}) {
    const where = {};
    
    // Apply filters
    if (filters.roomId) where.roomId = filters.roomId;
    if (filters.status) where.status = filters.status;
    if (filters.guestEmail) where.guestEmail = filters.guestEmail;
    
    // Date range filters
    if (filters.checkInFrom || filters.checkInTo) {
      where.checkIn = {};
      if (filters.checkInFrom) where.checkIn.gte = new Date(filters.checkInFrom);
      if (filters.checkInTo) where.checkIn.lte = new Date(filters.checkInTo);
    }

    // Hotel filter (through room relationship)
    if (filters.hotelId) {
      where.room = {
        hotelId: filters.hotelId
      };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          room: {
            include: {
              hotel: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async getBookingById(id) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  }

  async createBooking(data) {
    // Check room availability
    const availability = await this.checkRoomAvailability(
      data.roomId, 
      data.checkIn, 
      data.checkOut
    );

    if (!availability.available) {
      throw new Error('Room is not available for the selected dates');
    }

    // Get room to calculate total price
    const room = await prisma.room.findUnique({
      where: { id: data.roomId }
    });

    const totalPrice = this.calculateTotalPrice(
      room.pricePerNight,
      data.checkIn,
      data.checkOut
    );

    const booking = await prisma.booking.create({
      data: {
        ...data,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        totalPrice
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    return booking;
  }

  async updateBooking(id, data) {
    // If updating dates, check availability
    if (data.checkIn || data.checkOut) {
      const existingBooking = await prisma.booking.findUnique({
        where: { id },
        include: { room: true }
      });

      if (!existingBooking) {
        throw new Error('Booking not found');
      }

      const checkIn = data.checkIn ? new Date(data.checkIn) : existingBooking.checkIn;
      const checkOut = data.checkOut ? new Date(data.checkOut) : existingBooking.checkOut;

      const availability = await this.checkRoomAvailability(
        existingBooking.roomId,
        checkIn,
        checkOut,
        id // Exclude current booking from availability check
      );

      if (!availability.available) {
        throw new Error('Room is not available for the updated dates');
      }

      // Recalculate total price if dates changed
      if (data.checkIn || data.checkOut) {
        data.totalPrice = this.calculateTotalPrice(
          existingBooking.room.pricePerNight,
          checkIn,
          checkOut
        );
      }
    }

    // Convert date strings to Date objects
    const updateData = { ...data };
    if (updateData.checkIn) updateData.checkIn = new Date(updateData.checkIn);
    if (updateData.checkOut) updateData.checkOut = new Date(updateData.checkOut);

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    return booking;
  }

  async deleteBooking(id) {
    await prisma.booking.delete({
      where: { id }
    });
  }

  async getBookingsByRoom(roomId) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!room) {
      throw new Error('Room not found');
    }

    const bookings = await prisma.booking.findMany({
      where: { roomId },
      orderBy: { checkIn: 'asc' }
    });
    
    return {
      room,
      bookings
    };
  }

  async getBookingsByHotel(hotelId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId }
    });
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          hotelId
        }
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            type: true
          }
        }
      },
      orderBy: { checkIn: 'asc' }
    });
    
    return {
      hotel: {
        id: hotel.id,
        name: hotel.name
      },
      bookings
    };
  }
}

module.exports = new BookingService();
