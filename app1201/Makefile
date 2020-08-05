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


