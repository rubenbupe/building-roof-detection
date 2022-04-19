const { Search } = require('../../common/models/Search');

exports.get_history = async (req, res, next) => {

    console.log(req.query)
    if (req.query.from == null || req.query.to == null) {
        return res.sendStatus(400);
    }

    const search_history = await Search.aggregate([
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
                "query": "$query",
            }
        }
    ]);

    return res.status(200).json({
        SearchHistory: search_history,
    });
};

