const express = require('express');
const router = express.Router();
const User = require('../model/user');
const NonVerifiedUser = require('../model/NonVerifiedUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const converter = require('json-2-csv');
const validator = require('email-validator');
var SHA256 = require("crypto-js/sha256");
const { generateTokenFromPasswordHash,
    getPasswordResetURL,
    getEmailTemplate,
    getVerificationURL,
    getVerificationEmailTemplate,
    transporter
} = require('../modules/email');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_EVENT = process.env.JWT_SECRET_EVENT;
const JWT_EXPIRY_DURATION = '6h';

router.post('/register', async (req, res) => {
    // console.log(req.body);
    const { password: plainUserPassword, email } = req.body;
    const token = req.header('Authorization').split(" ")[1];
    var event_id;

    jwt.verify(token, JWT_SECRET_EVENT, (err, eventCreator) => {

        if (err) {
            return res.json({ status: "error", message: err });
        }
        else {
            event_id = eventCreator.event_id;
        }

    });

    const password = await bcrypt.hash(plainUserPassword, 10);

    if (!email || typeof (email) !== 'string') {
        console.log("Error in email");
        return res.json({ status: "error", message: "Invalid Email" })
    }
    if (!plainUserPassword || typeof (plainUserPassword) !== 'string') {
        return res.json({ status: "error", message: "Invalid Password" })
    }
    if (plainUserPassword.length < 6) {
        return res.json({ status: "error", message: "Password must be atleast 6 characters long" });
    }
    if (!validator.validate(email)) {
        console.log("Error validating email");
        return res.json({ status: "error", message: "Invalid Email" });
    }

    const data = {};

    for (const property in req.body) {
        if (property != 'email' && property != 'password') {
            data[property] = req.body[property];
        }
    }

    try {
        const response = await User.create({
            email,
            event_id,
            password,
            data
        });
        // console.log("User created successfully",response);
        const hash = SHA256(`${email}-${event_id}`).toString();
        try {
            const response = await NonVerifiedUser.create({
                email,
                event_id,
                hash
            });
            console.log("Reference created successfully", response);
            const url = getVerificationURL(hash);
            const emailTemplate = getVerificationEmailTemplate(email, url);
            transporter.sendMail(emailTemplate, (err, info) => {
                if (err) {
                    console.log(err);
                    return res.json({ status: 'error', message: 'Error while sending verification link to user' });
                }
                console.log(`Email sent to ${email}`);
                return res.json({ status: 'ok', message: 'Email has been sent to user' });
            })
        }
        catch (error) {
            console.log(error);
            let user
            let reference
            try {
                user = await User.findOne({ email, event_id });
                reference = await NonVerifiedUser.findOne({ email, event_id });
                if (user) {
                    user.delete();
                }
                if (reference) {
                    reference.delete();
                }
            }
            catch (error) {
                console.log(error);
                return res.json({ status: "error", message: "Error deleting invalid user or reference" });
            }
            return res.json({ status: "error", message: "Reference could not be made properly or mailing the link failed" });
        }
    }
    catch (error) {
        if (error.code === 11000) {
            console.log("Duplicate key error");
            return res.json({ status: "error", message: "Email Id for this event is already in use" })
        }
        throw (error);
    }

    res.json({ status: 200, message: { email, password, event_id } });
})

router.get('/verify-user', async (req, res) => {
    const { hash } = req.query;
    let reference
    try {
        reference = await NonVerifiedUser.findOne({ hash }).exec();
    }
    catch (error) {
        return res.json({ status: "error", message: "Error fetching reference, Please try again" });
    }
    if (reference && reference.hash === hash) {
        try {
            const email = reference.email
            const event_id = reference.event_id
            const response = await User.findOneAndUpdate({ email, event_id }, {
                $set: { verified: true }
            })
            await reference.delete()
            return res.json({ status: "ok", message: "User activated successfully" })
        }
        catch (error) {
            return res.json({ status: "error", message: "Invalid link, No user found or user already verified" });
        }
    }
    else {
        return res.json({ status: "error", message: "Invalid Link" });
    }
})


router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const token = req.header('Authorization').split(" ")[1];
    var event_id;

    jwt.verify(token, JWT_SECRET_EVENT, (err, eventCreator) => {

        if (err) {
            return res.json({ status: "error", message: err });
        }
        else {
            event_id = eventCreator.event_id;
        }

    });

    const user = await User.findOne({ email, event_id }).lean();

    if (!user) {
        return res.json({ status: "error", message: "Invalid Username/Password" });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            event_id,
            username: user.username
        },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY_DURATION }
        );
        return res.json({ status: 'ok', data: token });
    }

    return res.json({ status: "error", message: "Invalid Username/Password" });
});

