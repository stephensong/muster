---
id: muster-cookbook
title: Muster Cookbook
---

The goal of this page is to collect useful snippets you can adapt and use in your apps. These snippets are for pure Muster. They're designed in a way which should allow you to quickly adapt them to your requirements.

## Get a single item from a filtered collection

The following code shows how to get a single item from a filtered collection. The filter used in this example can be adapted to your needs.

```js
import muster, {
  applyTransforms,
  filter,
  get,
  head,
  query,
  ref,
  startsWith,
  variable
} from '@dws/muster';

// Create Muster graph with an example collection
const app = muster({
  todos: [
    {
      id: 1,
      description: 'Do first thing',
      completed: variable(false)
    },
    {
      id: 2,
      description: 'Do second thing',
      completed: variable(false)
    },
    {
      id: 3,
      description: 'Do third thing',
      completed: variable(false)
    }
  ]
});

// Find the item with a description that starts with 'Do second'
await app.resolve(
  query(
    head(
      applyTransforms(ref('todos'), [
        filter((item) =>
          startsWith('Do second', get(item, 'description'))
        )
      ])
    ),
    {
      id: true,
      description: true,
      completed: true
    }
  )
);
// === {
//   id: 2,
//   description: 'Do second thing',
//   completed: false,
// }
```

The first part of the example includes imports, and a declaration of a Muster graph. Below that we resolve a `query()` node (used here just to get specific branches of the returned node). The target for that `query()` is a construct that allows us to get the first item from the filtered collection. The filter we used here checks if the description of the item in question starts with `'Do second'`, but you can change the filter to anything you want.

## Remove a specific item from a collection

The code below shows how to remove a single item from a collection that matches specific criteria:

```js
import muster, {
  and,
  applyTransforms,
  arrayList,
  eq,
  filter,
  get,
  head,
  ref,
  removeItem
} from '@dws/muster';

// Create Muster graph with an example collection
const app = muster({
  people: arrayList([
    { firstName: 'Bob', lastName: 'Smith' },
    { firstName: 'Kate', lastName: 'Doe' }
  ])
});

// Remove a person with firstName='Bob' and lastName='Smith'
await app.resolve(
  removeItem(
    ref('people'),
    head(
      applyTransforms(ref('people'), [
        filter((person) =>
          and(
            eq(get(person, 'firstName'), 'Bob'),
            eq(get(person, 'lastName'), 'Smith')
          )
        )
      ])
    )
  )
);
```

In this particular example the person we'd like to remove has `firstName = 'Bob'` and `lastName = 'Smith'`, but you can adapt the filter to something that suits your requirements.

## Perform an operation on each item from a collection - forEach()

This recipe demonstrates how to run an operation on each item from a collection. It behaves in a similar way to the `forEach()` from lodash.
This particular recipe goes through every item on our todos collection and sets `completed` to `true`, but you can easily adapt the code to do other things as well.

```js
import muster, {
  applyTransforms,
  entries,
  get,
  map,
  query,
  ref,
  set,
  variable
} from '@dws/muster';

// Create Muster graph with an example collection
const app = muster({
  todos: [
    {
      id: 1,
      description: 'Do first thing',
      completed: variable(false)
    },
    {
      id: 2,
      description: 'Do second thing',
      completed: variable(false)
    },
    {
      id: 3,
      description: 'Do third thing',
      completed: variable(false)
    }
  ]
});

// Set every task as completed
// We don't really care about the result of resolving this node, but just about its effect on the items of the collection
await app.resolve(
  query(
    applyTransforms(ref('todos'), [
      map((item) => set(get(item, 'completed'), true))
    ]),
    entries()
  )
);
```

At the beginning of the example we define a sample collection of todos. Once the Muster graph is ready we resolve a node which should go and set every item as completed.

Let's start by looking first at a definition of the `applyTransforms()` node used as part of that `query()` node. The source for that collection is a `ref()` that points to the todos collection in the application graph. Then we define an array of transforms to do on that collection, which contains a single transform - `map()`. This transform maps every item to a `set()` node. On its own resolving such collection wouldn't do much, as Muster wouldn't actually resolve these `set()` nodes:

```js
// This won't work, as the applyTransforms() node doesn't support evaluate operation, and in this case the collection would get returned unchanged.
await app.resolve(
  applyTransforms(ref('todos'), [
    map((item) => set(get(item, 'completed'), true))
  ])
);
```

