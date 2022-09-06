const database = require("../util/database");
const misc = require("../util/functions");
const fs = require("fs");
const jsonWebToken = require("jsonwebtoken");
const env = require("dotenv");
const host = process.env.host;

exports.getAll = (req, res, next) => {
   const userId = misc.getUserId(req);
   database.query(
      "SELECT p.*, u.username,pv.value FROM publications AS p INNER JOIN users AS u  LEFT JOIN publications_votes as pv ON pv.publications_id=p.id AND pv.users_id=? WHERE p.users_id=u.id",
      [userId],
      function (err, results, fields) {
         if (err) {
            return res.status(500).json({ message: err.sqlMessage });
         } else {
            return res.status(200).json({ results, host });
         }
      }
   );
};

exports.create = (req, res, next) => {
   const formatDate = misc.formatDate();
   if (req.body.title != undefined) {
      if (req.file !== undefined) {
         const imgUrl = `images/${req.file.filename}`;
         if (req.body.content === undefined) {
            database.query(
               "INSERT INTO `publications`(`title`, `image`, `created_at`, `users_id`)values(?, ?, ?,?)",
               [req.body.title, imgUrl, formatDate, req.body.userId],
               function (err, results, fields) {
                  if (err) {
                     return res.status(400).json({ message: err.sqlMessage });
                  } else {
                     return res
                        .status(201)
                        .json({ message: "Publication crée" });
                  }
               }
            );
         } else {
            database.query(
               "INSERT INTO `publications`(`title`, `image`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?, ?)",
               [
                  req.body.title,
                  imgUrl,
                  req.body.content,
                  formatDate,
                  req.body.userId,
               ],
               function (err, results, fields) {
                  if (err) {
                     return res.status(400).json({ message: err.sqlMessage });
                  } else {
                     return res.status(201).json(results);
                  }
               }
            );
         }
      } else {
         database.query(
            "INSERT INTO `publications`(`title`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?)",
            [req.body.title, req.body.content, formatDate, req.body.userId],
            function (err, results, fields) {
               if (err) {
                  return res.status(400).json({ message: err.sqlMessage });
               } else {
                  return res.status(201).json(results);
               }
            }
         );
      }
   } else {
      return res.status(400).json({ message: "Manquerait pas un titre là ?" });
   }
};

exports.delete = (req, res, next) => {
   const userId = misc.getUserId(req);
   const hasRights = misc.getRank(req);
   database.query(
      "SELECT * FROM `publications` WHERE id=?",
      [req.params.publication_id],
      function (err, results, fields) {
         if (results.length === 0) {
            return res
               .status(500)
               .json({
                  message:
                     "La publication visée n'existe plus, elle a probablement été supprimée",
               });
         } else {
            if (results[0].image !== null) {
               const filename = results[0].image.split("images/")[1];
               if (results[0].users_id === userId || hasRights === 1) {
                  database.query(
                     "DELETE FROM `publications` WHERE id=?",
                     [req.params.publication_id],
                     function (err, results, fields) {
                        if (err) {
                           return res
                              .status(400)
                              .json({ message: err.sqlMessage });
                        } else {
                           if (fs.existsSync(`images/${filename}`)) {
                              fs.unlinkSync(`images/${filename}`);
                           }
                           return res.status(204).json();
                        }
                     }
                  );
               } else if (err) {
                  return res.status(400).json({ message: err.sqlMessage });
               } else {
                  return res
                     .status(403)
                     .json({
                        message:
                           "Vous n'avez pas le droit d'effectuer cette action",
                     });
               }
            } else {
               if (results[0].users_id === userId || hasRights === 1) {
                  database.query(
                     "DELETE FROM `publications` WHERE id=?",
                     [req.params.publication_id],
                     function (err, results, fields) {
                        if (err) {
                           return res
                              .status(400)
                              .json({ message: err.sqlMessage });
                        } else {
                           return res.status(200).json(results);
                        }
                     }
                  );
               } else if (err) {
                  return res.status(400).json({ message: err.sqlMessage });
               } else {
                  return res
                     .status(403)
                     .json({
                        message:
                           "Vous n'avez pas le droit d'effectuer cette action",
                     });
               }
            }
         }
      }
   );
};

