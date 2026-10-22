# Outlandish Live

Infoside til Outlandish Live, 22.–26. oktober 2026. Selve siden ligger i `public/`.
Kontakter, dagpenge og riders ligger i Supabase og vises kun efter login.

## Opsætning

- **GitHub:** al koden
- **Cloudflare:** hosting (Worker med statiske filer, se `wrangler.toml`)
- **Supabase:** database og login

## Cloudflare

Siden har intet build-trin. Cloudflare serverer `public/` direkte.

1. Log ind på Cloudflare → **Workers & Pages** → **Create** → **Import a repository**.
2. Vælg repoet `Luke-Rocc/Outlandish`.
3. Indstillinger:
   - Project name: `outlandish` (skal matche `name` i `wrangler.toml`)
   - Build command: *(tom)*
   - Deploy command: `npx wrangler deploy` (standard)
4. Klik **Deploy**. Under **Settings** → **Build** sættes branch til `claude/outlandish-live-2026-eggpi0`.

Siden kommer på `https://outlandish.<dit-subdomæne>.workers.dev`. Hver push til branchen deployer automatisk.

### Supabase-login

Login-linket virker kun på adresser, Supabase kender. I Supabase-projektet **Outlandish** → **Authentication** → **URL Configuration**:

- Site URL: din Cloudflare-adresse, fx `https://outlandish.<dit-subdomæne>.workers.dev/`
- Redirect URLs: samme adresse

Tilføjer du et eget domæne i Cloudflare, skal det også på listen.

### Sikkerhed

`public/_headers` sætter sikkerheds-headers. Content-Security-Policy tillader kun scripts fra siden selv og kun forbindelser til Supabase-projektet. Supabase-biblioteket ligger i `public/vendor/`, så siden ikke afhænger af andre tjenester end GitHub, Cloudflare og Supabase. Skifter du Supabase-projekt, skal adressen også rettes der.

## Adgang

Kun e-mails i tabellen `private.allowed_emails` kan læse de private data. Tilføj en ny person i Supabase → **SQL Editor**:

```sql
insert into private.allowed_emails (email) values ('navn@mail.dk');
```
