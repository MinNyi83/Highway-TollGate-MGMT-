.PHONY: dev install build test lint db-migrate db-seed db-reset docker-up docker-down clean help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	npm install

build: ## Build all packages
	cd packages/shared && npm run build
	cd packages/backend && npm run build
	cd packages/simulator && npm run build

dev: ## Start backend and frontend in dev mode
	@echo "Starting backend on port 3000..."
	cd packages/backend && npm run dev &
	@echo "Starting frontend on port 5173..."
	cd packages/frontend && npm run dev

test: ## Run all tests
	cd packages/backend && npm test

lint: ## Lint all packages
	cd packages/backend && npm run lint
	cd packages/frontend && npm run lint

db-generate: ## Generate Prisma client
	cd packages/backend && npm run db:generate

db-migrate: ## Run database migrations
	cd packages/backend && npm run db:migrate

db-seed: ## Seed database with test data
	cd packages/backend && npm run db:seed

db-reset: ## Reset database (migrate + seed)
	cd packages/backend && npm run db:migrate -- --force-init
	cd packages/backend && npm run db:seed

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-reset: ## Reset Docker containers
	docker-compose down -v
	docker-compose up -d

sim: ## Run simulator (usage: make sim ARGS="--plaza plaza-1 --count 10")
	cd packages/simulator && npm run dev -- $(ARGS)

clean: ## Remove node_modules and dist folders
	rm -rf node_modules packages/*/node_modules packages/*/dist .pitway
