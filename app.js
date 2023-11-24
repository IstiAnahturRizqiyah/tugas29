const express = require('express');
const path = require('path');
const app = express();
//call database
const pool = require('./db.js');
const port = 3000;
const host = 'localhost';
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const { getContact, loadContact, searchContact, addContact, chekDuplikat, deleteContact, updateContacts } = require('./utility/contacts.js');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//const contacts = require(`./contacts.json`);

// => req.body
app.use(express.json());
//information using EJS
app.set('view engine', 'ejs');
// Gunakan express-ejs-layouts middleware
app.use(expressLayouts);
// Menyajikan konten statis dari folder 'images'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

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
    body('nama').custom(async (value) => {
      const duplikat = await chekDuplikat(value);
      if (duplikat) {
        throw new Error('Maaf data sudah ada!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(), //email cek
    check('hp', 'Nomor Telepon Tidak Valid!').isMobilePhone('id-ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add Contact',
        layout: 'layout/main-layout.ejs',
        errors: errors.array(),
      });
    } else {
      try {
        await addContact(req.body);
        req.flash('msg', 'Data Contact Berhasil Ditambahkan!');
        res.redirect('/contact');
      } catch (err) {
        console.error(err.message);
      }
    }
  }
);

//hapus kontak
app.get('/contact/delete/:nama', async (req, res) => {
  try {
    const contact = await loadContact(req.params.nama);
    if (!contact) {
      res.status(404);
      res.send('Data Tidak Ada');
    } else {
      await deleteContact(req.params.nama);
      req.flash('msg', 'Data Berhasil di Hapus!!');
      res.redirect('/contact');
    }
  } catch (err) {
    console.error(err.message);
    res.status(300).send;
  }
});

//mengubah data
app.get('/contact/update/:nama', async (req, res) => {
  try {
    const contact = await searchContact(req.params.nama);
    res.render('edit-contact', {
      tittle: 'Form Update Data Contact',
      layout: 'layout/main-layout',
      contact,
    });
  } catch (err) {
    console.error(err.message);
    res.status(300).send;
  }
});

//ubah kontak
app.post(
  '/contact/update',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await chekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama sudah di gunakan!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('hp', 'Nomor Telepon Tidak Valid').isMobilePhone('id-ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Add Contact',
        layout: 'layout/main-layout.ejs',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      try {
        await updateContacts(req.body);
        req.flash('msg', 'Data Contact Berhasil Diubah!');
        res.redirect('/contact');
      } catch (err) {
        console.error(err.message);
        res.status(300).send;
      }
    }
  }
);

//detail contact
app.get('/contact/:nama', async (req, res) => {
  const nama = req.params.nama;
  const contacts = await getContact();
  const contact = contacts.find((contact) => contact.nama === nama);
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
    const nama = '';
    const hp = '';
    const email = '';
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

// halaman kontak
app.get('/contact', async (req, res) => {
  try {
    const contactList = await pool.query(`SELECT * FROM contacts`);
    const contacts = contactList.rows;
    // Menampilkan Data yang Tidak Tersedia
    res.render('contact', {
      contacts,
      layout: 'layout/main-layout.ejs',
      msg: req.flash('msg'),
    });
  } catch (err) {
    console.error(err.message);
    res.render('contact', {
      contacts: [],
      layout: 'layout/main-layout.ejs',
      msg: req.flash('msg'),
    });
  }
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('page not found :  404');
});
app.listen(port, host, () => {
  console.log(`Server berjalan di http://${host}:${port}`);
});
