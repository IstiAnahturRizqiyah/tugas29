const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, searchContact, addContact, chekDuplikat } = require('./utility/contacts.js');
const { body, validationResult } = require('express-validator');
//const contacts = require(`./contacts.json`);

//information using EJS
app.set('view engine', 'ejs');
// Gunakan express-ejs-layouts middleware
app.use(expressLayouts);
// Menyajikan konten statis dari folder 'images'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
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
  const contacts = loadContact();
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
// Menangani data yang dikirim dalam permintaan POST
// Memproses data dan mengirimkan respons
app.post(
  '/contact',
  [
    body('nama').custom((value) => {
      const duplikat = chekDuplikat(value);
      if (duplikat) {
        throw new Error('Maaf data sudah ada!');
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add Contact',
        layout: 'layout/main-layout.ejs',
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      res.redirect('/contact');
    }
  }
);
app.get('/contact/:nama', (req, res) => {
  const contact = searchContact(req.params.nama);
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
