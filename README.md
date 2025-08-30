

## 📄 Documentation

For full project documentation, see: [Project Docs](https://docs.google.com/document/d/1voDWtOC-vWqSAmjqzOxv-83WxojZyhrVTPsLfnfVrT8/edit?usp=sharing)

# TTJ_2025

## Repository Setup

1. Clone the repository:
	```bash
	git clone <repo-url>
	cd TTJ_2025/frontend
	```

## Setup Instructions

2. Install dependencies:
	```bash
	npm i
	```

3. Run the frontend:
	```bash
	npm run dev
	```

After starting the development server, you can access the frontend at:

  ➜  Local:   http://localhost:8080/

## Docker Setup

To run both backend and frontend using Docker Compose:

```bash
docker compose up --build
```

To stop and remove containers:

```bash
docker compose down
```

To clear Docker memory cache and volumes:

```bash
docker system prune -a
docker system prune --volumes
```
