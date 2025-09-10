const express = require('express');
const roomService = require('../services/roomService');
const { createRoomSchema, updateRoomSchema, roomIdSchema, roomQuerySchema } = require('../schemas/roomSchemas');

const router = express.Router();

// Get all rooms (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const filters = roomQuerySchema.parse(req.query);
    const rooms = await roomService.getAllRooms(filters);
    res.json({ 
      data: rooms, 
      success: true,
      count: rooms.length
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Get rooms by hotel ID
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const result = await roomService.getRoomsByHotel(hotelId);
    res.json({ data: result, success: true });
  } catch (error) {
    if (error.message === 'Hotel not found') {
      return res.status(404).json({ 
        error: 'Hotel not found', 
        success: false 
      });
    }
    console.error('Error fetching rooms by hotel:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = roomIdSchema.parse(req.params);
    const room = await roomService.getRoomById(id);
    res.json({ data: room, success: true });
  } catch (error) {
    if (error.message === 'Room not found') {
      return res.status(404).json({ 
        error: 'Room not found', 
        success: false 
      });
    }
    console.error('Error fetching room:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Create new room
router.post('/', async (req, res) => {
  try {
    const validatedData = createRoomSchema.parse(req.body);
    const room = await roomService.createRoom(validatedData);
    res.status(201).json({ data: room, success: true });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors,
        success: false 
      });
    }
    if (error.message === 'Hotel not found') {
      return res.status(404).json({ 
        error: 'Hotel not found', 
        success: false 
      });
    }
    if (error.message === 'Room number already exists in this hotel') {
      return res.status(409).json({ 
        error: 'Room number already exists in this hotel', 
        success: false 
      });
    }
    console.error('Error creating room:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Update room
router.put('/:id', async (req, res) => {
  try {
    const { id } = roomIdSchema.parse(req.params);
    const validatedData = updateRoomSchema.parse(req.body);
    const room = await roomService.updateRoom(id, validatedData);
    res.json({ data: room, success: true });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors,
        success: false 
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: 'Room not found',
        success: false 
      });
    }
    if (error.message === 'Room number already exists in this hotel') {
      return res.status(409).json({ 
        error: 'Room number already exists in this hotel', 
        success: false 
      });
    }
    console.error('Error updating room:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Delete room
router.delete('/:id', async (req, res) => {
  try {
    const { id } = roomIdSchema.parse(req.params);
    await roomService.deleteRoom(id);
    res.json({ message: 'Room deleted successfully', success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: 'Room not found',
        success: false 
      });
    }
    console.error('Error deleting room:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

module.exports = router;
