# syntax=docker/dockerfile:1

###################################
### IMAGE FOR APP (ALL SERVERS) ###
###################################

FROM node:14.18-bullseye AS app
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

RUN apt update
RUN apt install -y python3-opencv

### NODE.JS SETUP ###

# Add a work directory
WORKDIR /app
# Copy package.json files
COPY ./package*.json /app/
# Copy app files
COPY . /app
RUN npm install --only=prod
# Build front
RUN REACT_APP_API_HOST=${HOST_API} REACT_APP_AUTH_HOST=${HOST_AUTH} npm run buildFront
# Expose port
EXPOSE 3000
# Start script
WORKDIR /app


### PYTHON SETUP ###

RUN apt update
RUN apt install -y software-properties-common netcat
RUN apt install -y python3-pip python3-opencv

# Install Python dependencies
RUN cd api && python3 -m pip install -r requirements.txt

ENTRYPOINT ["sh", "docker_entrypoint.sh"]
