const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { loadcontact, searchcontact, addcontact } = require('./utility/contacts.js');
//const contacts = require(`./contacts.json`);

//information using EJS
app.set('view engine', 'ejs');

// Gunakan express-ejs-layouts middleware
app.use(expressLayouts);

// Menyajikan konten statis dari folder 'images'
app.use(express.static('public'));
app.use(express.urlencoded());

// Tentukan direktori views
app.set('views', __dirname + '/views');

//Definisikan route
app.get('/', (req, res) => {
  // Mengirimkan halaman HTML utama
  //res.sendFile("./index.html", { root: __dirname });
  res.render('index', { layout: 'layout/main-layout' });
});

app.get('/about', (req, res) => {
  // Mengirimkan halaman "about.html"
  // res.sendFile("./about.html", { root: __dirname });
  res.render('about', { layout: 'layout/main-layout' });
});

app.get('/contact', (req, res) => {
  const contacts = loadcontact();

  if (contacts.length === 0) {
    // Menampilkan Data yang Tidak Tersedia
    res.render('contact', {
      contacts,
      isEmpty: true, // Variabel untuk menunjukan bahwa tidak tersedia
      layout: 'layout/main-layout.ejs',
    });
  } else {
    res.render('contact', {
      contacts,
      isEmpty: false, // Vaiabel untuk menunjukan bahwa tidak tersedia
      layout: 'layout/main-layout.ejs',
    });
  }
});

//add new contact form
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Add New Data Form',
    layout: 'layout/main-layout.ejs',
  });
});

//add contact proses
app.post('/contact', (req, res) => {
  addcontact(req.body);
  res.redirect('/contact');
});

app.get('/contact/:nama', (req, res) => {
  const contact = searchcontact(req.params.nama);

  res.render('detail', {
    title: 'Detail Contact',
    contact,
    isEmpty: true, // Variabel flag untuk menunjukkan bahwa objek kosong
    layout: 'layout/main-layout.ejs', // Ejs core layout
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('page not found :  404');
});

app.listen(port, () => {
  console.log(`Server berjalan di port 3000`);
});
