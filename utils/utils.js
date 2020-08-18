import { Alert ,AsyncStorage} from 'react-native'

export function alertMessage (message) {
    Alert.alert(
        'Message',
        message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
    );
}

export function validEmail(text){
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if(reg.test(text) === false)
  {
     return false
  }
  else {
     return true
  }
}

export function replaceString (text) {
    if (text.length > 15) {
        return (text).substring(0,15) + ' ...';
    } else {
        return text ;
    }
}

export function removePlusCharacter(phone_number,country_code) {
  var isValid = true
  for (var i =0 ;i < phone_number.length; i++) {
      if (phone_number[i] == '+') {
          isValid = false
      }
  }
  var temp_str = ''
  if (!isValid) { //if phone number has +
      for (var i = 0 ;i < phone_number.length; i++) {
          var isChecked = true
          for (var j = 0; j < country_code.length; j++) {
              if (phone_number[i] == country_code[j] && (i - 1) <= country_code.length ) {
                  isChecked = false
              }
              if (phone_number[i] == " ") {
                  isChecked = false
              }
          }
          if (isChecked) {
              temp_str += phone_number[i]
          }
      }   
  } else {
      for (var i = 0 ;i < phone_number.length; i++) { 
          if (phone_number[i] != " ")
              temp_str += phone_number[i]
      }
  }
  return temp_str;
}

export function convertDate (date) {
    var year = new Date(date).getFullYear()
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var month = month[new Date(date).getMonth()];
    var day = new Date(date).getDate()
    if (day < 10 ) day = '0' + day

    return day + ' ' + month + ' ' + year
}
export function paramDate (date) {
    var day = new Date(date).getDate()
    var month = new Date(date).getMonth() + 1
    var year = new Date(date).getFullYear()

    if (day < 10)
        day = '0' + day
    if (month < 10)
        month = '0' + month

    return day + '/' + month + '/' + year
}
export function paramDate2 (date) {
    var day = new Date(date).getDate()
    var month = new Date(date).getMonth() + 1
    var year = new Date(date).getFullYear()

    if (day < 10)
        day = '0' + day
    if (month < 10)
        month = '0' + month

    return  day + '-' + month + '-' + year
}
export function changeDate (date) {
    var strs = date.split(' ')[0].split('-')
    var year = Number(strs[0])
    var mon = Number(strs[1])
    var day = strs[2]

    if (day < 10)
        day = '0' + day
    if (mon < 10)
        mon = '0' + mon

    return day + '-' + mon + '-' + year
}
export function changeDate2 (date) {
    var year = new Date(date).getFullYear()
    var mon = new Date(date).getMonth() + 1
    var day = new Date().getDate()

    if (day < 10)
        day = '0' + day
    if (mon < 10)
        mon = '0' + mon

    return  year + '-' + mon + '-' + day
}
export function getHoursAndMinsFromStr (str) {
    var strs = str.split(':')
    var hours = strs[0]
    var mins = strs[1]
    
    return hours + ":" + mins
}
export function getHoursAndMins(date) {
    var half = ''
    var hours = date.getHours();
    if (hours > 12) hours = hours - 12

    if (hours < 10) hours = '0' + hours 

    var mins = date.getMinutes();

    if (mins < 10 ) mins = '0' + mins

    //var seconds = date.getSeconds()
    var seconds = 0

    if (seconds < 10) seconds = '0' + seconds

    return hours + ':' + mins
}
export function changeNumber(number) {
    var str = number.toString().split('.');
    if (str.length == 1) {
        str.push('00')
    }
    if (str[0].length >= 3) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}

export function changeMonthfromServer(data) {

    var month = new Array();

    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "June";
    month[7] = "July";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";

    return month[Number(data)]
}
export function changeDatefromAccount(date) {
    var strs = date.split('-')
    var year = Number(strs[0])
    var mon = Number(strs[1])
    var day = strs[2]

    var month = new Array();

    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    
    var res_month = month[mon -1];
    return day + ' ' + res_month + ' ' + year
}
export function changeDatefromServer(date) {
    var strs = date.split('-')
    var year = Number(strs[0])
    var mon = Number(strs[1])
    var day = strs[2]

    var month = new Array();

    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    
    var res_month = month[mon -1];
    return day + ' ' + res_month + ' ' + year

}
export function convertJSON (data) {
    var result = Object.keys(data).map(function(key) {
        return data[key];
    });
    return result
}
export function getPrice(value) {
    var arr = value.toString().split(' ')
    return arr
}