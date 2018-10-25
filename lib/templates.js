const newArticleEmail = (receiver, author, title, slug) => `
  Hello, ${receiver}.
  ${author} just posted a new article. <a href='someurl/api/articles/${slug}'>${title}<a>`;

const newCommentEmail = (receiver, slug, body, id, title) => `
  Hello, ${receiver}.
  There's a new comment on your favorite article
  <small>${title}</small>
  <p><a href='someurl/api/articles/${slug}'>${body}</a></p>`;

export {
  newArticleEmail,
  newCommentEmail,
};
