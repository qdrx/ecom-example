<div align="center">
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/></code>
	<code><img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/519bfaf3-c242-431e-a269-876979f05574" alt="Nest.js" title="Nest.js"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" title="PostgreSQL"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" title="redis"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" title="Docker"/></code>
</div>


## Description

The development of this project is being done as part of a deeper exploration of NestJS. This repository is part of a real project that is likely to go into production and exists to demonstrate my skills. It is not a fully production-ready application.

## Installation and running with Docker

```bash
$ docker build -t ecom-example
$ docker-compose -f compose-services/database-service.yaml up -d
$ docker-compose -f compose-services/adminer-service.yaml up -d
$ docker-compose -f compose-services/redis-service.yaml up -d
$ docker-compose -f compose-services/api-service.yaml up -d
```


## Running the app in development mode
Installing dependencies.
```bash
$ npm install
```
Running the app.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Additional info
This documentation provides a high-level overview of the E-commerce backend project. For detailed information on endpoints, functionalities, and specific code implementations, refer to the source code and comments within the project files.

For any further assistance or inquiries, feel free to reach out to the project maintainers or contributors.

