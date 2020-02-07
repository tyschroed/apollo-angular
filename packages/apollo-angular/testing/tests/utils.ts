import {
  DocumentNode,
  OperationDefinitionNode,
  visit,
  Kind,
  FieldNode,
} from 'graphql';

export const buildOperationForLink = (
  document: DocumentNode,
  variables: any,
) => {
  return {
    query: document,
    variables,
    operationName: getOperationName(document) || undefined,
    context: {},
  };
};

export function getOperationName(doc: DocumentNode) {
  const namedOperation = doc.definitions.find(isNamedOperationDefinitionNode);

  return namedOperation ? namedOperation.name!.value : null;
}

const TYPENAME_FIELD: FieldNode = {
  kind: Kind.FIELD,
  name: {
    kind: Kind.NAME,
    value: '__typename',
  },
};

export function addTypenameToDocument(doc: DocumentNode) {
  return visit(doc, {
    SelectionSet: {
      enter(node, _key, parent) {
        if (parent && (parent as any).kind === Kind.OPERATION_DEFINITION) {
          return;
        }

        const selections = node.selections;
        if (!selections) {
          return;
        }

        const skip = selections.some(
          selection =>
            isField(selection) &&
            (selection.name.value === '__typename' ||
              selection.name.value.lastIndexOf('__', 0) === 0),
        );

        if (skip) {
          return;
        }

        const field = parent;
        if (
          isField(field) &&
          field.directives &&
          field.directives.some(d => d.name.value === 'export')
        ) {
          return;
        }

        return {
          ...node,
          selections: [...selections, TYPENAME_FIELD],
        };
      },
    },
  });
}

function isField(node: any): node is FieldNode {
  return node.kind === Kind.FIELD;
}

function isNamedOperationDefinitionNode(
  node: any,
): node is OperationDefinitionNode {
  return node.kind === 'OperationDefinition' && node.name;
}
