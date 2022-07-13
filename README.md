# Skill-Tree-API
API Platform for the Skill Tree project, allowing different services to interact with the backend database

[Tech-Stack](https://www.technologystacker.com/#/stack/sharelink/AdonisAPI-ts506)

## Installation
Make a copy of `.env.example` in `src/` and rename the new file to `.env`.
edit the `env` file to set 
1) DB_KEY to a valid authentication token for the database
2) API_KEY as the API key of the hosted Heroku instance
3) ENVIRONMENT_TYPE to "development" since you are a contributer to the project 


To start the api-platform server execute:

```console
npm start
```

## Development

### Locally hosting MongoDB (Docker)

To locally run a MongoDB server that is containerized, you will need [docker-desktop](https://www.docker.com/products/docker-desktop/) installed. You can run the following command from the same location as the `docker-compose.yml` file to start the container:

```console
docker compose up
```

After the command is run, then you should have a local mongodb server running in container. To connect to it review the configuration in the `docker-compose.yml` file.

### Building the  swagger documentation

To create the swagger-docs execute the following;

```console
npm run swagger-docs
```

After the command is run, the api-platform server will start listening on port 8080, with the docs being available at: `http://localhost:8080/#/api-docs/`

[//]: # (todo: Edit me to be up to date)