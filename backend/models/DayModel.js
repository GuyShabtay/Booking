import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema({
  hour: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
});

const daySchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    dayName: {
    type: String,
    required: true,
  },
    availableHours: {
      type: [String],
    },
    takenHours: {
      type: [lessonSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Day = mongoose.model('Day', daySchema);

export default Day;
