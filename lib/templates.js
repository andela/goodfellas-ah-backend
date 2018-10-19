const newArticleEmail = (receiver, author, title, slug) => `
  Hello, ${receiver}.
  ${author} just posted a new article. <a href='someurl/api/articles/${slug}'>${title}<a>`;

const newArticleNotification = (receiver, author, title) => `
  ${author} just posted a new article. ${title}`;

export {
  newArticleEmail,
  newArticleNotification,
};
