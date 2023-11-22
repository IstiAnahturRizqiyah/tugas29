const express = require('express');
const path = require('path');
const app = express();
//call database
const pool = require('./db');
app.use(express.json()); // => req.body
const port = 3000;
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, searchContact, addContact, chekDuplikat, deleteContact, updateContacts } = require('./utility/contacts.js');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//const contacts = require(`./contacts.json`);

//information using EJS
app.set('view engine', 'ejs');
// Gunakan express-ejs-layouts middleware
app.use(expressLayouts);
// Menyajikan konten statis dari folder 'images'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 5000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Tentukan direktori views
app.set('views', __dirname + '/views');

//halaman utama
app.get('/', (req, res) => {
  // Mengirimkan halaman HTML utama
  //res.sendFile("./index.html", { root: __dirname });
  res.render('index', { layout: 'layout/main-layout' });
});

//halaman about
app.get('/about', (req, res) => {
  // Mengirimkan halaman "about.html"
  // res.sendFile("./about.html", { root: __dirname });
  res.render('about', { layout: 'layout/main-layout' });
});

//halaman kontak
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
    check('email', 'Email Tidak Valid!').isEmail(), //email cek
    check('hp', 'Nomor Telepon Tidak Valid!').isMobilePhone('id-ID'),
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
      req.flash('msg', 'Data Contact Berhasil Ditambahkan!');
      res.redirect('/contact');
    }
  }
);

//hapus kontak
app.get('/contact/delete/:nama', (req, res) => {
  const contact = loadContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send('Data Tidak Ada');
  } else {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data Contact Deleted!');
    res.redirect('/contact');
  }
});

//mengubah data
app.get('/contact/update/:nama', (req, res) => {
  const contact = searchContact(req.params.nama);

  res.render('edit-contact', {
    tittle: 'Form Update Data Contact',
    layout: 'layout/main-layout',
    contact,
  });
});

//ubah kontak
app.post(
  '/contact/update',
  [
    body('nama').custom((value, { req }) => {
      const duplikat = chekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama sudah di gunakan');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('hp', 'Nomor Telepon Tidak Valid').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Add Contact',
        layout: 'layout/main-layout.ejs',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash('msg', 'Data Contact Berhasil Diubah!');
      res.redirect('/contact');
    }
  }
);

//detail contact
app.get('/contact/:nama', (req, res) => {
  const contact = searchContact(req.params.nama);
  res.render('detail', {
    title: 'Detail Contact',
    contact,
    isEmpty: true, // Variabel flag untuk menunjukkan bahwa objek kosong
    layout: 'layout/main-layout.ejs', // Ejs core layout
  });
});

//insert data to database
app.get('/addasync', async (req, res) => {
  try {
    const nama = 'rizqiyah';
    const hp = '089765678908';
    const email = 'rzqyh@gmail.com';
    const newCont = await pool.query(`INSERT INTO contacts VALUES('${nama}', '${hp}', '${email}') RETURNING *`);
    res.json(newCont);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/list', async (req, res) => {
  try {
    const contact = await pool.query(`SELECT * FROM contacts`);
    res.json(contact.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('page not found :  404');
});
app.listen(port, () => {
  console.log(`Server berjalan di port 3000`);
});
