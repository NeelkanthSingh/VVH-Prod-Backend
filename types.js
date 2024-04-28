const zod = require("zod")

const createUser = zod.object({
    username: zod.string(),
    email: zod.string(),
    refresh_token: zod.string().isOptional()
})

const storeToken = zod.object({
    email: zod.string(),
    access_token: zod.string(),
    scope: zod.string(),
    token_type: zod.string(),
    id_token: zod.string(),
    expiry_date: zod.date()
})

const createDocument = zod.object({
    email: zod.string(),
    doc_name: zod.string(),
    doc_url: zod.string(),
    last_updated: zod.date(),
    total_visits: zod.number()
})

module.exports = {
    createUser: createUser,
    storeToken: storeToken
}