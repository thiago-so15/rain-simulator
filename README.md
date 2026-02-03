# Lluvia - Aplicación Next.js

Esta es una aplicación Next.js creada con TypeScript y Tailwind CSS.

## Empezar

Primero, instala las dependencias:

```bash
npm install
```

Luego, ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Estructura del proyecto

```
lluvia/
├── app/              # Directorio de la aplicación (App Router)
│   ├── layout.tsx    # Layout principal
│   ├── page.tsx      # Página de inicio
│   └── globals.css   # Estilos globales
├── public/           # Archivos estáticos
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
├── tailwind.config.ts # Configuración de Tailwind CSS
└── next.config.js    # Configuración de Next.js
```

## Tecnologías utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **React 18** - Biblioteca de UI
