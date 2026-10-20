# Start containers in the background
up:
	docker compose up -d

# Start containers and follow logs for development
dev:
	docker compose up --build

# Stop containers
down:
	docker compose down

# Build container images
build:
	docker compose build

# Rebuild images without cache and start containers
rebuild:
	docker compose build --no-cache
	docker compose up -d

# Apply database migrations
migrate:
	docker compose exec app npx drizzle-kit migrate

# Generate migrations from schema changes
generate:
	docker compose exec app npx drizzle-kit generate

# Follow container logs
logs:
	docker compose logs -f

# Open a shell inside the backend container
shell:
	docker compose exec app sh

# Stop containers and remove volumes (DELETES DATABASE DATA)
clean:
	docker compose down -v

.PHONY: up dev down build rebuild logs migrate generate shell clean
