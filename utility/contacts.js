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
const searchContact = (nama) => {
  const contacts = getContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

//menambah data baru pda contact json
const addContact = (contact) => {
  const contacts = getContact();
  contacts.push(contact);
  saveContacts(contacts);
};

//Chek Duplikat
const chekDuplikat = (nama) => {
  const contacts = getContact();
  return contacts.find((contact) => contact.nama === nama);
};

//hapus kontak
const deleteContact = (nama) => {
  const contacts = getContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

//ubah kontak
const updateContacts = (newContact) => {
  const contacts = getContact();
  //menghilangkan nama yang sama dengan data yang lama
  const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldNama);
  delete newContact.oldNama;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = { getContact, loadContact, searchContact, addContact, chekDuplikat, deleteContact, updateContacts };
