/**
 * Created by mayankGarg on 15 june 2018
 * Global function
*/
import { Alert, Platform, Share, Linking } from 'react-native';
import { Strings } from 'Res'
import * as SessionManager from '../../Application/Utility/CustomManagers/SessionManager';

export const link = "<style>@import url('https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i');</style>";
//const customStyle = "<style>body {height:auto;padding:0 5px;} img, table, ul {max-width:96%;margin:0 auto;}, p{max-width:96%;}  </style>";
export const style = "<style>body {height:auto;padding:0 5px; font-family: 'Roboto', sans-serif;} img, table{white-space: normal}, ul {max-width:96%;margin:0 auto;}, p{max-width:96%;}  </style>";
export const script = "<head><meta name='viewport' content='target-densityDpi=device-dpi'/></head>";

export const customStyle = style + script;



/*
    This is use for Email validation
*/
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};


export function validateName(name) {
  var re = /^([A-z])+(.?[a-zA-Z])*('?[a-zA-Z])*$/;
  return re.test(name);
};


// check mobile number validation
export function checkMobileNumber(value) {
  if (value != "") {
    const re = /^[0-9\b]+$/;
    if (re.test(value)) {
      return true;
    } else {
      return false;
    }
  }
}

// for first letter captial 
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// remove html tag from string
export function removeHtmlTag(string) {
  const regex = /(<([^>]+)>)/ig;
  const result = string.replace(regex, '');
  return result;
}

// find only 2 digits value from long number digits
export function parseNumberDigitsValue(x) {
  return Number.parseFloat(x).toFixed(2);
}

// show alert dialog
export function singleAlertDilog(alertMessage, btnText) {

  var text;
  if (btnText == "" || btnText === undefined) {
    text = Strings.Ok;
  } else {
    text = btnText;
  }

  Alert.alert(
    Strings.AppName,
    alertMessage,
    [
      { text: text, onPress: () => console.log('ok press') },
    ],
    { cancelable: false }
  )
}
// show alert dialog
export function singleAlertDilogWithAction(alertMessage, btnText, btnOnPress) {

  var text;
  if (btnText == "" || btnText === undefined) {
    text = Strings.Ok;
  } else {
    text = btnText;
  }

  Alert.alert(
    Strings.AppName,
    alertMessage,
    [
      { text: text, onPress: () => btnOnPress() },
    ],
    { cancelable: false }
  )
}

// double button alert dialog with action method
export function doubleAlertDilog(message, positiveBtnText, negitiveBtnText, positiveBtnOnPress, negitiveBtnOnPress) {
  var text1, text2;
  if (positiveBtnText == "" || positiveBtnText === undefined) {
    text1 = Strings.Ok;
  } else {
    text1 = positiveBtnText;
  }
  if (negitiveBtnText == "" || negitiveBtnText === undefined) {
    text2 = Strings.Cancel;
  } else {
    text2 = negitiveBtnText;
  }
  Alert.alert(
    Strings.AppName,
    message,
    [
      { text: text2, onPress: () => negitiveBtnOnPress() },
      { text: text1, onPress: () => positiveBtnOnPress() },
    ],
    { cancelable: false }
  )
}


export function underWorkingAlert() {
  Alert.alert(
    Strings.AppName,
    Strings.underWorking,
    [
      { text: Strings.Ok, onPress: () => console.log('ok press') },
    ],
    { cancelable: false }
  )
}


export function getCurrentDateInGMT() {
  var d = new Date();
  var month = (d.getMonth() + 1);
  var date = d.getDate();
  if ((d.getMonth() + 1) <= 9) {
    month = "0" + (d.getMonth() + 1);
  }
  if (d.getDate() <= 9) {
    date = "0" + d.getDate();
  }
  var finalDateString = d.getFullYear() + "-" + month + "-" + date + "T00:00:00"
  console.log("current date is " + JSON.stringify(finalDateString))
  return finalDateString;

}

// get month index
export function getMonthByIndex(index) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

// check month index
export function checkMonthIndex(value) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (var i = 0; i < months.length; i++) {
    if (months[i] == value) {
      return i;
    }
  }
}


// share product to share intent
export function getShareProductByShareIntent(description, url, subject, onBackCome) {
  var finalMessage = subject + ' - \n' + url;
  var title = subject;
  Share.share({
    message: finalMessage,
    url: url,
    title: title
  }, {
    subject: subject,
    dialogTitle: Strings.AppName,
  }).then(({ action, activityType }) => {
    console.log("action is " + JSON.stringify(action))
    if (Platform.OS == 'ios') {
      if (action === Share.dismissedAction) {
        onBackCome();
      }
      else {
        onBackCome();
        setTimeout(() => {
          singleAlertDilog(Strings.productShareSuccessfully, Strings.Ok)
        }, 1000);
      }
    } else {
      if (action == "sharedAction") {
        onBackCome();
      } else {
        //this.onBackCome();
      }

    }

  });
}

