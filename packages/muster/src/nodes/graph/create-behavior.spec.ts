import muster, {
  error,
  ErrorNodeDefinition,
  fromPromise,
  getChildOperation,
  GetChildProperties,
  getInvalidTypeError,
  match,
  ref,
  set,
  toNode,
  traverse,
  types,
  value,
} from '../..';
import { operation, runScenario } from '../../test';
import { createBehavior } from './create-behavior';
import { withErrorPath } from './error';

function getTestError(
  failedOperation: string,
  acceptedOperations: Array<string>,
  nodePath: Array<string>,
): ErrorNodeDefinition {
  return withErrorPath(
    error(
      getInvalidTypeError(
        `This createBehavior node does not implement the '${failedOperation}' operation.`,
        {
          expected: acceptedOperations,
          received: failedOperation,
        },
      ),
    ),
    { path: nodePath },
  );
}

describe('createBehavior()', () => {
  runScenario({
    description: 'GIVEN a createBehavior node that does not implement any operations.',
    graph: () =>
      muster({
        node: createBehavior({}),
      }),
    operations: [
      operation({
        description: 'WHEN getting the value of the createBehavior node',
        input: ref('node'),
        expected: getTestError('evaluate', [], ['node']),
      }),
    ],
  });

  runScenario({
    description: 'GIVEN a createBehavior node that implements only evaluate operation',
    graph: () =>
      muster({
        node: createBehavior({
          evaluate: () => value('Hello world!'),
        }),
      }),
    operations: [
      operation({
        description: 'WHEN getting the value of the createBehavior node',
        input: ref('node'),
        expected: value('Hello world!'),
      }),
      operation({
        description: 'WHEN setting the value of the createBehavior node',
        input: set('node', 'other value'),
        expected: getTestError('set', ['evaluate'], ['node']),
      }),
    ],
  });

  runScenario({
    description: 'GIVEN a node that implements both evaluate and getChild',
    graph: () =>
      muster({
        items: (() => {
          const children = toNode({
            [match(types.string, 'id')]: fromPromise({
              get: ({ id }) => Promise.resolve(`Item ${id}`),
              // set: () => ...
            }),
          });
          return createBehavior({
            evaluate: () =>
              fromPromise({
                get: () => Promise.resolve('Fetching all items...'),
                // set: ({ params }, data) => ...
              }),
            getChild: (params, properties: GetChildProperties) =>
              traverse(children, getChildOperation(properties.key)),
          });
        })(),
      }),
    operations: [
      operation({
        description: 'WHEN the `items` is resolved',
        input: ref('items'),
        expected: value('Fetching all items...'),
      }),
      operation({
        description: 'WHEN the `items`, `first` is resolved',
        input: ref('items', 'first'),
        expected: value('Item first'),
      }),
      operation({
        description: 'WHEN the `items`, `second` is resolved',
        input: ref('items', 'second'),
        expected: value('Item second'),
      }),
    ],
  });
});
