const express = require('express');
const router = express.Router();
const { 
    createAutomation, 
    getAutomations, 
    getAutomation, 
    updateAutomation, 
    deleteAutomation 
} = require('../controllers/automationController');
const { auth } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', createAutomation);
router.get('/', getAutomations);
router.get('/:id', getAutomation);
router.put('/:id', updateAutomation);
router.delete('/:id', deleteAutomation);

module.exports = router;
