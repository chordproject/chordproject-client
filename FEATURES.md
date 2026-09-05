# ChordProject Client: Funcionalidades

Este documento describe el comportamiento funcional actualmente implementado en la aplicación compartida de ChordProject y HomenaJesus.

Las marcas se construyen desde la misma base de código, pero utilizan configuraciones, traducciones, assets y proyectos Firebase diferentes:

- ChordProject usa `chordproject-app`.
- HomenaJesus usa `homenajesus-app`.

La última sección contiene exclusivamente funcionalidades que todavía no están implementadas o decisiones pendientes.

## Autenticación

Rutas disponibles bajo `/auth`:

- `/auth/sign-in`
  - Inicio de sesión con email y contraseña.
  - Inicio de sesión con Google.
  - Inicio de sesión con GitHub.
  - Conserva una `returnUrl` válida del mismo origen para volver al destino solicitado.
- `/auth/sign-up`
  - Registro con email y contraseña.
  - Registro/inicio con Google y GitHub.
  - Validación de nombre, empresa, email y contraseña en el formulario.
- `/auth/forgot-password`
  - Solicitud de email para recuperar la contraseña mediante Firebase Authentication.
- `/auth/reset-password`
  - Lee el `oobCode` recibido en el enlace de Firebase.
  - Valida y confirma la nueva contraseña.
  - Regresa a iniciar sesión después del cambio.

Todas las pantallas de autenticación comparten:

- Enlace visible para volver a Home.
- Selector de tema claro/oscuro.
- Fondo y logo adaptados a la marca activa.
- Superficie de formulario con borde, contraste y sombra.

La sesión Firebase se restaura antes de resolver los guards. Las operaciones que requieren autenticación muestran un aviso con acceso directo a iniciar sesión.

Los administradores se identifican mediante el Custom Claim de Firebase Authentication:

```json
{ "admin": true }
```

El cliente y las reglas de Firestore consultan ese claim.

## Grupos musicales

La ruta autenticada `/group` permite gestionar la pertenencia inicial a un grupo musical sin compartir todavía cancioneros ni repertorios.

- Crear un grupo con un nombre.
- Generar un código de unión para compartirlo con otros integrantes.
- Unirse a un grupo mediante su código.
- Ver el grupo actual y el código de unión.
- Salir del grupo.
- Limitar el modelo actual a un solo grupo activo por usuario.
- Guardar en el perfil el nombre declarado durante el registro como dato provisional (`declaredGroupName`).
- Guardar `groupId` y `groupPromptDismissed` para preparar el onboarding y la pertenencia futura.

Los grupos y membresías tienen reglas de Firestore separadas. El código permite consultar directamente un grupo conocido, pero la colección no permite listar todos los grupos.

## Layout y navegación

El layout principal ofrece:

- Sidenav lateral en escritorio.
- Sidenav overlay en móvil.
- Cierre automático del sidenav móvil después de navegar.
- Toolbar compartida con:
  - apertura del sidenav;
  - búsqueda global compacta fuera de Home;
  - selector de idioma;
  - selector de tema;
  - enlace a GitHub;
  - apertura del formulario de feedback.
- Navegación principal hacia Home, Biblioteca, Crear, Cancioneros, Repertorios y Sugerencias.
- Acceso a Feedback visible para administradores.
- Navegación dinámica de cancioneros y repertorios.
- Rutas de error para páginas no encontradas.

La navegación de repertorios organiza el contenido mediante grupos, repertorios compartidos y una categoría `Otros` para repertorios sin grupo.

## Home

Home incluye:

- Fondo y branding específicos de la marca.
- Búsqueda global grande con resultados agrupados.
- Lista de las canciones añadidas recientemente.
- Acceso directo de cada canción al lector.
- En HomenaJesus, grupos de cancioneros públicos recomendados.
- En ChordProject, la tarjeta del próximo `gig`.
- En HomenaJesus, la tarjeta de la próxima celebración.
- La tarjeta de la próxima actividad muestra título, fecha, cantidad de canciones y acceso a `Abrir en vivo`.
- Bloque informativo de la plataforma.
- Enlaces de feedback integrados en las traducciones.

