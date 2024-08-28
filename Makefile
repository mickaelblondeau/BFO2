run:
	docker-compose up -d
	docker-compose exec server npm install
	docker-compose exec server npm install -g grunt-cli

stop:
	docker-compose down

build:
	docker-compose exec server grunt

watch:
	docker-compose exec server grunt watch
