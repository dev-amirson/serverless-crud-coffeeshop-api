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
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, max-age=300",
      },
      body: fileContent,
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "File not found" }),
    };
  }
};
