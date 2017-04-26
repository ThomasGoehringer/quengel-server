#
# Dockerfile for baby-app-server
#
FROM node:boron

RUN mkdir -p /home/app
WORKDIR /home/app

COPY . /home/app
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]
