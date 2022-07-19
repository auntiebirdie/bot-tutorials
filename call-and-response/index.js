const Discord = require('discord.js');

// GuildMessages intent is required to view message events
const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages]
});

const {
  GoogleSpreadsheet
} = require('google-spreadsheet');

// Google Sheet ID can be obtained from the URL
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

// Include and instantiate the Chance library
const chance = require('chance').Chance();

client.login(process.env.SUPER_SECRET_TOKEN);

client.on('ready', async () => {
  // Authenticate to the Google Sheets API
  await doc.useApiKey(process.env.GOOGLE_API_KEY);
  await doc.loadInfo();
});

client.on('messageCreate', async (message) => {
  // Ensure we don't respond to ourselves!
  if (message.author.id != client.user.id) {

    // Respond to direct pings
    if (message.mentions.users.get(client.user.id)) {
      // Fetch the data for the sheet with our triggers and responses
      var sheet = doc.sheetsByTitle['@'];
      var rows = await sheet.getRows();

      // An array to store matching responses
      var triggered = [];

      // An array to store generic responses
      var generic = [];

      // Loop through each row with data in it
      for (let row of rows) {
        // Assuming the triggers are stored as a comma-separated list
        let triggers = row.Trigger.split(',');

        // Compare the message content against each trigger
        for (let trigger of triggers) {
          if (trigger.trim() == '*') {
            generic.push(row.Response);
          } else if (message.content.toLowerCase().match(new RegExp(`(^|[^A-Za-z])${trigger.trim()}([^A-Za-z]|$)`, 'gi'))) {
            triggered.push(row.Response);
          }
        }
      }

      if (triggered.length > 0) {
        message.reply(chance.pickone(triggered));
      } else if (generic.length > 0) {
        message.reply(chance.pickone(generic));
      }
    }
  }
});