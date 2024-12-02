// backend/src/controllers/supportGroupController.js
import SupportGroup from '../models/SupportGroup.js';
import UserGroup from '../models/UserGroup.js';

// Get all available groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await SupportGroup.find({ isActive: true })
      .select('-__v')
      .lean();
    
    res.json(groups);
  } catch (error) {
    console.error('Error fetching support groups:', error);
    res.status(500).json({ message: 'Error fetching support groups' });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const newGroup = new SupportGroup({
      name,
      description,
      category,
      creator: req.user.id
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating support group:', error);
    res.status(500).json({ message: 'Error creating support group' });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userGroups = await UserGroup.find({ user: req.user.id })
      .populate('group')
      .select('group joinedAt')
      .exec();

    res.json(userGroups.map(ug => ug.group));
  } catch (error) {
    console.error('Error getting user groups:', error);
    res.status(500).json({ message: 'Error fetching user groups' });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Check if user is already in the group
    const existingMembership = await UserGroup.findOne({
      user: userId,
      group: groupId
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    // Create new membership
    const newMembership = new UserGroup({
      user: userId,
      group: groupId,
      joinedAt: new Date()
    });

    await newMembership.save();
    res.status(201).json({ message: 'Successfully joined group' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Error joining group' });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await SupportGroup.findOne({ id: groupId });
    if (!group) {
      return res.status(404).json({ message: 'Support group not found' });
    }

    if (group.currentMembers > 0) {
      group.currentMembers -= 1;
      await group.save();
    }

    res.json({ 
      message: 'Successfully left the group',
      currentMembers: group.currentMembers,
      spotsAvailable: group.capacity - group.currentMembers
    });
  } catch (error) {
    console.error('Error leaving support group:', error);
    res.status(500).json({ message: 'Error leaving support group' });
  }
};