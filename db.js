const mongoose = require("mongoose")
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    refresh_token: String
})

const documentSchema = mongoose.Schema({
    email: String,
    doc_name: String,
    doc_url: String,
    last_updated: Date,
    version: Number,
    total_visits: Number
})

const OAuthResponseSchema = mongoose.Schema({
    email: String,
    access_token: String,
    scope: String,
    token_type: String,
    id_token: String,
    expiry_date: Date
})

const user = mongoose.model('Users', userSchema)
const oAuthResponse = mongoose.model('OAuthResponse', OAuthResponseSchema)
const document = mongoose.model('Documents', documentSchema)

module.exports = {
    user,
    oAuthResponse,
    document
}