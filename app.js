const http = require('http');
const port = 3000;
const fs = require ("fs")

http
    .createServer((req,res) => {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        const url = req.url;
        if(url==='/about'){
            fs.readFile('./about.html',(err,data) => {
                if(err) {
                    res.writeHead(484);
                    res.write('Error : page not found');
                } else {
                    res.write(data)
                }
                res.end();
            })
        } else if(url=== '/contact'){
            fs.readFile('./contact.html',(err,data) => {
                if(err){
                    res.writeHead(484);
                    res.write('Error : page not found');
                } else {
                    res.write(data)
                }
                res.end();
            })
        } else {
            fs.readFile('./index.html',(err,data) => {
                if(err){
                    res.writeHead(484);
                    res.write('Error : page not found');
                } else {
                    res.write(data)
                }
                res.end();
            })
        }
    })
        .listen(3000,() => {
            console.log('Server is running on port 3000 ...'); 
});
