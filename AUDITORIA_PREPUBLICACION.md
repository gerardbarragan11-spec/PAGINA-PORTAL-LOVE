# Auditoría de prepublicación — Portal Love

**Fecha:** 12 de noviembre de 2026  
**Alcance:** páginas HTML, estilos, scripts, recursos locales, dependencias externas y pruebas de navegador.  
**Nota:** esta revisión técnica no constituye asesoría jurídica ni acredita titularidad o consentimiento.

## 1. Errores ortográficos y lingüísticos

Se normalizaron mayúsculas de títulos y etiquetas, expresiones comerciales y vocabulario de personalización. Ejemplos: “Clientes satisfechos”, “Materiales ecoamigables”, “La más pedida” y “enlace” en lugar de “link”. También se ajustó “Por más de 5 años” a “Desde hace más de 5 años”. Se mantuvo el sentido de los textos y no se cambiaron productos, precios ni opciones.

El subtítulo de Testimonios y el orden de los contactos reflejan solicitudes explícitas del propietario. No se cambiaron las frases provisionales que dependen de opciones comerciales todavía no definidas.

## 2. Derechos de autor y propiedad intelectual

No se encontraron archivos de licencia, atribuciones, autorizaciones de imagen ni registros de consentimiento dentro del proyecto. La falta de documentación aquí no demuestra que un recurso carezca de autorización; los elementos indicados quedan pendientes de comprobar con el propietario.

| Recurso o archivo | Problema / procedencia conocida | Riesgo | Acción recomendada | Estado |
|---|---|---:|---|---|
| `assets/images/TESTIMONIOS/` | Capturas de conversaciones de WhatsApp con nombres, fotos de perfil y mensajes identificables. La autorización de cada persona no está documentada en el proyecto. | Alto | Obtener consentimiento explícito para publicación y uso comercial; ocultar datos personales de quienes no hayan autorizado. | Pendiente del propietario; no se modificaron ni borraron archivos. |
| `assets/images/CLIENTES SATISFECHOS/` | Fotografías y videos exportados de WhatsApp; pueden mostrar clientes, terceros o contenido personal. No hay releases ni procedencia documentada. | Alto | Confirmar permiso de cada persona identificable y derechos comerciales del material antes de publicar; retirar o difuminar solo con autorización. | Pendiente de verificación. |
| Video “6º Congreso de Medicina Interna” en `assets/images/` y `assets/images/LUNAS/LUNAS EVENTOS/` | El nombre identifica un evento externo; no consta autorización de organizadores, participantes ni de música incorporada. | Alto | Confirmar permiso para usar imágenes, marcas del evento, personas y audio en promoción pública. | Pendiente de verificación; se conservó el video original. |
| `assets/models/**/*.stl` y `assets/models/luna-ejemplo.glb` | Modelos 3D locales sin autor, procedencia o licencia documentada. | Medio | Identificar al creador y conservar autorización/licencia comercial y atribuciones requeridas. | Pendiente de verificación. |
| `assets/images/` (fotografías y diseños de producto) | Recursos locales sin metadatos de autoría/licencia en el proyecto. | Medio | Confirmar que fueron creados por Portal Love o que existe licencia para uso comercial y web. | Pendiente de verificación. |
| Google Fonts: Cormorant Garamond, Inter y Playfair Display | Se cargan desde Google Fonts. Las licencias de las familias revisadas son SIL OFL 1.1; la carga remota comunica la solicitud del navegador a Google. | Bajo en licencia; medio en privacidad/terceros | Mantener los avisos exigidos si se autoalojan; decidir si se documenta la transferencia a Google o se autoalojan las fuentes. | Licencias verificadas; decisión de privacidad pendiente. |
| Three.js `0.160.0` desde jsDelivr | Dependencia CDN bajo licencia MIT; no hay manifiesto o copia local de licencias. La disponibilidad depende de un tercero. | Bajo en licencia; medio operativo | Conservar el aviso MIT si se distribuye una copia; documentar versión y evaluar SRI o autoalojamiento. | Licencia identificada; endurecimiento recomendado. |
| `<model-viewer>` `4.0.0` desde Google CDN | Dependencia CDN bajo Apache 2.0; no hay manifiesto local. | Bajo en licencia; medio operativo | Conservar avisos Apache si se distribuye una copia; documentar versión y evaluar SRI o autoalojamiento. | Licencia identificada; endurecimiento recomendado. |

## 3. Errores técnicos y correcciones

