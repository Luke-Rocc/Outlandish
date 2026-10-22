# Outlandish Live

Infoside til Outlandish Live, 22.–26. oktober 2026. Selve siden ligger i `public/`.

## Opsætning

- **GitHub:** al koden. Repoet skal være **privat**, fordi siden indeholder telefonnumre og dagpenge.
- **Cloudflare:** hosting (Worker med statiske filer, se `wrangler.toml`) og login via Cloudflare Access.

Hver push til `claude/outlandish-live-2026-eggpi0` lægges automatisk online af Cloudflare.

## Login med Cloudflare Access

Hele siden er låst, så kun godkendte e-mails kan se den. Man skriver sin e-mail og får en engangskode.

1. Cloudflare → **Workers & Pages** → **outlandish** → **Settings** → **Domains & Routes**.
2. Ud for **workers.dev**: klik **Enable Cloudflare Access**.
3. Klik **Manage Cloudflare Access** og tilføj de e-mails, der må se siden.

Gratis op til 50 personer.

## Sikkerhed

`public/_headers` sætter sikkerheds-headers. Siden må kun køre sine egne scripts og henter intet udefra.
