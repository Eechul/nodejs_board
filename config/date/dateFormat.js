exports.dataformat = function(d) {
    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDate(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds()

    var todayDate = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds
    console.log("todayDate", todayDate)
    return todayDate
}

exports.isCommonFormatDate = function(d,n) {
    var currentDate = 0
    var userCode = 1
    var fileDate = 2

    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDate(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds(),
        millise = d.getMilliseconds()

    var stringFormat = null
    var todayDate = null
    switch (n) {
        case 0:
            stringFormat = year+"/"+month+"/"+day+"/"+hours+":"+minutes+":"+seconds
        break;
        case 1: // 지금은 이 밑 함수를 씀. 채팅 어플에서 추후 수정할 예정
            var title = "chattingApp"
            todayDate = year+""+month+""+day+""+hours+""+minutes+""+seconds+""+millise
            stringFormat = title+""+todayDate
        break;
        default:
            stringFormat = "error: isCommonFormatDate()"
    }
    console.log("sumString", stringFormat)
    return stringFormat
}

exports.isFormatfileDate = function(d) {
    var year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDate(),
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
