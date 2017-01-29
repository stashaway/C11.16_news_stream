/*Added by Tim 1/27/2017 See: 
http://stackoverflow.com/questions/12134554/node-js-external-js-and-css-files-just-using-node-js-not-express
*/
/*Lets require/import the HTTP module*/
var http = require('http'),
    fileSystem = require('fs'),
    url = require('url');

/*Lets define a port we want to listen to*/
const PORT=8080;

/*We need a function which handles requests and send response*/
function handleRequest(request, response){
    console.log(request.url);
    /*I can probably replace all requests with the "else" one. Oh well. */
    if (request.url == '/') {
        fileSystem.readFile(__dirname + '/index.html', 'utf8', (err, data) => {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data)
        });
    } else if (request.url == '/style.css') {
        fileSystem.readFile(__dirname + '/style.css', 'utf8', (err, data) => {
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.end(data)
        });
    }  else if (request.url.indexOf('.js') != -1) {
        fileSystem.readFile(__dirname + request.url, 'utf8', (err, data) => {
            response.writeHead(200, {'Content-Type': 'text/javascript'});
            response.end(data)
        });
    }  else {
        fileSystem.readFile(__dirname + request.url, 'utf8', (err, data) => {
            response.writeHead(200, {'Content-Type': 'image/gif'});
            response.end(data)
        });
    }
}

/*Create a server*/
var server = http.createServer(handleRequest);

/*Lets start our server*/
server.listen(PORT, function(){
    /*Callback triggered when server is successfully listening. Hurray!*/
    console.log("Server listening on: http://localhost:%s", PORT);
});
