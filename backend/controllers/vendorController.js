const Vendor = require('../models/Vendor');
const User = require('../models/User');

async function createVendor(req, res) {
  try {
    const userId = req.userId;
    const { businessName, businessAddress, categories, services } = req.body;
    if (!businessName) return res.status(400).json({ success: false, message: 'businessName required' });

    const vendor = await Vendor.create({ userId, businessName, businessAddress, categories, services });

    // link to user
    await User.findByIdAndUpdate(userId, { vendorProfileId: vendor._id });

    return res.status(201).json({ success: true, vendor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed creating vendor' });
  }
}

async function updateVendor(req, res) {
  try {
    const userId = req.userId;
    const id = req.params.id;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    if (vendor.userId.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    Object.assign(vendor, req.body);
    await vendor.save();
    return res.json({ success: true, vendor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed updating vendor' });
  }
}

async function getVendor(req, res) {
  try {
    const id = req.params.id;
    const vendor = await Vendor.findById(id).populate('userId', 'phone countryCode name email');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    return res.json({ success: true, vendor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed fetching vendor' });
  }
}

module.exports = { createVendor, updateVendor, getVendor };