La próxima actividad se calcula buscando la fecha futura más cercana entre `date` y `additionalDates` de los repertorios disponibles.

## Biblioteca y búsqueda

La Biblioteca (`/library`) permite:

- Consultar canciones públicas.
- Buscar por título con debounce de 300 ms.
- Ignorar búsquedas de menos de dos caracteres.
- Evitar consultas repetidas con `distinctUntilChanged`.
- Persistir en la sesión el texto de búsqueda y la ordenación.
- Ordenar por título, artistas o fecha de creación.
- Cambiar la dirección ascendente/descendente.
- Agrupar por artista y expandir/contraer cada grupo.
- Usar una barra de salto alfabético cuando la ordenación es por título.
- Renderizar inicialmente 60 canciones y cargar más al acercarse al final o pulsar `Cargar más`.
- Seleccionar una canción para mostrar su vista previa en escritorio.
- Abrir directamente el lector con doble clic o desde móvil.
- Crear una canción nueva.

La búsqueda global está disponible en Home y en la toolbar. Busca por:

- título;
- artista;
- letra o contenido;
- nombre de cancionero.

Los resultados se presentan por categorías y se eliminan duplicados entre categorías.

La aplicación utiliza, cuando existen, los índices fragmentados `song_index` y `song_search_index`. Si no existen, cae de forma compatible a la colección `songs`.

## Lector de canciones

Ruta: `/songs/read/:uid`.

El lector permite:

- abrir canciones públicas;
- mostrar estados de carga y canción no disponible;
- volver usando el historial del navegador;
- visualizar contenido ChordPro renderizado;
- transponer acordes;
- cambiar el tamaño de visualización;
- activar pantalla completa;
- utilizar una toolbar responsive;
- navegar entre versiones y variantes;
- identificar la canción canónica mediante `variantOf`;
- consultar canciones relacionadas.

Desde el lector, un usuario autenticado puede:

- consultar cancioneros asociados;
- buscar cancioneros disponibles;
- agregar o quitar la canción de cancioneros personales;
- crear una sugerencia para agregarla a un cancionero público;
- cancelar una sugerencia propia todavía abierta;
- consultar, buscar, crear y asignar tags;
- quitar tags;
- abrir el editor completo.

Las modificaciones de un cancionero sincronizado muestran una advertencia antes de marcarlo como personalizado.

## Editor de canciones

Rutas:

- `/songs/create`
- `/songs/create/:uid`

El editor ofrece:

- edición en vivo de contenido ChordPro;
- vista previa dividida;
- actualización de metadatos parseados;
- guardado con autenticación;
- creación de canciones;
- edición de canciones propias;
- guardado mediante `Ctrl/Cmd+S`;
- advertencia ante títulos duplicados;
- creación de una variante mediante `variantOf`;
- edición directa para autor o administrador;
- sugerencia de cambios para otros usuarios autenticados;
- sugerencia de una nueva versión alternativa;
- actualización de una sugerencia abierta existente en lugar de duplicarla;
- confirmación antes de eliminar;
- eliminación de la canción y sus entradas de índice;
- regreso a la Biblioteca después de eliminar;
- confirmación al salir con cambios sin guardar;
- comportamiento responsive para alternar la vista previa.

La eliminación está restringida al autor, propietario o administrador. El evento de ayuda del editor existe, pero actualmente no abre una ayuda funcional.

## Cancioneros

Rutas:

- `/songbook`
- `/songbook/:uid`

La lista de cancioneros separa:

- Mis cancioneros.
- Cancioneros públicos/recomendados de HomenaJesus.

La lista permite:

- agrupar cancioneros;
- mostrar grupos y miembros;
- crear cancioneros personales autenticados;
- abrir cancioneros públicos y personales;
- mostrar el origen y estado de copias históricas mediante `copiedFrom` y `syncStatus`;
- eliminar cancioneros personales mediante soft delete;
- eliminar grupos personales y sus relaciones;
- permitir a administradores eliminar cancioneros públicos.

