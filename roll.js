var dice_regex = /^\s*(\d{1,3})?\s*d\s*(\d{1,3})\s*$/i;

var handleCommand = function (msg, args) {
  args = args || [];
  var text = (args.length > 0 ? args[0] : 'd20').toLowerCase();
  var match = text.match(dice_regex);
  if (match) {
    var quantity = parseInt(match[1] || '1');
    var dice = parseInt(match[2]);
    var result = rollDice(quantity, dice);
    text = '_<@' + msg.author.id + '> rolls ' + quantity + 'd' + dice + '_ : ' + result;
  } else if (text === 'adv' || text === 'advantage') {
    var result = roll2d20(true);
    text = '_<@' + msg.author.id + '> rolls with advantage_ : ' + result;
  } else if (text === 'dis' || text === 'disadvantage') {
    var result = roll2d20(false);
    text = '_<@' + msg.author.id + '> rolls with disadvantage : ' + result;
  } else {
    msg.reply('I don\'t understand `' + text + '`');
    return;
  }
  msg.channel.send(text);
};

function rollDice(q, d) {
  if (q == 1) {
    return '*' + rollOne(d) + '*';
  }
  else {
    var result = [];
    var sum = 0;
    for (var i = 0; i < q; i++) {
      result.push(rollOne(d));
      sum += result[i];
    }
    return '**' + sum + '**  [' + result + ']';
  }
}

function roll2d20(adv) {
  var first = rollOne(20);
  var second = rollOne(20);
  var take = adv ? Math.max(first, second) : Math.min(first, second);
    return '**' + take + '**  [' + first + ',' + second +']';
}

function rollOne(d) {
  return Math.floor((Math.random() * d) + 1);
}


module.exports = handleCommand;