This is why we had to wrap the `applyTransforms()` node in a `query()` node with `entries()`. This lets Muster know that it should resolve the node as a collection, and that it should also resolve each item to a static node. Due the fact that the `set()` nodes returned from the `map()` transform are not static, Muster will try resolving them, which causes the `completed` variable to be set to `true`.

One thing to note is that the result of that query is actually an `array()` node with following values: `array([true, true, true])`, cos that's a result of the `set()` node for each item.

## Using relative references inside collection items

Muster comes bundled with a `relative()` utility which when combined with `ref()` node allows accessing siblings of a given node. It might not be that obvious, but this pattern can also be used inside a collection item. This recipe serves to illustrate this particular use case:

```js
import muster, {
  computed,
  entries,
  query,
  ref,
  relative
} from '@dws/muster';

const app = muster({
  people: [
    {
      firstName: 'Bob',
      lastName: 'Smith',
      fullName: computed(
        [ref(relative('firstName')), ref(relative('lastName'))],
        (firstName, lastName) => `${firstName} ${lastName}`
      )
    },
    {
      firstName: 'Kate',
      lastName: 'Doe',
      fullName: computed(
        [ref(relative('firstName')), ref(relative('lastName'))],
        (firstName, lastName) => `${firstName} ${lastName}`
      )
    }
  ]
});

await app.resolve(
  query(ref('people'), entries({ fullName: true }))
);
// == [
//   { fullName: 'Bob Smith' },
//   { fullName: 'Kate Doe' },
// ]
```

## Dynamically add/remove graphs to Muster

Adding and removing graphs to Muster is quite an advanced topic, so before we dig into the explanation, it's important to add a refresher of some core concepts.

To begin, there's no restriction on the node used as a target of a `query()` node. In most of the Muster examples we've been using either root() or ref() nodes, but you can also resolve queries on `tree()` and `scope()` nodes.

The second thing is that nodes located in the scope do not have direct access outside that scope. The only way the scoped nodes can access wider graph is by injecting nodes through context. For example, given an application:

```javascript
import muster, { root, scope } from '@dws/muster'

const app = muster({
  name: 'Name from root of the graph',
  scope: scope({
    name: 'Name from scope',
    getName: get(root(), 'name'), // ref('name')
  }),
});
```

Resolving `await app.resolve(ref('scope', 'getName'))` returns 'Name from scope'. This happens because the scope node overrides the value of a `root()` node, which essentially prevents the nodes from being able to access anything outside that scope.



The `scope()` node optionally takes context values, which can be injected into that scope. This allows creating links between scope and its parent scope. There's no restrictions on what that link points to, as it can even point to the original root of the parent scope:

```javascript
import muster, { context, get, root, scope } from '@dws/muster'

const app = muster({
  name: 'Name from root of the graph',
  scope: scope({
    name: 'Name from scope',
    getName: get(context('originalRoot'), 'name'),
  }, {
    originalRoot: root(),
  }),
});
```

In this case resolving `await app.resolve(ref('scope', 'getName'))` returns 'Name from root of the graph'.

It's important to remember that while the example above uses string keys for context values, they can also be defined as symbols.

The final thing is that the `scope()` node definition exposes a `dispose()` function. Certain Muster nodes can have their own state, and their state lives for as long as the node has open subscriptions (except for the `variable()` node, which actually ignores the number of open subscriptions and stores the value for as its parent scope exists or until the `variable()` is reset).

The `dispose()` function is used to force removal of the state of every child node and scope of a `scope()` node definition to prevent garbage piling up from variables that would otherwise remain.

**The simplified workflow of dynamic adding/removing graphs is:**
1. Based on the `graph` property from an object passed into the `container()` function create a `scope()` node, while retaining a link to the root of the Muster graph through some context value. [[1]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L83)
2. Remember that `scope()` node definition, as it will be used to build both the `query()` node, and when component gets unmounted to dispose the retained nodes. [[2]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L150)
3. Build a `query()` that uses a `scope()` node definition from the step 2., and with the fields coming from transformed `props` property (again, from an object passed into the `container()` function). [[3]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L151)
4. Subscribe to that `query()` node, and render the component with the results from Muster. [[4]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L217) [[5]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L244)
5. (when unmounting) Close `query()` subscription, and then dispose the `scope()` node definition using the `dispose()` function. [[6]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L357) [[7]](https://github.com/dwstech/muster/blob/develop/packages/muster-react/src/utils/create-container-factory.ts#L373)