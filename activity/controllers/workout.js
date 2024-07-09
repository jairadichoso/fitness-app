const Workout = require("../models/Workout");
const User = require('../models/User');

module.exports.addWorkout = (req, res) => {
		return Workout.findOne({ name: req.body.name }).then(existingWorkout => {

			let newWorkout = new Workout({
				userId: req.user.id,
				name : req.body.name,
				duration : req.body.duration
			});

			if(existingWorkout) {
				return res.status(409).send({ error : 'Workout already exists' });
			}

			return newWorkout.save().then(savedWorkout => res.status(201).send(savedWorkout)).catch(saveError => {

				console.error('Error in saving the workout: ', saveError);

				res.status(500).send({ error : 'Failed to save the workout' });
			});

		}).catch(findErr => {

			console.error('Error in finding the workout: ', findErr);

			return res.status(500).send({ message: "Error in finding the workout" });
		})
}; 

module.exports.getMyWorkouts = (req, res) => {

	return Workout.find({}).then(workouts => {

		if(workouts.length > 0) {

			return res.status(200).send({ workouts: workouts });

		} else {

			return res.status(200).send({ message : 'No workouts found.' })
		}
		
	}).catch(findErr => {

		console.error('Error in finding all workouts: ', findErr);

		return res.status(500).send({ error : 'Error finding workouts.'})
	});
};

module.exports.updateWorkout = (req, res) => {

	let workoutId = req.params.workoutId;

	let updatedWorkout = {
		name : req.body.name,
		duration : req.body.duration
	};

	return Workout.findByIdAndUpdate(workoutId, updatedWorkout).then(updatedWorkout => {

		if (updatedWorkout) {

            return res.status(200).send({
            	message : 'Workout updated successfully',
            	updatedWorkout : updatedWorkout
            });

        } else {

            return res.status(404).send({ error : 'Workout not found'});
        }

	}).catch(updateErr => {

		console.error('Error in updating the workout: ', updateErr);

		return res.status(500).send({ error : 'Error in updating the workout' });
	});
}

module.exports.deleteWorkout = async (req, res) => {

    let workoutId = req.params.workoutId;
    
	try {
        const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
        if(!deletedWorkout){
            return res.status(404).send({ error: 'Workout not found'});
        }

        return res.status(200).send({ message: 'Workout deleted successfully'});
    }

    catch (err) {
        console.log('Error in deleting workout: ', err);
        return res.status(500).send({error : 'Error in deleting workout'});
    }

}

module.exports.completeWorkoutStatus = (req, res) => {

    let updateWorkoutStatus = {
        status: 'completed'
    }
    
    return Workout.findByIdAndUpdate(req.params.workoutId, updateWorkoutStatus).then(updateWorkout => {

        if (updateWorkout) {

            res.status(200).send({ 
            	message: 'Workout status updated successfully',
            	updatedWorkout: updateWorkout
            });

        } else {
            res.status(404).send({ error : 'Workout not found'});
        }
    }).catch(updateErr => {

		console.error('Error in completing the workout: ', updateErr);

		return res.status(500).send({ error : 'Failed to complete a workout' });
	});
};



