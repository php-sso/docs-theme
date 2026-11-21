---
title: Getting started
weight: 1
lead: Install it, run it, and see the pieces of the theme.
---

## Install

```bash
composer require php-sso/example
```

Text with `inline code`, a [link](/guides/) and a chip for a way in: {{< way saml >}} {{< way scim >}} {{< way password >}}.

> [!NOTE]
> A note uses the colour of this repository.

> [!TIP]
> A tip does too.

> [!WARNING]
> A warning uses the yellow highlighter, so it stands out from everything else.

## Configuration

| Option | Default | What it does |
| --- | --- | --- |
| `issuer` | none | The address of the server |
| `ttl` | `3600` | Seconds a token lives |

```php
<?php

$server = new Server(issuer: 'https://sso.example.org', ttl: 3600);
```

### A smaller heading

It appears in "On this page" too.
