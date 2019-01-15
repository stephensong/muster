---
id: version-6.6.0-matchers
title: Matchers
original_id: matchers
---
## Branch & Type Matchers
The branches of the `tree()` node can also be defined as **branch matchers**. These branch matchers inform the `tree()` node that a given branch can be accessed with a path that matches a specific type. Let's start with a simple matcher that accepts any name:
```javascript
import muster, { match, ref, types } from '@dws/muster';

const app = muster({
  greeting: {
    [match(types.string, 'name')]: 'Hello, world!',
  },
});

let result = await app.resolve(ref('greeting', 'Bob'));
console.log(result);

result = await app.resolve(ref('greeting', 123));
console.log(result);

// Console output:
// Hello, world!
// Error('Invalid child key: 123')
```
This example introduces two new concepts: a `types` object, and a `match()` function. The `types` object contains a number of different **type matchers**, that are used to inform Muster about a type of expected thing. These matchers can be used outside of Muster as well, for example:
```javascript
import { types } from '@dws/muster';

console.log('Is "hello" a string?', types.string('hello'));
console.log('Is 123 a string?', types.string(123));
console.log('Is true a string?', types.string(true));

// Console output:
// Is "hello" a string? true
// Is 123 a string? false
// Is true a string? false
```
To find out more about type matchers, browse the [API docs](/muster/api/latest/).

`match()` is a function used only inside of a `tree()` node to declare a branch matcher.
* The first argument of the `match()` is a type matcher, that checks if a given branch name matches with the expected type.
* The second argument of `match()` specifies a name of parameter that should be created when a given matcher captures the path. In the example above, for a path `ref('greeting', 'Bob')` the `name` parameter will contain `'Bob'`.

Going back to the example, we tried resolving two different `ref()` nodes. One was for `'Bob'` string, and the other for `123` number. Looking back at the Console output you can notice that the first one logged a `'Hello, world!'` string, and the other one resulted in `Error`.

Let's tweak that example to utilise the value of the `'name'` parameter:
```javascript
import muster, { format, match, param, ref, types } from '@dws/muster';

const app = muster({
  greeting: {
    [match(types.string, 'name')]: format('Hello, ${name}!', {
      name: param('name'),
    })
  },
});

let result = await app.resolve(ref('greeting', 'Bob'));
console.log(result);

result = await app.resolve(ref('greeting', 'Blueberry Muffin'));
console.log(result);

// Console output:
// Hello, Bob!
// Hello, Blueberry Muffin!
```
Now that's better! Note the new node - `param()`. The `param()` node can be used inside a branch matched by a branch matcher. The string argument used to create the `param()` node must match the one used when creating a branch matcher. Using it outside that branch, or misspelling `name` will result in that node resolving to an error.

#### Why you might use this
Matchers are a great way of type checking your input to restrict invalid input types being used by your branch and causing fatal errors where they may be incompatible.

## Matching Shapes
Branch matchers don't have to be only matching `string` types, they can match other types including **shapes** too. Consider the following example:
```javascript
import muster, { computed, match, param, property, ref, types } from '@dws/muster';

const app = muster({
  greet: {
    [match(types.shape({
      firstName: types.string,
      lastName: types.string,
    }), 'user')]: format('Hello, ${firstName} ${lastName}!', {
      firstName: property(param('user'), 'firstName'),
      lastName: property(param('user'), 'lastName'),
    })
  },
});

const result = await app.resolve(
  ref('greet', { firstName: 'Bob', lastName: 'Smith' }),
);
console.log(result);

// Console output:
// Hello, Bob Smith!
```
This example shows how to define branches that match on a specific shape. The shape in this case is expected to have a `firstName` and a `lastName`. Any other properties do not affect the shape matcher, and are allowed:
```javascript
const result = await app.resolve(
  ref('greet', { firstName: 'Bob', lastName: 'Smith', age: 25 }),
);
console.log(result);

// Console output:
// Hello, Bob Smith!
```
#### Why you might use this
This kind of functionality may be useful when matching search queries to API calls, if you know the expected shape of your results you can use matchers and the `fromPromise()` node to asynchronously anticipate them.

## Nested Matchers
Just like branches, branch matchers can be nested. One thing to remember is that it's always best to uniquely name branch parameters, so that they don't shadow previously defined parameters. Let's refactor the previous example into a nested branch matcher:
```javascript
import muster, { computed, match, param, ref, types } from '@dws/muster';

const app = muster({
  greet: {
    [match(types.string, 'firstName')]: {
      [match(types.string, 'lastName')]: format('Hello, ${firstName} ${lastName}', {
        firstName: param('firstName'),
        lastName: param('lastName')
      })
    }
  },
});

const result = await app.resolve(
  ref('greet', 'Bob', 'Smith'),
);
console.log(result);

// Console output:
// Hello, Bob Smith!
```

## Default Key Matchers

With the help of `createBehaviour()` and `fromPromise()` we can specify default key matchers, which are used when no additional arguments are specified. Look at the following example:
```javascript
import muster, { createBehaviour, fromPromise, getChildOperations, getChildProperties, match, toNode, traverse}
const app = muster({
  items: (() => {
    const children = toNode({
      [match(types.string, 'id')]: fromPromise({
        get: ({ id }) => Promise.resolve(`Item ${id}`),
        // Handle updating item
        // set: () => ...
      }),
    });
    return createBehavior({
      evaluate: () => fromPromise({
        get: () => Promise.resolve('Fetching all items...'),
        // Handle creating item
        // set: ({ params }, data) => ...
      }),
      getChild: (params, properties: GetChildProperties) => (
        traverse(children, getChildOperation(properties.key))
      ),
    });
  })(),
})

// Request `items` with argument 'first'
const result = await app.resolve(
  ref('items', 'first')
);
console.log(result);
// Console output:
// Item first

// Request `items` with no argument
const result = await app.resolve(
  ref('items')
);
console.log(result);
// Console output:
// Fetching all items...
```

In this example, the branch `items` is set up to return the string `Item {id}` whenever an `id` variable is specified. Therefore calling `ref('items', 'abcdef')` would return ***"Item abcdef"***. But if no `id` argument is provided, the `createBehaviour()` function is returned, resulting in ***"Fetching all items..."***. This design pattern can be modified to add specific behaviours for handing a lack of arguments.

#### Why you might use this
This functionality is useful as it is a way to overload your function or branch with alternative behaviours should it not always require an argument to serve a purpose if a default value is appropriate.