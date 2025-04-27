<div align="center">
    <img src=".assets/logo.svg" height="250px">
    <h1>Scribere</h1>
    <a href="https://app.scribere.sh"><em>app.scribere.sh</em></a>
</div>

<br />

**Table of Contents**

- [Tools](#tools)
- [Libraries](#libraries)
  - [**Svelte + SvelteKit**](#svelte--sveltekit)
  - [**TailwindCSS v4**](#tailwindcss-v4)
  - [**Elysia + Eden + Tanstack Svelte Query**](#elysia--eden--tanstack-svelte-query)
  - [**Drizzle ORM**](#drizzle-orm)
- [Development](#development)
- [Building](#building)
- [Note to aliases](#note-to-aliases)

<br />

> [!NOTE]
> This is an assesment for our [Bachelors in Software Engineering (BSE)](https://www.yoobee.ac.nz/courses/technology/bachelor-of-software-engineering) at [Yoobee College of Creative Innovation](https://www.yoobee.ac.nz/).
>
> As such this repository is under the MIT License as a learning resource.

<br />

### Tools

This program application is built to run on [Cloudflare Workers](https://workers.cloudflare.com/) and uses [Bun](https://bun.sh/docs) as a package manager (due to the simplicity of installing it on the Yoobee devices without admin permissions).

**In order to run this application you will need to [install bun](https://bun.sh/docs/installation).**

### Libraries

In order to make life simpler, this application is built upon the following technology stack

#### **Svelte + SvelteKit**

For the creation of re-useable components that are able to compile to very efficient JavaScript. Also provides a meta-framework upon which to structure the application.

#### **TailwindCSS v4**

In order to rapidly develop and prototype this solution, we need a way to quickly update styles and components. TailwindCSS is perfect for this with its utility-class based system

#### **Elysia + Eden + Tanstack Svelte Query**

While the [SvelteKit](#svelte--sveltekit) meta-framework is great for structuring a UI-based applications, it's very verbose and featureless when it comes to the creation of APIs, this is why the `/api` endpoint gets handled by an [Elysia](http://elysiajs.com/) Application.

In combination with it's [Eden](https://elysiajs.com/eden/overview.html) system, this creates an RPC-like system that makes our life significantly easier as we get end-to-end typing without needing to inflate the size of the end-product (which is a downside of [tRPC](https://trpc.io)).

[Tanstack Svelte Query](https://tanstack.com/query/latest/docs/framework/svelte/overview) is a library for providing deduplication, error handling, data invalidation, caching, refetching, and many more things. It allows our application to feel more reactive than could be realistically achieved without such a system.

#### **Drizzle ORM**

[Drizzle](https://orm.drizzle.team) is an ORM (Object Relation Mapping) library that allows us to manage an ever-evolving database schema and query our database with full output types.

It provides a comprehensive toolset and is for the most part, database agnostic, simplifying any process of migration down the line in necessary.

### Development

Getting a useable development environment is a simple process.

1. **Create `.env` file**

   Make a copy of the [`.env.example`](./.env.example) file and rename it to `.env`. This file is well documented and will explain what values you need to put here.

   This file **MUST** never be checked into source control or shared with anyone else as it contains API Keys.

2. **Install Dependencies**

   Run `bun install` to download all dependencies for this project and save them to the `node_modules` folder.

   The installation process is slow at first but Bun has some incredible [caching techniques](https://bun.sh/docs/install/cache) and subsequent installations will be significantly faster.

3. **Start Development Server**

   Run `bun dev` to start the development server, on first run this will take a bit to warm up the build caches, but ones that's sorted a TUI will appear with the URL to access the application with.

### Building

Since this is application is built to be a Cloudflare worker, most actual building is done by Cloudflare Automatically.

However if you would like to test how cloudflare would run it locally, we can simulate a production environment with `wrangler` and `workerd`. To do this you must first install wrangler

<details>
<summary><strong>Install & Setup <code>wrangler</code></strong></summary>

<br/>

Assuming you're using Bun for this project, you can install wrangler globally using the following command.

```sh
bun install -g wrangler
```

Once that is setup you will need to login to Cloudflare using the following command

```sh
wrangler login
```

Once this is complete, you can continue with the production simulation

<br/>

</details>

To build this program simply run the following command which will build the application using Vite.

```sh
bun run build
```

You can then run wrangler to start the local cloudflare worker environment with this command

```sh
wrangler dev
```

> [!WARNING]
> This will connect to the production R2 Instance and Production ARGON2 worker.

### Note to aliases

This repository contains a bunch of aliases to make some otherwise long import paths much shorter. For the most part these are useable, but `drizzle-kit` doesn't understand them. As such they may not be used within `./src/lib/server/db`.

Anywhere else they should work just fine.

- `$ui` &rarr; `./src/lib/components/ui`

  Reusable UI Components

- `$blk` &rarr; `./src/lib/components/blocks`

  Single use block components that need a place to stay

- `$srv` &rarr; `./src/lib/server`

  Server-only modules, importing these into client code will trigger an error.

- `$tb` &rarr; `./src/lib/server/db/schema`

  DrizzleORM table objects, use these querying the database.
