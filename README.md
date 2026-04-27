# word-search

word search app 

how to deploy levopront

Go to the root directory:
cd /Users/micalumno/Documents/learning/word-search
change the vercel.json on root folder specify the package and outputdirectory for levoporont should be "outputDirectory": "packages/levopront/build",

CMD:
npx vercel link
Select the project "word-search" (for Levopront) or "type word-search"
Deploy to production:
npx vercel deploy --prod

how to deploy kcab

Go to the root directory:
cd /Users/micalumno/Documents/learning/word-search
change the vercel.json on root folder specify the package and outputdirectory for levoporont should be "outputDirectory": "packages/kcab/build",

CMD:
npx vercel link
Select the project "kcab-word-search" (for kcab) or "kcab-word-search"
Deploy to production:
npxvercel deploy --prod

Monorepo with multiple small React games (each app lives under `packages/<app>`).

## Local dev

```bash
npm install
npm run start:levopront
```

Other apps:

```bash
npm run start:kcab
npm run start:suganon
npm run start:matchgame
npm run start:memorygame
npm run start:memorygamev2
```

## Deploy to Vercel

If `vercel` is not installed globally, use `npx vercel` (recommended) or run the repo scripts.

### Option A: npx (no global install)

Levopront:

```bash
cd packages/levopront
npx vercel link
npx vercel deploy --prod
```

KCAB:

```bash
cd packages/kcab
npx vercel link
npx vercel deploy --prod
```

### Option B: npm scripts (repo root)

Levopront:

```bash
npm run vercel:link:levopront
npm run vercel:deploy:levopront:prod
```

KCAB:

```bash
npm run vercel:link:kcab
npm run vercel:deploy:kcab:prod
```

## Notes

- If Vercel asks for a “Root Directory”, pick the package folder you are deploying (for example `packages/levopront`).
- If you already linked a package once, you can skip `link` and just run `deploy --prod`.
