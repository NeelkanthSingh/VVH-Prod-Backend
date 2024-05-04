const { document, uploadedDocumentStatus } = require("../db");
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

documentController.getUploadStatus = async (req, res) => {
    try {
        const docs = await uploadedDocumentStatus.find({email: req.email});
        const status = docs.length > 0 ? true : false;
        return res.status(200).json({
            status
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }

};

module.exports = { documentController };