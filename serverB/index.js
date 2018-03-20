const http = require('http');
const fs = require('fs');
const port = 1339;

http.createServer(handleRequest)
    .listen(port, () => {
        console.log(`Server B listening at ${port}`)
    });

function handleRequest(req, res) {

    saveFile(req)
        .then(() => {
            res.writeHead(200);
            res.end();
            // setTimeout(() => {res.end()}, 7000)  // use it to play with timeouts from server B
        });
}

function saveFile(req) {
    return new Promise((resolve, reject) => {
        const fileName = decodeURI(req.url.split('/').pop()) || 'file';
        const filePath = `${__dirname}/uploaded/${fileName}`;
        const writeStream = fs.createWriteStream(filePath);
        req.pipe(writeStream).on('finish', resolve)
    });
}