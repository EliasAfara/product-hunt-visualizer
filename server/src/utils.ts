import fetch from "node-fetch";

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

export async function fetchPosts(
  first: number,
  after: string
): Promise<PostConnection> {
  const apiUrl = "https://api.producthunt.com/v2/api/graphql";

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
      Authorization: `Bearer ${process.env.API_TOKEN}`,
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

  const responseData: any = await response.json();
  return responseData.data.posts;
}