router.post('/change-password', async (req, res) => {
    const { newpassword: plainUserPassword } = req.body;
    const token = req.header('Authorization').split(" ")[1];

    if (!plainUserPassword || typeof (plainUserPassword) !== 'string') {
        return res.json({ status: "error", message: "Invalid password" });
    }

    if (plainUserPassword.length < 6) {
        return res.json({ status: "error", message: "Password Length should be atleast 6 characters" });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;
        const password = await bcrypt.hash(plainUserPassword, 10);

        await User.updateOne({ _id }, {
            $set: { password }
        });

        return res.json({ status: 'ok', message: "Password successfully updated" });
    }
    catch (error) {
        console.log(error);
        return res.json({ status: 'error', message: "Error has occured while updating password" });
    }
});

router.get('/getUserData', async (req, res) => {
    const token = req.header('Authorization').split(" ")[1];
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const _id = user.id;

        const userData = await User.findById(_id).lean();
        console.log(userData);
        delete userData.password;
        delete userData._id;
        delete userData.__v;
        return res.json(userData);
    }
    catch (error) {
        console.log(error);
        return res.json({ status: error, message: "Token invalid or User does not exist" });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const verification_token = req.header('Authorization').split(" ")[1];
    var event_id;
    jwt.verify(verification_token, JWT_SECRET_EVENT, (err, eventCreator) => {
        if (err) {
            return res.json({ status: "error", message: err });
        }
        else {
            event_id = eventCreator.event_id;
        }
    });

    User.findOne({ email, event_id }, async (err, user) => {

        if (err) {
            return res.json({ status: "error", message: err });
        }
        else {
            if (user != null) {
                let createdAt;
                if (user.createdAt) {
                    createdAt = user.createdAt;
                }
                else {
                    createdAt = '';
                }
                const token = await generateTokenFromPasswordHash(user._id, user.password, createdAt);
                const url = getPasswordResetURL(user, token);
                const emailTemplate = getEmailTemplate(user, url);
                transporter.sendMail(emailTemplate, (err, info) => {
                    if (err) {
                        console.log(err);
                        return res.json({ status: 'error', message: 'Error while sending link to user' });
                    }
                    console.log(`Email sent to ${user.email}`);
                    return res.json({ status: 'ok', message: 'Email has been sent to user' });
                })
            }
            else {
                return res.json({ status: 'error', message: 'User with email not found for this Event' });
            }
        }

    })
})

router.get('/reset-password', async (req, res) => {
    console.log(req.query);
    userId = req.query.userid;
    token = req.query.token;
    let user
    try {
        user = await User.findById(userId).exec();
    }
    catch {
        return res.json({ status: 'error', message: 'User not found' });
    }
    return res.render('pages/reset-password', { 'token': token, 'userid': userId });
});

router.post('/reset-password', async (req, res) => {
    const { userid, token, plainUserPassword } = req.body;
    let user
    try {
        user = await User.findById(userid).exec();
    }
    catch {
        return res.json({ status: 'error', message: "User not found" });
    }
    let createdAt;
    if (user.createdAt) {
        createdAt = user.createdAt;
    }
    else {
        createdAt = '';
    }
    const secret = user.password + '-' + createdAt;
    let payload
    try {
        payload = await jwt.verify(token, secret);
    }
    catch {
        return res.json({ status: 'error', message: "Link used/expired" });
    }
    if (payload.userId === user._id.toString()) {
        const password = await bcrypt.hash(plainUserPassword, 10);
        try {
            await User.findByIdAndUpdate(userid, { password });
            return res.json({ status: 'ok' });
        }
        catch (err) {
            console.log(err);
            return res.json({ status: 'error', message: "Error updating password" });
        }
    }
    else {
        return res.json({ status: 'error', message: "Invalid User" });
    }
})


module.exports = router;
