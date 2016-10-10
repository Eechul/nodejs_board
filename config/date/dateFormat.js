exports.dataformat = function(d) {
    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDay(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds()
    
    var todayDate = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
    console.log("todayDate", todayDate)
    return todayDate
}  

exports.isFormatfileDate = function(d) {
    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDay(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds(),
        millise = d.getMilliseconds();
    
    var title = "chattingApp"
    var todayDate = year+""+month+""+day+""+hours+""+minutes+""+seconds+""+millise
    var sumString = title+""+todayDate
    console.log("sumString", sumString)
    return sumString
}  