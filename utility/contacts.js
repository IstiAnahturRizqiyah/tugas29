const fs = require('fs');

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

//load contacts
const loadContact = () => {
  //Membaca file JSON
  const file = fs.readFileSync(filePath, 'utf8');
  const contacts = JSON.parse(file);
  return contacts;
};

// Cari contact
const searchContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
};
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

//menambah data baru pda contact json
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

//Chek Duplikat
const chekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

module.exports = { loadContact, searchContact, addContact, chekDuplikat };
