const Workout = require('../models/Workout');

module.exports.addWorkout = async (req, res) => {

    const workout = await Workout.findOne({ name: req.body.name });
    if (workout) {
        return res.status(409).send({ error: 'Workout already exists' })
    }

    let newWorkout = new Workout({
        name: req.body.name,
        userId: req.user.id,
        duration: req.body.duration,
    })

    try {
        const savedWorkout = await newWorkout.save();
        return res.status(201).send(savedWorkout);
    }
    catch (err) {
        console.log('Error in adding the course', err);
        return res.status(500).send({ message: 'Error in adding workout' })
    }
}

module.exports.getWorkouts = async (req, res) => {

    const workouts = await Workout.find({ userId: req.user.id });
    try {
        if (workouts.length > 0) {
            return res.status(200).send({ workouts })
        }
        else {
            return res.status(200).send({ message: 'No Workout found' })
        }
    }
    catch (err) {
        console.error('Error in getting workouts: ', err);
        return errors.status(500).send({ error: 'Error in getting workout' })
    }
}

module.exports.getWorkout = async (req, res) => {
    let workoutId = req.params.workoutId;
    try {
        const workout = await Workout.findOne({ userId: req.user.id, _id: workoutId });
        if (!workout) {
            return res.status(404).send({ error: "Workout not found" })
        }
        return res.status(200).send({ workout });
    }
    catch (err) {
        console.error('Error in getting workout: ', err);
        return errors.status(500).send({ error: 'Error in getting workout' })
    }

}

module.exports.updateWorkout = async (req, res) => {
    let workoutId = req.params.workoutId;
    let newWorkout = {
        name: req.body.name,
        duration: req.body.duration,
    }

    try {
        const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, newWorkout);
        if (updatedWorkout) {
            return res.status(200).send({
                message: "Workout updated successfully",
                updatedWorkout
            })
        }
    }
    catch (err) {
        console.error('Error in updating workout: ', err);
        return res.status(500).send({ error: 'Error in updating the workout ' })
    }
}

module.exports.deleteWorkout = async (req, res) => {
    let workoutId = req.params.workoutId;
    try {
        const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
        if (!deletedWorkout) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        return res.status(200).send({ message: 'Workout deleted successfully' });
    }
    catch (err) {
        console.log('error in deleting workout: ', err);
        return res.status(500).send({ error: 'error in deleting workout' });
    }

}

module.exports.completeWorkout = async (req, res) => {
    let workoutId = req.params.workoutId;

    try {
        updatedWorkout = await Workout.findById(workoutId);

        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found' });
        }

        updatedWorkout.status = 'completed'
        await updatedWorkout.save();
        return res.status(200).send({
            message: 'Workout status updated successfully',
            updatedWorkout
        })
    }
    catch(err) {
        console.log('error in completing workout: ', err);
        return res.status(500).send({ error: 'error in completing workout' });
    }
}