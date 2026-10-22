# Outlandish Live

Infoside til Outlandish Live, 22.–26. oktober 2026: **https://outlandish.outlandishtour.workers.dev**

Selve siden ligger i `public/`.

## Opsætning

- **GitHub:** al koden.
- **Cloudflare:** Worker med statiske filer fra `public/` (se `wrangler.toml`). Hver push til `claude/outlandish-live-2026-eggpi0` lægges automatisk online.
- **Supabase** (projekt *Outlandish*): login og de private oplysninger (kontakter, dagpenge, riders).

## Login

Man logger på med brugernavn og password, som i AURUM. Brugernavnet omsættes til en intern adresse
`navn@outlandish-live.dk`. Der sendes ingen mails.

De private oplysninger ligger i tabellerne `public.contacts` og `public.private_sections` og kan kun læses af
brugere, hvis adresse står i `private.allowed_emails` (row level security).

### Ny bruger

Supabase → **Authentication** → **Users** → **Add user** → **Create new user**:
e-mail `navn@outlandish-live.dk`, password, og sæt flueben i **Auto Confirm User**. Kør derefter i **SQL Editor**:

```sql
insert into private.allowed_emails (email) values ('navn@outlandish-live.dk');
```

## Dagsprogram

Øverst kan man vælge dag (22.–26. oktober). Programmet ligger i tabellen `public.schedule_items`.
Tilføj et punkt i Supabase → **SQL Editor**:

```sql
insert into public.schedule_items (day, position, time, title, details)
values ('2026-10-24', 1, '21:00', 'Show', 'Soundcheck kl. 17.');
```

`time` og `details` kan udelades. `position` bestemmer rækkefølgen inden for dagen.

## Fly

Fly vises under den rigtige dag. De ligger i tabellen `public.flights`:

```sql
insert into public.flights (day, position, flight_no, from_place, to_place, departs, arrives, booking_ref, passengers, notes)
values ('2026-10-22', 1, 'TK 1786', 'København', 'Istanbul', '10:05', '15:20', 'ABC123', 'Alle', 'Terminal 3');
```

## Sikkerhed

`public/_headers` sætter sikkerheds-headers. Siden må kun køre sine egne scripts og kun tale med Supabase-projektet.
Supabase-biblioteket ligger i `public/vendor/`.
