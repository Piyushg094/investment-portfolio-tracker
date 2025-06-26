const User = require('../models/stockUser')
const bcrypt = require('bcrypt');

const { generateToken, jwtAuthMiddleware } = require('../utils/jwt')


exports.userRegister = async (req,res) => {
    try {
        const { password, ...rest } = req.body;
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user with hashed password
        const newUser = new User({ ...rest, password: hashedPassword });
        // Save the new user to the database
        let response = await newUser.save();
        console.log('data Saved');
        const payload = {
            id: response.id
        };
        response = response.toObject()
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is :', { token: token });
        delete response.password
        res.status(200).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.userLogin = async (req , res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const payload = { id: user.id };
        const token = generateToken(payload);
        res.status(200).json({ response:{message : 'user login succesfully '}, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



