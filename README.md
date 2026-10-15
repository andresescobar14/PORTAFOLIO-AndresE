# Andres Escobar · Portafolio

Portafolio de una sola página con Next.js 16 App Router, TypeScript, Tailwind CSS 4, GSAP y ScrollTrigger. Interfaz oscura por defecto con acentos violeta y azul, tema claro integral, fuentes locales y contenido renderizado en el servidor.

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

`components` contiene presentación; `hooks` coordina interacciones; `domain` valida y ejecuta el caso de uso; `services` integra HTTP, Redis y correo; `types` define contratos pequeños. Los componentes y servicios reciben datos o dependencias. Solo el formulario, el menú móvil, el alternador de tema, el control de la marquesina y las mejoras de movimiento necesitan JavaScript del cliente. Los logos vectoriales se renderizan desde React Icons en el servidor.

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

Las pruebas cubren identidad y navegación, éxito/error del formulario, validación, origen, cuota agotada, IP confiable, fallos de Redis, límite real del cuerpo y entrega no configurada. Las pruebas E2E esperan credenciales ausentes para evitar envíos reales; utilizan datos de prueba y nunca envían correo.

Para E2E local puede utilizarse Microsoft Edge con `PLAYWRIGHT_CHANNEL=msedge`, o Chromium instalado mediante la herramienta de Playwright. `PLAYWRIGHT_BASE_URL` permite probar un servidor ya iniciado; de otro modo Playwright inicia el entorno de desarrollo. El flujo CI utiliza Chromium.

Las fuentes se sirven localmente con `display: optional`, evitando cambios de tipografía tardíos en conexiones lentas; las imágenes reservan su tamaño. GSAP y ScrollTrigger se importan después de la hidratación cuando las animaciones están habilitadas. El contenido se mantiene visible si fallan las animaciones. Se respeta `prefers-reduced-motion`. Los textos secundarios conservan contraste suficiente y las etiquetas accesibles corresponden al texto visible. Objetivos de campo: LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1; no se garantiza una puntuación sin medir el despliegue real.

## Publicación

Importa este repositorio en Vercel con **Root Directory: `web`**, framework Next.js y Node.js 24. Configura las variables privadas antes de construir. El código también admite un servidor Node compatible con Next.js.

GitHub almacena el código. GitHub Pages no ejecuta esta API ni el servicio de imágenes de Next.js; para el portafolio completo se necesita alojamiento con servidor. Las demos enlazadas pueden estar en GitHub Pages.

## Referencias

