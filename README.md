# Helpse

Frontend MVP voor een mobile-first B2B webapp waarmee Belgische vakmannen via spraak een professionele offerte kunnen genereren.

Tagline: **Jouw offertes in 10 seconden ingesproken en verstuurd.**

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Lucide React
- Framer Motion

## Development

```bash
npm install
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000).

## Supabase Auth

1. Maak een project aan op Supabase.
2. Ga naar Project Settings > API.
3. Kopieer de Project URL en publishable key.
4. Maak lokaal een `.env.local` bestand op basis van `.env.example`.
5. Vul deze waarden in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

6. Ga in Supabase naar Authentication > Providers en zet Email aan.
7. Ga naar Authentication > URL Configuration en voeg je site en redirects toe:
   - lokale Site URL: `http://localhost:3000`
   - lokale Redirect URL: `http://localhost:3000/auth/callback`
   - productie Site URL: je echte Helpse domein
   - productie Redirect URL: `https://jouw-domein.be/auth/callback`
8. Voer optioneel `supabase/schema.sql` uit in de Supabase SQL Editor voor een `profiles` tabel.

## Checks

```bash
npm run lint
npm run build
```
