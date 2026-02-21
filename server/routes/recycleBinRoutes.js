const express = require('express');
const router = express.Router();
const { getDeletedItems, restoreItem, permanentlyDeleteItem } = require('../controllers/recycleBinController');
const { auth, authorize } = require('../middleware/authMiddleware');

// All recycle bin routes require org_admin
router.use(auth, authorize('org_admin'));

router.get('/', getDeletedItems);
router.post('/restore', restoreItem);
router.delete('/delete', permanentlyDeleteItem);

module.exports = router;
