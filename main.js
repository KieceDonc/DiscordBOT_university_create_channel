const Discord = require('discord.js')
const bot = new Discord.Client();
const secret = require("./secret.js");


bot.on('message', async message => {
  
  let moduleName = message.content;
  let currentServObject = message.guild;

  if(message.channel.id=="881644144869650492"){
    var currentModuleRoleID = createRole(currentServObject,moduleName);
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

function createRole(currentServObject,moduleName){
    currentServObject.roles.create({
        name:moduleName, 
        color: "#9e9e9e", 
        hoist: false,
        mentionable: true
    }).then(console.log);
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