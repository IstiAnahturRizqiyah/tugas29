const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { loadcontact, searchcontact } = require('./utility/contacts.js');
//const contacts = require(`./contacts.json`);

//information using EJS
app.set('view engine', 'ejs');

// Gunakan express-ejs-layouts middleware
app.use(expressLayouts);

// Menyajikan konten statis dari folder 'images'
app.use(express.static(path.join(__dirname, 'views')));

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
  // Mengirimkan halaman "contact.html"
  //res.sendFile("./contact.html", { root: __dirname });
  // Route untuk halaman Contact

  // Baca data kontak dari file JSON
  //fs.readFile('contacts.json', (err, data) => {
  //if (err) {
  //console.error(err);
  //return res.status(500).send('Terjadi kesalahan');
  //}
  //const contacts = JSON.parse(data);
  // Render halaman Contact dengan data kontak
  //res.render('contact', { contacts });
  // });
  //});

  //const contacts = [
  //{ nama: 'Isti', hp: '089786567823' },
  //{ nama: 'Anahtur', hp: '085678909876' },
  //{ nama: 'Rizqiyah', hp: '087678906543' },
  //];

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

app.get('/contact/:nama', (req, res) => {
  const contact = searchcontact(req.params.nama);

  res.render('detail', {
    title: 'Detail Contact',
    contact,
    isEmpty: true, // Variabel flag untuk menunjukkan bahwa objek kosong
    layout: 'layout/main-layout.ejs', // Ejs core layout
  });
});

app.get('/product/:id', (req, res) => {
  // Lakukan sesuatu dengan productId dan category, misalnya mencari produk berdasarkan ID dan kategori.
  res.send('product : ' + req.params.id + ' kategori  : ' + req.query.kategori);
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('page not found :  404');
});

app.listen(port, () => {
  console.log(`Server berjalan di port 3000`);
});