exports.modify = (req, res, next) => {
   const userId = misc.getUserId(req);
   const hasRights = misc.getRank(req);
   database.query(
      "SELECT * FROM publications WHERE id=?",
      [req.params.publication_id],
      function (err, results, fields) {
         let filename;
         if (results.length > 0) {
            if (results[0].image != undefined) {
               filename = results[0].image.split("images/")[1];
            }
            if (results[0].users_id === userId || hasRights === 1) {
               const host = `${req.protocol}://${req.get("host")}`;
               if (req.file !== undefined) {
                  const imgUrl = `images/${req.file.filename}`;
                  if (fs.existsSync(`images/${filename}`)) {
                     fs.unlinkSync(`images/${filename}`);
                  }
                  database.query(
                     "UPDATE `publications` SET title=?, image=?, content=? WHERE id=?",
                     [
                        req.body.title,
                        imgUrl,
                        req.body.content,
                        req.params.publication_id,
                     ],
                     function (err, results, fields) {
                        if (err) {
                           return res
                              .status(400)
                              .json({ message: err.sqlMessage });
                        } else {
                           return res.status(200).json(results);
                        }
                     }
                  );
               } else if (req.file !== undefined) {
                  const imgUrl = `images/${req.file.filename}`;
                  database.query(
                     "UPDATE `publications` SET title=?, image=?, content=? WHERE id=?",
                     [
                        req.body.title,
                        imgUrl,
                        req.body.content,
                        req.params.publication_id,
                     ],
                     function (err, results, fields) {
                        if (err) {
                           return res
                              .status(400)
                              .json({ message: err.sqlMessage });
                        } else {
                           return res.status(200).json(results);
                        }
                     }
                  );
               } else {
                  database.query(
                     "UPDATE `publications` SET title=?, content=? WHERE id=?",
                     [
                        req.body.title,
                        req.body.content,
                        req.params.publication_id,
                     ],
                     function (err, results, fields) {
                        if (err) {
                           return res
                              .status(400)
                              .json({ message: err.sqlMessage });
                        } else {
                           return res.status(200).json(results);
                        }
                     }
                  );
               }
            }
         } else if (err) {
            return res.status(400).json({ message: err.sqlMessage });
         } else {
            return res
               .status(403)
               .json({ message: "Cette publication n'existe plus" });
         }
      }
   );
};

