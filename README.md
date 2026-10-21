# Outlandish Live

Infoside til Outlandish Live, 22.–26. oktober 2026. Selve siden ligger i `public/`.
Kontakter, dagpenge og riders ligger i Supabase og vises kun efter login.

## Cloudflare Pages

Siden har intet build-trin. Cloudflare serverer `public/` direkte.

1. Log ind på Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Vælg repoet `Luke-Rocc/Outlandish`.
3. Indstillinger:
   - Production branch: `claude/outlandish-live-2026-eggpi0`
   - Framework preset: `None`
   - Build command: *(tom)*
   - Build output directory: `public`
4. Klik **Save and Deploy**. Siden kommer på `https://outlandish.pages.dev` (eller et lignende navn, som Cloudflare viser).

Hver push til branchen deployer siden automatisk.

### Supabase-login

Login-linket virker kun på adresser, Supabase kender. I Supabase-projektet **Outlandish** → **Authentication** → **URL Configuration**:

- Site URL: din Cloudflare-adresse, fx `https://outlandish.pages.dev/`
- Redirect URLs: samme adresse

Tilføjer du et eget domæne i Cloudflare, skal det også på listen.

### Sikkerhed

`public/_headers` sætter sikkerheds-headers. Content-Security-Policy tillader kun scripts fra siden selv og jsDelivr og kun forbindelser til Supabase-projektet. Skifter du Supabase-projekt, skal adressen også rettes der.

## Adgang

Kun e-mails i tabellen `private.allowed_emails` kan læse de private data. Tilføj en ny person i Supabase → **SQL Editor**:

```sql
insert into private.allowed_emails (email) values ('navn@mail.dk');
```
