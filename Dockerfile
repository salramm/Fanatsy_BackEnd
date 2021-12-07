FROM node:14.14.0-alpine

ENV MONGO_URI=mongodb+srv://dev_fantasy_admin:AtlasOfTheWorld7@cluster0.ektda.mongodb.net/Fantasy?retryWrites=true&w=majority

WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .


# RUN mkdir -p /home/app
# COPY . /home/app
# RUN cd /home/app

CMD ["npm", "run", "dev"]