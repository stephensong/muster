---
id: version-6.6.3-muster-lazy-loading
title: Lazy loading graphs
original_id: muster-lazy-loading
---

If you want to take advantage of features like [code-splitting][1] and [lazy loading][2], Muster is built for it right out of the box. Because all Muster paths are lazy by default, nodes are not resolved and invoked until something makes a request for their data. Combine this with the [dynamic `import()` method][3], and you can parcel out whole chunks of your graph into standalone files, and only load them when required.

> This tutorial presumes you're using Webpack 4+

## App setup

Imagine you have a root graph in your application, which imports some nicely separated subgraphs which describe other modules and entities.

```javascript
import muster from '@dws/muster';

import { auth } from './auth';
import { navigation } from './navigation';
import { users } from './users';
import { orders } from './orders';
import { admin } from './admin';
// ...etc

export default function root() {
  return muster({
    auth,
    navigation,
    users,
    orders,
    admin,
    // ...etc
  });
}
```  

Let's say most of those modules are cross-cutting, but the `admin` graph is only relevant if the user visits the `/admin` section. `admin.js` itself is a simple graph definition:

```javascript
import { action, scope } from '@dws/muster-react';

export const admin = scope({
  lockUser: action(/* ...etc... */),
  // ...etc
});
```

## Dynamic import

Most users won't visit `/admin`, so let's only load it when it's required. We remove the `import` statement at the top of the file, and replace it with a dynamic `import()` within the graph definition, wrapped in a `fromPromise()`. This `import()` won't be executed until something requests data from within the `admin` path.

```javascript
import muster, { fromPromise } from '@dws/muster';

import { auth } from './auth';
import { navigation } from './navigation';
import { users } from './users';
import { orders } from './orders';
// import { admin } from './admin';

export default function root() {
  return muster({
    auth,
    navigation,
    users,
    orders,
    admin: fromPromise(() =>
      import('./admin').then(({ admin }) => admin),
    ),
  });
}
```  

> It's important to note that the `admin.js` graph exports a `scope`. If you're not exporting a `scope` or a `module` (from `createModule()`), merely a plain object definition, you'll need to wrap your import in a `toNode()` to ensure it's not returned as a simple value. 

## That's it!

The contents of `admin.js` will now only be loaded and evaluated when something requests data from within that branch. If you want to look into preloading or prefetching modules (as well as using `webpackChunkName` to give your chunks semantic names), check out the [webpack docs][4].


[1]: https://webpack.js.org/guides/code-splitting/
[2]: https://webpack.js.org/guides/lazy-loading/
[3]: https://webpack.js.org/guides/code-splitting/#dynamic-imports
[4]: https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules
