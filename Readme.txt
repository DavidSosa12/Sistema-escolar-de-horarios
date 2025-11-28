Este programa es una aplicación web que permite visualizar, gestionar y actualizar los horarios de clases y actividades especiales (como charlas de orientación) para diferentes grupos escolares.

Está diseñado para ser fácil de usar por cualquier persona, incluso si no tiene conocimientos técnicos.

Contenido del sistema
La aplicación está formada por los siguientes archivos:

index.html – Interfaz principal del sistema
styles.css – Estilos y diseño visual
horarios.js – Datos iniciales y estructura base
app.js – Lógica principal del sistema (funcionalidad)

¿Cómo abrir el programa?
Descarga la carpeta completa del proyecto.
Abre la carpeta con Visual Studio Code (o cualquier editor).
Haz doble clic en el archivo index.html.
Se abrirá la aplicación en tu navegador.
No necesita instalación ni internet.
Funciona completamente de manera local.

¿Qué permite hacer este sistema?
Ver horarios por grupo
Selecciona un grupo (como 1A, 1B, 2A, etc.) y verás su horario de clases por día.

Ver actividades de un día específico
También puedes elegir una fecha y se mostrará el horario exacto de ese día.

Editar el horario
Puedes modificar las actividades:

Cambiar eventos
Cambiar lugar
Cambiar la hora
Añadir nuevas actividades

Evitar choques de horario
El sistema detecta automáticamente si se intenta asignar otra actividad en el mismo horario y te pregunta si deseas reemplazarla.

Añadir charlas del orientador
Desde la opción "Agregar actividad", puedes asignar una de las charlas obligatorias:

Charla 1 del orientador
Charla 2 del orientador
Charla 3 del orientador

Evita duplicar charlas
Si intentas agregar una charla que ese grupo ya recibió:

El sistema mostrará que ya fue impartida
También mostrará fecha, hora y lugar en que se impartió
No dejará duplicarla

Apartado para ver charlas impartidas y disponibles
Debajo de las actividades aparece:

Charlas disponibles (las que ese grupo todavía no recibe)
Charlas impartidas (con fecha, hora y lugar)
Ambas en tarjetas tipo “cards” fáciles de entender.

Cómo usar cada función
Seleccionar grupo
En la parte superior hay un menú desplegable.
Solo elige el grupo y automáticamente se cargará su información.

Elegir fecha
Elige una fecha para ver el horario de ese día.
Si esa fecha no tiene actividades, aparecerá vacía.

Editar actividades
Presiona el botón Editar este día y podrás:
Cambiar actividades ya existentes
Eliminar actividades
Agregar nuevas actividades

Agregar una actividad
Dentro del panel de edición:

Escribe la hora
Escribe el evento (como "Clase de español" o "Charla 1 del orientador")
Escribe el lugar
Toca Agregar actividad

El sistema validará:

Que no haya otra actividad en ese mismo horario
Si es charla, si ya fue impartida antes

Charlas del orientador
Debajo de las actividades, verás:

Charlas disponibles
Las que aún se pueden asignar a ese grupo.

Charlas impartidas
Con:

Fecha
Hora
Lugar

Estas se generan automáticamente al asignar una charla.
