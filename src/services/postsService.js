const Sequelize = require('sequelize');
const config = require('../database/config/config');
const { User, Category, BlogPost, PostCategory } = require('../database/models');

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' ? config.test : config.development,
);

const findAll = async () => BlogPost.findAll({
  // include: [{
  //   model: PostCategory,
  //   as: 'categories',
  // }, {
  //   model: User,
  //   as: 'user',
  // }],
  include: [{
    model: User,
    as: 'user',
    attributes: { exclude: ['password'] },
  }, {
    model: Category,
    as: 'categories',
    through: { attributes: [] },
  }],
});

const create = async (post, categoryIds) => {
  const { userId, title, content } = post;
  console.log(categoryIds);

  const result = await sequelize.transaction(async (t) => {
    const newPost = await BlogPost.create(
      { title, content, userId },
      { transaction: t },
    );

    await PostCategory.bulkCreate(
      categoryIds.map((categoryId) => ({
        postId: newPost.id,
        categoryId,
      })),
      { transaction: t },
    );

    return newPost;
  });

  return result.dataValues;
};

module.exports = {
  findAll,
  create,
};