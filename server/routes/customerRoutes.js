const express = require('express');
const router = express.Router();
const { 
    createCustomer, 
    getCustomers, 
    getCustomer, 
    updateCustomer, 
    deleteCustomer 
} = require('../controllers/customerController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
