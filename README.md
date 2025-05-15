# Proyecto Final Frontend

Esta aplicación es una Pokedex interactiva que permite a los usuarios buscar y explorar información sobre diferentes Pokémon. Ahora, toda la comunicación de datos se realiza exclusivamente a través del backend propio, el cual centraliza las llamadas a PokeAPI y la API de sprites de Pokémon.

## Arquitectura y conexión

- El frontend **no realiza llamadas directas a PokeAPI** ni a la API de sprites. Todas las solicitudes (Pokémon, usuarios, registro, login, etc.) se hacen al backend propio.
- El backend se encarga de obtener los datos de PokeAPI y de la API de sprites, y los expone mediante endpoints propios.
- El frontend utiliza el archivo `src/utils/MainApi.js` para gestionar todas las llamadas al backend.

## Link de acceso

- [Coloca aquí el link de despliegue del frontend]

## Capturas del Proyecto

A continuación, se presentan algunas capturas de pantalla del proyecto:

![Captura 1](./src/assets/images/capturaproject1.png)
![Captura 2](./src/assets/images/capturaproject2.png)
![Captura 3](./src/assets/images/capturaproject3.png)
![Captura 4](./src/assets/images/capturaproject4.png)
![Captura 5](./src/assets/images/capturaproject5.png)
![Captura 6](./src/assets/images/capturaproject6.png)

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para proyectos web modernos.
- **CSS**: Utilizado para el diseño y estilo de la aplicación.
- **JavaScript (ES6+)**: Lenguaje de programación principal.
- **PokeAPI**: API utilizada para obtener datos de los Pokémon.

## Propiedades de CSS

El proyecto utiliza las siguientes propiedades de CSS para el diseño y estilo:

- Flexbox y Grid para la disposición de los elementos.
- Variables CSS para mantener consistencia en colores y fuentes.
- Media queries para diseño responsivo.
- Animaciones y transiciones para mejorar la experiencia del usuario.

## Estructura del Proyecto

El proyecto está organizado en componentes reutilizables dentro de la carpeta `src/components`. Cada componente tiene su propio archivo `.jsx` y `.css`.

## Dependencias

- **react**: ^18.0.0
- **react-dom**: ^18.0.0
- **vite**: ^4.0.0

## Dependencias de Desarrollo

- **@vitejs/plugin-react**: ^4.0.0
- **eslint**: ^8.0.0
- **eslint-config-react-app**: ^7.0.0

## Cómo Ejecutar el Proyecto

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Inicia el servidor de desarrollo con `npm run dev`.
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
