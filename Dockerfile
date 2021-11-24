FROM node:13-alpine

ENV MONGO_URI=mongodb+srv://dev_fantasy_admin:AtlasOfTheWorld7@cluster0.ektda.mongodb.net/Fantasy?retryWrites=true&w=majority

RUN mkdir -p /home/app
COPY . /home/app

CMD ["npm", "run", "dev"]