const newArticleEmail = (receiver, author, title, slug) => `
  Hello, ${receiver}.
  ${author} just posted a new article. <a href='someurl/api/articles/${slug}'>${title}<a>`;

const testEmail = `There's a  nwew ${3}`;

export {
  newArticleEmail,
  testEmail
};
