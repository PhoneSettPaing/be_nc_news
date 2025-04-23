const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


// exports.getArticleID = ({ article_title, ...otherProperties }) => {
//   if (!article_title) {
//     return { ...otherProperties };
//   } else {
//     const formattedArticleTitle = [article_title];
//     const insertQuery = format(`SELECT article_id FROM articles WHERE title = %L` , formattedArticleTitle);
//     //console.log(insertQuery, "<-----insertQuery");
//     return db.query(insertQuery);
//   }
// }

exports.createRef = (articlesData) => {
  if(articlesData.length === 0) {
    return {};
  }
  const result = {};
  articlesData.forEach((article) => {
    result[article.title] = article.article_id;
  })

  return result;
}