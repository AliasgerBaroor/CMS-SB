const http = require('http');
const express = require('express');
const Docker = require("dockerode");
const httpProxy = require("http-proxy");

const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const proxy = httpProxy.createProxy({});

const db = new Map();

docker.getEvents((err, stream) => {
    if (err) {
        console.log("Error on getting events", err);
        return;
    }

    stream.on('data', async (chunk) => {
     try {
        if (!chunk) return;

        const event = JSON.parse(chunk.toString());

        if (event.Type === 'container' && event.Action == "start") {
            const container = docker.getContainer(event.id);
            const containerInfo = await container.inspect();

            const containerName = containerInfo.Name.substring(1);
            const ipAddress = containerInfo.NetworkSettings.IPAddress;

            const exposedPort = Object.keys(containerInfo.Config.ExposedPorts);

            let defaultPort = null;
            if (exposedPort && exposedPort.length > 0) {
                const [ port, type ] = exposedPort[0].split('/');

                if (type === "tcp") {
                    defaultPort = port;
                }
            }
            console.log(`Registering ${containerName}.localhost --> http://${ipAddress}:${defaultPort}`);

            db.set(containerName, { containerName, ipAddress, defaultPort });
        }
     } catch(error) {

     }
    })
})

const reverseProxyApp = express();

reverseProxyApp.use((req, res) => {
    const hostname = req.hostname;
    const subDomain = hostname.split(".")[0];

    if(!db.has(subDomain)) return res.status(404).end(404);

        const { ipAddress, defaultPort } = db.get(subDomain);

        const target = `http://${ipAddress}:${defaultPort || 80}`;
        console.log(`Forwarding ${hostname} --> ${target}`);

        return proxy.web(req, res, { target, changeOrigin: true, ws: true });
})
const reverseProxy = http.createServer(reverseProxyApp);

reverseProxy.on("upgrade", (req, socket, head) => {
    const hostname = req.headers.host;
    const subDomain = hostname.split(".")[0];

    if(!db.has(subDomain)) return res.status(404).end(404);

        const { ipAddress, defaultPort } = db.get(subDomain);

        const target = `http://${ipAddress}:${defaultPort || 80}`;

        return proxy.ws(req, socket, head, { target, ws: true });
})

const managementAPI = express();

managementAPI.use(express.json());

managementAPI.post("/containers", async (req, res) => {
    const { image, tag = "latest" } = req.body;

    let imageAlreadyExists = false;

    const images = await docker.listImages();

    for (const systemImage of images) {
        for (const systemTag of systemImage.RepoTags) {
            if (systemTag === `${image}:${tag}`) {
                imageAlreadyExists = true;
                break;
            }
        }
        if (imageAlreadyExists) break;
    }

    if (!imageAlreadyExists) {
        console.log(`pulling Image: ${image}:${tag}`);
        await new Promise((resolve, reject) => {
            docker.pull(`${image}:${tag}`, (err, stream) => {
                if (err) return reject(err);
                docker.modem.followProgress(stream, resolve, (progress) => console.log(progress));
            });
        });
        
    }

    const container = await docker.createContainer({
        Image: `${image}:${tag}`,
        Tty: false,
        HostConfig: {
            AutoRemove: true
        }
    });


    await container.start();

    return res.json({ status: "success", container: `${(await container.inspect()).Name}.localhost` });
})

managementAPI.listen(8080, () => console.log("Management API is running on port 8080")); 
reverseProxy.listen(80, () => console.log("Reverse Proxy is running on port 80")); 