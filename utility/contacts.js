const fs = require('fs');
const pool = require('../db.js');

// Membuat folder jika belum ada
const dirpath = './data';
if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath);
}

//membuat file contacts.json jika belum ada
const filePath = `./data/contacts.json`;
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// Memunculkan data yang tersimpan di postgreSQL
const getContact = async () => {
  const connection = await pool.connect();
  const query = `SELECT * FROM contacts`;
  const results = await connection.query(query);
  const contacts = results.rows;
  return contacts;
};

//load contacts
const loadContact = () => {
  //Membaca file JSON
  const file = fs.readFileSync(filePath, 'utf-8');
  const contacts = JSON.parse(file);
  return contacts;
};

// Cari contact
const searchContact = async (nama) => {
  const contacts = await getContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};

//const saveContacts = (contacts) => {
//fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
//};

//menambah data baru pda contact json
const addContact = async (contact) => {
  const { nama, hp, email } = contact;
  const connection = await pool.connect();
  const query = `INSERT INTO contacts (nama, hp, email) VALUES ($1, $2, $3) `;
  await connection.query(query, [nama, hp, email]);
  //const contacts = getContact();
  //contacts.push(contact);
  //saveContacts(contacts);
};

//Chek Duplikat
const chekDuplikat = async (nama) => {
  const contacts = await getContact();
  return contacts.find((contact) => contact.nama === nama);
};

//hapus kontak
const deleteContact = async (nama) => {
  const connection = await pool.connect();
  const query = `DELETE FROM contacts WHERE nama = $1 `;
  await connection.query(query, [nama]);
  //const contacts = getContact();
  //const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  //saveContacts(filteredContacts);
};

//ubah kontak
const updateContacts = async (newContact) => {
  const connection = await pool.connect();
  const query = ` UPDATE contacts SET nama = $1, hp = $2, email=$3 WHERE nama = $4 `;
  await connection.query(query, [newContact.nama, newContact.hp, newContact.email, newContact.oldNama]);
  //menghilangkan nama yang sama dengan data yang lama
  //const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldNama);
  //delete newContact.oldNama;
  //filteredContacts.push(newContact);
  //saveContacts(filteredContacts);
};

module.exports = { getContact, loadContact, searchContact, addContact, chekDuplikat, deleteContact, updateContacts };
