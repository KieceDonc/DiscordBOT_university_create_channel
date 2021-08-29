const Discord = require('discord.js')
const bot = new Discord.Client();
const secret = require("./secret.js");


bot.on('message', async message => {
  
    var authorID = message.author.id;
    var moduleName = message.content;
    var currentServObject = message.guild;

    if(message.channel.id=="881639490878332938" && authorID!="881642877984317452"){
    try{
        createRole(currentServObject,moduleName).then((currentRoleID)=>{
            createCategory(currentServObject,moduleName,currentRoleID).then((currentCategoryID)=>{
                createAllChannels(currentServObject,moduleName,currentCategoryID).then(()=>{
                    message.channel.send(MC+" done");
                })
            })
        });
    }catch(err){
        message.channel.send("err:\n"+err);
    }
  }
});

function createRole(currentServObject,moduleName){
    return new Promise((resolve)=>{ 
        // creating role for current module
        currentServObject.roles.create({
            data: {
                name: moduleName, 
                color: "#9e9e9e", 
                mentionable: true,
              },
            reason: 'we needed a role for Super Cool People',
        }).then((currentRole)=>{
            resolve(currentRole.id)
        });
    })
}

function createCategory(currentServObject,moduleName,currentRoleID){
    return new Promise((resolve)=>{ 
        // creating category for current module
        var everyoneRoleID = currentServObject.roles.everyone.id;
        currentServObject.channels.create(moduleName, {
            type: 'GUILD_CATEGORY',
        }).then((currentCategory)=>{
             // changing permissions to allow only the role of the current module to see it and not everyone
            currentCategory.overwritePermissions(currentRoleID, {
                VIEW_CHANNEL: true
            });
            currentCategory.overwritePermissions(everyoneRoleID, {
                VIEW_CHANNEL: false
            });
            resolve(currentCategory.id);
        })
    });
}

function createAllChannels(currentServObject,moduleName,currentCategoryID){
    return new Promise((resolve)=>{
        currentServObject.channels.create("annonces-"+moduleName, {
            type: 'GUILD_TEXT',
            parent_id: currentCategoryID, 
        }).then(()=>{
            currentServObject.channels.create("général-"+moduleName, {
                type: 'GUILD_TEXT',
                parent_id: currentCategoryID, 
            }).then(()=>{
                currentServObject.channels.create("fichiers-"+moduleName, {
                    type: 'GUILD_TEXT',
                    parent_id: currentCategoryID, 
                }).then(()=>{
                    resolve;
                })
            })
        })
    })
}

bot.login(secret.token);