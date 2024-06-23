const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
//localfileupload -> handler function

exports.localFileUpload = async (req, res) => {
  try {
    //fetch filefrom request
    const file = req.files.file;
    console.log("File Info  ", file);

    //create path where file need to be stored on server
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split("/")[1]}`;
    console.log("PATH-> ", path);

    //add path to the move fucntion
    file.mv(path, (err) => {
      console.log(err);
    });

    //create a successful response
    res.json({
      success: true,
      message: "Local File Uploaded Successfully",
    });
  } catch (error) {
    console.log("Not able to upload the file on server");
    console.log(error);
  }
};
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  console.log("temp file path: ", file.tempFilePath);
  options.resource_type = "auto"; //here auto means it will detect the file type automatically
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//imageupload -> handler function
exports.imageUpload = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.imageFile;
    console.log(file);

    //validation of file

    const supportedTypes = ["jpeg", "jpg", "png", "gif"];
    const fileType = file.mimetype.split("/")[1].toLowerCase();
    console.log("filetype: ", fileType);
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.json({
        success: false,
        message: "File type not supported",
      });
    }

    //file format supported
    console.log("uploading file to cloudinary");
    const response = await uploadFileToCloudinary(file, "MediaAssets");
    console.log(response);
    //save file in database
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: response.secure_url,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Image upload failed",
    });
  }
};

//video upload handler

exports.videoUpload = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);
    const file = req.files.videoFile;

    //validation of file
    const supportedTypes = ["mp4", "avi", "mov", "wmv", "3gpp"];
    const fileType = file.mimetype.split("/")[1].toLowerCase();
    console.log("filetype: ", fileType);

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.json({
        success: false,
        message: "File type not supported",
      });
    }

    //file format supported
    console.log("uploading file to cloudinary");
    const response = await uploadFileToCloudinary(file, "MediaAssets");
    console.log(response);

    //save file in database
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      message: "Video uploaded successfully",
      imageUrl: response.secure_url,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Video upload failed",
    });
  }
};
