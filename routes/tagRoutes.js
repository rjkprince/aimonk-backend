const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");
const { getTagTree } = require("../helperService");

// GET all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all tags
router.get("/tree", async (req, res) => {
  try {
    const tree = await getTagTree();
    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a tag
router.post("/pushUpdates", async (req, res) => {
  try {
    const updates = req.body.updates;
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const bulkOps = updates
      .map((update) => {
        if (!update || !update.id || !update.name || !update.data) return null; // Skip invalid entries

        const { id, name, data, parentTagId } = update;

        // If the tag exists, update it. Otherwise, insert a new one.
        return {
          updateOne: {
            filter: { _id: id }, // Check for existing tag by id
            update: {
              $set: { _id: id, name, data, parentTagId: parentTagId || null },
            },
            upsert: true, // Insert new document if not found
          },
        };
      })
      .filter((op) => op !== null); // Remove null operations

    if (bulkOps.length > 0) {
      await Tag.bulkWrite(bulkOps);
    }

    res.json("Updates done");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new tag
router.post("/", async (req, res) => {
  const tag = {
    name: req.body.name,
    data: req.body.data,
  };
  if (req.body.parentTagId) {
    tag.parentTagId = req.body.parentTagId;
  }

  try {
    const newTag = await Tag.create(tag);
    res.json(newTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
