// get activity data by ID from strava API and then send them to FE
const strava = require('strava-v3');
require('dotenv').config();

strava.config({"access_token"  : process.env.STRAVA_ACCESS_TOCEN});

async function getActivityDataByID(activityId){
    strava.activities.get({id:activityId}, (data) => {
        console.log(data)
        return data
    })
}

// https get 


exports.getActivityData = async (req, res) => {
  try {
    const result = await getActivityDataByID(req.id)
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};