- [Next.js](https://nextjs.org/docs)
- [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Resend](https://resend.com/docs/api-reference/emails/send-email)
- [GSAP](https://gsap.com/docs/) y [AOS](https://github.com/michalsnik/aos)

Las fuentes DM Sans y Space Grotesk proceden de Fontsource; sus licencias se incluyen en los respectivos paquetes. Las capturas de Rick & Morty, YouTube y Spotify proceden de los repositorios públicos de Andres. Barbería se capturó desde su demo y Registro se renderizó desde el HTML publicado en su repositorio. El script `web/scripts/capture-project-previews.mjs` permite regenerar estas dos últimas capturas sin enviar formularios.


## Rediseño oscuro / claro

- El tema inicial es oscuro; el botón del Header alterna entre temas. Una inicialización mínima antes del primer render recupera `portfolio-theme` de `localStorage` sin destellos. Si el almacenamiento está bloqueado, el botón sigue funcionando durante la sesión.
- Los colores de texto, superficies, campos, bordes y estados dependen de tokens en `globals.css`; ambos temas mantienen contraste. La composición es mobile-first con Tailwind y ajustes progresivos desde 380, 640, 768 y 1024 px. El contenido se limita a 1400 px en pantallas ultraanchas.
- Cada tarjeta ofrece Demo En Vivo, Ver Código y GitHub. Registro muestra Demo pendiente: su GitHub Pages devuelve 404. Barbería conserva su demo real en Vercel. Las otras tres demos están en GitHub Pages. No se crean URLs de ejemplo.
- GSAP ScrollTrigger controla las entradas al hacer scroll y las repite al volver a recorrer la sección. GSAP mueve el brillo radial con `quickTo`, reutilizando las animaciones, y anima los botones al pasar el cursor. Se limpian eventos y animaciones al desmontar y al activar movimiento reducido.
- La marquesina CSS repite un grupo idéntico sin saltos y oculta la copia a lectores de pantalla. Se pausa con el botón o al pasar el cursor. Con movimiento reducido se convierte en una lista estática que muestra todos los logos.
- El formulario valida antes de enviar, enfoca el primer error, bloquea los campos durante el envío y conserva el mensaje si falla. Éxito y error tienen iconos y anuncios accesibles. No se muestra éxito hasta que el proveedor confirma la entrega.

### Comprobación de esta versión

Compilación de producción, TypeScript, ESLint, control de pnpm y 19 pruebas unitarias correctos. Las pruebas de navegador cubren navegación, ambos temas, persistencia, tres acciones de proyecto, pausa, GSAP ScrollTrigger, seguimiento del cursor, movimiento reducido y lectura sin JavaScript. También verifican entradas visibles y luces en ambos temas a 320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920, 2560 y 3440 px, además de móviles y tablets táctiles. Se comprueban desbordamientos y colisiones del Header. El formulario se prueba con un servicio inyectado; **no se envió ningún correo real**.

### Activación pendiente del correo

El código de envío está implementado; el clon público no contiene credenciales. Para recibir mensajes reales hay que configurar Resend, el remitente verificado y Upstash tal como indica «Configurar el contacto». No se incluyen secretos en el código ni en el archivo entregado. Mientras no estén configurados, el formulario comunica su indisponibilidad y mantiene un enlace directo al correo. GitHub Pages no puede ejecutar esta API: publica el portafolio en un alojamiento compatible con Next.js.

### GSAP, fondos luminosos y preferencia de movimiento

Las entradas de tarjetas, títulos y contacto usan GSAP ScrollTrigger: opacidad, desplazamiento de 48–64 px, escala suave y desfase entre tarjetas. Las entradas se repiten al volver a recorrer las secciones. Las luces violeta y cian son capas visibles permanentes dentro de cada tarjeta. GSAP anima su posición y escala solo mientras la tarjeta está en pantalla; fuera de ella se pausan.

El botón **Pausar animaciones**, debajo de la introducción, permite detener los efectos y volver a activarlos. Los efectos están activados por defecto, como solicitó Andres, incluso con movimiento reducido del sistema. Solo una pausa explícita del visitante los detiene; se guarda en `portfolio-motion-v3` para evitar heredar la pausa de versiones antiguas. **Pausar animaciones** revierte las entradas y mantiene el contenido y los fondos visibles. No se modifica la configuración de Windows.

Este caso se comprobó reproduciendo la preferencia real del navegador integrado: `prefers-reduced-motion: reduce`. Se verificaron el arranque automático sin pulsar botones, la pausa explícita, su persistencia al recargar, las entradas repetidas y las luces en movimiento. El tema claro/oscuro conserva su funcionamiento antes de la hidratación.

GSAP se carga de forma asíncrona después del HTML principal. Esta versión usa GSAP para scroll, luces y puntero; la medición previa del 13 % menos de JavaScript correspondía a una implementación diferente y no se aplica a esta revisión. Las imágenes siguen usando carga diferida, tamaños ajustados y decodificación asíncrona.

Las pruebas verifican las animaciones activadas en ambos temas desde 320 hasta 3440 px, además de teléfonos y tablets táctiles. Los recursos sin JavaScript o con animaciones pausadas permanecen visibles. Las pruebas no envían correos reales.

### Acceso por la IP de la red

La dirección utilizada para probar este proyecto es `http://192.168.0.110:3000/`. Next.js 16 bloqueaba sus scripts de desarrollo con HTTP 403 porque esa IP no estaba en `allowedDevOrigins`. Eso impedía hidratar React e iniciar GSAP, aunque el HTML y los fondos fueran visibles. `web/next.config.ts` permite ahora específicamente `192.168.0.110`.

Se reprodujo el fallo en esa misma dirección, se confirmó el cambio de respuesta de los scripts de 403 a 200 y se verificó GSAP activo en el navegador integrado, móvil y escritorio. Una prueba de regresión comprueba la respuesta real del JavaScript con las cabeceras de la dirección utilizada para abrir la página. Si cambia la IP local del equipo, hay que actualizar esa entrada de desarrollo.
