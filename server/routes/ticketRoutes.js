const express = require('express');
const router = express.Router();
const { 
    createTicket, 
    getTickets, 
    getTicket, 
    updateTicket, 
    deleteTicket 
} = require('../controllers/ticketController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
