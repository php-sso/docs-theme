---
title: Tokens
weight: 2
lead: What the server gives an application after a sign-in, and how to read it.
---

## What is in a token

An ID token says who signed in and how. It is a JSON Web Token: three parts separated by dots, the first two readable by anyone and the last a signature.

```json
{
  "iss": "https://sso.example.org",
  "sub": "8f3a1c52",
  "aud": "billing",
  "iat": 1795350000,
  "exp": 1795353600,
  "amr": ["pwd"],
  "email": "ada@example.org"
}
```

| Claim | Meaning |
| --- | --- |
| `iss` | The server that issued the token. Check that it is yours. |
| `sub` | The user. It never changes, even if the email does. |
| `aud` | The application the token is for. Reject tokens meant for others. |
| `iat`, `exp` | When it was issued and when it stops being valid |
| `amr` | How the user proved who they are, such as `pwd` or `saml` |

## Check a token

An application must check four things before it trusts a token, in this order:

1. The signature, using the key named by `kid` in the header.
2. The issuer, which must be exactly your server address.
3. The audience, which must contain this application's client ID.
4. The expiry, allowing a minute of clock difference at most.

```php
<?php

$claims = $verifier->verify($idToken, audience: 'billing');

echo $claims['email'];
```

> [!WARNING]
> Never trust a token because it decodes. Anyone can write the first two parts. Only the signature proves the server made it.

## Access and refresh tokens

The server hands out two other tokens besides the ID token.

An **access token** lets an application call an API on the user's behalf. It is short-lived, one hour by default, and it is meant to be read by the API, not by the application.

A **refresh token** gets a new access token without asking the user to sign in again. It lives for two weeks by default and works once: each use returns a new refresh token and ends the old one.

### Narrowing scopes

A refresh may ask for fewer scopes than the first sign-in, never more. This lets an application drop what it no longer needs.

> [!TIP]
> Keep the access token lifetime short and the refresh token lifetime long. A leaked access token then stops working soon, and users still stay signed in.

## Revoking tokens

Tokens are checked by signature, so the server cannot take one back once it is out. Two things limit the damage:

- Short lifetimes, so a stolen token expires on its own.
- Revoking the refresh token, so no new access tokens can be made from it.

For the case where a key itself is compromised, see [signing keys](/guides/signing-keys/).
