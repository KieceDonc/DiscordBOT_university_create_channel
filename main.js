const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });
const secret = require("./secret.js");


var allChanCurrentSemestreID = "930490087878299688";

client.on('message', async message => {
 
    var authorID = message.author.id;
    var moduleName = message.content.split("&")[0];
    var moduleAbbreviation = message.content.split("&")[1];
    var currentServObject = message.guild;

    if(message.channel.id=="881639490878332938" && authorID=="302529594685128707"){
        try{
            createRole(currentServObject,moduleName).then((currentRoleID)=>{
                createCategory(currentServObject,moduleName).then((currentCategory)=>{
                    changeCategoryPerm(currentServObject,currentCategory,currentRoleID).then(()=>{
                        createAllChannels(currentServObject,currentCategory.id,moduleAbbreviation).then(()=>{
                            message.channel.send("Module "+moduleName+" avec abrévation "+moduleAbbreviation+" finit");
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
            name: moduleName,
            color: "#9e9e9e",
            reason: 'we needed a role for Super Cool People',
          }).then((currentRole)=>{
            resolve(currentRole.id)
        });
    })
}

function createCategory(currentServObject,moduleName){
    return new Promise((resolve)=>{
        // creating category for current module
        currentServObject.channels.create(moduleName, {
            type: 'GUILD_CATEGORY',
        }).then((currentCategory)=>{
            resolve(currentCategory);
        })
    });
}

function createAllChannels(currentServObject,currentCategoryID,moduleAbbreviation){
    return new Promise((resolve)=>{
        currentServObject.channels.create("annonces-"+moduleAbbreviation, {
            type: 'GUILD_TEXT',
            parent: currentCategoryID,
        }).then((annoncesChan)=>{
            annoncesChan.lockPermissions();
            currentServObject.channels.create("général-"+moduleAbbreviation, {
                type: 'GUILD_TEXT',
                parent: currentCategoryID,
            }).then((generalChan)=>{
                generalChan.lockPermissions();
                currentServObject.channels.create("fichiers-"+moduleAbbreviation, {
                    type: 'GUILD_TEXT',
                    parent: currentCategoryID,
                }).then((fichiersChan)=>{
                    fichiersChan.lockPermissions();
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
        currentCategory.permissionOverwrites.set([
            {
                id: currentRoleID,
                allow: 'VIEW_CHANNEL',
            },
            {
                id: allChanCurrentSemestreID,
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

client.login(secret.token);