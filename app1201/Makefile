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
ng9:
	#cd frontend && npm install angular-in-memory-web-api --save
	#cd frontend && ng generate service InMemoryData
	#cd frontend && ng generate component dish-search


