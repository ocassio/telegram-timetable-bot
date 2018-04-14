FROM node:alpine

RUN mkdir /telegram-timetable-bot
WORKDIR /telegram-timetable-bot
ADD . .

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]