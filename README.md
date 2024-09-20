# Goofy Rockets

This project uses the package manager `pnpm`

<https://pnpm.io/>

## PNPM commands

install a dependency via pnpm global

```bash
    pnpm add amqplib
```

install a dev dependency via pnpm global

```bash
    pnpm add -D @types/amqplib
```

install a dependency on a filtered app

```bash
    pnpm --filter @wgp/gateway add amqplib
```

install a dev dependency on a filtered app

```bash
    pnpm --filter @wgp/gateway add -D @types/amqplib
```

link a package to an app

```bash
    pnpm --filter @wgp/gateway "add" "@wgp/delayer@workspace:*"
```

run all applications in dev mode

```bash
pnpm dev
```

lint all applications

```bash
pnpm lint
```

run a specific app command

```bash
pnpm gateway lint
```

remove a package from an app

```bash
pnpm gateway remove typeorm reflect-metadata
```
