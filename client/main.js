const fileSelector = document.getElementById('file-selector');
const label = document.getElementById('file-selector-label');
const messageDiv = document.getElementById('message');
const serverBlocks = {
    serverA: document.getElementById('serverA'),
    serverB: document.getElementById('serverB')
};

const MAIN_SERVER_URL = 'http://localhost:1337/';

fileSelector.addEventListener('change', function(e) {
    const file = e.target.files[0];
    label.style.display = 'none';
    messageDiv.innerText = 'Loading...';
    upload(MAIN_SERVER_URL + file.name, file, function(resText) {
        messageDiv.innerText = resText;
        const res = JSON.parse(resText);
        serverBlocks.serverA.style.backgroundColor = '#00C421';
        serverBlocks.serverB.style.backgroundColor = '#00C421';
        if (!res.ok) {
            res.error.forEach(function (e) {
                serverBlocks[e].style.backgroundColor = 'red'
            });
        }
    });
});

function upload(url, file, cb){
    const req = new XMLHttpRequest();
    req.open("PUT", url);
    req.setRequestHeader("Content-type", file.type);
    req.onload = function() {
        cb(req.responseText);
    };
    req.send(file);
}