// Higher-order middleware to check if the user belongs to the same organization as the resource
const checkOrgAccess = (Model) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check Organization Access
    if (resource.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Attach resource to request object to avoid re-fetching in controller
    req.resource = resource;
    next();
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = checkOrgAccess;
