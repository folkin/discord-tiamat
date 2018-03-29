var Discord = require('discord.js');
var auth = require('./auth.json');
var replies = require('./replies.json');
var roll = require('./roll');

var bot = new Discord.Client();

bot.on('ready', function () {
    console.log("connected");
});
bot.on('message', function (msg) {
    var isMentioned = false;

    if (msg.author.bot) 
        return;

    if (msg.mentions.users.size > 0) {
        if (msg.mentions.users.some(x => x.id === auth.userid))
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
bot.login(auth.token);

function handleCommand(msg, cmd, args) {
    switch(cmd)
    {
        case "roar":
            msg.channel.send("*roars*");
            break;
        case "roll":
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
    if (response.indexOf("{NAME}") >= 0) {
        response = response.replace("{NAME}", "<@" + msg.author.id + ">");
        msg.channel.send(response);
    }
    else{
        msg.reply(response);
    }
}