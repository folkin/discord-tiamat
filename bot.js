const http = require('http');
var Discord = require('discord.js');
var replies = require('./replies.json');
var roll = require('./roll');


const server = http.createServer();
server.on('request', (req, res) => {
    res.writeHead(404, 'This server does nothing');
    res.end();
});
server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('server is listening on ${port}')
});


const bot = new Discord.Client();
bot.on('ready', function () {
    console.log('bot is logged in');
});
bot.on('message', function (msg) {
    var isMentioned = false;

    if (msg.author.bot) 
        return;

    if (msg.mentions.users.size > 0) {
        if (msg.mentions.users.some(x => x.id === process.env.discord_userid))
            isMentioned = true;
    }
    if (msg.content.startsWith('!')) {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase().trim(); 
        args.splice(0, 1);
        handleCommand(msg, cmd, args);
    }
    else if (isMentioned) {
        handleMention(msg);
    }
});
bot.login(process.env.discord_token);

function handleCommand(msg, cmd, args) {
    switch(cmd)
    {
        case 'roar':
            msg.channel.send('*roars*');
            break;
        case 'roll':
            roll(msg, args);
            break;
    }
}

function handleMention(msg) {
    var arr = replies.quotes;
    if (msg.content.endsWith('?')) {
        arr = replies.answers;
    }

    var response = arr[Math.floor(Math.random()*arr.length)];
    if (response.indexOf('{NAME}') >= 0) {
        response = response.replace('{NAME}', '<@' + msg.author.id + '>');
        msg.channel.send(response);
    }
    else{
        msg.reply(response);
    }
}