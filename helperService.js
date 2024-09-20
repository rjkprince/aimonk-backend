const Tag = require("./models/Tag");

async function getTagTree() {
  try {
    const tagTree = await buildTagTree(null);
    return tagTree;
  } catch (error) {
    console.error("Error building tag tree:", error);
    throw error;
  }
}

async function buildTagTree(tagId = null) {
  const tags = await Tag.find({ parentTagId: tagId });

  const tree = await Promise.all(
    tags.map(async (tag) => {
      const children = await buildTagTree(tag._id);
      return {
        id: tag._id,
        parentTagId: tag.parentTagId,
        name: tag.name,
        data: tag.data,
        children,
      };
    })
  );

  return tree;
}

module.exports = { getTagTree };
