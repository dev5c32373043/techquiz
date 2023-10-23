# Nuxt 3 Hello world

TechQuiz is a platform designed to assess the technical skills and knowledge of developers.
It is built using [Nuxt 3][nuxt] and [MongoDB][mongo].

[preview](https://github.com/dev5c32373043/techquiz/assets/13788002/182641ac-e0bf-4dcf-a7b6-36b0c4976a56)


## Getting started

To start the project install all dependencies in requirements section.
Add `.env` or `.env.local` file (`.env.example` as an example)
In order for MongoDB transactions to work you'll need to setup a replica set or sharded cluster or use [MongoDB Atlas](https://www.mongodb.com/atlas)

```bash
npm install && npm run dev
```

## Requirements

- [Node.js][node] 18.16.0+
- [MongoDB][mongo] 5.0.2+

[node]: https://nodejs.org/
[nuxt]: https://nuxt.com/
[mongo]: https://www.mongodb.com/

### Known Issues

- Member responses store unnecessary data
- The CodeEditor is too large in size due to highlight.js
- Additionally, I left some bugs and glitches here and there for you to find :)
