const generateArticleList = (userId) => {
  const iteratorList = Array.from(Array(20).keys());
  const articleList = [];
  const article = {
    title: 'Enough is Enough!',
    description: 'This is a call for Revolt',
    body: 'My people the time has come to revolt against this new government',
    image: 'null',
    authorId: userId
  };

  iteratorList.forEach(() => {
    articleList.push(article);
  });

  return articleList;
};

export {
  generateArticleList
};
