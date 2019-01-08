import fromPairs from 'lodash/fromPairs';
import omit from 'lodash/omit';
import zip from 'lodash/zip';
import {
  CallOperation,
  callOperation,
  isCallArgumentArray,
  isCallOperation,
} from '../../operations/call';
import { isGetChildOperation } from '../../operations/get-child';
import { getItemsOperation, isGetItemsOperation } from '../../operations/get-items';
import { isIterateOperation } from '../../operations/iterate';
import { isSetOperation } from '../../operations/set';
import {
  GraphNode,
  GraphOperation,
  isGraphNode,
  isNodeDefinition,
  NodeDefinition,
  NodeDependency,
  NodeExecutionContext,
  StatefulNodeType,
} from '../../types/graph';
import createGraphNode from '../../utils/create-graph-node';
import createNodeDefinition from '../../utils/create-node-definition';
import { createNodeType } from '../../utils/create-node-type';
import * as graphTypes from '../../utils/graph-types';
import hoistDependencies from '../../utils/hoist-dependencies';
import * as types from '../../utils/types';
import { WILDCARD_OPERATION } from '../../utils/wildcard-operation';
import withScopeFrom from '../../utils/with-scope-from';
import { array, isArrayNodeDefinition } from '../collection/array';
import { DisposeRequest, OperationPathPart, QueryBuilder } from '../remote/utils/query-builder';
import { isErrorNodeDefinition, withErrorPath } from './error';
import { createChildPathContext, getPath } from './get';
import { iteratorResult } from './iterator-result';
import { nil } from './nil';
import { isOkNodeDefinition } from './ok';
import { pending } from './pending';
import { resolve } from './resolve';
import { ExternalStatefulNodeDefinition, stateful } from './stateful';

/**
 * An instance of the [[placeholder]] node.
 * See the [[placeholder]] documentation page to find out more.
 */
export interface PlaceholderNode
  extends GraphNode<
    'placeholder',
    PlaceholderNodeProperties,
    PlaceholderNodeState,
    PlaceholderNodeData
  > {}

/**
 * A definition of the [[placeholder]] node.
 * See the [[placeholder]] documentation page to find out more.
 */
export interface PlaceholderNodeDefinition
  extends NodeDefinition<
    'placeholder',
    PlaceholderNodeProperties,
    PlaceholderNodeState,
    PlaceholderNodeData
  > {}

export interface PlaceholderNodeProperties {
  path: Array<OperationPathPart>;
  queryBuilder: QueryBuilder;
}

export interface PlaceholderNodeState {
  results: {
    [operationHash: string]: NodeDefinition | undefined;
  };
  statefulNodes: {
    [operationHash: string]: NodeDefinition | undefined;
  };
}

export interface PlaceholderNodeData {
  disposeRequest: {
    [operationHash: string]: DisposeRequest | undefined;
  };
}

/**
 * An implementation of the [[placeholder]] node.
 * See the [[placeholder]] documentation to find out more.
 */
export const PlaceholderNodeType: StatefulNodeType<
  'placeholder',
  PlaceholderNodeProperties,
  PlaceholderNodeState,
  PlaceholderNodeData
> = createNodeType<
  'placeholder',
  PlaceholderNodeProperties,
  PlaceholderNodeState,
  PlaceholderNodeData
