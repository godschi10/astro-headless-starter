/**
 * wp/queries.ts — G-will Chijioke (https://gwillchijioke.com)
 *
 * GraphQL query strings for WPGraphQL.
 * All queries include only fields consumed by the starter templates.
 */

export const GET_POSTS = /* GraphQL */ `
  query GetPosts($first: Int = 100, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        databaseId
        slug
        title
        excerpt
        date
        modified
        status
        author {
          node { databaseId name slug }
        }
        featuredImage {
          node {
            databaseId
            sourceUrl
            altText
            mediaDetails { width height }
            r2Url
            modernFormats { format url width height }
          }
        }
        categories {
          nodes {
            databaseId name slug
            parent { node { databaseId } }
          }
        }
        tags {
          nodes { databaseId name slug }
        }
        seo {
          title description canonical noindex
          ogTitle ogDescription ogImage
        }
        readingTime
        breadcrumbs { title url }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_POST_BY_SLUG = /* GraphQL */ `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      content
      excerpt
      date
      modified
      status
      author {
        node {
          databaseId name slug description
          avatar { url }
        }
      }
      featuredImage {
        node {
          databaseId
          sourceUrl altText
          mediaDetails { width height }
          r2Url
          modernFormats { format url width height }
        }
      }
      categories {
        nodes {
          databaseId name slug
          parent { node { databaseId } }
        }
      }
      tags {
        nodes { databaseId name slug }
      }
      seo {
        title description canonical noindex
        ogTitle ogDescription ogImage
      }
      readingTime
      breadcrumbs { title url }
    }
  }
`;

export const GET_PAGE_BY_SLUG = /* GraphQL */ `
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      databaseId
      slug
      title
      content
      date
      modified
      status
      featuredImage {
        node {
          databaseId sourceUrl altText
          mediaDetails { width height }
          r2Url
          modernFormats { format url width height }
        }
      }
      seo {
        title description canonical noindex
        ogTitle ogDescription ogImage
      }
    }
  }
`;

// Used by sitemap.xml.ts — fetches all published pages.
export const GET_ALL_PAGES = /* GraphQL */ `
  query GetAllPages($first: Int = 100, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        databaseId
        slug
        date
        modified
        status
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories(first: 100) {
      nodes {
        databaseId name slug count description
        parent { node { databaseId } }
      }
    }
  }
`;

export const GET_TAGS = /* GraphQL */ `
  query GetTags {
    tags(first: 200) {
      nodes { databaseId name slug count }
    }
  }
`;

export const GET_AUTHORS = /* GraphQL */ `
  query GetAuthors {
    users(first: 100) {
      nodes {
        databaseId name slug description
        avatar { url }
      }
    }
  }
`;

export const GET_MENU = /* GraphQL */ `
  query GetMenu($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }, first: 100) {
      nodes {
        databaseId label url target cssClasses parentId order
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = /* GraphQL */ `
  query GetPostsByCategory($category: String!, $first: Int = 10, $after: String) {
    posts(where: { categoryName: $category }, first: $first, after: $after) {
      nodes {
        databaseId slug title excerpt date
        featuredImage {
          node { sourceUrl altText r2Url modernFormats { format url width height } }
        }
        categories { nodes { name slug } }
        readingTime
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_POSTS_BY_AUTHOR = /* GraphQL */ `
  query GetPostsByAuthor($author: String!, $first: Int = 10, $after: String) {
    posts(where: { authorName: $author }, first: $first, after: $after) {
      nodes {
        databaseId slug title excerpt date
        featuredImage {
          node { sourceUrl altText r2Url modernFormats { format url width height } }
        }
        categories { nodes { name slug } }
        readingTime
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_POSTS_BY_TAG = /* GraphQL */ `
  query GetPostsByTag($tag: String!, $first: Int = 10, $after: String) {
    posts(where: { tag: $tag }, first: $first, after: $after) {
      nodes {
        databaseId slug title excerpt date
        featuredImage {
          node { sourceUrl altText r2Url modernFormats { format url width height } }
        }
        categories { nodes { name slug } }
        readingTime
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