La vista de detalle permite:

- mostrar nombre y estado público/personal;
- listar canciones con el panel compartido de lista y preview;
- seleccionar una canción;
- abrir una canción con doble clic;
- buscar y agregar canciones a cancioneros personales editables;
- quitar canciones;
- enviar sugerencias para agregar canciones a cancioneros públicos;
- advertir antes de personalizar una copia sincronizada;
- bloquear la edición de cancioneros públicos o templates para usuarios normales.

La aplicación ya no expone una acción general para crear nuevas copias personales de cancioneros compartidos. Se conserva metadata de copias antiguas y la capacidad de administrarlas/eliminarlas cuando corresponde.

## Sugerencias

Ruta: `/suggestions`.

Está protegida para usuarios autenticados.

Los usuarios pueden consultar:

- sus sugerencias abiertas;
- sugerencias aceptadas;
- sugerencias rechazadas;
- sugerencias de cambios de canciones;
- sugerencias de pertenencia a cancioneros;
- mensajes propios y respuestas del equipo;
- diferencias línea a línea entre versión actual y propuesta.

Los administradores pueden:

- consultar todas las sugerencias abiertas;
- aprobar cambios oficiales de canciones;
- crear nuevas versiones de canciones;
- rechazar sugerencias;
- aprobar o rechazar sugerencias de cancioneros;
- escribir un mensaje de respuesta;
- consultar el historial de sugerencias;
- cargar el historial en bloques de 20 elementos.

Las sugerencias abiertas de canciones y relaciones utilizan listeners de Firestore para actualizarse mientras la pantalla está abierta.

## Repertorios

Rutas:

- `/repertoires`
- `/repertoires/settings`
- `/repertoires/:uid`
- `/repertoires/:uid/live`

### Lista

La lista de repertorios permite:

- separar repertorios propios y compartidos;
- mostrar vista de cuadrícula o lista;
- buscar por título, descripción, tipo de evento, canción asignada o espacio del evento;
- filtrar por tipo de evento;
- filtrar por grupo o repertorios sin grupo;
- ordenar por fecha;
- ver resúmenes de canciones y espacios;
- abrir la gestión del repertorio;
- abrir la vista en vivo;
- crear repertorios mediante diálogo;
- guardar como borrador en `sessionStorage` una creación iniciada sin autenticación y restaurarla después de iniciar sesión;
- eliminar repertorios propios con confirmación.

### Configuración

La configuración separa dos áreas:

- Tipos de evento:
  - crear, renombrar y eliminar tipos;
  - crear, renombrar y eliminar espacios;
  - ordenar espacios con drag and drop.
- Grupos de repertorios:
  - crear y eliminar grupos;
  - agregar o quitar repertorios;
  - buscar repertorios antes de agregarlos;
  - ordenar repertorios del grupo con drag and drop.

En escritorio se utiliza un selector directo de sección. En móvil se utiliza breadcrumb y menú contextual. Los repertorios seleccionados solo aparecen en la lista ordenable; los candidatos se buscan y no se cargan cientos de filas inicialmente.

Los repertorios existentes están clasificados como compartidos mediante `scope: shared` y `published: true`. Los repertorios personales creados por un usuario se guardan como `scope: personal` y `published: false`.

### Detalle y edición

El detalle permite:

- ver título, descripción, tipo y fecha;
- editar título y descripción cuando el usuario tiene permiso;
- eliminar cuando corresponde;
- asignar canciones a espacios mediante autocomplete;
- agregar varias canciones al mismo espacio;
- eliminar asignaciones;
- reordenar canciones dentro de un espacio;
- marcar espacios como omitidos o activos;
- ver una advertencia de solo lectura en repertorios compartidos;
- crear una copia personal de un repertorio compartido mediante `forkRepertoire`.

La copia personal conserva `copiedFrom`, cambia a `scope: personal`, queda sin publicar y copia las asignaciones de canciones.

