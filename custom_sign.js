/*
var contents = [
    '&b&l告示牌',
    '==========','',
    '----------','',
    '==========','',
    '----------','say hello'
]
*/
var cmd = 'give @p minecraft:sign 1 0 {display:{Name:"'+contents[0]+'"},BlockEntityTag:{Text1:"%s",Text2:"%s",Text3:"%s",Text4:"%s"}}';
for(var i = 1;i<9;i+=2){
    cmd = cmd.replace('%s',('{"text":"'+contents[i]+'"}')
        .replace(/}$/,contents[i+1]==''?'}':',"clickEvent":{"action":"run_command","value":"'+contents[i+1]+'"}}')
        .replace(/"/g,'\\"'));
}
cmd = cmd.replace(/&[0-9a-fkl-or]/g,function(word){return word.replace('&','§')});
