const { oAuthResponse, document } = require("../db")
const { oauth2Client } = require("../drive")
const { google } = require("googleapis")
const { user } =  require("../db")
const { uploadedDocumentStatus } = require("../db")
const path = require('path');
const fs = require("fs")

let uploadController = {};

uploadController.fileUpload = async (req, res) => {

  const email = req.email
  const docName = req.body.name
  const pdfName = req.body.name

  uploadToGoogleDrive(email, pdfName, docName)

    await uploadedDocumentStatus.create({
        email: email,
        doc_name: docName,
        created_at: new Date()
    });

  res.json({ message: "Successfully uploaded files" });
}

async function uploadToGoogleDrive(email, pdfName, docName){
     
    const token = await oAuthResponse.findOne({
        email: email
    })

    const userDetail = await user.findOne({email: email});

    oauth2Client.setCredentials({
        "access_token": token.access_token,
        "refresh_token": userDetail.refresh_token,
        "scope": token.scope,
        "token_type": token.token_type,
        "id_token": token.id_token,
        "expiry_date": token.expiry_date,
    })

    let drive = google.drive({
        version: "v3",
        auth: oauth2Client,
    });
    
    const folderName = docName;

    drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and trashed=false and name='" + folderName + "'",
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    }).then((result) => {
    const folder = result.data.files.find(file => file.name === folderName);
    const folderId = folder ? folder.id : "Folder not found";
    console.log("Folder ID:", folderId);
    
    if (folderId != "Folder not found") {
        // Check if folder exists
        console.log("Folder exists");
    
        // Get the number of files in the folder
        drive.files.list({
        q: `'${folderId}' in parents and trashed=false and mimeType!='application/vnd.google-apps.folder'`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        }).then((result) => {
            const files = result.data.files;
            console.log("Number of files:", files.length);
            const pdfMetadata = {
                name: pdfName+`_${files.length + 1}`,
                parents: [folderId],
                mimeType: 'application/pdf',
            };

            // Store the pdf file in the google drive.
            const pdfPath = path.join(__dirname, `./../../uploads/${pdfName}.pdf`);
            const pdfFile = fs.createReadStream(pdfPath);

            drive.files.create({
                resource: pdfMetadata,
                media: {
                    mimeType: 'application/pdf',
                    body: pdfFile,
                }
            }, async (err, file) => {
            if (err) return console.error('Error uploading PDF:', err);
                console.log('PDF uploaded:', file.data.id);

                const fileID = file.data.id;

                // Create a new permission for the file
                drive.permissions.create({
                    fileId: fileID,
                    requestBody: {
                    role: 'reader',
                    type: 'anyone',
                    },
                }, async (err, res) => {
                    if (err) {
                    console.error('Error creating permission:', err);
                    return;
                    }
                
                    // Extract the public link with view access
                    const publicLink = `https://drive.google.com/file/d/${fileID}/view?usp=sharing`;
                    console.log('Public link with view access:', publicLink);

                    const documentExists = await document.findOne({email : email, doc_name: docName});
                    if(documentExists != null){
                        await document.updateOne({email: email}, {
                            $set: {
                                doc_url: publicLink,
                                last_updated: new Date(),
                                version: documentExists.version + 1
                            }
                        });
                    }else{
                        await document.create({
                            email: email,
                            doc_name: docName,
                            doc_url: publicLink,
                            last_updated: new Date(),
                            total_visits: 0,
                            version: 1
                        });
                    }
                    await uploadedDocumentStatus.deleteOne({email: email, doc_name: docName});
                });
            });
        });
    } else {
        console.log("Folder not found");
        drive.files.create({
            resource: {
                name: docName,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id',
        }, (err, file) => {
            if(err) return console.error('Error creating folder:', err);
            const folderId = file.data.id;
            console.log("FolderID: " + folderId)
    
            const pdfMetadata = {
                name: pdfName+"_1",
                parents: [folderId],
                mimeType: 'application/pdf',
            };
    
            // Store the pdf file in the google drive.
            const pdfPath = path.join(__dirname, `./../../uploads/${pdfName}.pdf`);
            const pdfFile = fs.createReadStream(pdfPath);
    
            drive.files.create({
                resource: pdfMetadata,
                media: {
                    mimeType: 'application/pdf',
                    body: pdfFile,
                }
            }, async (err, file) => {
            if (err) return console.error('Error uploading PDF:', err);
                console.log('PDF uploaded:', file.data.id);

                const fileID = file.data.id;

                // Create a new permission for the file
                drive.permissions.create({
                    fileId: fileID,
                    requestBody: {
                    role: 'reader',
                    type: 'anyone',
                    },
                }, async (err, res) => {
                    if (err) {
                    console.error('Error creating permission:', err);
                    return;
                    }
                
                    // Extract the public link with view access
                    const publicLink = `https://drive.google.com/file/d/${fileID}/view?usp=sharing`;
                    console.log('Public link with view access:', publicLink);

                    const documentExists = await document.findOne({email : email, doc_name: docName});
                    if(documentExists != null){
                        await document.updateOne({email: email}, {
                            $set: {
                                doc_url: publicLink,
                                last_updated: new Date(),
                                version: documentExists.version + 1
                            }
                        });
                    }else{
                        await document.create({
                            email: email,
                            doc_name: docName,
                            doc_url: publicLink,
                            last_updated: new Date(),
                            total_visits: 0,
                            version: 1
                        });
                    }
                    await uploadedDocumentStatus.deleteOne({email: email, doc_name: docName});
                });
            });
        })
    }
    }).catch(err => {
        console.error("Error searching for folder:", err);
    });
}

module.exports = { uploadController,
 }