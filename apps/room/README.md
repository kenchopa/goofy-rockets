# Room Service

The Room microservice has `Node.js 20 lts` and uses `TypeScript` to compile.
This microservice handles socket connections and interactions for the game.

## Environment variables

| Since   | Variable                 | Description                                                                                                                                  | Example                         |
|---------|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `0.0.1` | `SERVICE_NAME`           | The service name of the application                                                                                                          | `user`                          |
| `0.0.1` | `NODE_ENV`               | The application environment to use                                                                                                           | `'production'`, `'development'` |
| `0.0.1` | `PORT`                   | The port the application will run on                                                                                                         | `3000`                          |
| `0.0.1` | `LOG_LEVEL`              | The log level the logger will work on specified exactly in RFC5424 ('emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug') | `info`                          |
| `0.0.1` | `DOCS_URI`               | The uri where the docs are located                                                                                                           | `http://docs-template.com`      |
| `0.0.1` | `METRICS_PATH`           | The path for fetching the raw metrics                                                                                                        | `/private/metrics`              |
| `0.0.1` | `RABBITMQ_HOST`          | RabbitMQ host                                                                                                                                | `127.0.0.1`                     |
| `0.0.1` | `RABBITMQ_PORT`          | RabbitMQ port                                                                                                                                | `5672`                          |
| `0.0.1` | `RABBITMQ_USER`          | RabbitMQ user                                                                                                                                | `guest`                         |
| `0.0.1` | `RABBITMQ_PASSWORD`      | RabbitMQ password                                                                                                                            | `guest`                         |
| `0.0.1` | `RABBITMQ_VHOST`         | RabbitMQ vhost                                                                                                                               | ``                              |
| `0.0.1` | `RABBITMQ_EXCHANGE`      | RabbitMQ exchange                                                                                                                            | `global`                        |
| `0.0.1` | `RABBITMQ_HEARTBEAT_SEC` | RabbitMQ heatbeat in seconds                                                                                                                 | `15`                            |

## Getting started

### Production build

Configure environment variables, there is a default configuration:

```
cp .env.dist .env
```

Compile TypeScript:

```
pnpm room build
```

Then start with node:

```
pnpm room start
```

### Development setup

Configure environment variables, there is a default configuration:

```
cp .env.dist .env
```

For a development setup with ts-node and nodemon (server restart on changes):

```
pnpm room dev
```

### Scripts

Building for production with clean-up before hand

```bash
pnpm room build
```

Clean up dist and coverage

```bash
pnpm room clean
```

Run in debug mode

```bash
pnpm room debug
```

Run in dev mode

```bash
pnpm room dev
```

Run in production mode

```bash
pnpm room start
```

Run functional tests

```bash
pnpm room test
```

Run functional tests with coverage

```bash
pnpm room test:coverage
```

Run end to end tests

```bash
pnpm room test:e2e
```

Run lint in dry run mode

```bash
pnpm room lint
```

Run lint fix mode

```bash
pnpm room lint:fix
```
