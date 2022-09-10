/**
 * @generated SignedSource<<7d0ee0b3e2080c6c259a74f749577504>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PostsTimelineSectionQuery$variables = {
  after?: string | null;
  first?: number | null;
  before?: string | null;
  last?: number | null;
};
export type PostsTimelineSectionQuery$data = {
  readonly posts: {
    readonly pageInfo: {
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: string | null;
      readonly endCursor: string | null;
    };
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly idSerial: number;
        readonly user: {
          readonly idSerial: number;
          readonly username: string;
          readonly email: string;
          readonly createdAt: any;
          readonly updatedAt: any;
          readonly id: string;
        } | null;
        readonly userId: number | null;
        readonly description: string | null;
        readonly medias: ReadonlyArray<{
          readonly idSerial: number;
          readonly url: string;
          readonly postId: number | null;
          readonly createdAt: any;
          readonly updatedAt: any;
          readonly id: string;
        } | null>;
        readonly createdAt: any;
        readonly id: string;
        readonly updatedAt: any;
      } | null;
      readonly cursor: string;
    } | null> | null;
  };
};
export type PostsTimelineSectionQuery = {
  variables: PostsTimelineSectionQuery$variables;
  response: PostsTimelineSectionQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "idSerial",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "after",
        "variableName": "after"
      },
      {
        "kind": "Variable",
        "name": "before",
        "variableName": "before"
      },
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "first"
      },
      {
        "kind": "Variable",
        "name": "last",
        "variableName": "last"
      }
    ],
    "concreteType": "PostConnection",
    "kind": "LinkedField",
    "name": "posts",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PageInfo",
        "kind": "LinkedField",
        "name": "pageInfo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasNextPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasPreviousPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startCursor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endCursor",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PostEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Post",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "username",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "email",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "userId",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Media",
                "kind": "LinkedField",
                "name": "medias",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "postId",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/),
              (v7/*: any*/),
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cursor",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PostsTimelineSectionQuery",
    "selections": (v8/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "PostsTimelineSectionQuery",
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "42e617a8dab5a3488d3bbbd7715f8738",
    "id": null,
    "metadata": {},
    "name": "PostsTimelineSectionQuery",
    "operationKind": "query",
    "text": "query PostsTimelineSectionQuery(\n  $after: String\n  $first: Int\n  $before: String\n  $last: Int\n) {\n  posts(after: $after, first: $first, before: $before, last: $last) {\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        idSerial\n        user {\n          idSerial\n          username\n          email\n          createdAt\n          updatedAt\n          id\n        }\n        userId\n        description\n        medias {\n          idSerial\n          url\n          postId\n          createdAt\n          updatedAt\n          id\n        }\n        createdAt\n        id\n        updatedAt\n      }\n      cursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8de88f5ef4063d340e1a536aa1265116";

export default node;
