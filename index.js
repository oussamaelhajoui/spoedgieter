const http = require('http');
const fs = require('fs');
const whitelist = [
    "Rotterdam",
    "Bodegraven",
    "Poortugaal",
    "Berkel-en-Rodenrijs",
    "Woerden",
    "Barendrecht",
    "Zwijndrecht",
    "Papendrecht",
    "Alblasserdam",
    "Sliedrecht",
    "Spijkenisse",
    "Pijnacker",
    "Bleiswijk",
    "Wateringen",
    "Moerdijk",
    "'t-Woudt",
    "'s-Gravendeel",
    "Schipluiden",
    "Wagenberg",
    "Den-Hoorn",
    "Nootdorp",
    "Bergschenhoek",
    "Zevenhuizen",
    "Moerkapelle",
    "Waddinxveen",
    "Stompwijk",
    "Leiderdorp",
    "Zoeterwoude",
    "Zoeterwoude-Dorp",
    "Oud-Beijerland",
    "Maassluis",
    "Brielle",
    "Hendrik-Ido-Ambacht",
    "Nieuw-Lekkerland",
    "Oosterhout",
    "Breda",
    "Etten-Leur",
    "Zevenbergen",
    "Roosendaal",
    "Oudenbosch",
    "Steenbergen",
    "Werkendam",
    "Gouda",
    "Alphen-aan-den-Rijn",
    "Made",
    "Leiden",
    "Leidschendam",
    "Voorburg",
    "Vlaardingen",
    "Dordrecht",
    "Rijswijk",
    "Capelle",
    "Zoetermeer",
    "Den-Haag",
    "Delft",
    "Schiedam",
    "Wassenaar",
    "Voorschoten",
    "Utrecht",
    "Den-Bosch",
    "Maarsen",
    "Ijselstijn",
    "Houten",
    "Helmond",
    "Eindhoven",
    "Uden",
    "Nieuwegein",
    "Culemborg",
    "Tilburg",
    "Bergen-op-zoom",
    "Nieuwekerk-aan-de-IJssel"
];

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i)
}

const customStringify = function(v) {
    const cache = new Map();
    return JSON.stringify(v, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                return;
            }
            cache.set(value, true);
        }
        return value;
    });
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

var index = fs.readFileSync('home.html', 'utf-8');
var shit = fs.readFileSync("shit.html",'utf-8');

var httpServer = http.createServer(function(req, res) {
    if (req.url == '/robots.txt') {
        return filer('./robots.txt');
    } else if (req.url == '/sitemap.xml') {
        return filer('./sitemap.xml');
    } if (req.url.startsWith('/a/')) {
        var file = req.url.replace("/a/", "");
        return filer('./assets/' + file);
    } else {
        if (req.url !== '/') {
            var thecity = capitalizeFirstLetter(req.url.substring(1));
            if (whitelist.indexOf(thecity) > -1) {
                res.end(index.replaceAll('${cityThingy}$', 'Best plumber service at ' + thecity));
            }
            else {
                res.end(index.replaceAll('${cityThingy}$', 'Best plumber service!')); // Non-whitelisted city supplied, we should use none (Best plumber service!)
            }
        } else {
            res.end(index.replaceAll('${cityThingy}$', 'Best plumber service!')); //The user did not supplied a city on the url, we'll use none (Best plumber service!)
            // res.end(shit);
        }
    }
    
    function filer(file) {
            var filePath = file;
            if (filePath.startsWith('./')) {
                if (filePath == './')
                    filePath = './index.html';
            }

            var regex = /[#\\?]/g;
            var endOfExt = file.search(regex);
            if (endOfExt > -1) {
                filePath = filePath.substring(0, endOfExt);
            }
            var extname = getExtension(filePath);
            var contentType = 'text/html';
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
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.ico':
                    contentType = 'image/x-icon';
                    break;
                case '.wav':
                    contentType = 'audio/wav';
                    break;
                case '.mp3':
                    contentType = 'audio/mp3';
                    break;
                case '.woff2':
                    contentType = 'application/font-woff2';
                    break;
                case '.woff':
                    contentType = 'application/font-woff';
                    break;
                case '.woff':
                    contentType = 'application/font-ttf';
                    break;
                case '.eot':
                    contentType = 'application/font-eot';
                    break;
                case '.html':
                    contentType = 'text/html';
                    break;
                case '.xml':
                    contentType = 'application/xml';
                    break;
                case '.txt':
                    contentType = 'text/plain';
                    break;
                default:
                    contentType = 'text/plain';
                    break;
            }
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        res.statusCode = 500;
                        return res.end(customStringify(error));
                    }
                    res.statusCode = 200;
                    res.setHeader('content-type', contentType);
                    if (httpServer.rps > 30 && req.socket.server._connections > 30 && req.auth) {
                        res.setHeader("cache-control", "public, max-age=360000");
                        res.setHeader("expect-ct", "max-age=360000");
                        res.setHeader("vary", "Accept-Encoding");
                        res.setHeader("expires", new Date(Date.now() + 3600000).toUTCString());
                    } else {
                        res.setHeader("expect-ct", "max-age=1000");
                    }
                    res.end(content, 'utf-8');
                });
            }
}).listen(80);

httpServer.timeout = 10000; // Slow connection requests can be determined as DDoS attacked, sometimes when the server is over-loaded old requests will stay on the tcp connection sequence, which can make the server get easily downed. this line will help it all :)
