import express from 'express';
import AsyncHandler from '../middleware/AsyncHandler.js';
import Day from '../models/DayModel.js';
import User from '../models/UserModel.js';
import { DateTime } from 'luxon';
const router = express.Router();

// GET route to fetch all days 
router.get('/', AsyncHandler(async (req, res) => {

  const days = await Day.find({});
  res.json(days);
}));

// GET route to fetch a specific day by date
router.get('/findDay', AsyncHandler(async (req, res) => {
  const { date } = req.query; // Use req.query to get the date from query parameters
  try {
    const day = await Day.findOne({ date }); // Find a day by date
    if (day) {
      return res.status(200).json(day);
    }
    return res.status(404).json(null); // Not found
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving day', error });
  }
}));

// POST route to add a new day
router.post('/addDay', AsyncHandler(async (req, res) => {
  const { date,dayName, availableHours } = req.body;

  try {
    const newDay = new Day({
      date,
      dayName,
      availableHours,
      takenHours: [], // Initialize with an empty array
    });
    // Save the new day document in the database
    await newDay.save();

    return res.status(201).json({ message: 'New day added successfully', newDay });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding new day', error });
  }
}));

// PUT route to update existing day by date
router.put('/', AsyncHandler(async (req, res) => {
  const { date, availableHours } = req.body; // Get date and availableHours from the request body

  try {
    // Find the document by date and update the availableHours
    const updatedDay = await Day.findOneAndUpdate(
      { date }, // Find the document by date
      { availableHours }, // Update the availableHours field
      { new: true } // Return the updated document
    );

    if (!updatedDay) {
      return res.status(404).json({ message: 'Day not found' });
    }

    res.status(200).json({ message: 'Hours updated successfully', updatedDay });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hours' });
  }
}));

// PUT route to add a taken hour
router.put('/addTakenHour', AsyncHandler(async (req, res) => {
  const { date, hour, name, school } = req.body;

  // Validate that name and school are present in the request body
  if (!name || !school) {
    return res.status(400).json({ message: 'Name and school are required' });
  }

  try {
    // Find the day by date
    const day = await Day.findOne({ date });

    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Check if the hour is already taken
    const hourTaken = day.takenHours.some(lesson => lesson.hour === hour);

    if (hourTaken) {
      return res.status(400).json({ message: 'Hour already taken' });
    }

    // Add the selected hour to takenHours with the provided name and school
    day.takenHours.push({ hour, name, school });

    // Remove the hour from availableHours
    day.availableHours = day.availableHours.filter(h => h !== hour);

    // Save the updated day
    await day.save();

    return res.status(200).json({ message: 'Hour updated successfully', day });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update takenHours' });
  }
}));

// GET route fetch all the taken hours
router.get('/taken-hours', async (req, res) => {
  try {
    // Find all days with non-empty takenHours array
    const days = await Day.find({ 'takenHours.0': { $exists: true } });

    // Extract relevant data (name, school, date, hour) from takenHours for each day
    const takenHoursData = days.flatMap(day =>
      day.takenHours.map(lesson => ({
        id: `${day._id}-${lesson._id}`, // Generate a unique ID for each row
        date: day.date,
        dayName: day.dayName,
        hour: lesson.hour,
        name: lesson.name,
        school: lesson.school,
      }))
    );

    res.json(takenHoursData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching taken hours', error });
  }
});

// PUT route to remove an hour from takenHours and add it back to availableHours
router.put('/remove-taken-hour', AsyncHandler(async (req, res) => {
  const { date, hour, name, school } = req.body; // Get the hour details from the request body

  try {
    // Find the day by date
    const day = await Day.findOne({ date });

    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Remove the hour from takenHours
    day.takenHours = day.takenHours.filter(takenHour => !(takenHour.hour === hour && takenHour.name === name && takenHour.school === school));

    // Add the hour back to availableHours
    if (!day.availableHours.includes(hour)) {
      day.availableHours.push(hour);
    }

    // Save the updated day document
    await day.save();

    res.status(200).json({ message: 'Hour removed successfully', day });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove hour' });
  }
}));

// POST route to login or register a new user
router.post('/login', AsyncHandler(async (req, res) => {
  const { name, school } = req.body;

  try {
    // Check if the user already exists (for login)
    let user = await User.findOne({ name, school });
    
    if (user) {
      // If user exists, send a 'login' message
      return res.status(200).json({ message: 'login', user });
    } else {
      // If user doesn't exist, register a new user
      const newUser = new User({ name, school });
      await newUser.save();
      
      // Send a 'register' message
      return res.status(201).json({ message: 'register', user: newUser });
    }
  } catch (error) {
    // Handle any errors during the process
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Error processing request', error });
  }
}));

// PUT route to remove an available hour from a day
router.put('/remove-available-hour', AsyncHandler(async (req, res) => {
  const { date, hour } = req.body;
  try {
    const day = await Day.findOne({ date });

    if (!day) {
      return res.status(404).json({ message: 'Day not found' });
    }

    // Remove the hour from availableHours
    day.availableHours = day.availableHours.filter(h => h !== hour);

    await day.save();

    res.status(200).json({ message: 'Hour removed successfully', day });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove hour' });
  }
}));


// PUT route to remove expired hours based on the current time in Israel
router.put('/remove-expired-hours', AsyncHandler(async (req, res) => {
  try {
    // Get current time in Israel (taking into account DST)
    const israelTime = DateTime.now().setZone('Asia/Jerusalem');

    // Format the current date in DD/MM/YY format (matching the format in your database)
    const currentDateString = israelTime.toFormat('dd/LL/yy');

    // Current time (hours and minutes)
    const currentTimeString = israelTime.toFormat('HH:mm');

    // Find all days including and before the current date (formatted as DD/MM/YY)
    const days = await Day.find({ date: { $lte: currentDateString } });

    for (const day of days) {
      // If the date is today, only remove hours that are less than the current time
      if (day.date === currentDateString) {
        // Remove hours that have already passed
        day.availableHours = day.availableHours.filter(hour => hour > currentTimeString);
        day.takenHours = day.takenHours.filter(lesson => lesson.hour > currentTimeString);
      } else {
        // If the date is before today, remove all hours (as they are all expired)
        day.availableHours = [];
        day.takenHours = [];
      }

      // If both availableHours and takenHours are empty, delete the entire day
      if (day.availableHours.length === 0 && day.takenHours.length === 0) {
        await Day.deleteOne({ _id: day._id });
      } else {
        await day.save(); // Save the day if there are still hours left
      }
    }

    res.status(200).json({ message: 'Expired hours removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove expired hours', error });
  }
}));

export default router;
