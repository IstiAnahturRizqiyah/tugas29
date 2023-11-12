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
const loadcontact = () => {
  //Membaca file JSON
  const file = fs.readFileSync(filePath, 'utf8');
  const contacts = JSON.parse(file);
  return contacts;
};

module.exports = { loadcontact };
