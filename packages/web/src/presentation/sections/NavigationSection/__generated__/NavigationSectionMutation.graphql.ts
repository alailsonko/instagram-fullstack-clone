/**
 * @generated SignedSource<<1d7d1f55a1fba9c9753477b4f021461a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreatePostInput = {
  description: string;
  file: ReadonlyArray<any | null>;
  clientMutationId?: string | null;
};
export type NavigationSectionMutation$variables = {
  input: CreatePostInput;
};
export type NavigationSectionMutation$data = {
  readonly createPost: {
    readonly clientMutationId: string | null;
    readonly post: {
      readonly id: number;
      readonly user: {
        readonly id: number;
        readonly username: string;
        readonly email: string;
        readonly createdAt: any;
        readonly updatedAt: any;
        readonly uuid: string;
      } | null;
      readonly userId: number | null;
      readonly description: string | null;
      readonly medias: ReadonlyArray<{
        readonly id: number;
        readonly url: string;
        readonly postId: number | null;
        readonly createdAt: any;
        readonly updatedAt: any;
        readonly uuid: string;
      } | null>;
      readonly createdAt: any;
      readonly uuid: string;
      readonly updatedAt: any;
    } | null;
  } | null;
};
export type NavigationSectionMutation = {
  variables: NavigationSectionMutation$variables;
  response: NavigationSectionMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "uuid",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreatePostPayload",
    "kind": "LinkedField",
    "name": "createPost",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientMutationId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Post",
        "kind": "LinkedField",
        "name": "post",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
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
              (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          (v4/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NavigationSectionMutation",
    "selections": (v5/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NavigationSectionMutation",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "a3eca78162158cd68da6c9bf750d7d44",
    "id": null,
    "metadata": {},
    "name": "NavigationSectionMutation",
    "operationKind": "mutation",
    "text": "mutation NavigationSectionMutation(\n  $input: CreatePostInput!\n) {\n  createPost(input: $input) {\n    clientMutationId\n    post {\n      id\n      user {\n        id\n        username\n        email\n        createdAt\n        updatedAt\n        uuid\n      }\n      userId\n      description\n      medias {\n        id\n        url\n        postId\n        createdAt\n        updatedAt\n        uuid\n      }\n      createdAt\n      uuid\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ffbb6305dc99227335ef513bc95183fd";

export default node;
