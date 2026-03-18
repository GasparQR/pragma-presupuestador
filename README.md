# Pragma Studio — Presupuestos

App web para gestión de presupuestos. Stack: **Next.js 14 + @react-pdf/renderer**. Deploy en Vercel en minutos.

## Instalación local

```bash

npm install
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000).

## Iniciar local
```
cd ~/Downloads/pragma-quotes
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

### Opción A — CLI (recomendado)

```bash
npm i -g vercel
vercel
```

Seguí los pasos del wizard. En la primera vez te va a pedir login.

### Opción B — GitHub

1. Subí el proyecto a un repo GitHub (público o privado)
2. Entrá a [vercel.com](https://vercel.com) → **New Project** → importá el repo
3. Dejá todas las opciones por defecto → **Deploy**

---

## Persistencia de datos

Los presupuestos y clientes se guardan en `.data/quotes.json` y `.data/clients.json` (excluidos de git).

> **Importante para Vercel:** El filesystem de Vercel es efímero — los datos se pierden entre deploys. Para persistencia real en producción, conectá una base de datos. Las opciones más simples:
> - **Vercel KV** (Redis, gratis en el tier hobby) — requiere migrar `src/lib/db.ts` a usar `@vercel/kv`
> - **PlanetScale** o **Neon** (PostgreSQL serverless, tier gratuito) — requiere migrar a Prisma o Drizzle
> - **Vercel Blob** — para guardar los JSON como blobs
>
> Para uso local o en un VPS propio (Railway, Fly.io, DigitalOcean), el filesystem funciona perfecto sin cambios.

---

## Estructura del proyecto

```
src/
  app/
    page.tsx              → Dashboard
    quotes/
      page.tsx            → Lista de presupuestos
      QuotesTable.tsx     → Tabla con filtros y acciones
      new/page.tsx        → Nuevo presupuesto
      [id]/page.tsx       → Editar presupuesto
    clients/
      page.tsx            → Lista de clientes
      ClientsManager.tsx  → CRUD de clientes
    api/
      quotes/route.ts     → API REST presupuestos
      clients/route.ts    → API REST clientes
      pdf/route.ts        → Generación de PDF
  components/
    Sidebar.tsx           → Navegación lateral
    QuoteForm.tsx         → Formulario de presupuesto
    QuotePDF.tsx          → Documento PDF (@react-pdf/renderer)
  lib/
    db.ts                 → Lectura/escritura de datos (JSON)
```

## Personalización rápida

- **Logo / nombre:** editá `src/components/Sidebar.tsx` y `src/components/QuotePDF.tsx`
- **Colores:** editá las variables CSS en `src/app/globals.css`
- **Servicios / categorías:** editá los arrays `CATEGORIES` e `ITEM_TYPES` en `src/components/QuoteForm.tsx`
- **Pie del PDF:** editá el footer en `src/components/QuotePDF.tsx`