| Recurso o archivo | Problema | Riesgo | Acción recomendada | Estado |
|---|---|---:|---|---|
| `js/blog.js` | El primer artículo referenciaba IDs de categorías, pero el componente busca IDs de productos y no mostraba recomendaciones. | Medio | Se reemplazaron por tres IDs reales del catálogo y se abrió cada artículo en navegador. | Corregido; ambos artículos mostraron tres productos con rutas válidas. |
| `js/cart.js`, `js/main.js`, `personalizar.html` | Controles dinámicos del carrito y cantidades necesitaban nombres/estado accesible; Escape y retorno de foco no estaban implementados. | Medio | Se añadieron etiquetas ARIA, tipos de botón, estado expandido, cierre con Escape y retorno del foco. | Corregido y probado: abrir, cerrar con Escape, estado ARIA y foco correctos. |
| `css/styles.css` | El texto secundario del pie tenía contraste aproximado de 3,24:1, inferior al mínimo WCAG AA de 4,5:1 para texto normal. | Medio | Se ajustó el token de color; contraste medido después: 5,68:1. | Corregido. |
| `index.html`, `personalizar.html`, `js/personalizar.js`, `js/cart.js` | Mayúsculas inconsistentes y uso mezclado de “link/enlace”; la página de personalización no tenía descripción meta. | Bajo | Se normalizaron textos y se añadió la descripción meta de personalización. | Corregido; diagnósticos del editor sin errores. |
| Rutas locales de HTML, CSS, JS y medios | Se contrastaron 66 referencias locales y cinco rutas de personalización. | Bajo | Revisar rutas al desplegar respetando mayúsculas/minúsculas del servidor. | Las referencias comprobadas existen; páginas y rutas probadas respondieron HTTP 200. |
| `index.html`, `personalizar.html` | No se encontró favicon ni `og:image`; la página principal sí tiene título, descripción y metadatos Open Graph, y personalización tiene título y descripción. | Bajo | Añadir favicon e imagen social usando recursos oficiales aprobados; no se inventó ni generó un logotipo. | Pendiente de recurso aprobado. |
| `index.html` | Los enlaces “Preguntas frecuentes” y “Envíos y devoluciones” usan `href="#"` y no llevan a contenido. | Medio | Crear las páginas o secciones reales y actualizar los destinos antes de publicar. | Pendiente de contenido del propietario; no se inventaron destinos. |
| `index.html`, `js/cloudinary-config.js`, `js/personalizar.js` | Nombre de nube y preset de carga de Cloudinary están en el cliente. Son identificadores/configuración pública, no claves secretas; un preset de carga sin restricciones puede ser abusado. | Medio | En Cloudinary limitar tipos, tamaño, formatos, carpetas y uso; habilitar moderación y valorar cargas firmadas desde backend. Documentar retención y tratamiento de imágenes/audio. | No se detectaron secretos privados; restricciones del panel y política de datos pendientes de confirmar. |
| Enlaces de WhatsApp | El contacto y el checkout deben conservar el número único configurado en `Cart.WA_NUMBER`. | Bajo | Se verificó el uso del número configurado y se añadieron `noopener,noreferrer` a ventanas abiertas por el sitio. | Revisado; no se enviaron pedidos reales. |
| Accesibilidad y responsive | No se observaron errores JavaScript/consola ni solicitudes fallidas durante la carga inicial de prueba. Anchos de 390, 768 y 1406 px sin desbordamiento horizontal. | Bajo | Repetir pruebas en navegadores/dispositivos reales antes del despliegue. | Prueba de humo superada. |

## 4. Riesgos pendientes

- **Consentimientos y derechos de imagen:** obtener autorizaciones verificables para capturas, fotos y videos de clientes, terceros y asistentes a eventos. Las capturas contienen conversaciones privadas y datos identificables.
- **Titularidad de recursos:** documentar autor y licencia comercial de fotografías, diseños y modelos STL/GLB; conservar los avisos de licencia de dependencias si se distribuyen copias.
- **Privacidad y carga de archivos:** publicar una política de tratamiento de datos que explique el envío de imágenes/audio a Cloudinary y mensajes a WhatsApp, sus finalidades, conservación, contacto y derechos de los titulares; confirmar los ajustes del preset de carga.
- **Contenido incompleto:** asignar destinos reales a Preguntas frecuentes y Envíos y devoluciones. Completar las frases pendientes de definir antes de que aparezcan en confirmaciones de pedidos.
- **Metadatos:** añadir un favicon y una imagen Open Graph únicamente cuando el propietario apruebe los recursos de marca.
- **Validación final:** probar compras, validaciones de formularios, carga real a Cloudinary y enlaces de WhatsApp en un entorno de staging con autorización, sin enviar datos de clientes durante esta auditoría.

## 5. Estado de publicación

**Estado: técnicamente estable para continuar con staging, pero no recomendado para publicación pública hasta cerrar los riesgos de privacidad, consentimientos y derechos de los medios.** El código auditado no presenta errores del editor; la carga inicial, los artículos, el carrito y los tamaños de pantalla probados funcionan. La auditoría no puede certificar licencias ni permisos que no estén documentados. Tampoco se realizaron pedidos reales ni cargas a Cloudinary.
