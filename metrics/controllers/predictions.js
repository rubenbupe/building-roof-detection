const { Prediction } = require('../../common/models/Prediction');

exports.get_summary = async (req, res, next) => {

    console.log(req.query)
    if (req.query.from == null || req.query.to == null) {
        return res.sendStatus(400);
    }

    const summary_api_type = await Prediction.aggregate([
        {
            $match: {
                "message_datetime": {
                    "$gte": new Date(req.query.from),
                    "$lte": new Date(req.query.to),
                }
            }
        },
        {
            $group:
            {
                _id: "$api_type",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                'api': '$_id',
                'count': '$count'
            }

        }
    ]);

    const summary_segmentation_type = await Prediction.aggregate([
        {
            $match: {
                "message_datetime": {
                    "$gte": new Date(req.query.from),
                    "$lte": new Date(req.query.to),
                }
            }
        },
        {
            $group:
            {
                _id: "$segmentation_type",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                'api': '$_id',
                'count': '$count'
            }

        }
    ]);

    return res.status(200).json({
        ApiTypes: summary_api_type,
        SegmentationTypes: summary_segmentation_type,
    });
};


exports.get_segmentation_type = async (req, res, next) => {
    if (req.query.from == null || req.query.to == null) {
        return res.sendStatus(400);
    }

    const segmentation_pred = await Prediction.aggregate([
        {
            $match: {
                "message_datetime": {
                    "$gte": new Date(req.query.from),
                    "$lte": new Date(req.query.to),
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "date": "$message_datetime",
                        "format": "%Y-%m-%dT%H:00:00.000Z"
                    }
                },
                "exec_time": { "$avg": "$execution_time" },
                "count_instance": { $sum: {$cond: { if: { "$eq": ["$segmentation_type", "instance"]}, then: 1, else: 0 }} },
                "count_semantic": { $sum: {$cond: { if: { "$eq": ["$segmentation_type", "semantic"]}, then: 1, else: 0 }} },
            }
        },
        {
            $project: {
                _id: 0,
                'date': "$_id",
                'exec_time': '$exec_time',
                'count_instance': "$count_instance",
                "count_semantic": "$count_semantic"
            }

        },
        { $sort: { "date": 1 } }
    ]);

    return res.status(200).json({
        SegmentationHistory: segmentation_pred,
    });
}

exports.get_api_type = async (req, res, next) => {
    if (req.query.from == null || req.query.to == null) {
        return res.sendStatus(400);
    }

    const api_pred = await Prediction.aggregate([
        {
            $match: {
                "message_datetime": {
                    "$gte": new Date(req.query.from),
                    "$lte": new Date(req.query.to),
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "date": "$message_datetime",
                        "format": "%Y-%m-%dT%H:00:00.000Z"
                    }
                },
                "exec_time": { "$avg": "$execution_time" },
                "count_socket": { $sum: {$cond: { if: { "$eq": ["$api_type", "socket"]}, then: 1, else: 0 }} },
                "count_rest": { $sum: {$cond: { if: { "$eq": ["$api_type", "rest"]}, then: 1, else: 0 }} },
            }
        },
        {
            $project: {
                _id: 0,
                'date': "$_id",
                'exec_time': '$exec_time',
                'count_socket': "$count_socket",
                "count_rest": "$count_rest"
            }

        },
        { $sort: { "date": 1 } }
    ]);

    return res.status(200).json({
        ApiHistory: api_pred,
    });
}