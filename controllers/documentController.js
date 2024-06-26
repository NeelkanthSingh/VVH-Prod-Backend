const { document, user } = require("../db");
const INTERNAL_JWT_SECRET = process.env.INTERNAL_JWT_SECRET;
const jwt = require("jsonwebtoken");
const documentController = {};

documentController.getAllDocuments = async (req, res) => {
try {
    let docs = await document.find({email: req.email});
        
    docs = docs.map(doc => {
            return {
                doc_name: doc.doc_name,
                last_updated: doc.last_updated,
                version: doc.version,
                total_visits: doc.total_visits,
                doc_url: doc.doc_url,
            };
        });

        return res.status(200).json({
            message: "All documents fetched successfully",
            documents: {
                docs            
            }
        });
} catch (err) {
    console.error(err);
            return res.status(500).json({
                message: "Internal server error",
            });
} 
};

documentController.getDocument = async (req, res) => {
    const username = req.query.username;
    const doc_name = req.query.doc_name;

    try {
        const userDetail = await user.findOne({ username: username });
        const docDetail = await document.findOne({ email: userDetail.email, doc_name: doc_name });
        if (!docDetail) { 
            return res.status(404).json({
                message: "Document not found",
            });
        }
        return res.status(200).json({
            message: "Document fetched successfully",
            url: docDetail.doc_url,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { documentController };