>('placeholder', {
  state: {
    results: types.objectOf(graphTypes.nodeDefinition),
    statefulNodes: types.objectOf(graphTypes.nodeDefinition),
  },
  shape: {
    path: types.arrayOf(
      types.shape({
        id: types.string,
        operation: graphTypes.graphOperation,
      }),
    ),
    queryBuilder: types.saveHash(types.any),
  },
  serialize: false,
  deserialize: false,
  getInitialState(): PlaceholderNodeState {
    return {
      results: {},
      statefulNodes: {},
    };
  },
  operations: {
    [WILDCARD_OPERATION]: {
      run(
        node: PlaceholderNode,
        operation: GraphOperation,
        dependencies: never,
        context: never,
        state: PlaceholderNodeState,
      ): NodeDefinition | GraphNode {
        return state.results[operation.id] || pending();
      },
      onSubscribe(
        this: NodeExecutionContext<PlaceholderNodeState, PlaceholderNodeData>,
        node: PlaceholderNode,
        operation: GraphOperation,
      ): void {
        handleOperation(this, node, operation);
      },
      onInvalidate(
        this: NodeExecutionContext<PlaceholderNodeState, PlaceholderNodeData>,
        node: PlaceholderNode,
        operation: GraphOperation,
      ): void {
        if (isGetChildOperation(operation)) return;
        handleOperation(this, node, operation);
      },
      onUnsubscribe(
        this: NodeExecutionContext<PlaceholderNodeState, PlaceholderNodeData>,
        node: PlaceholderNode,
        operation: GraphOperation,
      ): void {
        const { disposeRequest } = this.getData();
        const disposeCurrentRequest = disposeRequest && disposeRequest[operation.id];
        if (disposeCurrentRequest) {
          disposeCurrentRequest();
          this.setData((data) => ({
            ...data,
            disposeRequest: omit(data.disposeRequest, operation.id),
          }));
        }
        this.setState((state) => ({
          ...state,
          results: omit(state.results, operation.id),
        }));
      },
    },
  },
});

/**
 * Creates a new instance of the [[placeholder]] node, which is used by the [[proxy]] to establish which nodes and
 * operations need to be subscribed from the remote instance of Muster.
 * @param queryBuilder
 * @param path
 */
export function placeholder(
  queryBuilder: QueryBuilder,
  path: Array<OperationPathPart>,
): PlaceholderNodeDefinition {
  return createNodeDefinition(PlaceholderNodeType, {
    path,
    queryBuilder,
  });
}

export function isPlaceholderNodeDefinition(
  value: NodeDefinition,
): value is PlaceholderNodeDefinition {
  return value.type === PlaceholderNodeType;
}

function assignPlaceholderPath(
  placeholderNode: GraphNode,
  path: Array<OperationPathPart>,
  target: NodeDefinition,
): GraphNode {
  const parentNode = path.reduce((currentParent, pathPart) => {
    if (!isGetChildOperation(pathPart.operation)) {
      return currentParent;
    }
    const childContext = createChildPathContext(currentParent, pathPart.operation.properties.key);
    return createGraphNode(currentParent.scope, childContext, currentParent.definition);
  }, placeholderNode);
  if (isErrorNodeDefinition(target)) {
    const errorPath = getPath(parentNode.context);
    const errorNode = errorPath.length > 0 ? withErrorPath(target, { path: errorPath }) : target;
    return withScopeFrom(parentNode, errorNode);
  }
  return withScopeFrom(parentNode, target);
}

function toIteratorResult(node: NodeDefinition): NodeDefinition {
  if (!isArrayNodeDefinition(node)) return node;
  const { items } = node.properties;
  if (items.length === 0) return nil();
  const [firstItem, ...remaining] = items;
  return iteratorResult(firstItem, remaining.length === 0 ? nil() : array(remaining));
}

function toNodeDefinitionArray(items: Array<GraphNode | NodeDefinition>): Array<NodeDefinition> {
  return items.map((item) => (isGraphNode(item) ? item.definition : item));
}

