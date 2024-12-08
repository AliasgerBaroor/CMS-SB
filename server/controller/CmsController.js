const router = require("express").Router();
const express = require("express");
const themeClient = require("../models/Cms")
const fs = require("fs/promises")
const pathLib = require("path");
const http = require('http');

const { Server: SocketServer } = require('socket.io');

const app = express()
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("assets:read", async (data) => {
    const fileTree = await generateFileTree("./themes/theme1");
    socket.emit("assets:write", { tree: fileTree } )
    // return res.json({ tree: fileTree });
  });
});

const findFiles = async (dir, baseUrl, extensions) => {
    let results = [];

    try {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = pathLib.join(dir, file.name);

            if (file.isDirectory()) {
                // Recurse into subdirectories
                const nestedResults = await findFiles(fullPath, baseUrl, extensions);
                results = results.concat(nestedResults);
            } else if (file.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
                // Convert the file system path to a server URL
                const relativePath = pathLib.relative(pathLib.join(__dirname, "themes"), fullPath);
                const serverUrl = `${baseUrl}/themes/${relativePath.replace(/\\/g, "/")}`;
                results.push({ serverUrl, fileName: pathLib.basename(fullPath) });
            }
        }
    } catch (err) {
        console.error("Error reading directory:", err);
    }
    return results;
};


router.get("/theme/preview", async (req, res) => {
    try {
        const themesPath = pathLib.join(__dirname , "../themes");

        const baseUrl = `http://localhost:8000`;
        const extensions = [".html"];

        const files = await findFiles(themesPath, baseUrl, extensions);
        res.status(200).json({ files });
    } catch (err) {
        console.error("Error finding files:", err);
        res.status(500).json({ error: "Failed to find files" });
    }
});


router.get("/themes", async (req, res) => {
    const response_find_themes = await themeClient.find({});
    const themes = response_find_themes[0].theme;
    res.status(200).json({themes})
})

router.get("/theme/details", async (req, res) => {
  const { theme } = req.query
  try {
    const response_theme_details = await themeClient.find({ name : theme });
    console.log(response_theme_details)
  } catch (err) {
    res.status(404).json({message : "theme not found!"})
  }
})


const generateFileTree = async (directory) => {
  const tree = {};

  const buildTree = async (currentDir, currentTree) => {
    const files = await fs.readdir(currentDir);

    for (const file of files) {
      const filePath = pathLib.join(currentDir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  };

  await buildTree(directory, tree);
  return tree;
};

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Socket Server is running on http://localhost:${PORT}`);
});

module.exports = router