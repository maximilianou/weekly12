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
	cd frontend && ng generate component home
	cd frontend && ng generate component header
	cd frontend && ng generate component profile
	cd frontend && ng generate component auth
	cd frontend && ng generate module auth
	cd frontend && ng generate service auth/auth
	cd frontend && ng generate guard auth/auth
	cd frontend && ng generate component auth/register
	cd frontend && ng generate component auth/login
	cd frontend && npm install bootstrap --save
	cd frontend && npm install @auth0/angular-jwt --save
	cd frontend && npm install moment --save

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
  cook1201_angular: # name of the first service
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

  cook1201_express: #name of the second service
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
      - SECRET=Thisismysecretforjwt
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

  cook1201_nginx: #name of the fourth service
    build: loadbalancer # specify the directory of the Dockerfile
    container_name: cook1201_nginx
    ports:
      - "8046:80" #specify ports forewarding
    links:
      - cook1201_express
      - cook1201_angular


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
### ../../../app1201/frontend/package.json 
```
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --disableHostCheck=true --host=0.0.0.0 ",
    "serve": "ng serve --proxy-config proxy.conf.json",
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
    "@auth0/angular-jwt": "^5.0.1",
    "bootstrap": "^4.5.0",
    "moment": "^2.27.0",
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
    "eslint": "^7.6.0",
    "eslint-config-prettier": "^6.11.0",
    "eslint-plugin-prettier": "^3.1.4",
    "nodemon": "^2.0.4",
    "prettier": "^2.0.5"
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
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';

import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule
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

import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }

```
### ../../../app1201/frontend/src/app/app.component.html 
```
<div>
    <app-header></app-header>
    <router-outlet></router-outlet>
</div>

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
### ../../../app1201/api/server.js 
```
// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/environment');
const userRoute = require('./routes/UserRoute');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.mongodb.uri).then(
  () => {
    console.log('Database is Connected!');
  },
  (err) => {
    console.log(`Cannot connect to the server: ${err}`);
  }
);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// let corsOptions = {
//  origin: 'http://0.0.0.0:4200',
//  optionSuccessStatus: 200
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use('/api/users', userRoute);

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
### ../../../app1201/api/controllers/UserController.js 
```
// controllers/UserController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/environment');

exports.register = function (req, res) {
  const { username, email, password, passwordConfirmation } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide email or password' });
  }
  if (password !== passwordConfirmation) {
    return res.status(422).json({ error: 'Password does not match' });
  }
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return res.status(422).json({ error: 'User already exist' });
    }
    const user = new User({
      username,
      email,
      password,
    });
    user.save((err) => {
      if (err) {
        res
          .status(422)
          .json({ error: `Ooops! something went wrong! ${err}::${user}` });
      } else {
        return res.status(200).json({ registered: true });
      }
    });
  });
};

exports.login = function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide email or password' });
  }
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(422).json({ error: 'Oops! Something went wrong' });
    }
    if (!user) {
      return res.status(422).json({ error: 'Invalid User' });
    }
    if (user.hasSamePassword(password)) {
      const jsonToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        env.secret,
        { expiresIn: '1,h' }
      );
      return res.json(jsonToken);
    }
    return res.status(422).json({ error: 'Wrong email or password' });
  });
};

exports.authMiddleware = function (req, res, next) {
  const jsonToken = req.headers.authorization;
  try {
    if (jsonToken) {
      const user = parseToken(jsonToken);
      User.findById(user.userId, (err, user) => {
        if (err) {
          return res.status(422).json({
            error: 'Opps!, Something went Wrong!!',
          });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return res.status(422).json({
            error: 'Not authorized User.',
          });
        }
      });
    } else {
      return res.status(422).json({ error: 'Not authorized user' });
    }
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err,
    });
  }
};

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], env.secret);
}

```
### ../../../app1201/api/models/User.js 
```
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = Schema({
  username: {
    type: String,
    min: [4, 'Too short, min 4 chars!'],
    man: [32, 'Too long, max 16 chars!'],
  },
  email: {
    type: String,
    min: [4, 'Too short, min 4 chars!'],
    man: [32, 'Too long, max 16 chars!'],
    lowercase: true,
    unique: true,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    min: [4, 'Too short, min 4 chars!'],
    man: [32, 'Too long, max 16 chars!'],
    required: 'Password is required',
  },
  passwordConfirmation: {
    type: String,
    min: [4, 'Too short, min 4 chars!'],
    man: [32, 'Too long, max 16 chars!'],
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.getSalt(10, (err, salt) => {
    if (err) {
      return res.status(422).json({
        error: 'There is an error while gensalt hash',
      });
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return res.status(422).json({
          error: 'There is an error while password hash',
        });
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.hasSamePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

```
### ../../../app1201/api/routes/UserRoute.js 
```
// routes/UserRoute.js
const express = require('express');
const user = require('../controllers/UserController');

const { authMiddleware } = require('../controllers/UserController');

const router = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ access: true });
});

router.get('/index', (req, res) => {
  res.json({ access: true });
});

module.exports = router;

```
### ../../../app1201/frontend/src/app/home/home.component.ts 
```
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  notify: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const key1 = 'loggedin';
      if( params[key1] === 'success'){
        this.notify = 'You have been successfully loggedin. Welcome Home';
      }
    });
  }

}

```
### ../../../app1201/frontend/src/app/home/home.component.html 
```
<div *ngIf="notify" class="alert alert-success container marge">
    {{ notify }}
</div>
<p>home works!</p>

```
### ../../../app1201/frontend/src/app/home/home.component.css 
```
.marge{
    margin-top: 1%;
}
```
### ../../../app1201/frontend/src/app/header/header.component.ts 
```
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login'], {queryParams: {loggedOut: 'success'}});
  }


}

```
### ../../../app1201/frontend/src/app/profile/profile.component.ts 
```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

```
### ../../../app1201/frontend/src/app/header/header.component.html 
```
<nav class="navbar navbar-light navbar-extend-lg" style="background-color: #e3f2fd;">
    <div class="container">
        <a routerLink="/" class="navbar-brand" routerLinkActive="active">AppDividend</a>
        <div class="" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <ng-container *ngIf="!auth.isAuthenticated()">
                    <li class="nav-item">
                        <a routerLink="/auth/login" class="nav-link" routerLinkActive="active">
                            Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a routerLink="/auth/register" class="nav-link">
                            Register
                        </a>
                    </li>
                </ng-container>
                <ng-container *ngIf="auth.isAuthenticated()">
                    <li class="nav-item">
                        <a class="nav-link " >
                            {{ auth.getUsername() }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pointer" (click)="logout()">
                            Logout
                        </a>
                    </li>
                </ng-container>
            </ul>
        </div>
    </div>
</nav>

```
### ../../../app1201/frontend/src/app/auth/auth.component.ts 
```
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

```
### ../../../app1201/frontend/src/app/auth/auth.module.ts 
```
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    RegisterComponent, 
    LoginComponent,
    AuthComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [RouterModule],
  providers: [
    AuthService,
    AuthGuard
  ]
})
export class AuthModule { }

```
### ../../../app1201/frontend/src/app/auth/auth.service.ts 
```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

const jwt = new JwtHelperService();

class DecodedToken {
  exp: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uriseg = 'http://localhost:5000/api/users';
  private decodedToken;

  constructor(private http: HttpClient) { 
    this.decodedToken = JSON.parse( localStorage.getItem('auth_meta') ) || new DecodedToken();
  }

  public register(userData: any): Observable<any>{
    const URI = this.uriseg + '/register';
    return this.http.post(URI, userData);
  }

  public login(userData: any): Observable<any>{
    const URI = this.uriseg + '/login';
    return this.http.post(URI, userData)
    .pipe(
      map( (token) => {
        return this.saveToken(token);
      })
    );
  }
  private saveToken(token: any): any{
    this.decodedToken = jwt.decodeToken(token);
    localStorage.setItem('auth_tkn', token);
    localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));
    return token;
  }
  public logout(): void {
    localStorage.removeItem('auth_tkn');
    localStorage.removeItem('auth_meta');
    this.decodedToken = new DecodedToken();
  }
  public isAuthenticated(): boolean {
    console.log(this.decodedToken.exp);
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }
  public getUsername(): string{
    return this.decodedToken.username;
  }
}




```
### ../../../app1201/frontend/src/app/auth/auth.guard.ts 
```
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private url: string;
  constructor(private auth: AuthService, private router: Router){}

  private authState(): boolean {
    if(this.isLoginOrRegister()){
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
  private notAuthState(): boolean {
    if( this.isLoginOrRegister() ){
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
  private isLoginOrRegister(): boolean{
    if(this.url.includes('/auth/login') || this.url.includes('/auth/register')){

      return true;
    }
    return false;
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.url = state.url;
      if(this.auth.isAuthenticated()){
        return this.authState();
      }
      return this.notAuthState();
  }
  
}

```
### ../../../app1201/frontend/src/app/auth/register/register.component.ts 
```
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formData: any = {};
  errors: any = [];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  register(): void {
    this.errors = [];
    this.auth.register(this.formData).subscribe(
      () => { 
        this.router.navigate(['/auth/login'], { queryParams: {registered: 'success'}});
      },
      (errorResponse) => {
        this.errors.push(errorResponse.error.error);
      }
    );
  }
}

```
### ../../../app1201/frontend/src/app/auth/register/register.component.html 
```
<div class="container">
    <div class="row">
        <div class="col-md-5">
            <h1 class="page-title">User Registration</h1>
            <form #registerForm="ngForm">
                <div class="form-group">
                  <div *ngIf="errors.length > 0" class="alert alert-danger">
                    <ul *ngFor="let error of errors">
                        <li>{{error}}</li>
                    </ul>
                  </div>
                <label for="username">Username</label>
                <input type="text"
                        class="form-control"
                        [(ngModel)]="formData.username"
                        name="username"
                        #username="ngModel" required />
                </div>
                <div *ngIf="username.invalid && (username.dirty || username.touched)"
                     class="alert alert-danger">
                     <div *ngIf="username.errors.required">
                        Username is Required!
                     </div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control"
                        [(ngModel)]="formData.email" name="email"
                        #email="ngModel" required />
                </div>
                <div *ngIf="email.invalid && ( email.dirty || email.touched)"
                    class="alert alert-danger">
                    <div *ngIf="email.errors.required">
                        Email is Required!
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control"
                        [(ngModel)]="formData.password" 
                        #password="ngModel"
                        name="password" required
                    />
                </div>
                <div *ngIf="password.invalid && (password.dirty || password.touched)"
                    class="alert alert-danger">
                    <div *ngIf="password.errors.required">
                        Password is Required!
                    </div>
                </div>

                <div class="form-group">
                    <label for="passwordConfirmation">PasswordConfirmation</label>
                    <input type="password" class="form-control"
                        [(ngModel)]="formData.passwordConfirmation" 
                        #passwordConfirmation="ngModel"
                        name="passwordConfirmation" required
                    />
                </div>
                <div *ngIf="passwordConfirmation.invalid && (passwordConfirmation.dirty || passwordConfirmation.touched)"
                    class="alert alert-danger">
                    <div *ngIf="passwordConfirmation.errors.required">
                        Confirmation Password is Required!
                    </div>
                </div>

                <button (click)="register()"
                type="submit"
                class="btn btn-warning"
                [disabled]="!registerForm.form.valid">
                    Register
                </button>

            </form>
        </div>
    </div>

</div>

```
### ../../../app1201/frontend/src/app/auth/login/login.component.ts 
```
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: any = [];
  notify: string;

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private fb: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParamMap.subscribe(
      (params) => {
        const key1 = 'registered';
        const key2 = 'loggedOut';
        if(params[key1] === 'success'){
          this.notify = 'You have been successfully registered. Please Log in';
        }
        if(params[key2] === 'success'){
          this.notify = 'You have been logged out successfully';
        }
      }
    );
  }
  initForm(): void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, 
        Validators.pattern(
          '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required],
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
    (this.loginForm.controls[fieldName].dirty 
      || this.loginForm.controls[fieldName].touched)
  }

  login(): void {
    this.errors = [];
    this.auth.login(this.loginForm.value)
      .subscribe(
        (token) => { 
          this.router.navigate(['/'],{queryParams: {loggedin:'success'}});
      },
        (errorResponse) => {
          this.errors.push(errorResponse.error.error);
        }
      );
  }
}

```
### ../../../app1201/frontend/src/app/auth/login/login.component.html 
```
<div class='container'>
    <div class='row'>
        <div class='col-md-5'>
            <h1 class='page-title'>Login</h1>
            <form [formGroup]='loginForm' (ngSubmit)="login()">
                <div class="form-group">
                    <div *ngIf='notify' class='alert alert-success'>
                        {{notify}}
                    </div>
                    <div *ngIf='errors.length > 0' class='alert alert-danger'>
                        <p>
                        {{error}}
                        </p>
                    </div>
                    <label for='email'>Email</label>
                    <input type='email' class='form-control'
                        formControlName="email" />
                </div>
                <div *ngIf="isValidInput('email')" class='alert alert-danger'>
                    <div *ngIf="loginForm.controls['email'].errors.required">
                        Email is required!
                    </div>
                    <div *ngIf="loginForm.controls['email'].errors.pattern">
                        Must be a valid email format!
                    </div>
                </div>

                <div class='form-group'>
                    <label for="password">Password</label>
                    <input type="password" class="form-control"
                        formControlName="password" />
                </div>
                <div *ngIf="isValidInput('password')" class="alert alert-danger">
                    <div *ngIf="loginForm.controls['password'].errors.required">
                        Password is required!
                    </div>
                </div>
                <button [disabled]="!loginForm.valid"
                type="submit" class="btn btn-warning">
                Sign In
                </button>
            </form>
        </div>
    </div>
</div>
```