//This function is used to check wheater a string is null or emply or undefined
export function isNull(data) {
  return typeof data === "undefined" || data === null || data === "" || data.toString().trim() === "";
}
// convert currency price
export function convertPrice(price, currencyType) {
  if (currencyType != null) {
    if (price != "") {
      if (currencyType == "US Dollar") {
        return "$" + parseNumberDigitsValue((price * 1.26));
      } else if (currencyType == "Euro") {
        return "€" + parseNumberDigitsValue((price * 1.13));
      } else if (currencyType == "GB Pound") {
        return "£" + parseNumberDigitsValue((price));
      } else if (currencyType == "Canadian Dollar") {
        return "$" + parseNumberDigitsValue((price * 1.71));
      } else if (currencyType == "Australian Dollar") {
        return "$" + parseNumberDigitsValue((price * 1.82));
      } else if (currencyType == "New Zealand Dollar") {
        return "$" + parseNumberDigitsValue((price * 1.92));
      }
    }
  } else {
    return "£" + parseNumberDigitsValue((price));
  }

}


export function phonecall(phoneNumber, prompt) {
  if (arguments.length !== 2) {
    console.log('you must supply exactly 2 arguments');
    return;
  }

  if (!isCorrectType('String', phoneNumber)) {
    console.log('the phone number must be provided as a String value');
    return;
  }

  if (!isCorrectType('Boolean', prompt)) {
    console.log('the prompt parameter must be a Boolean');
    return;
  }

  let url;

  if (Platform.OS !== 'android') {
    url = prompt ? 'telprompt:' : 'tel:';
  }
  else {
    url = 'tel:';
  }

  url += phoneNumber;

  LaunchURL(url);
}




export function email(to, cc, bcc, subject, body) {
  let url = 'mailto:';
  let argLength = arguments.length;

  switch (argLength) {
    case 0:
      LaunchURL(url);
      return;
    case 5:
      break;
    default:
      console.log('you must supply either 0 or 5 arguments. You supplied ' + argLength);
      return;
  }

  // we use this Boolean to keep track of when we add a new parameter to the querystring
  // it helps us know when we need to add & to separate parameters
  let valueAdded = false;

  if (isCorrectType('Array', arguments[0])) {
    let validAddresses = getValidArgumentsFromArray(arguments[0], 'String');

    if (validAddresses.length > 0) {
      url += encodeURIComponent(validAddresses.join(','));
    }
  }

  url += '?';

  if (isCorrectType('Array', arguments[1])) {
    let validAddresses = getValidArgumentsFromArray(arguments[1], 'String');

    if (validAddresses.length > 0) {
      valueAdded = true;
      url += 'cc=' + encodeURIComponent(validAddresses.join(','));
    }
  }

  if (isCorrectType('Array', arguments[2])) {
    if (valueAdded) {
      url += '&';
    }

    let validAddresses = getValidArgumentsFromArray(arguments[2], 'String');

    if (validAddresses.length > 0) {
      valueAdded = true;
      url += 'bcc=' + encodeURIComponent(validAddresses.join(','));
    }
  }

  if (isCorrectType('String', arguments[3])) {
    if (valueAdded) {
      url += '&';
    }

    valueAdded = true;
    url += 'subject=' + encodeURIComponent(arguments[3]);
  }

  if (isCorrectType('String', arguments[4])) {
    if (valueAdded) {
      url += '&';
    }

    url += 'body=' + encodeURIComponent(arguments[4]);
  }

  LaunchURL(url);
}
const isCorrectType = function (expected, actual) {
  return Object.prototype.toString.call(actual).slice(8, -1) === expected;
};
const LaunchURL = function (url) {
  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log('Can\'t handle url: ' + url);
    } else {
      Linking.openURL(url)
        .catch(err => {
          if (url.includes('telprompt')) {
            // telprompt was cancelled and Linking openURL method sees this as an error
            // it is not a true error so ignore it to prevent apps crashing
            // see https://github.com/anarchicknight/react-native-communications/issues/39
          } else {
            console.warn('openURL error', err)
          }
        });
    }
  }).catch(err => console.warn('An unexpected error happened', err));
};
const getValidArgumentsFromArray = function (array, type) {
  var validValues = [];
  array.forEach(function (value) {
    if (isCorrectType(type, value)) {
      validValues.push(value);
    }
  });

  return validValues;
};



