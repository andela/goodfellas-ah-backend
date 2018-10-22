const newArticleEmail = (receiver, author, title, slug) => `
  Hello, ${receiver}.
  ${author} just posted a new article. <a href='someurl/api/articles/${slug}'>${title}<a>`;

export {
  newArticleEmail
};
