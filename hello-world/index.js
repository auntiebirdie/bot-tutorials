const Discord = require('discord.js');

const client = new Discord.Client({
 intents: [Discord.Intents.FLAGS.GUILDS]
});

client.login('SUPER_SECRET_TOKEN');

client.on('ready', () => {

 // find all the servers this bot can see
 client.guilds.fetch().then((guilds) => {

   // fetch the details of the first server it finds
   client.guilds.fetch(guilds.first().id).then((guild) => {

     // find all the channels this bot can see in the server
     guild.channels.fetch().then((channels) => {

       // send 'Hello world!' to the first channel it sees
       channels.find((ch) => ch.type == 'GUILD_TEXT').send({
         content: 'Hello world!'
       });
     });
   });
 });
});
