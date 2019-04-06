const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // -------- more flexible way ---------

    // Build file path
    let filePath = path.join(
        __dirname,
        '',
        req.url === '/' ? 'index.html' : req.url
    );

    // get file extension
    let extname = path.extname(filePath);

    // initial content type;
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.eot':
            contentType = 'application/vnd.ms-fontobject'
            break;
        case '.ttf':
            contentType = 'application/octet-stream'
            break;
        case '.woff':
            contentType = 'application/font-woff'
            break;
        case '.woff2':
            contentType = 'application/font-woff2'
            break;
        case '.svg':
            contentType = 'image/svg+xml'
            break;
        case '.min.css':
            contentType = 'text/css';
            break;
        case '.min.js':
            contentType = 'text/javascript';
            break;

    }

    // Check if contentType is text/html but no .html file extension
    if (contentType == "text/html" && extname == "") filePath += ".html";

    // log the filePath
    console.log(filePath);

    // Read file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {  // Page not found
                fs.readFile(path.join(__dirname, '', '404.html'),
                    (err, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    })
            } else {
                // Some server errors: 500
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            // Success request
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    })
});

// set port number to run to PORT or 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});