exports.like = (req, res, next) => {
   const userId = misc.getUserId(req);
   database.query(
      "SELECT value FROM publications_votes WHERE users_id=? AND publications_id=?",
      [userId, req.params.publication_id],
      function (err, results, fields) {
         if (results.length === 0) {
            if (req.body.value !== -1) {
               database.query(
                  "INSERT INTO publications_votes(users_id, publications_id, value)VALUES(?, ?, ?)",
                  [userId, req.params.publication_id, req.body.value],
                  function (err, results, fields) {
                     if (err) {
                        if (err.errno == 1452) {
                           return res
                              .status(404)
                              .json({
                                 message:
                                    "La publication visée a été supprimée",
                              });
                        }
                        return res
                           .status(401)
                           .json({ message: err.sqlMessage });
                     } else if (req.body.value === 1) {
                        database.query(
                           "UPDATE publications SET upvote=upvote + 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     } else if (req.body.value === 0) {
                        database.query(
                           "UPDATE publications SET downvote=downvote + 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     } else {
                        return res
                           .status(500)
                           .json({
                              message:
                                 "Aie, aie, aie ... Il y a eu une couille dans le potage",
                           });
                     }
                  }
               );
            } else {
               return res.status(400).json({ message: "Vote non conforme" });
            }
         } else if (req.body.value === 1) {
            if (results[0].value === 0) {
               database.query(
                  "UPDATE publications_votes SET value=1 WHERE publications_id=?",
                  [req.params.publication_id],
                  function (err, results, fields) {
                     if (err) {
                        return res
                           .status(400)
                           .json({ message: err.sqlMessage });
                     } else {
                        database.query(
                           "UPDATE publications SET downvote=downvote - 1, upvote=upvote + 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     }
                  }
               );
            } else if (results[0].value === 1) {
               return res
                  .status(204)
                  .json({ message: "Vous avez déjà fait le même vote" });
            }
         } else if (req.body.value === 0) {
            if (results[0].value === 1) {
               database.query(
                  "UPDATE publications_votes SET value=0 WHERE publications_id=?",
                  [req.params.publication_id],
                  function (err, results, fields) {
                     if (err) {
                        return res
                           .status(400)
                           .json({ message: err.sqlMessage });
                     } else {
                        database.query(
                           "UPDATE publications SET downvote=downvote + 1, upvote=upvote - 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     }
                  }
               );
            } else if (results[0].value === 0) {
               return res
                  .status(204)
                  .json({ message: "Vous avez déjà fait le même vote" });
            }
         } else if (err) {
            return res.status(400).json({ message: err.sqlMessage });
         } else if (req.body.value === -1) {
            if (results[0].value === 0) {
               database.query(
                  "DELETE FROM publications_votes WHERE publications_id=?",
                  [req.params.publication_id],
                  function (err, results, fields) {
                     if (err) {
                        return res
                           .status(400)
                           .json({ message: err.sqlMessage });
                     } else {
                        database.query(
                           "UPDATE publications SET downvote=downvote - 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     }
                  }
               );
            } else if (results[0].value === 1) {
               database.query(
                  "DELETE FROM publications_votes WHERE publications_id=?",
                  [req.params.publication_id],
                  function (err, results, fields) {
                     if (err) {
                        return res
                           .status(400)
                           .json({ message: err.sqlMessage });
                     } else {
                        database.query(
                           "UPDATE publications SET upvote=upvote - 1 WHERE id=?",
                           [req.params.publication_id],
                           function (err, results, fields) {
                              if (err) {
                                 return res
                                    .status(400)
                                    .json({ message: err.sqlMessage });
                              } else {
                                 return res.status(200).json(results);
                              }
                           }
                        );
                     }
                  }
               );
            }
         }
      }
   );
};

exports.addFavorites = (req, res, next) => {
   const userId = misc.getUserId(req);
   database.query(
      "SELECT * FROM favorites WHERE publications_id=? AND users_id=?",
      [req.params.publication_id, userId],
      function (err, results, fields) {
         if (results.length === 0) {
            {
               database.query(
                  "INSERT INTO favorites(publications_id, users_id)VALUES(?, ?)",
                  [req.params.publication_id, userId],
                  function (err, results, fields) {
                     if (err) {
                        return res
                           .status(400)
                           .json({
                              message: `La publication visée n'existe plus, elle a probablement été supprimée`,
                           });
                     } else {
                        return res
                           .status(201)
                           .json({ message: "Ajouté aux favoris" });
                     }
                  }
               );
            }
         } else if (err) {
            return res.status(400).json({ message: err.sqlMessage });
         } else if (results.length > 0) {
            return res
               .status(200)
               .json({
                  message:
                     "Se trouve déjà dans vos favoris, pour le retirer allez dans votre profil",
               });
         } else {
            return res
               .status(500)
               .json({
                  message:
                     "Aie, aie, aie ... Il y a eu une couille dans le potage",
               });
         }
      }
   );
};

exports.deleteBookmark = (req, res, next) => {
   const userid = misc.getUserId(req);
   database.query(
      "DELETE FROM favorites WHERE publications_id=?",
      [req.params.publication_id],
      function (err, results, fields) {
         if (err) {
            return res.status(400).json({ message: err.sqlMessage });
         } else {
            return res.status(204).json({ message: "Favori supprimé" });
         }
      }
   );
};
