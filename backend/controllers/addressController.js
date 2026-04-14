import Address from "../models/Address.js";

//add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // not from req.body
    const { address } = req.body;
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// get address
export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id; // not from req.body
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
