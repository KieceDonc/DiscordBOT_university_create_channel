const Discord = require('discord.js')
const bot = new Discord.Client();
const secret = require("./secret.js");


bot.on('message', async message => {
  
    var authorID = message.author.id;
    var moduleName = message.content;
    var currentServObject = message.guild;

    if(message.channel.id=="881639490878332938" && authorID!="881642877984317452"){
        var currentModuleRoleID = createRole(currentServObject,moduleName,message);
        message.channel.send("done");
    /*try{
        createCategory(currentServObject,moduleName).then(()=>{
            createAllChannels(currentServObject,moduleName).then(()=>{
                message.channel.send(MC+" done");
            })
        })
    }catch(err){
        message.channel.send("err:\n"+err);
    }*/
  }
});

function createRole(currentServObject,moduleName,message){
    currentServObject.roles.create({
        name:moduleName, 
        color: "#9e9e9e", 
        hoist: false,
        mentionable: true
    }).then((param)=>{
        message.channel.send(param);
    });
}

function createCategory(currentServObject,moduleName){
    return new Promise((resolve)=>{
        currentServObject.channels.create(moduleName, {
            type: 'category',
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
        }).then(()=>{
            resolve;
        })
    });
}

function createAllChannels(currentServObject,moduleName){
    return new Promise((resolve)=>{
        resolve;
    })
}

bot.login(secret.token);