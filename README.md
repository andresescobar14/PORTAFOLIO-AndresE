# Andres Escobar · Portafolio

Portafolio de una sola página con Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP y AOS. Diseño responsive en blanco y azul, fuentes locales y contenido renderizado en el servidor.

La aplicación está en **`web/`**. Abre una terminal en esa carpeta y utiliza exclusivamente pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Requisitos: Node.js 24 y pnpm 12.5.1. El campo `packageManager` fija la versión del gestor. Se versiona `pnpm-lock.yaml`; el control de instalación y CI rechaza otros gestores y lockfiles.

## Personalización

- `web/src/data/portfolio.ts`: identidad, biografía, tecnologías y contactos proporcionados por Andres; proyectos editables.
- `web/src/app/globals.css`: tokens de color, composición, puntos de ruptura y movimiento reducido.
- `web/public/projects/`: capturas reales de los cinco proyectos, presentadas mediante `next/image`.
- `web/src/app/layout.tsx`: metadatos y fuentes locales desde los paquetes Fontsource, sin solicitudes a Google Fonts.

La colección incluye los cinco repositorios elegidos por Andres: Rick & Morty, Copia de YouTube, Copia de Spotify, Barbería y Registro de usuarios. Las descripciones se contrastaron con su código y documentación. Cuatro demos están verificadas; Registro enlaza al código porque su dirección de Pages no está publicada.

## Arquitectura

`components` contiene presentación; `hooks` coordina interacciones; `domain` valida y ejecuta el caso de uso; `services` integra HTTP, Redis y correo; `types` define contratos pequeños. Los componentes y servicios reciben datos o dependencias. Solo el formulario, el menú móvil y las mejoras de movimiento necesitan JavaScript del cliente.

El límite por IP se aplica **dentro de `POST /api/contact`**, antes de leer y entregar el mensaje. No hay otro punto de envío ni doble conteo en un middleware. Upstash mantiene el contador compartido entre instancias: cinco intentos por minuto con ventana deslizante. Un timeout o fallo del limitador cierra el envío con `503`; una cuota agotada devuelve `429` y `Retry-After`.

La ruta valida JSON con Zod, comprueba el origen cuando está presente, rechaza cuerpos superiores a 8 KiB leyendo el tamaño real y descarta el campo trampa antispam. El correo usa texto plano, destinatario y remitente fijos del servidor y el correo del visitante como `reply_to`. No se registran mensajes ni credenciales. El control por IP no reemplaza la protección DDoS del proveedor.

## Configurar el contacto

1. Copia `web/.env.example` a `web/.env.local` y completa los valores únicamente en tu entorno privado.
2. Crea una instancia Redis de Upstash y configura `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.
3. Configura `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (dominio verificado) y `CONTACT_TO_EMAIL` en Resend y el alojamiento.
4. En Vercel se usa la IP de `x-vercel-forwarded-for`. En otro servidor, configura `TRUSTED_PROXY_IP_HEADER` solamente detrás de un proxy que sobrescriba esa cabecera y bloquee el acceso directo al origen. Sin una IP confiable, la ruta falla de forma cerrada.
5. Reconstruye la aplicación después de configurar las variables para habilitar el formulario prerenderizado.

Sin credenciales, el sitio y los enlaces de correo, WhatsApp y GitHub funcionan; el formulario indica que aún no está disponible y la API devuelve `503`. Nunca simula una entrega exitosa. En desarrollo, los envíos comparten el identificador local `127.0.0.1`, manteniendo el límite en Redis.

## Verificación

Las tareas declaradas en `web/package.json` son `test` (Vitest), `test:watch`, `lint`, `typecheck`, `build`, `test:e2e` (Playwright) y `check:manager`. CI ejecuta instalación congelada, calidad, pruebas, compilación y navegación en escritorio/móvil.

Las primeras pruebas se escribieron y ejecutaron antes de sus implementaciones (fase roja de TDD). Cubren identidad y navegación, éxito/error del formulario, validación, origen, cuota agotada, IP confiable, fallos de Redis, límite real del cuerpo y entrega no configurada. Las pruebas E2E esperan credenciales ausentes para evitar envíos reales; utilizan datos de prueba y nunca envían correo.

Para E2E local puede utilizarse Microsoft Edge con `PLAYWRIGHT_CHANNEL=msedge`, o Chromium instalado mediante la herramienta de Playwright. `PLAYWRIGHT_BASE_URL` permite probar un servidor ya iniciado; de otro modo Playwright inicia el entorno de desarrollo. El flujo CI utiliza Chromium.

Las fuentes se sirven localmente, los gráficos vectoriales reservan su tamaño, GSAP/AOS se importan de forma diferida y el contenido se mantiene visible sin animaciones. Se respeta `prefers-reduced-motion`. Objetivos de campo: LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1; no se garantiza una puntuación sin medir el despliegue real.

## Publicación

Importa este repositorio en Vercel con **Root Directory: `web`**, framework Next.js y Node.js 24. Configura las variables privadas antes de construir. El código también admite un servidor Node compatible con Next.js.

GitHub almacena el código. GitHub Pages no ejecuta esta API ni el servicio de imágenes de Next.js; para el portafolio completo se necesita alojamiento con servidor. Las demos enlazadas pueden estar en GitHub Pages.

## Referencias

- [Next.js](https://nextjs.org/docs)
- [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Resend](https://resend.com/docs/api-reference/emails/send-email)
- [GSAP](https://gsap.com/docs/) y [AOS](https://github.com/michalsnik/aos)

Las fuentes DM Sans y Space Grotesk proceden de Fontsource; sus licencias se incluyen en los respectivos paquetes. Las capturas de Rick & Morty, YouTube y Spotify proceden de los repositorios públicos de Andres. Barbería se capturó desde su demo y Registro se renderizó desde el HTML publicado en su repositorio. El script `web/scripts/capture-project-previews.mjs` permite regenerar estas dos últimas capturas sin enviar formularios.
