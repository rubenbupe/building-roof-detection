// Source: https://gist.github.com/carlhoerberg/006b01ac17a0a94859ba

const amqp = require('amqplib/callback_api');

const { Prediction } = require('../../common/models/Prediction');

// if the connection is closed or fails to be established at all, we will reconnect
var amqpConn = null;
const start = () => {
	amqp.connect(process.env.RABBIT_URI + "?heartbeat=60", function (err, conn) {
		if (err) {
			console.error("[AMQP]", err.message);
			return setTimeout(start, 7000);
		}
		conn.on("error", function (err) {
			if (err.message !== "Connection closing") {
				console.error("[AMQP] conn error", err.message);
			}
		});
		conn.on("close", function () {
			console.error("[AMQP] reconnecting");
			return setTimeout(start, 7000);
		});

		console.log("[AMQP] connected");
		amqpConn = conn;

		whenConnected();
	});
}

exports.start_consumming = start;

function whenConnected() {
	startWorker();
}

// A worker that acks messages only if processed succesfully
function startWorker() {
	amqpConn.createChannel(function (err, ch) {
		if (closeOnErr(err)) return;
		ch.on("error", function (err) {
			console.error("[AMQP] channel error", err.message);
		});
		ch.on("close", function () {
			console.log("[AMQP] channel closed");
		});
		ch.prefetch(10);
		ch.assertQueue("image_processing", { durable: true }, function (err, _ok) {
			if (closeOnErr(err)) return;
			ch.consume("image_processing", processMsg, { noAck: false });
			console.log("Worker is started");
		});

		function processMsg(msg) {
			var incomingDate = (new Date()).toISOString();
			console.log("Msg [deliveryTag=" + msg.fields.deliveryTag + "] arrived at " + incomingDate);
			work(msg, function (ok) {
				console.log("Sending Ack for msg at time " + incomingDate);
				try {
					if (ok)
						ch.ack(msg);
					else
						ch.reject(msg, true);
				} catch (e) {
					closeOnErr(e);
				}
			});
		}
	});
}

function work(msg, cb) {
	try {
		const message_content = JSON.parse(msg.content.toString());

		if (msg.fields.routingKey == 'image_processing') {
			const pred = new Prediction({
				execution_time: message_content.execution_time,
				message_datetime: message_content._message_datetime,
				api_type: message_content.api_type,
				segmentation_type: message_content.segmentation_type,
			});
	
			pred.save().then(() => {
				console.log('Saved prediction');
				cb(true);
			}).catch(() => {
				console.error('Error saving prediction');
				cb(false);
			})
		}
	} catch {
		cb(false);
	}
}

function closeOnErr(err) {
	if (!err) return false;
	console.error("[AMQP] error", err);
	amqpConn.close();
	return true;
}
