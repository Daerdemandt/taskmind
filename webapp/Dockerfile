FROM node:12

MAINTAINER Roman Kuzmichev daerdemandt@gmail.com

# Joining those into 1 command breaks stuff
RUN npm install -g webpack webpack-cli
RUN npm install -g babel-loader babel-core babel-preset-env babel-preset-react react react-dom
RUN npm install -g html-webpack-plugin html-loader style-loader css-loader

RUN mkdir -p /webapp
WORKDIR /webapp

COPY package.json /webapp/
RUN npm install --dev

CMD ["npm", "run", "watch"]
