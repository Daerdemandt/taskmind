FROM node:12

MAINTAINER Roman Kuzmichev daerdemandt@gmail.com

# Install nodemon
RUN npm install -g nodemon c8

# TODO: set proper USER

# Create app directory
RUN mkdir -p /server
WORKDIR /server

# Install app dependencies
COPY package.json /server/
RUN npm install

# Bundle app source
COPY . /server

# Expose port
EXPOSE  80

# Run app using nodemon
CMD ["npm", "start"]
