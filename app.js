const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const contacts = require(`./contacts.json`);


//information using EJS
app.set('view engine', 'ejs');

// Tentukan direktori views
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  // Mengirimkan halaman HTML utama
    //res.sendFile("./index.html", { root: __dirname }); 
    res.render('index', {nama: 'AKW', title:'WebServer EJS'}); 
}); 


app.get('/about', (req, res) => {
  // Mengirimkan halaman "about.html"
  // res.sendFile("./about.html", { root: __dirname }); 
    res.render("about", {nama : "Isti Anahatur Rizqiyah"}); 
}); 

app.get('/contact', (req, res) => {
  // Mengirimkan halaman "contact.html"
  //res.sendFile("./contact.html", { root: __dirname }); 
     // Route untuk halaman Contact
    
      // Baca data kontak dari file JSON
        fs.readFile('contacts.json', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan');
        }
        const contacts = JSON.parse(data);
        // Render halaman Contact dengan data kontak
        res.render('contact', { contacts });
        });
    });
  
app.get('/product/:id', (req, res) => {
  // Lakukan sesuatu dengan productId dan category, misalnya mencari produk berdasarkan ID dan kategori.
  res.send('product : '+ req.params.id +' kategori  : '+ req.query.kategori);
});

app.use('/', (req,res) => {
    res.status(404)
    res.send('page not found :  404')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

