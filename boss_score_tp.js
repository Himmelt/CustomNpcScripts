// Init
npc.setTempData("lastHealth",npc.getHealth()+20);//bosss上次血量记录
npc.setTempData("dropChance",0.1);//全局物品掉落概率
npc.setTempData("dropItemid"," 4429 ");//全局掉落物品id,注意两边有空格,估计也可以使用nameid的形式
npc.setTempData("dropNumber",1);//物品掉落数量,这里比较特殊,不仅可以用整数,小数也是支持的,但是千万别用负数!!!
//掉落物品的描述,注意空格的使用要符合指令形式
npc.setTempData("dropDescri"," 0 {display:{Lore:[\"§e拿给天空族的人看看吧,或许有用.§r\"],Name:\"§5魔族骸骨§r\"}}");
npc.setTempData("QuestId",31);//传送任务的任务ID
npc.setTempData("ATTACK",false);
npc.setTempData("TIME",Date.parse(new Date())/1000);//获取1970-1-1-00:00:00至今的秒数


//update
if(!npc.getTempData("ATTACK")){
    var time_old = npc.getTempData("TIME");
    var time_now = Date.parse(new Date())/1000;

    if(time_now - time_old > 10 )
    {
        var players = npc.getSurroundingEntities(15,1);//获取npc10格内的玩家实体,根据boss房间的半径设置
        var length  = players.length;
        if(length > 0){
            switch(length){
                case 1 : npc.say(players[0].getName()+",你竟然敢独自前来送死,\n我真替你感到惋惜(｀·ω·´)");break;
                case 2 : npc.say("卧槽，就你们这俩二货也敢来挑战我(´；ω；`)");break;
                case 3 : npc.say(players[0].getName()+","+players[1].getName()+","+players[2].getName()+",\n我记住你们了！(;¬_¬)");break;
                default : npc.say("你们。。你。。你们竟然那么卑鄙,一群人来&m轮&r..\n额,围殴我一个弱女子,555555(╯°口°)╯(┴—┴");
            }
        }
        npc.setTempData("TIME",time_now);
    }
}


// Update 周期检测玩家任务状态，如果不是未完成状态，一律传送
// 现在用的是另一个npc,放置到boss房间的中心
var time_old = npc.getTempData("TIME");
var time_now = Date.parse(new Date())/1000;

if(time_now - time_old > 10 )
{
    var players = npc.getSurroundingEntities(15,1);//获取npc10格内的玩家实体,根据boss房间的半径设置
    for(var i=0;i<players.length;i++){
        if(!players[i].hasActiveQuest(31)){
            players[i].setPosition(-128,12,69);//传送至目标点
        }
    }
    //npc.say(time_now);
    npc.setTempData("TIME",time_now);
}


// Demage
npc.setTempData("ATTACK",true);

var player = event.getSource();//获取伤害源(如玩家、其他生物、火)
if(player != null && player.getType() == 1 )//如果伤害源存在并且类型是1(也就是玩家)则继续
{
    var score = npc.getTempData("lastHealth") - npc.getHealth();//上次血量-当前血量=伤害值
    if(player.hasTempData("Score")){
        player.setTempData("Score",player.getTempData("Score") + score);//存储玩家伤害值到玩家的全局变量
    }
    else{
        player.setTempData("Score",score);//第一次攻击时设置全局变量
    }
    npc.say(player.getName() + ",伤害:" + score + ",总伤害:" + player.getTempData("Score"));
}
npc.setTempData("lastHealth",npc.getHealth());//把boss当前血量设置到lastHealth,为下次使用



// Dead
npc.setTempData("ATTACK",false);

var players = npc.getSurroundingEntities(10,1);//获取npc10格内的玩家实体
var i = 0;//循环变量
var j = 0;
var length = players.length;//玩家数量
var scores = new Array(length);//玩家伤害值数组
var totalScore = 0;//总伤害值
//排序
for (i = 0;i < length;i++ ){
    for(j = i + 1;j < length;j++){
        if(players[i].hasTempData("Score") && players[j].hasTempData("Score")){
            if(players[j].getTempData("Score") > players[i].getTempData("Score")){
                var p = players[i];
                players[i] = players[j];
                players[j] = p;
            }
        }
    }
}
//统计总伤害
for(i = 0;i < length;i++){
    if(players[i].hasTempData("Score")){
        scores[i] = players[i].getTempData("Score");
        totalScore = totalScore + scores[i];
    }
}
//第一名奖励
if(length > 0 && players[0].hasTempData("Score") ){
    npc.say("第一名:"+players[0].getName()+"有较高几率获得金色叶子");
    if(Math.random()<npc.getTempData("dropChance")){
    //给玩家物品的指令
        //npc.say("give " + players[0].getName() + " 4440 1 0 " + "{display:{Lore:[\"§e珍贵的枫叶§r\"],Name:\"§d§l金色枫叶§r\"}}");
        //npc.executeCommand("give " + players[0].getName() + " 4440 1 0 " + "{display:{Lore:[\"§e珍贵的枫叶§r\"],Name:\"§d§l金色枫叶§r\"}}" );
    }
}
else{
    npc.say("没找到第一名");
}

//计算伤害百分比并分配物品
for(i = 0;i < length;i++){
    if(players[i].hasTempData("Score")){
        npc.say(players[i].getName()+" 总伤害值: "+scores[i]);
        if(Math.random()<npc.getTempData("dropChance")){
            //给玩家物品的指令
            npc.executeCommand("give " + players[i].getName() + npc.getTempData("dropItemid") + Math.round(npc.getTempData("dropNumber")*(scores[i]/totalScore)) + npc.getTempData("dropDescri"));
        }
        players[i].removeQuest(npc.getTempData("QuestId"));//清除任务状态
    }
    players[i].removeTempData("Score");//清除玩家得分记录
}
