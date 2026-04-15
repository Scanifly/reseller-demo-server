up: 
	docker compose -f docker/docker-compose.yml up -d 

build-up: 
	docker compose -f docker/docker-compose.yml up -V --build -d

down:
	docker compose -f docker/docker-compose.yml down

logs:
	docker compose -f docker/docker-compose.yml logs -f reseller-demo-server
