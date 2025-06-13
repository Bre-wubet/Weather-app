import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  favorites: [{
    cityName: String,
    lat: Number,
    lon: Number,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  searchHistory: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User; 