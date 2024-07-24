const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
    try {
        const comment = new Comment({
            ...req.body,
            author: req.user._id,
            recipe: req.params.recipeId
        });
        await comment.save();
        res.status(201).json({ comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getCommentsByRecipeId = async (req, res) => {
    try {
        const comments = await Comment.find({ recipe: req.params.recipeId });
        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ updatedComment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
