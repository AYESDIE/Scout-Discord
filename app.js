var Discord = require('discord.io'),
    express     = require("express"),
    app         = express(),
    logger = require('winston'),
    request = require('request'),
    auth = require('./auth.json'),
    moon = "http://localhost:1111/";


app.set("view engine", "ejs");
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';



var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});


app.get("/", function(req, res){
    res.render("index");
    bot.on('ready', function (evt) {
        logger.info('Connected');
        logger.info('Logged in as: ');
        logger.info(bot.username + ' - (' + bot.id + ')');

    });
    bot.on('message', function (user, userID, channelID, message, evt) {
        if (message.substring(0, 1) == '.') {
            var args = message.substring(1).split(' ');
            var cmd = args[0];
            var subcmd = args[1];
            args = args.splice(1);

            switch(cmd) {
                // !ping
                case 'help':
                    if (subcmd==undefined)
                        bot.sendMessage({ to: channelID, message: 'Available commands:\n .ping \n .moon \n .retry \n .dev \n .stop \n use .help /command/ to know about command'});
                    else if (subcmd=='moon')
                        bot.sendMessage({ to: channelID, message: '```.moon /url of image/```' });
                    else if (subcmd=='ping')
                        bot.sendMessage({ to: channelID, message: '```.ping```' });
                    else if(subcmd=='dev')
                        bot.sendMessage({ to: channelID, message: '```.dev```' });
                    else if(subcmd=='retry')
                        bot.sendMessage({ to: channelID, message: '```.retry It tries to reconnect to ApertER-Discord-API```' });
                    break;


                case 'ping':
                    bot.sendMessage({ to: channelID, message: 'Pong!' });
                    console.log(channelID);
                    break;


                case 'cpp':
                    bot.sendMessage({ to: "478542893041057792", message: '```std::cout<<'+args+"```" });
                    break;


                case 'dev':
                    bot.sendMessage({ to: channelID, message: 'This bot is made by: <@200877407727517696>,\nGo here https://github.com/AYESDIE/moon-Discord' });
                    break;


                case 'retry':
                    subcmd = 'test';
                    request(moon+'api?url='+subcmd,function (error,response,body) {
                        if(error){
                            bot.sendMessage({ to: channelID, message: "Failed to connect to ApertER-Discord-API. Make sure it is running." });
                        }   else    {
                            bot.sendMessage({ to: channelID, message: "Successfully connected to ApertER-Discord-API." });
                        }
                    });
                    break;

                case 'stop':
                    bot.sendMessage({ to: channelID, message: 'Shutting Down, Bye!' });
                    setTimeout(function() {
                        process.exit(1);
                    }, 5000);
                    break;


                case 'moon':
                    if (subcmd==undefined)
                        bot.sendMessage({ to: channelID, message: 'error:Invalid Syntax\n```.moon /url of image/```'});
                    else
                        request(moon+'discord?url='+subcmd,function (error,response,body) {
                            if(error){
                                bot.sendMessage({ to: channelID, message: "Problem connecting to the API." });
                            }   else    {
                                bot.sendMessage({ to: channelID, message: body });
                            }
                        });
                    break;

                default:
                    bot.sendMessage({ to: channelID, message: 'Unknown command.\n ```use .help```' });
            }
        }
    });
});

app.listen(8080, function() {
    console.log("Activate the bot by going -> http://localhost:8080/");
} );
