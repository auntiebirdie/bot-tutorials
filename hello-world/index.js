const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
 intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.login(process.env.SUPER_SECRET_TOKEN);

client.on('ready', () => {

 // find all the servers this bot can see
 client.guilds.fetch().then((guilds) => {

   // fetch the details of the first server it finds
   client.guilds.fetch(guilds.first().id).then((guild) => {

     // find all the channels this bot can see in the server
     guild.channels.fetch().then((channels) => {

       // send 'Hello world!' to the first channel it sees
       channels.find((ch) => ch.type == ChannelType.GuildText).send({
         content: 'Hello world!'
       });
     });
   });
 });
});
