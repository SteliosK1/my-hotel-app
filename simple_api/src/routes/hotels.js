const express = require('express');
const hotelService = require('../services/hotelService');
const { createHotelSchema, updateHotelSchema, hotelIdSchema } = require('../schemas/hotelSchemas');

const router = express.Router();
const { pagePaginationQuerySchema } = require('../schemas/hotelSchemas');

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const pagination = pagePaginationQuerySchema.parse(req.query);
    const hotels = await hotelService.listHotelsPaged(pagination);
    res.json({ data: hotels, success: true });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = hotelIdSchema.parse(req.params);
    const hotel = await hotelService.getHotelById(id);
    res.json({ data: hotel, success: true });
  } catch (error) {
    if (error.message === 'Hotel not found') {
      return res.status(404).json({ 
        error: 'Hotel not found', 
        success: false 
      });
    }
    console.error('Error fetching hotel:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Create new hotel
router.post('/', async (req, res) => {
  try {
    const validatedData = createHotelSchema.parse(req.body);
    const hotel = await hotelService.createHotel(validatedData);
    res.status(201).json({ data: hotel, success: true });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors,
        success: false 
      });
    }
    console.error('Error creating hotel:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Update hotel
router.put('/:id', async (req, res) => {
  try {
    const { id } = hotelIdSchema.parse(req.params);
    const validatedData = updateHotelSchema.parse(req.body);
    const hotel = await hotelService.updateHotel(id, validatedData);
    res.json({ data: hotel, success: true });
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
        error: 'Hotel not found',
        success: false 
      });
    }
    console.error('Error updating hotel:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

// Delete hotel
router.delete('/:id', async (req, res) => {
  try {
    const { id } = hotelIdSchema.parse(req.params);
    await hotelService.deleteHotel(id);
    res.json({ message: 'Hotel deleted successfully', success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: 'Hotel not found',
        success: false 
      });
    }
    console.error('Error deleting hotel:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      success: false 
    });
  }
});

module.exports = router;
