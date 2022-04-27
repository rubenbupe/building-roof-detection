const { Location } = require('../../common/models/Location');

exports.get_history = async (req, res, next) => {

    console.log(req.query)
    if (req.query.from == null || req.query.to == null) {
        return res.sendStatus(400);
    }

    const location_history = await Location.aggregate([
        {
            $match: {
                "message_datetime": {
                    "$gte": new Date(req.query.from),
                    "$lte": new Date(req.query.to),
                }
            }
        },
        {
            $project: {
                _id: 0,
                "date": "$message_datetime",
                "latitude": "$latitude",
                "longitude": "$longitude",
            }
        }
    ]);

    return res.status(200).json({
        LocationHistory: location_history,
    });
};

