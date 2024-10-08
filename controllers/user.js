const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validEmail, validPwd } = require('../utils/validator')

const registerUser = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;
        if (!(name && email && password)) {
            return res.status(400).json({ status: false, message: "Please fill in all fields." })
        }
        if (validEmail(email)) {
            return res.status(400).json({ status: false, message: "Enter a valid email address" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (validPwd(password)) {
            return res.status(400).json({
                status: false,
                message:
                    "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email: email.toLowerCase(),
            userType,
            password: hashedPassword
        });
        await user.save();
        return res.status(201).json({ status: true, message: "User register successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ status: true, message: "User login", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const getAllUser = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        const totalCount = await User.countDocuments();
        const checkUsers = await User.find({}).select({ password: 0 }).limit(perPage)
            .skip(skip)
        if (!checkUsers) {
            return res.status(404).json({ status: false, message: "No users found" })
        }
        return res.status(200).json({
            status: true,
            message: "Users found",
            data: checkUsers,
            pagination: {
                totalUser: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / perPage),
            },
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        // Check if the user is trying to access their own details
        if (req.user.userId !== id) {
            return res.status(403).json({ message: 'Access denied: Unauthorized to access this user\'s data' });
        }
        const user = await User.findById({ _id: id }).select({ password: 0 })
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" })
        }
        return res.status(200).json({ status: true, message: "User found", data: user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const updateDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, password } = req.body;
        if (req.user.userId !== id) {
            return res.status(403).json({ message: 'Access denied: Unauthorized to access this user\'s data' });
        }
        if (validPwd(password)) {
            return res.status(400).json({
                status: false,
                message:
                    "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(
            { _id: id },
            { name, password: hashedPassword },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" })
        }
        return res.status(200).json({ status: true, message: "User details updated" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.user.userId !== id) {
            return res.status(403).json({ message: 'Access denied: Unauthorized to access this user\'s data' });
        }
        const user = await User.findByIdAndDelete({ _id: id })
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found or already deleted" })
        }
        return res.status(200).json({ status: true, message: "User deleted successfull" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}
module.exports = { registerUser, login, getAllUser, getUserById, updateDetails, deleteUser }