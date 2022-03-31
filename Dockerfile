# syntax=docker/dockerfile:1

###################################
### IMAGE FOR APP (ALL SERVERS) ###
###################################

FROM node:14.18-bullseye AS app
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# Add a work directory
WORKDIR /app
# Copy package.json files
COPY ./package*.json /app/
# Copy app files
COPY . /app
RUN npm install
# Build front
RUN REACT_APP_API_HOST=${HOST_API} REACT_APP_AUTH_HOST=${HOST_AUTH} npm run buildFront
# Expose port
EXPOSE 3000
# Start script
WORKDIR /app
ENTRYPOINT ["sh", "docker_entrypoint.sh"]
