const axios = require("axios");
const jwt = require('jsonwebtoken')
const { user, oAuthResponse } = require("../db");
const { storeToken } = require("../types");
const { oauth2Client } = require("../drive");
const { JWT_SECRET } = require("../config")

let googleController = {}

googleController.handleRedirect = async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const response = await storeResponseDataFromToken(tokens, res)

    const email = response.data.email;
    const isUser = await user.findOne({ email: email });

    if(!isUser){
        const username = createUniqueUsername(email)
        await user.create({
        username: username,
        email: email
        });
    }

    if(tokens.refresh_token != undefined){
        await user.updateOne({email: email},{
        $set: {
            refresh_token: tokens.refresh_token
        }});
    }

    const refreshToken = jwt.sign({
        username: createUniqueUsername(email),
        email: email,
        token_type: "REFRESH"
    }, JWT_SECRET, {
        expiresIn: '1d'
    });

    res.cookie('jwtToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 24 * 60 * 60 * 1000 })
    res.redirect('http://localhost:5173/signin');
};

function createUniqueUsername(email) {
    let i = 0;
    for(;i<email.length;i++){
        if(email[i]=='@'){
            break;
        }
    }

    const username = email.substring(0, i);
    return username;
}

async function storeResponseDataFromToken(tokens, res) {
    const response = await axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json",
            },
        });
    const isToken = await oAuthResponse.findOne({email: response.data.email});
    if(isToken){
        await oAuthResponse.deleteOne({email: isToken.email});
    }

    const parsedPayload = storeToken.safeParse({
        email: response.data.email,
        access_token: tokens.access_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        id_token: tokens.id_token,
        expiry_date: new Date(tokens.expiry_date)
    });

    if (!parsedPayload.success) {
        return res.status(411).json({
            message: "Token schema doesn't fit!"
        });
    }

    await oAuthResponse.create({
        email: response.data.email,
        access_token: tokens.access_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        id_token: tokens.id_token,
        expiry_date: new Date(tokens.expiry_date)
    });

    return response;
}

module.exports = {
    googleController
}