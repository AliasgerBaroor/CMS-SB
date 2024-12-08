require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process")
const { publisher, subscriber } = require("./redisClient")
const http = require('http');

const { Server: SocketServer } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});


const name = "nanoFind";

const publishLog = (log) => {
  publisher.publish(`logs:${name}`, JSON.stringify({ log }));
};

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  // Subscribe to Redis channelx
  await subscriber.subscribe(`logs:${name}`);
  console.log(`Subscribed to logs:${name}`);

  subscriber.on("message", (channel, message) => {
    if (channel === `logs:${name}`) {
      io.emit(`logs:${name}`, message); 
    }
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.post("/api/v1/build/cms", async (req, res) => {

  const templatedPackageJSON = `{
      "name": "${name}",
      "version": "1.0.0",
      "private": true,
      "scripts": {
          "dev": "next dev --turbopack",
          "build": "next build",
          "start": "next start",
          "lint": "next lint"
      },
      "dependencies": {
          "@chakra-ui/react": "^3.2.2",
          "@emotion/react": "^11.13.5",
          "next": "15.0.3",
          "next-themes": "^0.4.3",
          "react": "18",
          "react-dom": "18",
          "react-icons": "^5.3.0",
          "${name}": "file:"
      },
      "devDependencies": {
          "@types/node": "^20",
          "@types/react": "^18",
          "@types/react-dom": "^18",
          "eslint": "^8",
          "eslint-config-next": "15.0.3",
          "typescript": "^5"
      }
  }`;

  try {
    const sourcePath = path.join(__dirname, "template");
    const destinationPath = path.join(__dirname, "builds", name);
    const buildsFolder = path.join(__dirname, "builds", name);

    await fs.cp(sourcePath, destinationPath, { recursive: true });

    await fs.writeFile(path.join(destinationPath, "package.json"), templatedPackageJSON);

    console.log("Build Started...");
    publishLog("Build Started...");

    const p = exec(`cd ${destinationPath}`);
    // const p = exec(`cd ${destinationPath} && npm install --omit=dev && npm run build`);

    p.stdout.on("data", (data) => {
        console.log(data.toString());
        publishLog(data.toString());
    });
    
    p.stderr.on("data", (data) => {
        console.error("Build Error:", data.toString());
        publishLog("Build Error: " + data.toString());
    });
    
    p.on("error", (error) => {
        console.error("Process Error:", error.message);
        publishLog("Process Error: " + error.message);
    });
    
    p.on("close", async (code) => {
      if (code !== 0) {
        console.error(`Build process exited with code ${code}`);
        publishLog(`Build process exited with code ${code}`);
        return; // Exit if the build failed
      }
      
      try {
        // await fs.rm(path.join(buildsFolder, "src"), { recursive: true, force: true });
        // await fs.rm(path.join(buildsFolder, ".eslintrc.json"), { force: true });
        //     await fs.rm(path.join(buildsFolder, ".gitignore"), { force: true });
        //     await fs.rm(path.join(buildsFolder, "next-env.d.ts"), { force: true });
        //     await fs.rm(path.join(buildsFolder, "next-sitemap.config.js"), { force: true });
        //     await fs.rm(path.join(buildsFolder, "next.config.ts"), { force: true });
        //     await fs.rm(path.join(buildsFolder, "README.md"), { force: true });
        //     await fs.rm(path.join(buildsFolder, "tsconfig.json"), { force: true });
    


        const p2 = exec(`docker build -t ${name}:v1 -f build-images/Dockerfile .`);

        p2.stdout.on("data", (data) => {
          console.log(data.toString());
          publishLog(data.toString());
        });
      
        p2.stderr.on("data", (data) => {
          const log = data.toString();
      
          // Filter out non-critical logs
          if (log.includes("Build Error:")) {
            console.error("Build Error:", log);
            publishLog("Build Error:", log);
          } else {
            console.warn("docker image warning:", log);
            publishLog("docker image warning:", log);
          }
        });
      
        p2.on("error", (error) => {
          console.error("Process Error:", error.message);
          publishLog("Process Error:", error.message)
        });
      
        p2.on("close", async (code) => {
          if (code === 0) {
            console.log("Build Completed...");
            publishLog("Build Completed...");
            console.log("Docker image built successfully!");
          } else {
            console.error(`Docker image build process exited with code: ${code}`);
            publishLog(`Docker image build process exited with code: ${code}`)
          }
        });

        console.log("Deployment Started...");
        publishLog("Deployment Started...");

        const p3 = exec(`docker run -itd --rm --name ${name} ${name}:v1`);
        p3.stdout.on("data", (data) => {
          console.log(data.toString());
          publishLog(data.toString());
        });
      
        p3.stderr.on("data", (data) => {
          const log = data.toString();
      
          // Filter out non-critical logs
          if (log.includes("Deployment Error:")) {
            console.error("Deployment Error:", log);
            publishLog("Deployment Error:", log);
          } else {
            console.warn("docker image warning:", log);
            publishLog("docker image warning:", log);
          }
        });
      
        p3.on("error", (error) => {
          console.error("Process Error:", error.message);
          publishLog("Process Error:", error.message);

        });
      
        p3.on("close", async (code) => {
          if (code === 0) {
            console.log("Deployment Completed...");
            publishLog("Deployment Completed...");
            console.log("Docker image deployed successfully!");
            console.log("Done...")
            publishLog("Done...")
          } else {
            console.error(`Deployment process exited with code: ${code}`);
            publishLog(`Deployment process exited with code: ${code}`);

          }
        });


        res.status(200).json({message : "Build success!"})
          
        } catch (cleanupError) {
          console.error("Cleanup Error:", cleanupError.message);
          publishLog("Cleanup Error: " + cleanupError.message);
        }

        });
        
  } catch (error) {
    console.error("Error while building CMS:", error);
    publishLog(`Error: ${error.message}`);
    res.status(500).send({ error: "Failed to build CMS" });
  }
});

const PORT = process.env.SERVERPORT || 8002;
const SOCKETPORT = process.env.SOCKETSERVERPORT || 9002;

app.listen(PORT, () => console.log(`Build server listening on port http://localhost:${PORT}`));

server.listen(SOCKETPORT, () => {
  console.log(`Socket server listening on port http://localhost:${SOCKETPORT}`);
});
