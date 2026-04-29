import User from '../models/User.js';
import Badge from '../models/Badge.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Assign badges based on user activity
const assignBadges = async (user) => {
  const badges = await Badge.find({});
  const newBadges = [];

  for (const badge of badges) {
    // Check if user already has this badge
    if (user.badges.includes(badge._id)) continue;

    let shouldAssign = false;

    switch (badge.criteria) {
      case 'connections':
        shouldAssign = user.totalConnections >= badge.requiredValue;
        break;
      case 'skills_count':
        shouldAssign = user.skills.length >= badge.requiredValue;
        break;
      case 'learning_count':
        shouldAssign = user.learningGoals.length >= badge.requiredValue;
        break;
      case 'exchanges':
        shouldAssign = user.skillExchanges >= badge.requiredValue;
        break;
    }

    if (shouldAssign) {
      newBadges.push(badge._id);
    }
  }

  if (newBadges.length > 0) {
    user.badges = [...user.badges, ...newBadges];
    await user.save();
  }

  return newBadges;
};

export const signup = async (req, res) => {
  try {
    const {name, email, password, college, location, skills, learningGoals, interests, availability, bio, phone, profileImage} = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password,
      college: college || '',
      location: location || '',
      skills: skills || [],
      learningGoals: learningGoals || [],
      interests: interests || [],
      availability: availability || 'Online',
      bio: bio || '',
      phone: phone || '',
      profileImage: profileImage || '',
    });

    // Initialize default badges
    await Badge.initDefaultBadges();

    // Assign initial badges
    await assignBadges(user);

    // Generate token
    const token = generateToken(user._id);

    // Update last active
    user.lastActive = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        skills: user.skills,
        learningGoals: user.learningGoals,
        interests: user.interests,
        badges: user.badges,
        rating: user.rating,
        totalConnections: user.totalConnections,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last active
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        skills: user.skills,
        learningGoals: user.learningGoals,
        interests: user.interests,
        bio: user.bio,
        profileImage: user.profileImage,
        badges: user.badges,
        rating: user.rating,
        totalConnections: user.totalConnections,
        skillExchanges: user.skillExchanges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('badges');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        learningGoals: user.learningGoals,
        interests: user.interests,
        profileImage: user.profileImage,
        badges: user.badges,
        rating: user.rating,
        totalConnections: user.totalConnections,
        skillExchanges: user.skillExchanges,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, college, location, phone, skills, learningGoals, interests, profileImage } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (college !== undefined) user.college = college;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (skills) user.skills = skills;
    if (learningGoals) user.learningGoals = learningGoals;
    if (interests) user.interests = interests;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    // Check for new badges
    const newBadges = await assignBadges(user);

    res.status(200).json({
      success: true,
      message: newBadges.length > 0 ? 'Profile updated and new badges earned!' : 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        learningGoals: user.learningGoals,
        interests: user.interests,
        profileImage: user.profileImage,
        badges: user.badges,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).populate('badges');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        college: user.college,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        learningGoals: user.learningGoals,
        interests: user.interests,
        profileImage: user.profileImage,
        badges: user.badges,
        rating: user.rating,
        totalConnections: user.totalConnections,
        skillExchanges: user.skillExchanges,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
