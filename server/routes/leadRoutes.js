const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  deleteLeads,
  exportLeads,
  importLeads,
} = require("../controllers/leadController");
const { auth, authorize } = require("../middleware/authMiddleware");
const checkOrgAccess = require("../middleware/checkOrgAccess");
const Lead = require("../models/Lead");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// All routes are protected
router.use(auth);

router.post(
  "/",
  authorize("org_admin", "sales_manager", "sales_executive", "marketing"),
  createLead,
);
router.get(
  "/",
  authorize("org_admin", "sales_manager", "sales_executive", "marketing"),
  getLeads,
);
router.get(
  "/export",
  authorize("org_admin", "sales_manager", "marketing"),
  exportLeads,
);
router.post(
  "/import",
  authorize("org_admin", "sales_manager", "marketing"),
  upload.single("file"),
  importLeads,
);
router.get(
  "/:id",
  checkOrgAccess(Lead),
  authorize("org_admin", "sales_manager", "sales_executive", "marketing"),
  getLead,
);
router.put(
  "/:id",
  checkOrgAccess(Lead),
  authorize("org_admin", "sales_manager", "sales_executive", "marketing"),
  updateLead,
);
router.delete(
  "/:id",
  checkOrgAccess(Lead),
  authorize("org_admin", "sales_manager"),
  deleteLead,
);
router.post(
  "/bulk-delete",
  authorize("org_admin", "sales_manager"),
  deleteLeads,
);

module.exports = router;