function handleOperation(
  context: NodeExecutionContext<PlaceholderNodeState, PlaceholderNodeData>,
  node: PlaceholderNode,
  operation: GraphOperation,
): void {
  const { path, queryBuilder } = node.definition.properties;
  const { statefulNodes } = context.getState();
  const statefulNode =
    statefulNodes && statefulNodes[operation.id]
      ? (statefulNodes[operation.id] as ExternalStatefulNodeDefinition<NodeDefinition | GraphNode>)
      : stateful<NodeDefinition | GraphNode>(pending());
  const getOperationDependencies = (): Array<NodeDependency> | undefined => {
    if (isCallOperation(operation)) {
      const { args } = operation.properties;
      if (!args) return [];
      if (Array.isArray(args)) {
        return args.map((arg) => ({
          target: arg,
          once: true,
        }));
      }
      return Object.keys(args).map((name) => ({
        target: args[name],
        once: true,
      }));
    }
    if (isGetItemsOperation(operation)) {
      return operation.properties.transforms.map((transform) => {
        const transformNode = isNodeDefinition(transform)
          ? withScopeFrom(node, transform)
          : transform;
        const resolveTransform = hoistDependencies(transformNode);
        return { target: resolveTransform.definition };
      });
    }
    return undefined;
  };
  let lastResolvedDependenciesIds: Array<string> | undefined;
  const dependenciesResolved = (resolvedDependencies: Array<GraphNode>): NodeDefinition => {
    if (lastResolvedDependenciesIds) {
      const dependenciesHaveChanged = lastResolvedDependenciesIds.some(
        (id, index) => id !== resolvedDependencies[index].id,
      );
      if (!dependenciesHaveChanged) {
        queryBuilder.markAsModified();
        return statefulNode;
      }
    }
    lastResolvedDependenciesIds = resolvedDependencies.map(({ id }) => id);
    if (isCallOperation(operation)) {
      const { args } = operation.properties;
      const argsValues = toNodeDefinitionArray(resolvedDependencies);
      let resolvedOperation: CallOperation;
      if (!args) {
        resolvedOperation = callOperation();
      } else if (isCallArgumentArray(args)) {
        // Handle the array of arguments
        resolvedOperation = callOperation(argsValues);
      } else {
        // Handle the named arguments
        resolvedOperation = callOperation(fromPairs(zip(Object.keys(args), argsValues)));
      }
      const childPath = [...path, { id: operation.id, operation: resolvedOperation }];
      const disposeRequest = queryBuilder.addRequest(childPath, (result) =>
        statefulNode.update(assignPlaceholderPath(node, path, result)),
      );
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: disposeRequest,
        },
      }));
    } else if (isGetChildOperation(operation)) {
      const childPath = [...path, { id: operation.id, operation }];
      const dispose = queryBuilder.addRequest(childPath);
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: dispose,
        },
      }));
      return placeholder(queryBuilder, childPath);
    } else if (isGetItemsOperation(operation)) {
      const data = context.getData();
      const disposePreviousGetItems = data.disposeRequest && data.disposeRequest[operation.id];
      if (disposePreviousGetItems) {
        disposePreviousGetItems();
      }
      const operationWithResolvedTransforms = getItemsOperation(
        toNodeDefinitionArray(resolvedDependencies),
      );
      const childPath = [...path, { id: operation.id, operation: operationWithResolvedTransforms }];
      const dispose = queryBuilder.addRequest(childPath, (result) => {
        statefulNode.update(assignPlaceholderPath(node, path, result));
      });
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: dispose,
        },
      }));
      statefulNode.update(placeholder(queryBuilder, childPath));
    } else if (isIterateOperation(operation)) {
      const childPath = [...path, { id: operation.id, operation: getItemsOperation() }];
      statefulNode.update(placeholder(queryBuilder, childPath));
      const dispose = queryBuilder.addRequest(childPath, (result) => {
        statefulNode.update(assignPlaceholderPath(node, path, toIteratorResult(result)));
      });
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: dispose,
        },
      }));
    } else if (isSetOperation(operation)) {
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: queryBuilder.addRequest(
            [...path, { id: operation.id, operation }],
            (result) => {
              statefulNode.update(
                assignPlaceholderPath(
                  node,
                  path,
                  isOkNodeDefinition(result) ? operation.properties.value : result,
                ),
              );
            },
          ),
        },
      }));
    } else {
      context.setData((data) => ({
        ...data,
        disposeRequest: {
          ...data.disposeRequest,
          [operation.id]: queryBuilder.addRequest(
            [...path, { id: operation.id, operation }],
            (result) => {
              if ((global as any).DEBUG) {
                debugger;
              }
              statefulNode.update(assignPlaceholderPath(node, path, result));
            },
          ),
        },
      }));
    }
    return statefulNode;
  };
  const dependencies = getOperationDependencies();
  if (dependencies && dependencies.length > 0) {
    context.setState((state) => ({
      ...state,
      results: {
        ...state.results,
        [operation.id]: resolve(dependencies, dependenciesResolved),
      },
      statefulNodes: {
        ...statefulNodes,
        [operation.id]: statefulNode,
      },
    }));
  } else {
    context.setState((state) => ({
      ...state,
      results: {
        ...state.results,
        [operation.id]: dependenciesResolved([]),
      },
      statefulNodes: {
        ...statefulNodes,
        [operation.id]: statefulNode,
      },
    }));
  }
}
