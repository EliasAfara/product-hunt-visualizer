import { gql } from 'apollo-angular';

const GET_POSTS = gql`
  query GetPosts {
    posts {
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

export { GET_POSTS };
