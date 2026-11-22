---
title: Getting started
weight: 1
lead: Install it, run it, and see the pieces of the theme.
---

## Install

Add the package to your project with Composer. It needs PHP 8.2 or newer and has no other requirements.

```bash
composer require php-sso/example
```

Once it is installed, run the setup command. It writes a configuration file and generates the first signing key, so you can sign in right away.

```bash
vendor/bin/sso setup
```

Text with `inline code`, a [link](/guides/) and a chip for a way in: {{< way saml >}} {{< way scim >}} {{< way password >}}.

> [!NOTE]
> A note uses the colour of this repository.

> [!TIP]
> A tip does too.

> [!WARNING]
> A warning uses the yellow highlighter, so it stands out from everything else.

## Requirements

Before you start, check that your environment has the following. Most hosts already do.

- PHP 8.2 or newer, with the `openssl` and `sodium` extensions
- A database: SQLite for trying it out, MySQL or PostgreSQL for production
- A web server that can send a request to `public/index.php`
- A writable `var/` folder for logs and cached keys

Things you can skip at first:

1. A mail server. Password reset by email is the only part that needs one.
2. A queue worker. Everything runs inside the request until you need more.
3. A separate cache. The built-in file cache is fine for a small site.

## Configuration

The configuration is one array. Every option has a default, so you only write the ones you want to change.

| Option | Default | What it does |
| --- | --- | --- |
| `issuer` | none | The address of the server |
| `ttl` | `3600` | Seconds a token lives |
| `refreshTtl` | `1209600` | Seconds a refresh token lives (two weeks) |
| `storage` | `file` | Where data is kept: `file`, `sqlite` or `database` |
| `scopes` | `['openid']` | The scopes a client may ask for |
| `allowedDomains` | `[]` | Email domains that may sign in, empty for all |

```php
<?php

$server = new Server(issuer: 'https://sso.example.org', ttl: 3600);
```

A fuller example, with a database and a short token lifetime for a high-risk application:

```php
<?php

use PhpSso\Server;
use PhpSso\Storage\DatabaseStorage;

$server = new Server(
    issuer: 'https://sso.example.org',
    ttl: 300,
    refreshTtl: 86400,
    storage: new DatabaseStorage($pdo),
    scopes: ['openid', 'profile', 'email'],
);

$server->handle($request)->send();
```

### A smaller heading

It appears in "On this page" too.

### Environment variables

Secrets should never live in the configuration file. Read them from the environment instead, and keep the file in version control.

```bash
SSO_ISSUER=https://sso.example.org
SSO_DB_DSN=pgsql:host=db;dbname=sso
SSO_DB_PASSWORD=change-me
```

> [!WARNING]
> Never commit a `.env` file. Add it to `.gitignore` before the first commit.

## Your first client

A client is an application that signs its users in through your server. Create one with the command line, and keep the secret it prints: it is shown only once.

```bash
vendor/bin/sso client:create --name "Billing" --redirect https://billing.example.org/callback
```

The command prints a client ID and a secret. Give both to the application, together with the issuer address. Any OpenID Connect library can read the rest from `https://sso.example.org/.well-known/openid-configuration`.

> [!TIP]
> Use one client per application, not one for everything. You can then revoke a single application without signing out all the others.

## What next

Read the [guides](/guides/) for the work you will do most: [rotating signing keys](/guides/signing-keys/), and [what is in a token](/guides/tokens/).
