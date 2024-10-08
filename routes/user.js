const express = require('express');
const router = express.Router();
const { registerUser, login, getAllUser, getUserById, updateDetails, deleteUser } = require('../controllers/user');
const authentication = require('../middlewares/auth')

router.post('/register', registerUser);
router.post('/login', login);
router.get('/all', getAllUser);
router.get('/:id', authentication, getUserById);
router.put('/:id', authentication, updateDetails);
router.delete('/:id', authentication, deleteUser);
module.exports = router;