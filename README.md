# Lokaloka Landing Page

## Environment

Copy `.env.example` to `.env` and set the `VITE_*` values. Vite injects these
values during the build, so do not put private secrets in them: anything with a
`VITE_` prefix is included in the browser bundle.

## Local development

```bash
npm install
npm run dev
```

The development server is available on port `5173`.

## Docker

Build the image with the values from your deployment environment:

```bash
docker build \
	--build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 \
	--build-arg VITE_DASHBOARD_URL=https://dashboard.example.com/ \
	--build-arg VITE_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=... \
	-t localoka-landing .
```

Run it on port `5173`:

```bash
docker run --rm -p 5173:5173 localoka-landing
```

The image uses only the `Dockerfile`; no runtime entrypoint is required.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
