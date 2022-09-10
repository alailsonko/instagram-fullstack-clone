/**
 * @generated SignedSource<<a28d696e9bc33ee51be977d0b1fd99f5>>
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
  "name": "idSerial",
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
  "name": "id",
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
    "cacheID": "c3242bf75503b951faafbb3215423b48",
    "id": null,
    "metadata": {},
    "name": "NavigationSectionMutation",
    "operationKind": "mutation",
    "text": "mutation NavigationSectionMutation(\n  $input: CreatePostInput!\n) {\n  createPost(input: $input) {\n    clientMutationId\n    post {\n      idSerial\n      user {\n        idSerial\n        username\n        email\n        createdAt\n        updatedAt\n        id\n      }\n      userId\n      description\n      medias {\n        idSerial\n        url\n        postId\n        createdAt\n        updatedAt\n        id\n      }\n      createdAt\n      id\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "111f60ec9cc3e6535bab1e6a56da7804";

export default node;
