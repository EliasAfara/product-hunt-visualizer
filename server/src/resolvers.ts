import { fetchPosts } from "./utils.js";

export const resolvers = {
  Query: {
    posts: async (_, args) => {
      try {
        const { first, after } = args;
        const responseData = await fetchPosts(first, after);

        return responseData;
      } catch (error) {
        throw new Error(
          `Failed to fetch data from Product Hunt API: ${error.message}`
        );
      }
    },
  },
};
