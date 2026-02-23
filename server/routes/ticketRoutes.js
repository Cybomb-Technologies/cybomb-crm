const express = require('express');
const router = express.Router();
const { 
    createTicket, 
    getTickets, 
    getTicket, 
    updateTicket, 
    deleteTicket 
} = require('../controllers/ticketController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', authorize('org_admin', 'support_agent', 'sales_manager', 'sales_executive'), createTicket);
router.get('/', authorize('org_admin', 'support_agent', 'sales_manager', 'sales_executive'), getTickets);
router.get('/:id', authorize('org_admin', 'support_agent', 'sales_manager', 'sales_executive'), getTicket);
router.put('/:id', authorize('org_admin', 'support_agent', 'sales_manager', 'sales_executive'), updateTicket);
router.delete('/:id', authorize('org_admin', 'support_agent'), deleteTicket);

module.exports = router;
