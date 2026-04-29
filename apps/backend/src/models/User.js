import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: '',
    },
    skills: [
      {
        name: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
        description: { type: String, default: '' },
        _id: false,
      },
    ],
    learningGoals: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        _id: false,
      },
    ],

    availability: {
  type: String,
  enum: ["Online", "Offline", "Both"],
  default: "Online",
},

teachSkills: {
  type: [String],
  default: [],
},

learnSkills: {
  type: [String],
  default: [],
},
    interests: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalConnections: {
      type: Number,
      default: 0,
    },
    skillExchanges: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for searching users
userSchema.index({ name: 'text', email: 'text', college: 'text' });
userSchema.index({ skills: 1 });
userSchema.index({ learningGoals: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Get public profile (hide sensitive data)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    skills: this.skills,
    learningGoals: this.learningGoals,
    interests: this.interests,
    profileImage: this.profileImage,
    location: this.location,
    college: this.college,
    badges: this.badges,
    rating: this.rating,
    totalConnections: this.totalConnections,
    skillExchanges: this.skillExchanges,
    lastActive: this.lastActive,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
