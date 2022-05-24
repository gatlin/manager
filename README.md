Manager
===

(c) 2021 &mdash; present, Gatlin Johnson <gatlin@niltag.net>.

overview
===

Manager lets you control [lit components][litsite] with
[robot finite state machines][robotsite].
[(Read more about Lit's "reactive controllers" here.)][reactivecontroller]

The best introduction I can think of is simply to take a look at the included
[example web component](example-component.ts).
See below for information on building the example.

building
===

Before you can do anything else, make sure you first install Manager's
dependencies:

```shell
npm i
```

just the `Manager` library
---

This will only build the actual `Manager` controller and not the example
component (eg, the proper behavior when being installed by a client project).

```shell
npm run build
```

demo
---

To try out the [example component][examplecomponent], run:

```shell
npm run example
```

Then visit http://localhost:8000/ in your [favorite browser][firefox].

Issues / Questions / Concerns
===

You may file reports using GitHub's Issues feature, or you may email me:
<gatlin+manager@niltag.net>.

[litsite]: //lit.dev
[robotsite]: //thisrobot.life
[reactivecontroller]: https://lit.dev/docs/composition/controllers/
[examplecomponent]: example-component.ts
[firefox]: //getfirefox.com
