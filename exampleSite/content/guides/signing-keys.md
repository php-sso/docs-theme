---
title: Signing keys
weight: 1
lead: Tokens are signed with a key. Keep it safe, and replace it on a schedule.
---

## How keys work

The server signs every ID token with a private key. Applications check the signature with the matching public key, which the server publishes at `/.well-known/jwks.json`. Because applications fetch the public keys themselves, you can change the key without touching any application.

A key set holds one or more keys. Each has an ID (`kid`), and every token names the key that signed it. That is what lets a new key and an old key work side by side.

| State | Signs new tokens | Published | Typical length |
| --- | --- | --- | --- |
| `active` | yes | yes | 90 days |
| `retiring` | no | yes | until its last token expires |
| `revoked` | no | no | forever |

## Generate a key

Create the first key during setup, or later with the command line.

```bash
vendor/bin/sso key:generate --algorithm ES256
```

`ES256` keys are small and fast. Use `RS256` only when an application cannot read anything else.

## Rotate a key

Rotate keys on a schedule. Old keys stay published until tokens signed with them expire.

1. Generate a new key. It is published at once but does not sign anything yet.
2. Wait until applications have fetched the key set. Five minutes is enough for most, an hour is safe for all.
3. Promote the new key. It now signs new tokens, and the old key becomes `retiring`.
4. When the longest token lifetime has passed, remove the old key.

```bash
vendor/bin/sso key:generate
vendor/bin/sso key:promote 2026-11-new
vendor/bin/sso key:remove 2026-08-old
```

> [!NOTE]
> The wait in step 2 is the part people skip. Without it, a token signed by the new key can reach an application that has not seen that key yet, and the sign-in fails.

### Rotate automatically

Run the rotation from a scheduled job. This one rotates every 90 days and keeps the old key for the longest refresh lifetime.

```bash
0 3 * * * cd /var/www/sso && vendor/bin/sso key:rotate --every 90d
```

## Revoke a key

Remove it from the key set and restart.

Do this at once if a private key has leaked. Every token it signed stops being accepted, so every user has to sign in again.

> [!WARNING]
> Revoking is not rotating. A revoked key is dropped immediately, with no waiting period, and all sessions that rely on it end.

## Where keys are stored

Private keys are kept in the storage you configured, encrypted with the application secret. Back up both: a key that cannot be decrypted is as good as lost.
