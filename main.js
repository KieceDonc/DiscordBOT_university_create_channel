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
                createCategory(currentServObject,moduleName,currentRoleID).then((currentCategory)=>{
                    createAllChannels(currentServObject,moduleName,currentCategory.id).then(()=>{
                        changeCategoryPerm(currentServObject,currentCategory,currentRoleID).then(()=>{
                            message.channel.send(message.content+" done");
                        })
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
        currentServObject.channels.create(moduleName, {
            type: 'CATEGORY',
        }).then((currentCategory)=>{
            resolve(currentCategory);
        })
    });
}

function createAllChannels(currentServObject,moduleName,currentCategoryID){
    return new Promise((resolve)=>{
        currentServObject.channels.create("annonces-"+moduleName, {
            type: 'TEXT',
            parent: currentCategoryID, 
        }).then(()=>{
            currentServObject.channels.create("général-"+moduleName, {
                type: 'TEXT',
                parent: currentCategoryID, 
            }).then(()=>{
                currentServObject.channels.create("fichiers-"+moduleName, {
                    type: 'TEXT',
                    parent: currentCategoryID, 
                }).then(()=>{
                    resolve();
                })
            })
        })
    })
}

function changeCategoryPerm(currentServObject,currentCategory,currentRoleID){
    return new Promise((resolve)=>{
        var everyoneRoleID = currentServObject.roles.everyone.id;
        // changing permissions to allow only the role of the current module to see it and not everyone
        currentCategory.overwritePermissions([
            {
                id: currentRoleID, 
                allow: 'VIEW_CHANNEL',
            },
            {
                id: everyoneRoleID, 
                deny: 'VIEW_CHANNEL',
            }
        ]).then(()=>{
            resolve();
        });
    })
}

bot.login(secret.token);