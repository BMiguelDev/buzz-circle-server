const Post = require('../model/Post');
const ROLES_LIST = require('../config/roles_list');

const NUMBER_RESULTS_PER_PAGE = 16;

const getAllPosts = async (req, res) => {
    const pageNumber = req?.query?.page;
    const findOptions = req?.query?.userId ? { userId: req.query.userId } : {};

    // If the requested endpoint has a 'userId' or 'page' query, only return the posts that meet those conditions
    let posts;
    // The 'skip' and 'limit' methods allow the implementation of the pagination functionality
    if(pageNumber) posts = await Post.find(findOptions).sort({ date: -1 }).skip(NUMBER_RESULTS_PER_PAGE*pageNumber).limit(NUMBER_RESULTS_PER_PAGE);     // Sorting by descending date ("{ date: -1 }"), so the most recent results are retrieved first
    else posts = await Post.find(findOptions);  // Calling the 'find' method with no arguments (or empty object) will return all posts; calling it with an object as argument will look for elements with that object's properties

    if (!posts) return res.status(204).json({ 'message': 'No posts found' });
    res.json(posts);
}

const createPost = async (req, res) => {
    if (!req?.body?.title || !req?.body?.body || !req?.body?.userId) return res.status(400).json({ 'message': 'Title, body and userId fields are required.' });

    const user_id = req.user_id;  // Get the decoded 'user_id' set by the 'verifyJWT' middleware
    if(user_id !== req.body.userId) return res.status(403).json({ 'message': `Forbidden from creating posts authored by other users` });   // If authenticated user is not the author of the post to create, return response with 'status' of 403 ("Forbidden")

    try {
        const result = await Post.create({
            title: req.body.title,
            body: req.body.body,
            userId: req.body.userId,
            date: req.body.date,
            reactions: req.body.reactions
        });
        res.status(201).json({ 'success': `New post '${req.body.title}' created successfully`, 'result': result });    // Set response with 'status' of 201 ("Created")
    } catch (err) {
        res.status(500).json({ 'message': err.message });   // Set response with 'status' of 500 ("Server Error")
    }
}

const updatePost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `ID parameter is required.` });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) return res.status(204).json({ 'message': `No post matches ID ${req.params.id}` });

    const user_id = req.user_id;  // Get the decoded 'user_id' set by the 'verifyJWT' middleware
    if(user_id !== post.userId) return res.status(403).json({ 'message': `Forbidden from editing other user's posts` });   // If authenticated user is not the author of the post to edit, return response with 'status' of 403 ("Forbidden")

    if (req.body?.date) post.date = req.body.date;
    if (req.body?.title) post.title = req.body.title;
    if (req.body?.body) post.body = req.body.body;

    const result = await post.save();
    res.json(result);
}

const deletePost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `Post ID is required.` });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) return res.status(204).json({ 'message': `No post matches ID ${req.params.id}` });

    const user_id = req?.user_id;   // Get the decoded 'user_id' set by the 'verifyJWT' middleware
    const roles = req?.roles;   // Get the decoded 'roles' set by the 'verifyJWT' middleware
    if(user_id !== post.userId && !roles.includes(ROLES_LIST.Admin)) return res.status(403).json({ 'message': `Forbidden from deleting other user's posts` });   // If authenticated user is not an admin and not the author of the post to delete, return response with 'status' of 403 ("Forbidden")

    const result = await post.deleteOne();
    res.json(result);
}

const updateReactions = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `Post ID is required.` });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) return res.status(204).json({ 'message': `No post matches ID ${req.params.id}` });

    if(req.body?.reactions) {
        const newReactions = req.body.reactions;
        let isWrongFormat = false;

        // Check if updated reactions have the same property keys as the previous reactions
        if(Object.keys(newReactions).length !== Object.keys(post.reactions).length) isWrongFormat = true;
        Object.keys(newReactions).forEach(newReaction => {
            if(!Object.keys(post.reactions).includes(newReaction)) isWrongFormat = true;
        });

        if(isWrongFormat) return res.status(400).json({ 'message': "Updated reactions need to follow the existing reaction's format" });

        const user_id = req.user_id;  // Get the decoded 'user_id' set by the 'verifyJWT' middleware
        let isUpdatingOtherUsersReactions = false;

        // Check if the difference between the updated reactions object and the previous reactions object includes any user ID that isn't the currently authenticated user's ID
        Object.entries(newReactions).forEach(([newReactionKey, newReactionUserIdList]) => {
            const previousReactionsUserIdList = post.reactions[newReactionKey];
            let addedUserIds = newReactionUserIdList.filter(newReactionUserId => !previousReactionsUserIdList.includes(newReactionUserId))
            let removedUserIds = previousReactionsUserIdList.filter(previousReactionUserId => !newReactionUserIdList.includes(previousReactionUserId));
            let changedUserIds = [...addedUserIds, ...removedUserIds];
            if(changedUserIds.filter((userId) => userId !== user_id).length > 0) isUpdatingOtherUsersReactions = true;
        })

        if(isUpdatingOtherUsersReactions) return res.status(403).json({ 'message': "Forbidden from changing other user's reactions" });

        // If there are no errors, update the post's reactions
        post.reactions = req.body.reactions;
    }

    const result = await post.save();
    res.json(result);
}

const getPost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `Post ID url parameter is required.` });

    const post = await Post.findOne({ _id: req.params.id }).exec();
    if (!post) return res.status(204).json({ 'message': `No post matches ID ${req.params.id}` });

    res.json(post);
}

module.exports = { getAllPosts, createPost, updatePost, deletePost, updateReactions, getPost }
