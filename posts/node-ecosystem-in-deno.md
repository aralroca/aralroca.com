---
title: Node ecosystem in Deno
created: 05/17/2020
description: Learn how to use Node ecosystem in Deno.
tags: node, deno, javascript
cover_image: /images/cover-images/10_cover_image.jpg
cover_image_mobile: /images/cover-images/10_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/10_cover_image_vert.jpg
cover_color: '#353133'
---

Last week I published an article about Deno, and how to create a [Chat app with Deno and Preact](https://aralroca.com/blog/learn-deno-chat-app). Since then, many doubts have arisen. Most of the doubts about Deno are about how to do the same thing we did in Node, but with the new Deno ecosystem.

In this article I try to collect some of the most used topics in Node, and look for their alternative with Deno. First of all, I would like to make it clear that we can use many of the current Node.js modules. There is no need to look for an alternative for everything, as many modules are reusable. You can visit [pika.dev](https://www.pika.dev/about) to look for modules to use in Deno. That said, we start with the list:

**We will cover the following:**

* [Electron](#electron)
* [Forever / PM2](#forever--pm2)
* [Express / Koa](#express--koa)
* [MongoDB](#mongodb)
* [PostgresSQL](#postgressql)
* [MySQL / MariaDB](#mysql--mariadb)
* [Redis](#redis)
* [Nodemon](#nodemon)
* [Jest, Jasmine, Ava...](#jest-jasmine-ava)
* [Webpack, Parcel, Rollup...](#webpack-parcel-rollup)
* [Prettier](#prettier)
* [NPM Scripts](#npm-scripts)
* [Nvm](#nvm)
* [Npx](#npx)
* [Run on a Docker](#run-on-a-docker)
* [Run as a lambda](#run-as-a-lambda)
* [Conclusion](#conclusion)

## Electron

With Node.js we can create desktop applications using [Electron](https://github.com/electron/electron). Electron uses Chromium as interface to run a web environment. But, we can use electron with Deno? Are there alternatives?

<img src="/images/blog-images/55.png" alt="Electron logo" class="center transparent keepcolor" />

Well, right now Electron is far from being able to be executed under Deno. We must look for alternatives. So since Deno is made with Rust, we can use [web-view rust bindings](https://github.com/Boscop/web-view) to run Destkop application in Deno.

This way, we can use the native OS webview. And run as many webviews as we want.

**Repo**: https://github.com/eliassjogreen/deno_webview

```js
import { WebView } from "https://deno.land/x/webview/mod.ts";

const sharedOptions = {
  width: 400,
  height: 200,
  resizable: true,
  debug: true,
  frameless: false,
};

const webview1 = new WebView({
  title: "Multiple deno_webview example",
  url: `data:text/html,
    <html>
    <body>
      <h1>1</h1>
    </body>
    </html>
    `,
  ...sharedOptions,
});

const webview2 = new WebView({
  title: "Multiple deno_webview example",
  url: `data:text/html,
    <html>
    <body>
      <h1>2</h1>
    </body>
    </html>
    `,
  ...sharedOptions,
});

await Promise.all([webview1.run(), webview2.run()]);
```

<img src="/images/blog-images/40.jpg" alt="Deno desktop app" class="center" />
<br />


## Forever / PM2

[Forever](https://github.com/foreversd/forever) and [PM2](https://github.com/Unitech/pm2) are CLI tools for ensuring that a given script runs continuously as a daemon. PM2 unlike forever is more complete, as it also serves as a load balancer. Both are very useful in Node, but can we use them in Deno?

Forever is intended for Node only, so using Forever is not feasible with Deno. However, with PM2 we can run non-node scripts, so we could still use PM2 for Deno.

<img src="/images/blog-images/56.png" alt="PM2 logo" class="center transparent keepcolor" />

Creating an `app.sh` file

```bh
#!/bin/bash
deno run -A myCode.ts
```

And

```
➜ pm2 start ./app.sh 
```

<br />
<img src="/images/blog-images/41.png" alt="Running Deno with PM2" class="center" />
<br />

## Express / Koa

[Express](https://github.com/expressjs/express) and [Koa](https://github.com/koajs/koa) are the best known Node frameworks. They're known for their robust routing system and their HTTP helpers (redirection, caching, etc). Can we use them in Deno? The answer is not... But there are some equivalents.

<br />
<img src="/images/blog-images/42.png" alt="Express and Koa logo" class="center transparent" />


### Http (std lib)

Deno's own STD library already covers many of the needs provided by Express or Koa. https://deno.land/std/http/.

```js
import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { getCookies } from "https://deno.land/std/http/cookie.ts";

let request = new ServerRequest();
request.headers = new Headers();
request.headers.set("Cookie", "full=of; tasty=chocolate");

const cookies = getCookies(request);
console.log("cookies:", cookies);
```

However, the way of declaring routes is not very attractive. So let's look at some more alternatives.

### Oak (Third party lib)

One of the most elegant solutions right now. It's very inspired by Koa. https://github.com/oakserver/oak

```js
import { Application,  } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });
```

### Abc (Third party lib)

Similar to Oak. https://deno.land/x/abc.

```js
import { Application } from "https://deno.land/x/abc/mod.ts";

const app = new Application();

app.static("/static", "assets");

app.get("/hello", (c) => "Hello!")
  .start({ port: 8080 });
```

### Deno-express (Third party lib)

Maybe the most similar alternative to Express Framework. https://github.com/NMathar/deno-express.

```js
import * as exp from "https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts";

const port = 3000;
const app = new exp.App();

app.use(exp.static_("./public"));
app.use(exp.bodyParser.json());

app.get("/api/todos", async (req, res) => {
  await res.json([{ name: "Buy some milk" }]);
});

const server = await app.listen(port);
console.log(`app listening on port ${server.port}`);
```

## MongoDB

[MongoDB](https://github.com/mongodb/mongo) is a document database with a huge scability and flexibility. In the Javascript ecosystem has been widely used, there are many stacks like MEAN or MERN that use it. So it's very popular.

<br />
<img src="/images/blog-images/43.png" alt="MongoDB logo" class="center transparent keepcolor" />

So yes, we can use MongoDB with Deno. For this, we can use this driver: https://github.com/manyuanrong/deno_mongo.

```js
import { init, MongoClient } from "https://deno.land/x/mongo@v0.6.0/mod.ts";

// Initialize the plugin
await init();

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

const db = client.database("test");
const users = db.collection("users");

// insert
const insertId = await users.insertOne({
  username: "user1",
  password: "pass1"
});

// findOne
const user1 = await users.findOne({ _id: insertId });

// find
const users = await users.find({ username: { $ne: null } });

// aggregation
const docs = await users.aggregation([
  { $match: { username: "many" } },
  { $group: { _id: "$username", total: { $sum: 1 } } }
]);

// updateOne
const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
  username: { $ne: null },
  { $set: { username: "USERNAME" } }
);

// deleteOne
const deleteCount = await users.deleteOne({ _id: insertId });
```

## PostgresSQL

<img src="/images/blog-images/44.png" alt="PostgresSQL logo" class="center transparent keepcolor" />

Like MongoDB, there is also a driver for [PostgresSQL](https://github.com/postgres/postgres/). 

* https://github.com/buildondata/deno-postgres.

```js
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "user",
  database: "test",
  hostname: "localhost",
  port: 5432
});
await client.connect();
const result = await client.query("SELECT * FROM people;");
console.log(result.rows);
await client.end();
```

## MySQL / MariaDB

<img src="/images/blog-images/45.png" alt="MySQL and MariaDB logo" class="center transparent keepcolor" />

Same way as MongoDB and Postgress, there is also a driver for [MySQL](https://github.com/mysqljs/mysql) / [MariaDB](https://github.com/mariadb-corporation/mariadb-connector-nodejs).

* https://github.com/manyuanrong/deno_mysql

```js
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  poolSize: 3, // connection limit
  password: "password",
});

let result = await client.execute(`INSERT INTO users(name) values(?)`, [
  "aralroca",
]);
console.log(result);
// { affectedRows: 1, lastInsertId: 1 }
```

## Redis

<img src="/images/blog-images/46.png" alt="Redis logo" class="center transparent keepcolor" />

[Redis](https://github.com/NodeRedis/node-redis), the best known database for caching, also has a driver for use in Deno.

* https://github.com/keroxp/deno-redis

```js
import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379
});
const ok = await redis.set("example", "this is an example");
const example = await redis.get("example");
```


## Nodemon

<img src="/images/blog-images/47.png" alt="Nodemon logo" class="center transparent keepcolor" />

[Nodemon](https://github.com/remy/nodemon) is used in develpment environment to monitor for any changes in your files, and it automatically restart the server. This makes node development much more enjoyable, without having to manually stop and restart the server to see the applied changes. Can be used in Deno? Or is there an alternative?

Sorry, but you can't use Nodemon on Deno... but as an alternative, there's Denon.

* https://github.com/eliassjogreen/denon

We can use Denon in a similar way that we use `deno run` to execute scripts.

```
➜ denon server.ts
```

## Jest, Jasmine, Ava...

<img src="/images/blog-images/48.png" alt="Jasmine, Jest, Ava, Mocha logos" class="center" />

In the Node.js ecosystem there are a lot of alternatives for test runners. However, there isn't one official way to test the Node.js code.

In Deno, there is an official way. So you can use the testing std library.

* https://deno.land/std/testing

```js
import { assertStrictEq } from 'https://deno.land/std/testing/asserts.ts'

Deno.test('My first test', async () => {
  assertStrictEq(true, false)
})
```

And to run the tests:

```
➜  deno test
```

## Webpack, Parcel, Rollup...

<img src="/images/blog-images/52.png" alt="Webpack, Parcel, Rollup logos" class="center transparent keepcolor" />

One of the strengths of Deno is that we can use esmodules with TypeScript without the need for a bundler such as [Webpack](https://github.com/webpack/webpack), [Parcel](https://github.com/parcel-bundler/parcel) or [Rollup](https://github.com/rollup/rollup).

However, probably we have asked ourselves that if given a tree of files, we can make a bundle to put everything in one file. This way, we can take this file and run it on the web.

Well, to do this, we can do it with Deno's CLI. So there's no need for a third-party bundler.

```
➜ deno bundle myLib.ts myLib.bundle.js
```
And it's ready to be loaded on the web:

```html
<script type="module">
  import * as myLib from "myLib.bundle.js";
</script>
```

## Prettier

<img src="/images/blog-images/49.png" alt="Prettier logo" class="center transparent keepcolor" />

In the last few years [Prettier](https://prettier.io/) has become quite well known within the JavaScript ecosystem to don't have to worry about file formats.

And the truth is, it can still be used on Deno. But it loses its meaning a little bit, because Deno already has a formatter.

You can format your files using this command:

```
➜  deno fmt
```

## NPM Scripts

<img src="/images/blog-images/50.png" alt="Npm scripts logo" class="center transparent" />

Now with deno, the `package.json` no longer exists. So at least I, one of the things I miss are the scripts that were declared in the `package.json`.

The simple solution is to use a `makefile` and execute with `make`. However, if you miss the npm syntax, there is an npm-style script runner for Deno:

* https://github.com/umbopepato/velociraptor

So you can define a file with your scripts:

```yaml
# scripts.yaml
scripts:
  start: deno run --allow-net server.ts
  test: deno test --allow-net server_test.ts
```
 
And Execute with:

```
➜  vr run <SCRIPT>
```

Another alternative is [denox](https://github.com/BentoumiTech/denox). Very similar to velociraptor.


## Nvm

<img src="/images/blog-images/51.png" alt="Version semantics" class="center transparent" />

[Nvm](https://github.com/nvm-sh/nvm) is a CLI to manage multiple active Node versions. To easy upgrade or downgrade versions depending on your projects.

One `nvm` equivalent in Deno is `dvm`.

* https://github.com/axetroy/dvm

```bh
➜  dvm use 1.0.0
```

## Npx

[Npx](https://github.com/npm/npx) in recent years has become very popular for executing npm packages without having to install them. Now with Deno there will be many projects that will not exist within npm because it's a separate ecosystem. So how can we execute Deno modules without having to install them with `deno install https://url-of-module.ts`?

In the same way that we run our project, instead of a file, we can put the URL of the module:

```
➜  deno run https://deno.land/std/examples/welcome.ts
```

The difference is that not only do we have to remember the name of the module, but we have to remember the whole URL, which makes it a little more difficult to use.

But at the same time it gives a lot more flexibility as we can run any file, not just what is specified as a binary in the `package.json` like `npx`.

## Run on a Docker

<img src="/images/blog-images/53.png" alt="Docker logo" class="center transparent keepcolor" />

To run Deno inside a Docker, we can create this Dockerfile:

```dockerfile
FROM hayd/alpine-deno:1.0.0

EXPOSE 1993  # Port.

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts # Cache the deps

ADD . .
RUN deno cache main.ts # main entrypoint.

CMD ["--allow-net", "main.ts"]
```

And to build + run it:

```
➜  docker build -t app . && docker run -it --init -p 1993:1993 app
```


Repo: https://github.com/hayd/deno-docker

## Run as a lambda

<img src="/images/blog-images/54.png" alt="Lambda symbol" class="center transparent" />

To use Deno as a lambda, there is a module of the Deno STD library. https://deno.land/x/lambda.

```ts
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return {
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
    headers: { "content-type": "text/html;charset=utf8" },
    statusCode: 200
  };
}
```

Interesting references:

* Deno in Vercel: https://github.com/lucacasonato/now-deno
* Deno in AWS: https://blog.begin.com/deno-runtime-support-for-architect-805fcbaa82c3

## Conclusion

I'm sure that I forgot to add some Node libs and their Deno alternative. But I hope that with this article I have broken the barrier with Deno, and you give it a chance.

Explore all libraries for Deno:

* https://deno.land/std
* https://deno.land/x
* https://www.pika.dev/
