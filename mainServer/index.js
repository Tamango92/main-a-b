const http = require('http');
const config = require('./config');
const fs = require('fs');

http.createServer(handleRequest)
    .listen(config.own.port, () => {
        console.log(`Main server listening at ${config.own.port}`)
    });

function handleRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        return res.end();
    }

    saveFileOnMain(req)
        .then(sendCopies)
        .then(getResponseData)
        .then((data) => {
            res.writeHead(200);
            res.write(data);
            res.end();
        })
        .catch(err => console.log(err))
}


function saveFileOnMain(req) {
    return new Promise((resolve, reject) => {
        const fileName = decodeURI(req.url.split('/').pop()) || 'file';
        const filePath = `${__dirname}/uploaded/${fileName}`;
        const writeStream = fs.createWriteStream(filePath);

        req.pipe(writeStream).on('finish', () => {
            resolve(fileName);
        })
    });
}

function sendCopies(fileName) {
    console.log(fileName);
    return Promise.all([
        uploadCopy(fileName, 'serverA', config.serverA.retry),
        uploadCopy(fileName, 'serverB', config.serverB.retry)
    ])
}

function uploadCopy(fileName, serverName, retries) {
    if (retries === 0) {
        return Promise.resolve(serverName); // in case of NOT successful upload  - failed server name is resolved
    }
    console.log(`Trying upload file to ${serverName} ... ${retries} attempts left`);
    retries--;
    return _uploadAttempt(fileName, serverName).catch(() => {
        return uploadCopy(fileName, serverName, retries);
    })
}

function _uploadAttempt(fileName, serverName) {
    return new Promise((resolve, reject) => {
        const filePath = `${__dirname}/uploaded/${fileName}`;
        const stream = fs.createReadStream(filePath);
        const req = http.request({
            method: 'PUT',
            path: `/${fileName}`,
            hostname: config[serverName].address,
            port: config[serverName].port,
            timeout: config[serverName].timeout
        }, () => resolve(null));

        req.on('timeout', () => req.abort());
        stream.pipe(req).on('error', (e) => {
            reject(e);
        })
    });
}

function getResponseData(results) {
    const response = {
        ok: true
    };
    const errors = results.filter(r => r);
    if (errors.length > 0) {
        response.ok = false;
        response.error = errors;
    }
    return Promise.resolve(JSON.stringify(response));
}
