export const typeDefs = `#graphql
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
