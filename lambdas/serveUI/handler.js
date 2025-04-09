const fs = require("fs");
const path = require("path");

module.exports.serveUI = async (event) => {
  const resourcePath = event.path.substring(1); // Remove the leading slash

  // Set the default response file
  let filePath = path.join(__dirname, "index.html");
  let contentType = "text/html";

  // Determine the content type for the static assets
  if (resourcePath === "styles.css") {
    filePath = path.join(__dirname, "styles.css");
    contentType = "text/css";
  } else if (resourcePath === "script.js") {
    filePath = path.join(__dirname, "script.js");
    contentType = "application/javascript";
  } else if (resourcePath === "coffee-cup.png") {
    filePath = path.join(__dirname, "coffee-cup.png");
    contentType = "image/png";
  }

  try {
    // Read the image file as binary (for non-text files)
    const fileContent =
      resourcePath === "coffee-cup.png"
        ? fs.readFileSync(filePath) // For binary content (image)
        : fs.readFileSync(filePath, "utf8"); // For text-based content

    return {
      statusCode: 200,
      headers: { "Content-Type": contentType },
      body: fileContent.toString("base64"), // Convert binary data to base64 for images
      isBase64Encoded: resourcePath === "coffee-cup.png", // Mark as base64 encoded for binary files
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return {
      statusCode: 404,
      body: "File not found",
    };
  }
};
