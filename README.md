# Outlandish Live

Infoside til Outlandish Live, 22.–26. oktober 2026. Selve siden ligger i `public/`.

## Opsætning

- **GitHub:** al koden. Repoet skal være **privat**, fordi siden indeholder telefonnumre og dagpenge.
- **Cloudflare:** hosting og login (Worker med statiske filer, se `wrangler.toml`).

Hver push til `claude/outlandish-live-2026-eggpi0` lægges automatisk online af Cloudflare.

## Login

Hele siden er låst bag brugernavn og password (`src/worker.js`, login-siden er `public/login.html`).
Brugerne ligger som secrets i Cloudflare, ikke i koden:

Cloudflare → **Workers & Pages** → **outlandish** → **Settings** → **Variables and Secrets** → **Add** (type **Secret**):

| Navn | Værdi |
|---|---|
| `USERS` | `navn:password,navn2:password2` |
| `SESSION_SECRET` | en lang tilfældig tekst |

Ændrer du `USERS`, gælder det med det samme. Ændrer du `SESSION_SECRET`, bliver alle logget ud.

Lokalt: læg samme værdier i `.dev.vars` og kør `npx wrangler dev`.

## Sikkerhed

`public/_headers` sætter sikkerheds-headers. Siden må kun køre sine egne scripts og henter intet udefra.
