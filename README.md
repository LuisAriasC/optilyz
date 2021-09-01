# Optilyz

Nodejs & Express API challenge.

## I. Installation

### Manual Method

#### 1. Clone this repo

```
$ git clone git@github.com:LuisAriasC/optilyz.git
$ cd optilyz
```

#### 2. Install dependencies

##### Yarn
```
$ yarn install
```

##### NPM
```
$ npm install
```

## II. Development

### Start dev server
Starting the dev server also starts MongoDB as a service in a docker container using the compose script at `docker-compose.dev.yml`.

##### Yarn
```
$ yarn dev
```

##### NPM
```
$ npm run dev
```

Running the above commands results in 
**API Server** running at `http://localhost:3000`
**MongoDB** running at `mongodb://localhost:27017`

## III. Testing

### Start test server
Starting the test server also starts MongoDB as a service in a docker container using the compose script at `docker-compose.test.yml`.

##### Yarn
```
$ yarn test
```

##### NPM
```
$ npm run test
```

Running the above commands results in 
**API Server** at `http://localhost:3000`
**MongoDB** running at `mongodb://localhost:27017`

## IV. Packaging and Deployment

The mongo container is only only available in dev environment. When you build and deploy the docker image, be sure to provide the correct **[environment variables](#environment)**.

#### 1. Build and run without Docker

##### Yarn
```
$ yarn build && yarn start
```

##### NPM
```
$ npm run build && npm run start
```

#### 2. Run with docker

```
$ docker build -t api-server .
$ docker run -t -i \
      --env NODE_ENV=production \
      --env MONGO_URL=mongodb://host.docker.internal:27017/optilyz \
      --env JWT_ACCESS_SECRET=your_access_secret \
      --env JWT_REFRESH_SECRET=your_refresh_secret \
      -p 3000:3000 \
      api-server
```

#### 3. Run with docker-compose

```
$ docker-compose up
```


---

## Environment
To edit environment variables, create a file with name `.env` and copy the contents from `.env.default` to start with.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| NODE_ENV  | string  | `development` |API runtime environment. eg: `staging`  |
|  PORT | number  | `3000` | Port to run the API server on |
|  MONGO_URL | string  | `mongodb://localhost:27017/books` | URL for MongoDB |
|  JWT_ACCESS_SECRET | string  | `accessSecret` | JWT access token secret |
|  JWT_REFRESH_SECRET | string  | `refreshSecret` | JWT refresh token secret |