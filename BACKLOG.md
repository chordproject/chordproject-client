# ChordProject Client Backlog

Este documento registra el trabajo pendiente para sustituir progresivamente las aplicaciones antiguas de ChordProject y HomenaJesus sin perder datos, seguridad ni capacidades esenciales.

## Objetivo

Mantener una base de código compartida con builds, branding, traducciones y configuraciones Firebase separadas:

- [homenajesus.com](https://homenajesus.com/home) usa `homenajesus-app`.
- [chordproject.com](https://chordproject.com/home) usa `chordproject-app`.

## Decisiones vigentes

- Las canciones son una biblioteca compartida. Todos pueden leerlas; solo el autor o un administrador puede editarlas o eliminarlas.
- `tags` y cancioneros son conceptos distintos. `tags` clasifica canciones; `songbook_songs` representa pertenencia a un cancionero.
- Los cancioneros y repertorios personales no deben mutar contenido compartido.
- HomenaJesus puede ofrecer cancioneros y repertorios públicos.
- Un usuario puede crear una copia personal tipo fork desde un contenido público.
- La copia conserva `copiedFrom` y puede modificarse sin afectar al original.
- Los usuarios anónimos no deben ver asociaciones personales de otros usuarios.
- Las lecturas públicas no requieren guard de ruta; las escrituras requieren autenticación y reglas de propiedad.
- No se migrará la funcionalidad de favoritos `liked`.
- No se añadirán nuevas funcionalidades de tiempo real sin justificar su costo.
- El costo de Firestore se revisará antes de incorporar consultas, listeners o sincronización nuevos.

## Trabajo entregado

### Aplicación y experiencia

- Home, biblioteca, lector, editor, songbooks y repertorios funcionales en Angular 22.
- Lector con transposición, zoom, fullscreen, toolbar y configuración visual.
- Eliminación directa de canciones desde el lector con confirmación.
- Avisos de autenticación en operaciones de escritura y navegación protegida.
- Layout de repertorios con tipos de evento, espacios, orden y repertorios fechados.
- Creación rápida de un repertorio para un tipo de evento existente, separada de la configuración de tipos de evento y espacios (uso poco frecuente).
- Vista "Abrir en vivo" de un repertorio con lista de canciones asignadas y previsualización de acordes, con el mismo patrón lista + vista previa que cancioneros.
- Repertorios navegables desde el menú lateral, agrupados por tipo de evento, igual que los cancioneros.
- Componente compartido de lista de canciones con vista previa (`ChpSongListPanelComponent`), reutilizado por cancioneros y por la vista en vivo de repertorios.
- Simplificación de la edición de canciones: se eliminó la edición rápida ("Quick edit") inline para utilizar siempre el editor completo (`/songs/create/:uid`) como única vía de edición.
- Orden de cancioneros dentro de un grupo: se respeta el orden manual cuando existe: si todos los miembros del grupo comparten el mismo valor de orden se ordenan alfabéticamente en su lugar.
- El contenido de un cancionero público solo expone al usuario anónimo las relaciones `songbook_songs` marcadas como `songbookPublic`.
- Cancioneros personales y públicos separados visualmente en "Mis cancioneros" y "Públicos", con el origen (`copiedFrom`) y el estado de sincronización visibles en la copia.
- Fork de cancioneros y sus relaciones (`forkSongbooks`/`forkMany`), usado hoy desde el flujo de sugerencias para crear la copia personal antes de aplicar un cambio.
- Un cancionero base (`isTemplate: true`, `scope: shared`, `published: true`) no puede editarse desde una copia: bloqueado por reglas de Firestore y por `isEditable()` en el cliente.
- Logos, favicons, títulos, metadata, marcas de agua y traducciones adaptados a cada marca.
- Idioma inicial basado en preferencia guardada o idioma del navegador, con inglés como fallback.
- Preferencia de idioma persistida en `localStorage`.
- Tema inicial `system`, con preferencia persistida localmente.

### Firebase y builds

- `chp` y `hj` tienen entornos Firebase separados.
- `chp` construye en `dist/chp/browser`.
- `hj` construye en `dist/hj/browser`.
- `firebase.json` contiene ambos targets de Hosting.
- `firestore.rules` está versionado y enlazado desde `firebase.json`.
- Los builds y scripts de desarrollo permiten ejecutar `start-chp`, `start-hj`, `build:prod` y `build-hj`.
- El proyecto antiguo `gochord-1` no se usa como configuración de producción de HomenaJesus.
- La propiedad `liked` fue retirada del modelo `Song` y no quedan referencias funcionales en el cliente.

### Control de lecturas aplicado

- Debounce y `distinctUntilChanged` en la búsqueda de biblioteca.
- No se buscan canciones con menos de dos caracteres.
- Cache de canciones durante la sesión.
- Cache de cancioneros durante la sesión.
- Invalidación de caches después de guardar cambios.
- La búsqueda por letras reutiliza el cache de canciones.
- La búsqueda global ya no recorre el contenido de cada cancionero por cada tecla.
- Las búsquedas nuevas sustituyen resultados anteriores para no acumular consultas y respuestas obsoletas.

## P1 - Seguridad y datos Firebase

### Pendiente

- Probar las reglas con usuario anónimo, autor, usuario autenticado ajeno y administrador.
- Configurar custom claims `admin: true` desde un entorno seguro para los administradores.
- Confirmar que solo autor o administrador puede editar y eliminar canciones.
- Confirmar que un usuario no puede cambiar el `authorId` de una canción ajena.
- Revisar las reglas de `songbook_songs` contra los datos reales y los documentos antiguos.
- Definir formalmente el propietario de una relación: usuario, propietario del cancionero o contenido publicado.
- Decidir si los documentos antiguos de `users` todavía son necesarios.
- Confirmar que `relations` no sea usado por ninguna aplicación antigua antes de eliminarlo definitivamente.
- Hacer backup verificable antes de migraciones o limpiezas destructivas.
- Comparar y aprobar reglas de `homenajesus-app` y `chordproject-app` por separado.

### Terminada cuando

- Las reglas están probadas con los cuatro perfiles de usuario.
- Los administradores pueden actuar sobre contenido autorizado sin abrir permisos globales.
- Los cancioneros base no pueden ser modificados por usuarios normales.
- Existe un backup y un procedimiento de rollback.

## P2 - Cancioneros personales y recomendados

### Modelo objetivo

Un cancionero personal puede tener esta forma:

```text
ownerId: usuario o ministerio propietario
scope: personal
source: user | fork
copiedFrom: id opcional del cancionero original
```

Un cancionero recomendado de HomenaJesus puede tener:

```text
ownerId: propietario editorial
scope: shared
published: true
isTemplate: true
```

### Pendiente

- Crear cancioneros recomendados de HomenaJesus sin imponerlos al usuario.
- Añadir acciones "Ver" y "Crear mi copia" como acción directa y visible, no solo disparada indirectamente al aplicar una sugerencia.
- Permitir que cada ministerio renombre, ordene, agregue y quite canciones de su copia.
- Ocultar cancioneros personales al usuario anónimo.
- Decidir si una copia puede recibir actualizaciones manuales del original en el futuro.
- Usar un nombre de propietario coherente en nuevas relaciones; evaluar migración de `author_uid` a `ownerId` sin romper datos existentes.

### Terminada cuando

- Los cancioneros base de HomenaJesus están protegidos.
- Un usuario nuevo puede descubrir recomendaciones y crear una copia.
- La personalización de una copia no cambia el original ni las copias de otros usuarios.
- Las asociaciones visibles respetan el alcance y propietario del cancionero.

## P3 - Repertorios compartidos y reutilizables

### Pendiente

- Separar "Mis repertorios" y "Repertorios recomendados".
- Permitir publicar un repertorio como propuesta compartida.
- Permitir crear una copia personal tipo fork para otra fecha o ministerio.
- Mantener `copiedFrom` y el historial básico del origen.
- Permitir adaptar canciones, espacios y orden sin modificar el repertorio original.
- Definir campos de dominio opcionales para HomenaJesus: cita bíblica, tiempo litúrgico y notas pastorales.
- Definir permisos para autor, equipo y administradores.
- Añadir duplicación de repertorios para nuevas fechas.
- Validar índices, reglas y eliminación de repertorios con datos reales.
- Definir sugerencias de repertorios previos por fecha o tiempo litúrgico sin crear lecturas excesivas.
- Buscador inteligente de repertorios a partir de la cita bíblica o el tema central (campo `description`): encontrar repertorios anteriores del mismo evangelio aunque cambie el ciclo litúrgico A/B/C, el mismo pasaje narrado por otro evangelista (p. ej. la multiplicación de los panes en Mateo 14, Marcos 6, Lucas 9 o Juan 6) o repertorios con el mismo tema central aunque el pasaje sea distinto (p. ej. la misericordia de Dios hacia el pecador en el hijo pródigo, la mujer adúltera o Zaqueo). Evaluar si conviene resolverlo con búsqueda de texto simple o con IA; solo tiene sentido cuando exista suficiente volumen de repertorios (al menos uno por semana). El campo de descripción ya se documenta en la UI como preparación para esta funcionalidad futura.

### Terminada cuando

- Un ministerio puede consultar un repertorio compartido y clonarlo.
- La copia queda bajo su propietario y puede adaptarse libremente.
- El original permanece intacto.
- La solución genérica funciona en ChordProject y admite campos litúrgicos solo en HomenaJesus.

## P4 - Búsqueda y consumo de Firestore

### Situación

Se observó un consumo diario aproximado de 57K lecturas, 92 escrituras y 2 eliminaciones. No hay uso actual de `onSnapshot`; las consultas son lecturas puntuales con `getDocs` o `getDoc`. Una pestaña abierta no debería generar lecturas periódicas por sí sola.

### Pendiente inmediato

- Revisar en Firebase Console qué rutas, horas y clientes producen las lecturas.
- Medir por flujo: Home, biblioteca, lector, búsqueda global, cancioneros y repertorios.
- Revisar el consumo después de las optimizaciones ya aplicadas.
- Mantener cache y evitar consultas completas repetidas por tecla.
- No introducir `onSnapshot` sin definir su ciclo de vida, reconexiones y costo esperado.
- Añadir paginación por cursor cuando la biblioteca supere el volumen que justifique su complejidad.
- Usar `startAfter` y `limit`, no `offset`.
- Evaluar campos indexables para título y artista.
- No usar Firestore como buscador de texto completo de letras a escala.
- Evaluar un índice de búsqueda dedicado si crece la necesidad de buscar contenido completo.
- Documentar el costo estimado de cada nueva consulta.
- Configurar alertas de presupuesto y consumo.

### Lista infinita

La lista infinita es útil para reducir la carga inicial, memoria y tiempo de respuesta cuando existan cientos o miles de canciones. No reduce necesariamente las lecturas totales si el usuario recorre toda la biblioteca. Se implementará solo cuando el volumen o las métricas lo justifiquen.

En la biblioteca ya existe carga progresiva de renderizado: se pintan 60 canciones y se añaden más al acercarse al final. No reduce lecturas porque el conjunto completo ya está en memoria; solo reduce nodos del DOM. La ordenación y la búsqueda siguen operando sobre el conjunto completo.

### Índice de canciones para reducir lecturas

Problema medido sobre los 242 documentos actuales: Firestore factura por documento devuelto, no por bytes. Cada lista de canciones cuesta tantas lecturas como canciones muestre.

- Biblioteca: 242 lecturas por sesión, repetidas en cada recarga.
- Home, recientemente agregadas: 10 lecturas.
- Abrir un cancionero de N canciones: N lecturas de `songbook_songs` más N lecturas de `songs`.

Propuesta: colección `song_index` con documentos que agrupan entradas ligeras de canción, leída de una vez y resuelta en memoria para todas las listas. El detalle completo con `content` se sigue pidiendo solo al abrir lector o editor.

Estado: implementado. `song_index` guarda la entrada ligera y `song_search_index` el texto normalizado para buscar en letras, ambos fragmentados en documentos de 500 entradas. El cliente cae a leer la colección `songs` completa mientras los índices no existan, así que la aplicación funciona igual antes del primer reindexado. La reconstrucción se lanza con `npm run reindex:hj`, y `npm run reindex:hj:dry` calcula fragmentos y tamaños sin escribir.

Pendiente de este bloque:

- Ejecutar el reindexado inicial contra producción y comprobar el consumo real después.
- Abrir un cancionero sigue costando N lecturas de `songbook_songs`. Para bajarlo a 1 habría que guardar los `songId` ordenados dentro del documento del cancionero y retirar la colección de relaciones, lo que implica migración de datos y cambio de reglas.
- Las reglas permiten escribir los índices a cualquier usuario autenticado, porque cualquiera que pueda crear una canción debe poder mantener el fragmento en la misma escritura por lotes. La reparación ante un cliente que los corrompa es el script de reindexado.
- Valorar `onSnapshot` sobre `song_index` para recibir altas ajenas sin recargar. Con pocos documentos el coste es una lectura inicial más una por cambio real.

Medición real, obtenida con el reindexado sobre las dos bases de producción:

| Proyecto | Canciones | Índice ligero | Índice de búsqueda | Bytes por canción en búsqueda |
| --- | --- | --- | --- | --- |
| `homenajesus-app` | 242 | 85 KB | 113 KB | media 476, p95 928, máx 2336 |
| `chordproject-app` | 156 | 56 KB | 199 KB | media 1306, p95 2097, máx 2539 |

Las canciones de ChordProject son casi tres veces más largas que las de HomenaJesus, así que el dimensionamiento debe hacerse con el peor caso, no con la media. Por eso el fragmento es de 300 entradas y no de 500: con 500 canciones del percentil 95 un fragmento de búsqueda alcanzaría 1,05 MB y superaría el límite de Firestore. Con 300, incluso un fragmento formado íntegramente por las canciones más largas medidas se queda en unos 760 KB.

El extracto de letra de 140 caracteres en la entrada ligera es necesario porque la lista de la biblioteca muestra un fragmento bajo cada título. Sin él la entrada ligera bajaría de unos 351 a unos 169 bytes.

Proyección de un documento único, que es lo que se descartó:

| Canciones | Índice ligero | Índice de búsqueda |
| --- | --- | --- |
| 242 | 85 KB | 113 KB |
| 1000 | 343 KB | 455 KB a 1,3 MB según la marca |
| 5000 | 1,7 MB, excede el límite | 2,3 MB a 6,5 MB, excede el límite |

Conclusión: un documento único no es viable en el objetivo de 5000 canciones, ni siquiera para el índice ligero. El índice debe nacer fragmentado.

- Fragmentar en documentos de 300 entradas como máximo. Con 5000 canciones son 17 fragmentos, es decir 17 lecturas en lugar de 5000.
- El tamaño de fragmento está duplicado en `SONG_INDEX_SHARD_SIZE` y en el script de reindexado. Si se cambia uno hay que cambiar el otro, o el cliente y el script discreparán al decidir cuándo crear un fragmento nuevo.
- Leer los fragmentos con una consulta a la colección completa, sin documento manifiesto, para no añadir una lectura extra. Ese camino de lectura es idéntico con un fragmento que con diecisiete, así que la fragmentación no obliga a migrar cuando la biblioteca crece.
- Mantener el índice de búsqueda en fragmentos aparte y cargarlo de forma perezosa solo al primer uso del buscador, para no penalizar cada arranque.
- Incluir `count` y `updatedAt` en cada fragmento para detectar desincronización.
- Regenerar desde el cliente en la misma escritura por lotes que guarda la canción, ya que no hay plan Blaze para Cloud Functions.
- Reconstrucción manual completa desde el script de reindexado, como reparación ante desincronización.

Revisar cuando se superen las 2000 canciones:

- El índice ligero pasaría de 690 KB por carga, lo que empieza a pesar en móvil aunque cueste pocas lecturas.
- A partir de ahí conviene caché persistente con verificación de versión, o paginación por cursor real con búsqueda delegada a un motor externo.
- El índice de búsqueda por letra deja de ser razonable como descarga completa; evaluar servicio de búsqueda dedicado.

### Índices Firestore

- Mantener el índice compuesto existente de `songbooks` para `parent`, `order` y `name`.
- Crear y versionar el índice compuesto de `songbook_songs` para `songbookId` y `songId` si la consulta lo requiere.
- Añadir `firestore.indexes.json` y enlazarlo desde `firebase.json`.
- Crear índices nuevos solo a partir de consultas reales o de errores de Firestore que proporcionen el índice requerido.
- Revisar índices adicionales cuando se implementen `scope`, `published`, `ownerId` o `copiedFrom`.
- Evitar índices especulativos: tienen costo de almacenamiento y mantenimiento en escrituras.

### Terminada cuando

- Las lecturas se conocen por flujo y no solo como total diario.
- No hay consultas completas repetidas por cada interacción.
- Los índices usados por producción están versionados.
- Existe una alerta de consumo y un procedimiento para investigar picos.

## P5 - Viewer, parser y editor

### Pendiente real

- Comparar `chordpro-parser` con ChordSheetJS antes de reemplazar o refactorizar el parser.
- Validar transposición con canciones reales: alteraciones, slash chords, tensiones, capo y equivalencias enarmónicas.
- Confirmar que transponer repetidamente no degrade la representación.
- Separar progresivamente lógica musical y presentación del viewer.
- Revisar persistencia y validación de preferencias tipográficas.
- Evaluar autoscroll y tuner como funcionalidades independientes, con carga diferida y costos de mantenimiento claros.
- Comparar Ace y CodeMirror antes de migrar `chordproject-editor`.
- Diseñar la ayuda del editor a partir de las reglas reales de ChordPro.

### Ya disponible

- Transposición inicial.
- Zoom de `50%` a `200%`.
- Fullscreen sobre el viewer.
- Configuración tipográfica y visual básica.
- Editor integrado con guardar, cerrar y eliminar.

## P6 - Testing, staging y sustitución de producción

### Pendiente

- Crear pruebas básicas después de cerrar la migración funcional.
- Cubrir login, crear/editar/eliminar canción, búsqueda, cancioneros, relaciones y transposición.
- Probar ambos builds en staging antes de cambiar tráfico o DNS.
- Preparar rollback de Hosting, reglas y datos.
- Comparar conteos, relaciones y documentos antes y después de cada migración.
- Sustituir gradualmente la aplicación antigua.

## Fuera de alcance actual

- Funcionalidad de favoritos `liked`.
- Nuevas traducciones no relacionadas con los flujos actuales.
- Tests E2E y cobertura alta antes de cerrar la migración.
- Migración de editor o parser sin investigación previa.
- Listeners en tiempo real sin justificación de producto y costo.
- Colección `diagrams` y diagramas de acordes hasta decidir entre una fuente externa como `chords-db` o una solución propia.
- Eliminación de datos remotos sin backup y verificación de dependencias.

## Orden recomendado

1. Probar y publicar reglas seguras en cada proyecto.
2. Medir el consumo real de Firestore después de las optimizaciones.
3. Crear y versionar los índices necesarios.
4. Proteger y clasificar cancioneros base de HomenaJesus.
5. Implementar cancioneros recomendados y forks personales.
6. Implementar repertorios compartidos y forks por fecha.
7. Completar la revisión del parser, viewer y editor.
8. Probar staging, preparar rollback y sustituir producción gradualmente.
