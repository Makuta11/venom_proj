const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const contacts = [];

// Read contacts from CSV
fs.createReadStream(path.resolve(__dirname, 'contacts.csv'))
  .pipe(csv())
  .on('data', (row) => {
    if (row.name && row.phone) {
      contacts.push({
        name: row.name.trim(),
        phone: row.phone.trim().replace('+', '') + '@c.us',
      });
    }
  })
  .on('end', () => {
    console.log(`Loaded ${contacts.length} contacts.`);
    startBot();
  });

// Start Venom and send messages
function startBot() {
  venom
    .create({
      session: 'opto-session',
      headless: false, 
      useChrome: true,
      multidevice: true
    })
    .then((client) => {
      contacts.slice(0, 20).forEach((contact, index) => {
        const message = `Hi, ${contact.name}: Marcus here from Optoceutics`;
        setTimeout(() => {
          client
            .sendText(contact.phone, message)
            .then(() => console.log(`Sent to ${contact.name}`))
            .catch((err) => console.error(`Failed to send to ${contact.name}:`, err));
        }, index * 5000); // Wait 5 seconds between messages
      });
    })
    .catch((err) => {
      console.error('Venom error:', err);
    });
}

