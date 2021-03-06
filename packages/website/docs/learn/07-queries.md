---
id: queries
title: Queries
---
## Standard Queries

Until now, when requesting nodes we've been using the simple `ref()` node to request a single value at a time from our graph. To avoid duplicating code with several `ref()` nodes, the `query()` node comes in handy. It's a node that is used when making a query for multiple pieces of data, arranged in a tree-like structure. Let's start small:
```javascript
import muster, { query, root } from '@dws/muster';

const app = muster({
  firstName: 'Bob',
  lastName: 'Smith',
  age: 25,
});

const result = await app.resolve(query(root(), {
  firstName: true,
  lastName: true,
}));
console.log(result);

// Console output:
// { firstName: 'Bob', lastName: 'Smith' }
```
In this example, the `query()` node only requests a subset of the full Muster graph, the `firstName` and `lastName` branches.

The `query()` node is constructed by first providing the root node of the query - in this case we use a `root()` node. The `root()` node serves as a kind of meta-node which always resolves to the top-most node of the application graph. In this example the `root()` node resolves to:

```javascript
tree({
  firstName: value('Bob'),
  lastName: value('Smith'),
  age: value(25),
})
```

The root of the `query()` node can also be set to any other node to define the top-level branch to query from.


The second argument of `query()` is a node that defines the shape of nodes to extract. Some [implicit conversion](/muster/docs/understanding-muster/explicit-definition#explicit-query-definitions) is performed to keep the syntax as legible as possible.

The query we ended up creating informs Muster that we'd like to load `firstName` and `lastName` from the root of our graph fields. These fields should first resolve to a non-error node that doesn't implement `evaluate` operation.

## Nested Queries

A `query()` node can also be used when loading nested data structures from the graph:

```javascript
import muster, { computed, query, ref, root } from '@dws/muster';

const app = muster({
  user: {
    age: 25,
    firstName: 'Bob',
    lastName: 'Smith',
    fullName: computed(
      [ref('user', 'firstName'), ref('user', 'lastName')],
      (firstName, lastName) => `${firstName} ${lastName}`,
    ),
  },
});

const result = await app.resolve(query(root(), {
  user: {
    age: true,
    fullName: true,
  },
}));
console.log(result);

// Console output:
// {
//   user: {
//     age: 25,
//     fullName: 'Bob Smith',
//   },
// }
```

The query constructed requests two fields (`age` and `fullName`) from the `user` tree, which can be observed in the result received from Muster.

Again, in the previous example, the `query()` node created uses a `root()` node as the root of the query, but now that there is nesting in the graph the query could be rewritten to use `user` as the starting point:

```javascript
import muster, { computed, query, ref } from '@dws/muster';

const app = muster({
  user: {
    age: 25,
    firstName: 'Bob',
    lastName: 'Smith',
    fullName: computed(
      [ref('user', 'firstName'), ref('user', 'lastName')],
      (firstName, lastName) => `${firstName} ${lastName}`,
    ),
  },
});

const result = await app.resolve(query(ref('user'), {
  age: true,
  fullName: true,
}));
console.log(result);

// Console output:
// {
//   age: 25,
//   fullName: 'Bob Smith',
// }
```

The `query()` node created in this example sets is root as `ref('user')`, which means that the `fields` part of the query now is defined relative to the `user` branch. Also, note that the output no longer has the `user: {}` object, and that the `age` and `fullName` properties are present directly inside the top-level object.


## Omitting Non-Values

In the event that a query you make is likely to return an object with `nil`, `null` or `undefined` values, it is possible to opt-in to omit any of these values using the `omitNils` flag.

```javascript
import muster, { nil, query, ref } from '@dws/muster';

const app = muster({
  users: {
    admin: {
      firstName: 'Bob',
      lastName: 'Smith'
    },
    unknown: {
      firstName: nil(),
      lastName: nil()
    }
  }
});

const resultWithNils = await app.resolve(query(ref('users', 'unknown'),
  { firstName: true, lastName: true }
));
console.log(resultWithNils);

// Console output:
// {
//   firstName: undefined,
//   lastName: undefined
// }

const resultWithoutNils = await app.resolve(query(ref('users', 'unknown'),
{ firstName: true, lastName: true },
{ omitNils: true }
));
console.log(resultWithoutNils);

// Console output:
// undefined
```

In this example, when the `omitNils` flag is added, any branch of the tree that evaluates to `undefined` is truncated from the query results. The first query without the `omitNils` flag returns the shape of the object with `undefined` values, whereas the second query with the flag enabled only returns `undefined` as there are no values to return.

In the instance that there are some child values that are `undefined` but not all, `omitNils` works as follows:

```javascript
import muster, { nil, query, ref } from '@dws/muster';

const app = muster({
  users: {
    unknown: {
      firstName: 'Bob',
      lastName: nil()
    }
  }
});

const resultWithNils = await app.resolve(query(ref('users', 'unknown'),
  { firstName: true, lastName: true },
  { omitNils: true }
));
console.log(resultWithNils);

// Console output:
// {
//   firstName: "Bob",
//   lastName: undefined
// }
```

In this example, the `omitNils` flag does not remove the undefined values from the shape of the object returned.