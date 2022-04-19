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
		self.channel_image = self.connection.channel() 
		self.channel_search = self.connection.channel() 
		self.channel_image.queue_declare(queue='image_processing', durable=True) 
		self.channel_search.queue_declare(queue='search_processing', durable=True) 


	def __serialize_message(self, **kwargs) -> dict:
		return json.dumps(kwargs)

	def publish_map_search(self, latitude, longitude, query) -> None:
		if( latitude == None or longitude == None):
			return

		lat = latitude
		lon = longitude
		q = query
		if isinstance(latitude, list):
			lat = latitude[0]
		if isinstance(longitude, list):
			lon = longitude[0]
		if isinstance(query, list):
			q = query[0]


		message_datetime = datetime.datetime.now(datetime.timezone.utc).isoformat()
		message_payload = json.dumps({
			"_message_datetime":message_datetime,
			"latitude":lat,
			"longitude":lon,
			"query":q,
		})

		self.__setup_connection()
		self.channel_search.basic_publish(exchange='',
                      routing_key='search_processing',
                      body=message_payload)


	def publish_segmentation_metrics(self, exec_time, segmentation_type, api_type) -> None:
		message_datetime = datetime.datetime.now(datetime.timezone.utc).isoformat()
		message_payload = json.dumps({
			"_message_datetime": message_datetime,
			"execution_time": exec_time,
			"api_type": api_type,
			"segmentation_type": segmentation_type,
		})
		self.__setup_connection()
		self.channel_image.basic_publish(exchange='',
                      routing_key='image_processing',
                      body=message_payload)


	def __del__(self) -> None:
		if(self.connection is not None):
			self.connection.close()
