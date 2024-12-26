// server/controllers/groupController.js
const Group = require('../models/Group');

exports.createGroup = async (req, res) => {
    const { name, members, admin } = req.body;
    try {
        const group = new Group({ name, members, admin });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Group creation failed' });
    }
};