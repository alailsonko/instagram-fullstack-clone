/**
 * @generated SignedSource<<271e0262b8e63b1793aca4d792f60105>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProfileDetailSectionQuery$variables = {
  first?: number | null;
  before?: string | null;
  last?: number | null;
  username?: string | null;
  after?: string | null;
};
export type ProfileDetailSectionQuery$data = {
  readonly getPostsBySlug: {
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
          readonly avatar: {
            readonly idSerial: number;
            readonly url: string;
            readonly postId: number | null;
            readonly createdAt: any;
            readonly updatedAt: any;
            readonly id: string;
          } | null;
          readonly avatarId: number | null;
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
export type ProfileDetailSectionQuery = {
  variables: ProfileDetailSectionQuery$variables;
  response: ProfileDetailSectionQuery$data;
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
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "idSerial",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = [
  (v5/*: any*/),
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
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = [
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
      },
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "username"
      }
    ],
    "concreteType": "PostConnection",
    "kind": "LinkedField",
    "name": "getPostsBySlug",
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
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "user",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
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
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "avatar",
                    "plural": false,
                    "selections": (v9/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "avatarId",
                    "storageKey": null
                  },
                  (v8/*: any*/)
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
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              (v6/*: any*/),
              (v8/*: any*/),
              (v7/*: any*/)
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
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProfileDetailSectionQuery",
    "selections": (v10/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ProfileDetailSectionQuery",
    "selections": (v10/*: any*/)
  },
  "params": {
    "cacheID": "7ccb969b95aff0b46a7a0bcd84050e47",
    "id": null,
    "metadata": {},
    "name": "ProfileDetailSectionQuery",
    "operationKind": "query",
    "text": "query ProfileDetailSectionQuery(\n  $first: Int\n  $before: String\n  $last: Int\n  $username: String\n  $after: String\n) {\n  getPostsBySlug(first: $first, before: $before, last: $last, username: $username, after: $after) {\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        idSerial\n        user {\n          idSerial\n          username\n          email\n          createdAt\n          updatedAt\n          avatar {\n            idSerial\n            url\n            postId\n            createdAt\n            updatedAt\n            id\n          }\n          avatarId\n          id\n        }\n        userId\n        description\n        medias {\n          idSerial\n          url\n          postId\n          createdAt\n          updatedAt\n          id\n        }\n        createdAt\n        id\n        updatedAt\n      }\n      cursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9563b0388f40a241d267a445ef591696";

export default node;
