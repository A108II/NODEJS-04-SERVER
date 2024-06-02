const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const http = require('http');
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const emitter = new MyEmitter();
// Here emitter is listening for an event named 'log', when it's triggered, the callback function (listener) also gets executed and calls the logEvents functions with the provided arguments. 
emitter.on('log', (message, fileName) => {
    logEvents(message, fileName);
})

const PORT = process.env.PORT || 3500;

const myServer = http.createServer((req, res) => {
    console.log(`Request url: ${req.url}, Request method: ${req.method}`);
    // log named event gets triggered, and the arguments in emit() are forwarded to the callback function of emitter.on()
    emitter.emit('log', `${req.url}\t${req.method}`, 'logEvents.txt');

    // Specify content type to help browser identify different MIMES like json, javascript and jpeg etc.
    const extension = path.extname(req.url);
    let content_type;
    switch (extension) {
        case '.json': content_type = 'application/json';
            break;

        case '.js': content_type = 'application/javascript';
            break;

        case '.css': content_type = 'text/css';
            break;

        case '.jpg': content_type = 'image/jpeg';
            break;

        case '.png': content_type = 'image/png';
            break;

        case '.txt': content_type = 'text/plain';
            break;

        default: content_type = 'text/html'
    }
    
    // Specifying file paths for different requests
    let file_Path =  
    req.url === '/' && content_type === 'text/html' ? path.join(__dirname, 'html_files', 'index.html') :    
    req.url.slice(-1) === '/' && content_type === 'text/html' ? path.join(__dirname, 'html_files', req.url, 'index.html') :
    content_type === 'text/html' ? path.join(__dirname, 'html_files', req.url) : path.join(path.join(__dirname, req.url));

    // If content type is text/html, no extension is specified and request url does not end with / then add .html extension by default to the files 
    if (content_type === 'text/html' && !extension && req.url.slice(-1) !== '/') {
        file_Path += '.html'
    }

    const file_exists = fs.existsSync(file_Path);

    if (file_exists) {
        serveFile(file_Path, content_type, res)
    }

    else {
        switch (path.basename(file_Path)) {
        // 301 redirect 
        case 'image.html': res.writeHead(301, { 'Location': 'image_page.html' });
        res.end()
        break;

        case 'www.index.html': res.writeHead(301, { 'Location': 'index.html' });
        res.end();
        break;

        default: serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
})

const serveFile = async (filePath, content_type, response) => {
    try {
        const plainData = await fsPromises.readFile(filePath, !content_type.includes('image') ? 'utf-8' : '');
        const data = content_type === 'application/json' ? JSON.parse(data) : plainData
        response.writeHead(filePath.includes('404.html') ? 404 : 200, { 'content_type': content_type });
        response.end(content_type === 'application/json' ? JSON.stringify(data) : plainData)
    } 
    catch (error) {
        console.log(error);
        emitter.emit('log', `${error.name}\t${error.message}`, 'logError.txt');
        response.statusCode = 500; // status code indicates that there is an internal error on the server side, and it can't fulfill the request
        response.end();
    }
}

myServer.listen(PORT, () => {
    console.log(`Server is listening from port ${PORT}`);
})
