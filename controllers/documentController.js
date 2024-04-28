const { user, document } = require("../db");
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

module.exports = { documentController };