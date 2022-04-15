const { Prediction } = require('../../common/models/Prediction');

exports.get_summary = async (req, res, next) => {

    console.log(req.query)
    if(req.query.from == null || req.query.to == null){
        return res.sendStatus(400);
    }

    console.log(new Date(req.query.from).toISOString())
    const summary_api_type = await Prediction.aggregate([
        {
            $match:{
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
            $match:{
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

