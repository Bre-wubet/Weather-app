import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User; 