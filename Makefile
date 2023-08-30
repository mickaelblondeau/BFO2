build:
	docker build -t bfo2-build . --target=build
	docker run --rm -v $(shell pwd):/app bfo2-build grunt

run:
	docker build -t bfo2-run . --target=run
	docker run --rm -it -p 8080:8080 bfo2-run
