const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const User = require("../models/User");
const protect = require("../middleware/auth");

// GET /api/notes - Get all notes for the authenticated user
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    })
      .populate("owner", "name email")
      .populate("collaborators", "name email")
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET /api/notes/search?q=keyword
router.get("/search", protect, async (req, res) => {
  try {

    const query = req.query.q;

    if (!query || query.trim() === "") {
      const notes = await Note.find({
        $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
      })
        return res.json(notes);
    }

    const notes = await Note.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id },
      ],
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],     

    })
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/notes — create a note
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      owner: req.user.id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/notes/:id — update a note
router.put("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    const isOwner = note.owner.toString() === req.user.id;
    const isCollaborator = note.collaborators
      .map((c) => c.toString())
      .includes(req.user.id);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE /api/notes/:id — delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Only the owner can delete this note" });
    }

    await note.deleteOne();

    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/notes/:id/collaborators — add a collaborator
router.post("/:id/collaborators", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Only the owner can add collaborators" });
    }

    const userToAdd = await User.findOne({ email: req.body.email });
    if (!userToAdd) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (note.collaborators.includes(userToAdd._id)) {
      return res.status(400).json({ msg: "User is already a collaborator" });
    }

    note.collaborators.push(userToAdd._id);
    await note.save();

    res.json({ msg: "Collaborator added", note });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
