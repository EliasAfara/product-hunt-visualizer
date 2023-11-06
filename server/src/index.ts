import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from "node-fetch";
import * as fs from "fs";

// The GraphQL schema
const typeDefs = `#graphql

type Thumbnail {
    url: String!
}


type Topic {
    id: ID!
    name: String!
}

type TopicEdge {
    node: Topic!
}

type TopicConnection {
    edges: [TopicEdge!]!
}


type Post {
    id: ID!
    name: String!
    tagline: String!
    url: String!
    thumbnail: Thumbnail!
    createdAt: String!
    topics: TopicConnection!
}

type PostConnection {
    edges: [PostEdge!]!
    totalCount: Int!
}

type PostEdge {
    cursor: String!
    node: Post!
}

type Query {
    posts(first: Int, after: String): PostConnection!
}
`;

const saveResponseToFile = (responseData: any, filePath: string) => {
  fs.writeFileSync(filePath, JSON.stringify(responseData, null, 2), "utf-8");
  console.log(`Response data has been saved to ${filePath}`);
};

type Post = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  thumbnail: {
    url: string;
  };
  createdAt: string;
  topics: {
    edges: {
      node: {
        id: string;
        name: string;
      };
    }[];
  };
};

type PostConnection = {
  posts: {
    edges: { cursor: string; node: Post }[];
    totalCount: number;
  };
};

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    posts: async (parents, args: { first: number; after: string }) => {
      const { first, after } = args;
      const apiUrl = "https://api.producthunt.com/v2/api/graphql";

      // Define your Product Hunt API query here
      const graphqlQuery = `
        query GetPosts($first: Int, $after: String) {
          posts(first: $first, after: $after) {
            edges {
              cursor
              node {
                id
                name
                tagline
                url
                thumbnail {
                  url
                }
                createdAt
                topics {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
            }
            totalCount
          }
        }
      `;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1ieR99hPyLtV0MtaA-DBwDWoe6C46c9sqlOGoJ7I6AE",
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { first, after },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from Product Hunt API: ${response.statusText}`
        );
      }

      const responseData: PostConnection = await response.json();

      console.log(typeof responseData);

      // Replace this with the actual path where you want to save the response data
      const filePath = "response.json";

      // Call the function to save the response data to the file
      saveResponseToFile(responseData.data.posts, filePath);

      // Return the data structure with "PostConnection.edges"
      return responseData.data.posts;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
