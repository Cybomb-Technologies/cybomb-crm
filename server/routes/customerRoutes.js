const express = require('express');
const router = express.Router();
const { 
    createCustomer, 
    getCustomers, 
    getCustomer, 
    updateCustomer, 
    deleteCustomer 
} = require('../controllers/customerController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), createCustomer);
router.get('/', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), getCustomers);
router.get('/:id', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), getCustomer);
router.put('/:id', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), updateCustomer);
router.delete('/:id', authorize('org_admin', 'sales_manager'), deleteCustomer);

module.exports = router;