### Vista en vivo

Ruta: `/repertoires/:uid/live`.

Incluye:

- lista de canciones ordenada por espacio;
- etiquetas de espacio cuando hay más de uno;
- selección de canción;
- preview de acordes;
- navegación anterior/siguiente en móvil;
- alternancia entre lista y viewer en pantallas pequeñas;
- regreso al repertorio.

La selección de una canción se refleja en la URL para que el botón Back del navegador móvil vuelva a la lista de canciones en lugar de saltar directamente a Home.

## Feedback, temas, idiomas y marcas

### Feedback

El drawer compartido de feedback permite:

- elegir bug o idea;
- introducir título y mensaje;
- indicar permiso de contacto;
- proporcionar email de contacto opcional;
- enviar feedback anónimo o autenticado.

Los administradores pueden listar y filtrar feedback abierto.

### Idiomas

Se soportan inglés, español y francés mediante Transloco.

- Se prioriza la preferencia guardada.
- Después se usa el idioma del navegador.
- Inglés es el fallback.
- La preferencia se guarda en `localStorage`.
- HomenaJesus sobrescribe traducciones comunes con valores específicos de su marca.

### Temas

Se soportan:

- claro;
- oscuro;
- sistema.

La preferencia se guarda localmente y se aplica también en autenticación.

### Branding

Cada marca tiene sus propios:

- logos;
- favicons;
- títulos y metadata;
- watermarks;
- traducciones;
- assets de autenticación;
- configuración Firebase.

## Seguridad y administración implementadas

Las reglas de Firestore y los guards aplican los siguientes principios:

- canciones legibles públicamente;
- creación de canciones solo autenticada y con `authorId` coincidente;
- edición y eliminación de canciones restringidas al autor, propietario o administrador;
- protección de `authorId` y `ownerId` frente a cambios no autorizados;
- cancioneros públicos legibles sin autenticación;
- datos personales restringidos al propietario;
- templates y cancioneros públicos no editables por usuarios normales;
- sugerencias limitadas a su autor o administradores;
- feedback de lectura, actualización y eliminación restringido a administradores;
- creación de feedback pública con validación;
- tipos de evento, espacios, repertorios, grupos y relaciones con escrituras autenticadas y propiedad validada.

Los administradores se asignan mediante el Custom Claim de Firebase Authentication `admin: true`. El script disponible es `scripts/set-admin-claim.mjs`.

## Índices, cache y consumo

Actualmente existen:

- cache de canciones durante la sesión;
- cache de cancioneros durante la sesión;
- invalidación de cache después de escrituras;
- búsqueda con debounce y sustitución de resultados obsoletos;
- índice ligero de canciones fragmentado;
- índice de búsqueda de letras fragmentado;
- reconstrucción de índices mediante `scripts/rebuild-song-index.mjs`;
- modo dry-run para medir tamaño de índices;
- carga progresiva del DOM de la Biblioteca;
- consultas puntuales con `getDoc`/`getDocs` en la mayoría de los flujos;
- listeners solo en sugerencias abiertas.

Los índices se fragmentan en bloques de 300 entradas para respetar los límites de Firestore. El índice ligero contiene metadata y extractos para listas; el índice de búsqueda se carga de forma perezosa.

## Builds, despliegue y herramientas

La aplicación está preparada para dos builds:

- `npm run build:prod` para ChordProject.
- `npm run build-hj` para HomenaJesus.

Desarrollo:

- ChordProject en el puerto `3874`.
- HomenaJesus en el puerto `3873`.
- `npm start` ejecuta ambos servidores.

Hosting:

- `dist/chp/browser` para ChordProject.
- `dist/hj/browser` para HomenaJesus.
- Targets Firebase `hosting:chp` y `hosting:hj`.
- Rewrites SPA hacia `index.html`.
- Traducciones con headers de no-cache.

Despliegue:

- `npm run deploy:chp`.
- `npm run deploy:hj`.
- `npm run release`.

Scripts administrativos disponibles:

