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
- HomenaJesus puede ofrecer cancioneros y repertorios recomendados publicados.
- Un usuario puede crear una copia personal tipo fork desde un contenido recomendado.
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

- Separar visualmente "Mis cancioneros" y "Cancioneros recomendados".
- Crear cancioneros recomendados de HomenaJesus sin imponerlos al usuario.
- Añadir acciones "Ver" y "Crear mi copia".
- Implementar el fork completo del cancionero y sus relaciones.
- Conservar `copiedFrom` y mostrar el origen de una copia.
- Permitir que cada ministerio renombre, ordene, agregue y quite canciones de su copia.
- Impedir que una copia modifique el cancionero base.
- Ocultar cancioneros personales al usuario anónimo.
- Mostrar al usuario anónimo únicamente asociaciones de cancioneros compartidos publicados.
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
- Evaluar autoscroll, diagramas de acordes y tuner como funcionalidades independientes, con carga diferida y costos de mantenimiento claros.
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
