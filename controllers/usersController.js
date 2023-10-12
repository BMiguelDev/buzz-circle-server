const User = require('../model/User');

const NUMBER_RESULTS_PER_PAGE = 30;

const getAllUsers = async (req, res) => {
    const pageNumber = req?.query?.page;
    const findOptions = req?.query?.username ? { username: req.query.username } : {};

    // If the requested endpoint has a 'username' or 'page' query, only return the users that meet those conditions
    let users;
    // The 2nd argument of the 'find' method specifies that only the '_id' and 'username' properties of each document should be retrieved from the database. This way, user private information isn't exposed
    if (pageNumber) users = await User.find(findOptions, { _id: 1, username: 1 }).skip(NUMBER_RESULTS_PER_PAGE * pageNumber).limit(NUMBER_RESULTS_PER_PAGE);     // The 'skip' and 'limit' methods allow the implementation of the pagination functionality
    else users = await User.find(findOptions, { _id: 1, username: 1 });   // Calling the 'find' method with an empty object as 1st argument will return all users; calling it with an object as 1st argument will look for elements with that object's properties

    if (!users) return res.status(204).json({ 'message': 'No users found' });

    res.json(users);
}

// const updateUser = async (req, res) => {
//     if (!req?.params?.id) return res.status(400).json({ 'message': `User ID is required.` });

//     const user = await User.findOne({ _id: req.params.id }).exec();
//     if (!user) return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });

//     const user_id = req.user_id;  // Get the decoded 'user_id' set by the 'verifyJWT' middleware
//     if(user_id !== user._id.toString()) return res.status(403).json({ 'message': `Forbidden from editing other user's information` });   // If authenticated user is not the user to edit, return response with 'status' of 403 ("Forbidden")

//     if (req.body?.username) user.username = req.body.username;

//     const result = await user.save();
//     res.json(result);
// }

const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `User ID is required` });

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });

    // Make sure the authenticated user isn't requesting a deletion of its own account (this could be a future feature)
    const user_id = req.user_id;  // Get the decoded 'user_id' set by the 'verifyJWT' middleware
    if (user_id === user._id.toString()) return res.status(403).json({ 'message': `Forbidden from deleting own user account` });

    const result = await user.deleteOne();
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': `User ID is required` });

    const user = await User.findOne({ _id: req.params.id }, {_id: 1, username: 1}).exec();
    if (!user) return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });

    res.json(user);
}

module.exports = { getAllUsers, /* updateUser, */ deleteUser, getUser }
