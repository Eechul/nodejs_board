var isFormatfileDate = function(d) {
    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDay(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds(),
        millise = d.getMilliseconds();
    
    var title = "chattingApp"
    var todayDate = year+""+month+""+day+""+hours+""+minutes+""+seconds+""+millise
    var sumString = title+"_"+todayDate
    console.log("sumString", sumString)
    return sumString
}  

var isRandomNumber = function() {
    var max = 5;
    var RandomNumber = "";
    
    for(var i=0; i<max; i++) {
        var random = (Math.random()*10)
        random = Math.floor(random);
        RandomNumber += ""+random
    }
    return RandomNumber
}  