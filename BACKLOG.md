# ChordProject Client Backlog

Este documento define el trabajo pendiente para completar la sustitución progresiva de las aplicaciones antiguas por este cliente Angular 22 + Fuse.

## Objetivo

Reemplazar la aplicación antigua de producción sin perder datos ni capacidades esenciales de ChordProject y HomenaJesus.

Los dominios de producción son:

- [homenajesus.com](https://homenajesus.com/home)
- [chordproject.com](https://chordproject.com/home)

La aplicación nueva se probará inicialmente contra `homenajesus-app`. La separación definitiva de sitios y configuraciones Firebase se resolverá al final de la migración.

## Decisiones de alcance

- No migrar la funcionalidad de canciones favoritas (`liked`).
- No añadir por ahora nuevas traducciones.
- No crear actualmente tests unitarios, tests E2E ni una infraestructura de testing.
- No convertir las pruebas responsive en una fase formal del backlog; se continuarán corrigiendo conforme aparezcan problemas reales.
- Posponer la validación y el refactoring completo del viewer hasta estudiar la evolución de `chordpro-parser` y las alternativas externas indicadas en este documento.
- Mantener las operaciones públicas de lectura sin guards de ruta. Las operaciones de escritura deben continuar verificando autenticación.
- Probar primero las funcionalidades contra el proyecto Firebase `homenajesus-app`.
- Mantener la posibilidad de generar configuraciones separadas para HomenaJesus y ChordProject.

## Prioridad de trabajo

1. Visualización y datos de songbooks.
   La carga y visualización básica ya funciona. Queda auditar y migrar todos los datos Firebase necesarios, especialmente `relations`.
2. Etiquetas.
3. Administración de songbooks.
4. Revisar y refactorizar el ecosistema `chordpro-parser`/viewer.
   Incluye transposición musical, fullscreen, zoom, autoscroll, personalización y configuración del viewer, diagramas, tuner y comparación con alternativas externas.
5. Revisar y refactorizar `chordproject-editor`.
   Incluye decidir el futuro del editor y replantear la ayuda según las reglas reales de ChordPro.
6. Preparar builds y branding separados para HomenaJesus y ChordProject.
   Incluye comparar y versionar Firebase Rules, probar ambos dominios en staging y preparar la migración progresiva con rollback.
7. Crear el testing básico posterior a la migración.
8. Retirar gradualmente la aplicación antigua.

Las prioridades 4 y 5 comienzan con investigación y comparación de los repositorios externos antes de implementar cambios estructurales.

---

## P0 - Visualización de songbooks

### Estado actual

- La ruta `/songbook/:uid` debe cargar el songbook, su lista de canciones y el viewer.

### Trabajo pendiente

- Auditar y migrar desde los proyectos de origen todos los datos necesarios para que la visualización funcione, especialmente los documentos de `relations`.
- Comparar conteos de songbooks, relaciones y canciones antes y después de la migración a `homenajesus-app`.
- Manejar songbooks vacíos, canciones eliminadas y relaciones rotas.
- Manejar errores de lectura de songbook y relaciones sin dejar un panel completamente vacío sin explicación.
- Mantener lectura pública cuando corresponda y autenticación únicamente para operaciones de escritura.

### Terminado cuando

- Abrir cualquier songbook existente muestra su nombre y sus canciones.
- La migración de datos necesaria para visualizar songbooks está completa y verificada en `homenajesus-app`.
- Songbooks vacíos y relaciones rotas muestran estados manejables.
- La navegación y selección funcionan con songbooks reales.

---

## P1 - Etiquetas

### Estado actual

- Existe el modelo `Tag` en `src/app/models/tag.ts`.
- `SongService.getTags()` ya consulta la colección `tags` de Firestore.
- La ruta de Library tiene un resolver para cargar tags.
- El detalle de canción todavía contiene restos del código antiguo, pero la UI completa de administración de tags no está migrada.
- El código antiguo hacía referencia a una dependencia de chips y a métodos que ya no existen en el servicio actual.

### Trabajo pendiente

- Diseñar la experiencia de tags con Angular Material 22, preferentemente usando `MatChipsModule`, `MatChipInput` y controles Material compatibles con Fuse.
- Integrar la UI en el detalle de canción y definir claramente los estados:
    - tags actualmente asignados;
    - tags disponibles;
    - filtro de tags;
    - creación de un tag nuevo;
    - edición del nombre;
    - eliminación;
    - agregar un tag a la canción;
    - quitar un tag de la canción.
- Definir el contrato Firestore para la colección `tags`.
- Implementar en `SongService` las operaciones necesarias para tags:
    - crear;
    - actualizar;
    - eliminar;
    - listar.
- Decidir si la eliminación de un tag debe quitarlo primero de todas las canciones relacionadas o si se permiten referencias huérfanas.
- Mantener la lista de tags consistente después de crear, editar o eliminar sin recargar toda la página.
- Revisar la forma de guardar `song.tags` y evitar duplicados.
- Manejar nombres vacíos, espacios, mayúsculas/minúsculas y duplicados.
- Verificar permisos de lectura y escritura con las reglas Firestore reales.
- Eliminar del componente de detalle los métodos antiguos comentados o adaptarlos al nuevo contrato, pero no conservar stubs sin comportamiento.
- Mantener el diseño coherente con Fuse y evitar colores o clases heredadas de Nebular.

### Terminado cuando

- Se pueden listar tags existentes.
- Se puede filtrar la lista.
- Se puede crear y asignar un tag.
- Se puede quitar un tag de una canción.
- Se puede renombrar un tag.
- Se puede eliminar un tag según la política definida.
- Los cambios persisten en `homenajesus-app` y respetan las reglas Firebase.

---

## P2 - Administración de songbooks

### Estado actual

- La aplicación nueva tiene `SongbookService` con lectura, guardado, relaciones, ordenamiento y búsqueda.
- La navegación dinámica de songbooks ya existe.
- Existe la vista `/songbook/:uid` para abrir un songbook y ordenar sus canciones.
- La aplicación antigua tenía además `/songbooks` y `SongbookSettingsComponent` para administrar la colección.
- La administración completa de songbooks todavía no tiene una pantalla equivalente clara.

### Trabajo pendiente

- Crear una vista de administración de songbooks equivalente a la función antigua `/songbooks`.
- Definir la ruta canónica de administración, por ejemplo `/songbooks`.
- Permitir crear songbooks de primer nivel.
- Permitir crear songbooks hijos cuando la jerarquía lo necesite.
- Permitir editar nombre y propiedades del songbook.
- Permitir eliminar un songbook con confirmación.
- Mostrar la jerarquía padre/hijo de forma comprensible.
- Mostrar la cantidad de canciones de cada songbook.
- Permitir seleccionar un songbook y cargar sus hijos.
- Mantener la navegación lateral sincronizada después de crear, renombrar o eliminar.
- Revisar `isReorderable` y la persistencia del orden de canciones.
- Confirmar el modelo de propiedad, autor y relaciones entre songbooks y canciones.
- Confirmar el comportamiento cuando se elimina un songbook que contiene canciones.
- Integrar la administración con el modelo de relaciones que quede definido en P0.
- Mantener lectura pública cuando corresponda y autenticación para operaciones de escritura.

### Terminado cuando

- Un usuario autenticado puede crear, editar y eliminar songbooks.
- La jerarquía de songbooks se mantiene correctamente.
- Las canciones se pueden agregar, quitar y reordenar.
- La navegación lateral refleja los cambios sin reiniciar la aplicación.
- No se rompen los songbooks existentes de `homenajesus-app`.

---

## P3 - Revisar y refactorizar el ecosistema `chordpro-parser`/viewer: transposición musical

### Estado actual

- La aplicación actual ya permite transponer canciones.
- La implementación actual depende de reglas y transformaciones heredadas del parser/transposer.
- Existe la sospecha de que parte del comportamiento está basado en cálculos simplificados y no modela suficientemente las reglas musicales.
- Se usará otro repositorio como referencia cuando sea identificado.

### Trabajo pendiente

- Clonar y revisar el repositorio de referencia [ChordBook](https://github.com/chordbook/chordbook).
- Comparar su implementación de transposición con `src/app/core/chordpro/parser.service.ts`, el transposer del parser y los modelos actuales.
- Identificar qué partes son reutilizables conceptualmente y qué partes dependen de modelos o servicios propios de ChordBook.
- Revisar la licencia, dependencias y compatibilidad antes de copiar cualquier código.
- Comparar su modelo de notas, tonalidades, alteraciones, modos y acordes con el actual.
- Definir el comportamiento esperado para:
    - acordes mayores y menores;
    - sostenidos y bemoles;
    - acordes alterados;
    - slash chords;
    - acordes con tensiones;
    - tonalidad de la canción;
    - capo;
    - selección de tonalidad preferida;
    - equivalencias enarmónicas.
- Separar la lógica musical de la UI del viewer.
- Revisar la transposición de `songKey`, `uniqueChords` y `defaultKeyUniqueChords`.
- Evitar que transponer repetidamente acumule errores de representación.
- Validar que el contenido original no se muta accidentalmente.
- Decidir si la transposición usa preferencias de sostenidos o bemoles según la tonalidad.
- Comparar resultados con canciones reales de HomenaJesus.
- Actualizar el viewer y el editor solo después de estabilizar el modelo musical.

### Terminado cuando

- La transposición produce tonalidades musicalmente coherentes.
- Se conservan correctamente alteraciones, tensiones y slash chords.
- La tonalidad mostrada coincide con los acordes resultantes.
- Repetir la operación no degrada el contenido.
- El comportamiento está validado con ejemplos reales antes de tocar el viewer completo.
- Existe una decisión documentada sobre si se refactoriza el transposer actual, se adapta una implementación externa o se diseña una solución nueva.

---

## P3.1 - Ecosistema parser/viewer: fullscreen

### Estado actual

- La acción existe en la toolbar del viewer.
- La implementación debe validarse y completarse como comportamiento real.

### Trabajo pendiente

- Implementar fullscreen con la Fullscreen API.
- Manejar entrada, salida y errores de fullscreen.
- Actualizar el icono y tooltip según el estado actual.
- Recalcular el tamaño del viewer al entrar o salir.
- Verificar compatibilidad en escritorio y dispositivos móviles.
- Evitar conflictos con el drawer y `angular-split`.
- Mantener el estado correcto al cambiar de canción o ruta.

### Terminado cuando

- Fullscreen funciona desde el viewer.
- Se puede salir usando el botón y la tecla correspondiente del navegador.
- El viewer se redimensiona correctamente.
- No quedan estados visuales desincronizados.

---

## P3.2 - Ecosistema parser/viewer: zoom

### Estado actual

- Existe una herramienta de zoom en el viewer.
- Falta comprobar equivalencia con el comportamiento deseado del producto antiguo.

### Trabajo pendiente

- Definir límites mínimo y máximo.
- Definir el incremento por acción.
- Mantener lectura cómoda en claro y oscuro.
- Verificar que el cambio no rompa columnas, saltos ni ancho del contenido.
- Revisar comportamiento en móvil y tablet cuando aparezca un caso real.
- Decidir si el valor debe persistir en la configuración del usuario.
- Asegurar que el zoom no cambia el tamaño del layout de forma inesperada.

### Terminado cuando

- El zoom es predecible y reversible.
- El contenido sigue siendo legible en todos los niveles permitidos.
- El cambio no rompe el formato ChordPro.

---

## P3.3 - Ecosistema parser/viewer: autoscroll

### Estado actual

- La aplicación antigua tenía la herramienta de autoscroll.
- No existe actualmente una implementación equivalente claramente integrada en el nuevo viewer.

### Trabajo pendiente

- Definir controles de iniciar, pausar, reanudar y detener.
- Definir velocidad y forma de ajuste.
- Usar un mecanismo de animación que no bloquee la interacción.
- Pausar al tocar o desplazar manualmente cuando corresponda.
- Reiniciar correctamente al cambiar de canción.
- Evitar que fullscreen o zoom desincronicen el desplazamiento.
- Persistir o no la velocidad según la decisión de producto.
- Revisar accesibilidad y controles de teclado.

### Terminado cuando

- Una canción puede desplazarse automáticamente durante una interpretación.
- El usuario puede pausar y recuperar el control manual.
- El cambio de canción limpia el estado anterior.

---

## P3.4 - Ecosistema parser/viewer: personalización tipográfica

### Estado actual

- Existe `ViewSettingsService`.
- El viewer ya recibe configuraciones de tipografía.
- La equivalencia completa con la aplicación antigua aún no está cerrada.

### Trabajo pendiente

- Comparar las opciones disponibles en la aplicación antigua y la nueva.
- Definir controles para tamaño, peso y estilo de:
    - letras;
    - acordes;
    - comentarios.
- Verificar colores configurables y su compatibilidad con los temas Fuse.
- Persistir preferencias en local storage de forma estable.
- Definir valores por defecto razonables.
- Evitar que valores antiguos inválidos rompan el viewer.
- Revisar la interacción con zoom y columnas.
- Mantener una lectura consistente en claro y oscuro.

### Terminado cuando

- Las preferencias se aplican inmediatamente.
- Se conservan después de recargar.
- Los valores guardados de versiones anteriores se migran o se ignoran de forma segura.

---

## P3.5 - Ecosistema parser/viewer: configuración del viewer

### Estado actual

- Hay controles separados de toolbar y un servicio de configuración.
- La validación completa del viewer se pospone porque probablemente habrá un refactoring del repositorio parser/viewer.

### Trabajo pendiente

- Inventariar las opciones antiguas y las actuales.
- Definir una configuración única y coherente.
- Revisar mostrar/ocultar acordes.
- Revisar mostrar/ocultar tabs.
- Revisar columnas.
- Revisar comentarios y secciones.
- Revisar persistencia y valores por defecto.
- Evitar duplicar estado entre toolbar, viewer y servicios.
- Preparar la API para el futuro refactoring del parser.

### Terminado cuando

- La configuración tiene una fuente de verdad clara.
- Los controles no pierden estado al cambiar de canción.
- Las preferencias no producen combinaciones visuales inválidas.

---

## P4 - Revisar y refactorizar `chordproject-editor`: ayuda y reglas ChordPro

### Estado actual

- El editor tiene una acción de ayuda.
- La ayuda heredada no debe trasladarse sin revisar su contenido.

### Trabajo pendiente

- Diseñar una ayuda orientada a usuarios que editan canciones, no a desarrolladores.
- Explicar de forma sencilla:
    - formato básico de una línea con acorde;
    - tags de metadata;
    - comentarios;
    - secciones de verso y coro;
    - tabs;
    - tags personalizados;
    - tonalidad y capo;
    - reglas de corchetes y llaves.
- Incluir ejemplos ChordPro pequeños y reales.
- Explicar errores habituales de sintaxis.
- Explicar al usuario cómo sus reglas afectan el resultado del viewer.
- Decidir si será un diálogo, panel lateral o página independiente.
- Mantener el contenido traducible en una fase posterior, sin bloquear ahora el diseño.

### Terminado cuando

- Un usuario nuevo puede entender cómo escribir una canción válida.
- La ayuda refleja el comportamiento real del parser.
- Los ejemplos se pueden copiar y usar en el editor.

---

## P4.1 - `chordproject-editor`: evaluación de un editor moderno

### Estado actual

- La aplicación usa `chordproject-editor` basado en Ace.
- El editor actual funciona, pero su arquitectura y personalización visual son limitadas para una evolución a largo plazo.
- El cliente necesita overrides para integrar sus temas Ace con Fuse.

### Trabajo pendiente

- Clonar y analizar [ChordBook Editor](https://github.com/chordbook/editor).
- Clonar y revisar [CodeMirror ChordPro language](https://github.com/chordbook/codemirror-lang-chordpro).
- Comparar Ace y CodeMirror en resaltado, autocompletado, validación, reglas ChordPro, atajos, integración Angular, responsive, temas, bundle, mantenimiento y licencia.
- Decidir si se mantiene Ace, se migra a CodeMirror o se evalúa otra alternativa.
- Definir una interfaz propia del cliente para desacoplar las páginas del editor concreto.
- Mantener los eventos actuales de guardar, cerrar, eliminar, ayuda y apertura del editor completo.
- Revisar cómo pasar reglas ChordPro al editor para ofrecer ayuda contextual y validación útil.
- No migrar de editor hasta cerrar la comparación técnica y de licencias.

### Terminado cuando

- Existe una decisión fundamentada entre Ace, CodeMirror u otra alternativa.
- La solución elegida permite extender reglas ChordPro sin hacks visuales del cliente.
- Se conserva el flujo actual de crear, editar, guardar y cerrar canciones.
- Los atajos y estados del editor están definidos antes de implementarlos.

---

## P3.6 - Ecosistema parser/viewer: diagramas de acordes bajo demanda

### Objetivo

Permitir que un usuario consulte el diagrama de un acorde directamente desde la canción cuando no conoce su digitación.

### Referencia

- Evaluar [chords-db](https://github.com/tombatossals/chords-db) como fuente de diagramas.
- Revisar afinaciones, instrumentos, variantes y licencia.

### Trabajo pendiente

- Definir cómo detectar un clic sobre un acorde renderizado.
- Definir el contrato entre viewer, acorde seleccionado y diálogo o panel de diagrama.
- Determinar instrumentos y afinaciones iniciales.
- Resolver acordes ambiguos o con múltiples digitaciones.
- Integrar la base de datos sin acoplar el viewer a su formato interno.
- Definir el estado para acordes no disponibles.
- Mantener el diagrama como consulta opcional, sin alterar el texto ni la transposición.

### Terminado cuando

- Un acorde visible puede abrir su diagrama bajo demanda.
- El diagrama corresponde a la afinación e instrumento seleccionados.
- Los acordes no disponibles muestran un estado claro sin romper la lectura.

---

## P3.7 - Ecosistema parser/viewer: tuner

### Objetivo

Incorporar un afinador para ayudar al usuario antes o durante la interpretación de una canción.

### Referencias

- Analizar [ChordBook Tuner](https://github.com/chordbook/tuner).
- Revisar permisos, audio, compatibilidad y licencia.

### Trabajo pendiente

- Definir si será página, diálogo, panel lateral o herramienta del viewer.
- Analizar captura de audio mediante Web Audio API y permisos del navegador.
- Revisar precisión, latencia y frecuencia de actualización.
- Definir instrumentos y afinaciones iniciales.
- Mostrar nota detectada, frecuencia, desviación y dirección de ajuste.
- Diseñar estados para permisos denegados, micrófono ausente, navegador incompatible y ausencia de señal.
- Definir compatibilidad con HTTPS, staging y producción.
- Cargar la funcionalidad de forma diferida cuando sea posible.

### Terminado cuando

- El usuario puede abrir y cerrar el tuner sin perder el estado de la canción.
- La lectura de afinación es comprensible y estable para uso práctico.
- Los permisos y errores de audio tienen un flujo claro.

---

## P3.8 - `chordpro-parser`: refactoring futuro

### Estado actual

- El cliente usa `chordpro-parser` para parsear, transponer y formatear canciones.
- El parser define la estructura ChordPro y genera HTML para el viewer.
- Se prevé una revisión importante de reglas musicales, editor y viewer.

### Referencia

- Clonar y analizar [ChordSheetJS](https://github.com/ChordPro/chordsheetjs).
- Comparar modelos, parser, formatter, transposer y cobertura ChordPro con `chordpro-parser`.

### Trabajo pendiente

- Comparar cobertura de tags, secciones, acordes, comentarios y tabs.
- Comparar modelos internos de canciones y líneas.
- Comparar acordes complejos, alteraciones y slash chords.
- Comparar la transposición basada en reglas musicales.
- Comparar la salida HTML y la separación entre modelo y presentación.
- Identificar comportamientos actuales que no deben romperse.
- Crear una matriz de compatibilidad con canciones reales de HomenaJesus.
- Decidir si se refactoriza el parser actual, se incorporan ideas externas o se reemplaza parte de la implementación.
- Revisar licencias antes de reutilizar código.
- Mantener una API estable para editor, viewer, búsqueda y persistencia.

### Terminado cuando

- Hay una decisión clara sobre el futuro de `chordpro-parser`.
- Las reglas soportadas y no soportadas están documentadas.
- Las canciones existentes conservan su formato y comportamiento.
- Editor, viewer, transposición y diagramas pueden evolucionar sobre una base común.

---

## P5 - Builds, Firebase, sitios y branding

### Estado actual

- `homenajesus-app` es el proyecto Firebase correcto para HomenaJesus.
- El proyecto antiguo `gochord-1` no debe tomarse como configuración correcta de producción de HomenaJesus.
- La aplicación antigua separaba builds/configuraciones para `chp` y `hj`.
- La aplicación nueva tiene una configuración única y `source: 'chp'`.
- No todos los datos relacionados, especialmente `relations`, han sido migrados a `homenajesus-app`.

### Trabajo pendiente

- Definir formalmente la configuración Firebase de cada sitio:
    - HomenaJesus;
    - ChordProject.
- Confirmar los proyectos Firebase reales de producción para ambos dominios.
- Crear configuraciones de entorno separadas sin subir credenciales privadas.
- Separar como mínimo:
    - `projectId`;
    - `authDomain`;
    - `storageBucket`;
    - `messagingSenderId`;
    - `appId`;
    - `source`;
    - logo;
    - nombre de producto;
    - idioma inicial;
    - URLs específicas.
- Decidir si se generarán dos builds o una aplicación configurable por dominio.
- Implementar el logo correcto para cada sitio.
- Mantener una misma base de código para evitar divergencia funcional.
- Auditar colecciones y documentos en los proyectos de origen y destino:
    - `songs`;
    - `songbooks`;
    - `relations`;
    - `tags`;
    - usuarios;
    - favoritos heredados, aunque `liked` no se vaya a migrar como funcionalidad.
- Respaldar los datos antes de modificar producción.
- Crear un inventario de conteos y relaciones antes y después de la migración.
- Migrar los documentos `relations` faltantes a `homenajesus-app`.
- Definir tratamiento de documentos duplicados, referencias rotas y timestamps.
- Comparar las Firebase Rules de los proyectos que se usaban en los sitios antiguos con las reglas activas de `homenajesus-app`.
- Versionar las reglas Firebase una vez validadas.
- Confirmar que las reglas permiten lectura pública donde corresponde y escritura solo a usuarios autorizados.
- Definir hosting final: Firebase Hosting, Vercel o una combinación explícita.
- Preparar staging y rollback antes del cambio de DNS o tráfico.

### Terminado cuando

- Ambos dominios apuntan al build correcto.
- Cada dominio usa el Firebase correcto.
- Cada dominio muestra su logo y branding.
- Canciones, songbooks, tags y relations aparecen completas.
- Las reglas de seguridad están comparadas, aprobadas y versionadas.
- Existe un procedimiento de rollback.

---

## Futuro - Eliminación de `liked`

### Decisión

La funcionalidad de canciones favoritas no se migrará.

### Trabajo pendiente futuro

- Confirmar que ningún flujo nuevo depende de `liked`.
- Inventariar documentos que todavía contienen el campo.
- Decidir si se conserva por compatibilidad de datos o se elimina físicamente.
- Si se elimina:
    - hacer backup;
    - definir una migración irreversible explícita;
    - eliminar el campo de los documentos de canciones;
    - retirar `liked` de `Song`;
    - retirar cualquier referencia de UI o servicios;
    - revisar reglas y scripts de migración.
- No eliminar el campo antes de completar la migración de datos y confirmar que no se necesita como referencia histórica.

### Terminado cuando

- No existen referencias de código a `liked`.
- La documentación de datos refleja su eliminación.
- La limpieza se ha ejecutado con backup verificable.

---

## P7 - Testing básico posterior

### Alcance acordado

No se crearán tests ahora. Al terminar la migración funcional se añadirá únicamente una capa básica para proteger los flujos más críticos.

### Trabajo pendiente futuro

- Elegir el mínimo mecanismo de testing que encaje con Angular 22.
- Cubrir solamente flujos esenciales:
    - iniciar sesión;
    - crear canción;
    - editar y guardar;
    - eliminar con confirmación;
    - buscar;
    - crear y modificar songbook;
    - agregar y quitar tags;
    - transponer.
- Evitar perseguir cobertura alta o probar cada componente visual.
- Mantener los tests como una red de seguridad para la sustitución de producción, no como una fase que bloquee el trabajo actual.

---

## Fuera del backlog inmediato

- Nuevas traducciones y extracción completa de strings restantes.
- Rediseño completo del viewer antes del refactoring de parser.
- Pruebas formales de responsive como etapa independiente.
- Migración de `liked` como funcionalidad.
- Cambios generales dentro de `src/@fuse` salvo integraciones estrictamente necesarias.

## Orden de cierre para reemplazar producción

1. Completar la visualización de songbooks y auditar/migrar los datos Firebase, especialmente `relations`.
2. Completar etiquetas.
3. Completar administración de songbooks.
4. Revisar y refactorizar el ecosistema `chordpro-parser`/viewer, incluyendo transposición, viewer, diagramas y tuner.
5. Revisar y refactorizar `chordproject-editor`, incluyendo la ayuda basada en reglas ChordPro.
6. Preparar builds y branding separados para HomenaJesus y ChordProject.
7. Comparar y versionar Firebase Rules.
8. Probar ambos dominios en staging.
9. Ejecutar la migración progresiva con rollback disponible.
10. Crear el testing básico posterior.
11. Retirar gradualmente la aplicación antigua.
