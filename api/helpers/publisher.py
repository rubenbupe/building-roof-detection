import pika
import os
import datetime
import json

url = os.environ.get('RABBIT_URI', 'amqp://guest:guest@localhost:5672/') 

SEGMENTATION_API_TYPE = {
	'socket': 'socket',
	'api': 'rest'
}

SEGMENTATION_TYPE = {
	'instance': 'instance',
	'semantic': 'semantic'
}


class Publisher:

	def __init__(self) -> None:
		self.__setup_connection()

	def __setup_connection(self) -> None:
		try: 
			self.connection.close()
		except Exception:
			pass
		
		params = pika.URLParameters(url)
		self.connection = pika.BlockingConnection(params)
		self.channel = self.connection.channel() 
		self.channel.queue_declare(queue='image_processing', durable=True) 


	def __serialize_message(self, **kwargs) -> dict:
		return json.dumps(kwargs)


	def publish_segmentation_metrics(self, exec_time, segmentation_type, api_type) -> None:
		message_datetime = datetime.datetime.now(datetime.timezone.utc).isoformat()
		message_payload = self.__serialize_message(
			_message_datetime=message_datetime,
			execution_time=exec_time,
			api_type=api_type,
			segmentation_type=segmentation_type,
		)
		self.__setup_connection()
		self.channel.basic_publish(exchange='',
                      routing_key='image_processing',
                      body=message_payload)


	def __del__(self) -> None:
		if(self.connection is not None):
			self.connection.close()
