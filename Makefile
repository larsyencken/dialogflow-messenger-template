.PHONY: start build test clean

default: help

help:
	@echo "Available commands:"
	@echo
	@echo "  make serve      Run the development server"
	@echo "  make tunnel     Run an ngrok tunnel to the local server"
	@echo "  make test       Run unit tests"
	@echo "  make clean      Clean up temporary files"
	@echo

node_modules: package.json
	@echo '==> Installing packages'
	npm install
	touch $@

serve: node_modules
	@echo '==> Running server with hot reload'
	npm run start

build: node_modules
	@echo '==> Compiling typescript'
	npm run build

test: node_modules up
	@echo '==> Running unit tests'
	npm t

up:
	@echo '==> Starting MySQL'
	docker-compose up

down:
	docker-compose down

clean:
	rm -rf node_modules dist

tunnel:
	ngrok http 3000