- `scripts/set-admin-claim.mjs` para claims de administrador.
- `scripts/rebuild-song-index.mjs` para índices.
- `scripts/backup-firestore.mjs` para backups manuales.
- `scripts/migrate-repertoires-to-shared.mjs` para migración de visibilidad de repertorios.

## Limitaciones actuales

Estas no son funcionalidades futuras; describen aspectos ya presentes pero incompletos o deliberadamente limitados:

- El formulario de registro valida nombre y empresa, pero el flujo actual de creación persiste principalmente email y contraseña.
- El evento de ayuda del editor no tiene todavía una pantalla o contenido de ayuda asociado.
- La búsqueda global no muestra actualmente una categoría de canciones encontradas dentro de cancioneros aunque existe soporte parcial en el servicio.
- La Biblioteca carga el conjunto de metadata disponible y limita el renderizado del DOM; aún no usa paginación Firestore real.
- La creación general de copias de cancioneros públicos no está expuesta como acción de usuario. Se conserva metadata histórica de copias para su administración.
- Los listeners de sugerencias requieren ciclo de vida de pantalla y manejo de reconexiones propio de Firestore.

## Funcionalidades futuras

Esta sección contiene únicamente trabajo que todavía no está implementado o decisiones pendientes.

### Seguridad y datos

- Probar reglas con usuario anónimo, propietario, usuario autenticado ajeno y administrador en ambos proyectos.
- Verificar en producción la inmutabilidad de `authorId` y `ownerId`.
- Comparar y aprobar las reglas de ChordProject y HomenaJesus por separado.
- Decidir si las colecciones antiguas `users` y `relations` todavía son necesarias.
- Preparar backups verificables y procedimientos de rollback antes de migraciones destructivas.

### Cancioneros

- Diseñar y publicar un catálogo editorial de cancioneros recomendados de HomenaJesus.
- Decidir si se reintroduce una acción directa para crear copias personales de cancioneros públicos.
- Definir sincronización futura entre un cancionero original y sus copias.
- Permitir ownership o colaboración por ministerio/equipo.
- Normalizar `author_uid` y `ownerId` en relaciones antiguas sin romper datos existentes.

### Repertorios

- Definir un modelo completo de repertorios recomendados y publicación editorial.
- Permitir duplicar repertorios para nuevas fechas con historial de origen.
- Definir permisos de equipo, autor y administrador.
- Añadir campos específicos de HomenaJesus: cita bíblica, tiempo litúrgico y notas pastorales.
- Crear sugerencias inteligentes por cita bíblica, ciclo litúrgico o tema central.
- Validar migraciones, índices, reglas y eliminaciones contra datos reales de producción.

### Escala y Firestore

- Medir lecturas por flujo en Firebase Console.
- Ejecutar el reindexado inicial de producción y comparar el ahorro real.
- Añadir paginación por cursor cuando el volumen lo justifique.
- Evaluar cache persistente con versión cuando la biblioteca supere aproximadamente 2.000 canciones.
- Evaluar un buscador dedicado para letras a gran escala.
- Configurar alertas de presupuesto y consumo.
- No introducir nuevos listeners en tiempo real sin justificar ciclo de vida y costo.

### Viewer, parser y editor

- Validar transposición con alteraciones, slash chords, tensiones, capo y equivalencias enarmónicas.
- Verificar que transponer repetidamente no degrade la representación.
- Completar la ayuda integrada del editor.
- Comparar Ace, CodeMirror y el editor actual antes de una migración.
- Documentar y ampliar las reglas reales de ChordPro soportadas por el editor.
- Evaluar autoscroll y tuner como funcionalidades independientes con carga diferida.

### Calidad y sustitución de producción

- Crear pruebas funcionales para autenticación, canciones, Biblioteca, búsqueda, cancioneros, sugerencias, repertorios y transposición.
- Probar ambos builds en staging.
- Preparar rollback de Hosting, reglas y datos.
- Comparar conteos, relaciones e índices antes y después de migraciones.
- Sustituir progresivamente las aplicaciones antiguas.
