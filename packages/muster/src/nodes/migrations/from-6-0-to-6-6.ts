import { createMigration } from './create-migration';
import { createMigrator, DEFAULT } from './create-migrator';
import { Migration } from './types';

type SerializedPrimitive = string | number | boolean | null | undefined;
interface SerializedArray extends Array<SerializedValue> {}
interface SerializedObject {
  [key: string]: SerializedValue;
}

type SerializedValue =
  | SerializedPrimitive
  | SerializedArray
  | SerializedObject
  | NodeBefore
  | NodeAfter;

interface NodeBefore {
  $type: string;
  data: {
    [key: string]: SerializedValue;
  };
}

interface NodeAfter {
  $type: string;
  data: {
    [key: string]: SerializedValue;
  };
}

const migrator = createMigrator<NodeBefore, NodeAfter>({
  [DEFAULT]: {
    downgrade(node, traverse): NodeBefore {
      return {
        $type: node.$type,
        data: traverse(node.data),
      };
    },
    upgrade(node, traverse): NodeAfter {
      return {
        $type: node.$type,
        data: traverse(node.data),
      };
    },
  },
  query: {
    downgrade(node, traverse): NodeBefore {
      return {
        $type: node.$type,
        data: {
          keys: traverse(node.data.keys),
          root: traverse(node.data.root),
        },
      };
    },
    upgrade(node, traverse): NodeAfter {
      return {
        $type: node.$type,
        data: {
          keys: traverse(node.data.keys),
          options: {
            omitNils: false,
          },
          root: traverse(node.data.root),
        },
      };
    },
  },
  'query-set': {
    downgrade(node, traverse): NodeBefore {
      return {
        $type: node.$type,
        data: {
          children: traverse(node.data.children),
          options: {
            bubbleErrorsToTop: (node.data.options as any).bubbleErrorsToTop,
          },
          root: traverse(node.data.root),
        },
      };
    },
    upgrade(node, traverse): NodeAfter {
      return {
        $type: node.$type,
        data: {
          children: traverse(node.data.children),
          options: {
            bubbleErrorsToTop: (node.data.options as any).bubbleErrorsToTop,
            omitNils: false,
          },
          root: traverse(node.data.root),
        },
      };
    },
  },
});

export default createMigration({
  match: '>=6.0.0 <6.6.0',
  migrator,
  versionAfterUpgrade: '6.6.0',
  versionAfterDowngrade: '6.0.0',
}) as Migration;
