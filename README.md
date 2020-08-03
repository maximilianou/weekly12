### ../../../app1201/Makefile 
```
ng1:
	nvm install 14
	nvm use 14
	npm install -g npm@latest
	npm install -g @angular/cli
	ng new frontend
ng2: 
	cd frontend && ng serve
ng3:
	docker-compose -f docker-compose.dev.yml up	--build
ng4:
	docker-compose -f docker-compose.dev.yml down	
ng5: 
	docker system prune -a # delete all docker images in your computer
ng6:
	mkdir api
	cd api && npm init -y
	cd api && npm install nodemon --save-dev
	cd api && npm install bcryptjs body-parser cors express jsonwebtoken mongoose validator --save	
ng8:
	#cd frontend && ng generate module app-routing --flat --module=app
ng9:
	#cd frontend && npm install angular-in-memory-web-api --save
	#cd frontend && ng generate service InMemoryData
	#cd frontend && ng generate component dish-search



```
### ../../../app1201/docker-compose.dev.yml 
```
version: "3.8" # specify docker-compose version

# Define the services/containers to be run
services:
  angular: # name of the first service
    build: # specify the directory of the Dockerfile
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: cook1201_angular
    volumes:
      - ./frontend:/frontend
      - /frontend/node_modules
    ports:
      - "4200:4200" # specify port forewarding
      - "49153:49153"
    environment:
      - NODE_ENV=dev

  express: #name of the second service
    build: # specify the directory of the Dockerfile
      context: ./api
      dockerfile: Dockerfile.dev
    container_name: cook1201_express
    volumes:
      - ./api:/api
      - /api/node_modules
    ports:
      - "5000:5000" #specify ports forewarding
    environment:
      - PORT=5000
      - SECRET=Thisismysecret
      - NODE_ENV=development
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=?authSource=admin
      - MONGO_DB_DATABASE=mean-contacts
    links:
      - database

  database: # name of the third service
    image: mongo # specify image to build container from
    container_name: cook1201_mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_DB_USERNAME=admin-user1
      - MONGO_DB_PASSWORD=admin-password1
      - MONGO_DB=mean-contacts
    volumes:
      - ./mongo:/home/mongodb
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/
      - ./mongo/db:/data/db
    ports:
      - "27017:27017" # specify port forewarding

```
### ../../../app1201/frontend/Dockerfile.dev 
```
# Create image based off of the official 12.8-alpine
FROM node:14-alpine
# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false
#RUN echo "nameserver 8.8.8.8" |  tee /etc/resolv.conf > /dev/null
WORKDIR /frontend
# Copy dependency definitions
COPY package.json ./
## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i
COPY . .
EXPOSE 4200 49153
CMD ["npm", "start"]

```
### ../../../app1201/api/Dockerfile.dev 
```
# Create image based off of the official 12.8-alpine
FROM node:14-alpine
# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false
# Change directory so that our commands run inside this new directory
WORKDIR /api
# Copy dependency definitions
COPY package.json ./
## installing node modules
RUN npm i
COPY . .
# Expose the port the app runs in
EXPOSE 5000
# Serve the app
CMD [ "npm", "run", "dev-server" ]

```
### ../../../app1201/frontend/package.json 
```
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --disableHostCheck=true --host=0.0.0.0 ",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~10.0.5",
    "@angular/common": "~10.0.5",
    "@angular/compiler": "~10.0.5",
    "@angular/core": "~10.0.5",
    "@angular/forms": "~10.0.5",
    "@angular/platform-browser": "~10.0.5",
    "@angular/platform-browser-dynamic": "~10.0.5",
    "@angular/router": "~10.0.5",
    "rxjs": "~6.5.5",
    "tslib": "^2.0.0",
    "zone.js": "~0.10.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.1000.4",
    "@angular/cli": "~10.0.4",
    "@angular/compiler-cli": "~10.0.5",
    "@types/node": "^12.11.1",
    "@types/jasmine": "~3.5.0",
    "@types/jasminewd2": "~2.0.3",
    "codelyzer": "^6.0.0",
    "jasmine-core": "~3.5.0",
    "jasmine-spec-reporter": "~5.0.0",
    "karma": "~5.0.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage-istanbul-reporter": "~3.0.2",
    "karma-jasmine": "~3.3.0",
    "karma-jasmine-html-reporter": "^1.5.0",
    "protractor": "~7.0.0",
    "ts-node": "~8.3.0",
    "tslint": "~6.1.0",
    "typescript": "~3.9.5"
  }
}
```
### ../../../app1201/api/package.json 
```
{
  "name": "api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev-server": "nodemon -L server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^2.0.4"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-jwt": "^6.0.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.9.27",
    "validator": "^13.1.1"
  }
}

```
### ../../../app1201/frontend/src/app/app.module.ts 
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
### ../../../app1201/frontend/src/app/app-routing.module.ts 
```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```
### ../../../app1201/frontend/src/app/app.component.ts 
```
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}

```
### ../../../app1201/frontend/src/app/app.component.html 
```
<h1>Angular </h1>
<router-outlet></router-outlet>
```
### ../../../app1201/api/server.js 
```
// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const config = require('./config/environment');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.mongodb.uri).then(
  () => { console.log('Database is Connected!'); },
  (err) => { console.log(`Cannot connect to the server: ${err}`); },
);

app.get('/', (req, res) => {
  res.send('hello');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

```
### ../../../app1201/api/config/environment.js 
```
module.exports = {
  mongodb: {
    uri:
      `mongodb://${
        process.env.MONGO_DB_USERNAME
      }:${
        process.env.MONGO_DB_PASSWORD
      }@${
        process.env.MONGO_DB_HOST
      }${process.env.MONGO_DB_PORT
        ? `:${process.env.MONGO_DB_PORT}/`
        : '/'
      }${process.env.MONGO_DB_DATABASE
      }${process.env.MONGO_DB_PARAMETERS}`,
  },
  secret: process.env.SECRET,
};

```
