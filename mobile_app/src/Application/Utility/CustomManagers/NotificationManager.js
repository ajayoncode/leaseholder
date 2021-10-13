// import {Platform} from 'react-native';
// import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, notificationUnsubscribe} from 'react-native-fcm';

// var isIOS = (Platform.OS === "ios")

// class NotificationManager {

//     /**
//      * used to receive notification when app is killed or restarted 
//      */
//     getInitialNotification=()=>{
//        return new Promise((resolve,reject)=>{
//             FCM.getInitialNotification()
//             .then(notif => {
                
//                 console.log("got initial notification >>>>"+JSON.stringify(notif))
//                 resolve(notif)
//             })
//             .catch((err)=>{
//                 console.log("err in get initial notification" + JSON.stringify(err))
//                 reject(err)
//             })
//         })       
//     }

//     /**
//      * request permissions for ios 
//      */
//     requestPermissionIOS = (optionsObj)=>{
//         if(isIOS){
//            return new Promise(async(resolve,reject)=>{
//                 try {
//                     let result = await FCM.requestPermissions({
//                       badge: true,
//                       sound: true,
//                       alert: true,
//                       ...optionsObj
//                     });
//                     console.log("request permission success")
//                     resolve(result);
//                   } catch (e) {
//                     console.log("error in request notif permission  >> "+JSON.stringify(e));
//                     reject(e);
//                   }
//             })
            
//         }
//     }

//     /**
//      * used to get fcm token
//      */
//     getToken = ()=>{
//      return new Promise((resolve,reject)=>{
//                 FCM.getFCMToken()
//                 .then((fcmToken)=>{
//                     console.log("got fcm token >> " + JSON.stringify(fcmToken))
//                     resolve(fcmToken)
//                 })
//                 .catch((err)=>{
//                     console.log("err in get fcm Token >> " + JSON.stringify(err))
//                     this.getToken()
//                     reject(err)
//                 })
//         })
//     }

//     /**
//      * used to get apns token for iOS only
//      */
//     getAPNSToken=()=>{
//         return new Promise((resolve,reject)=>{
//             FCM.getAPNSToken()
//             .then((apnsToken)=>{
//                 console.log("got APNS token >> " + JSON.stringify(apnsToken))
//                 resolve(apnsToken)
//             })
//             .catch((err)=>{
//                 console.log("err in get APNS Token >> " + JSON.stringify(err))
//                 reject(err)
//             })
//         })
//     }


//     /**
//      * listens to notification receive or tap 
//      * uses two listeners 
//      * 1. onReceiveForgroundListener
//      * 2. onTapListener
//      */
//     onNotificationListen=(onTapListener)=>{
//         this.notifListener =   FCM.on(FCMEvent.Notification,(notif)=>{
//             console.log("on notification tapped >>ddd"+ JSON.stringify(notif))
//             if(notif.opened_from_tray){
//                 console.log("on notification tapped >> "+ JSON.stringify(notif))
//                 FCM.setBadgeNumber(0);
//                 //onTapListener(notif)
//             }else{
//                 console.log("on notification received >> "+ JSON.stringify(notif))
//                 onTapListener(notif)
//             }  
//             if(isIOS){
//                 switch(notif._notificationType){
//                     case NotificationType.Remote:
//                       notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
//                       break;
//                     case NotificationType.NotificationResponse:
//                       notif.finish();
//                       break;
//                     case NotificationType.WillPresent:
//                       notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
//                       break;
//                 }
//             }         
//         })
//     }

//     /**
//      * refreshes token 
//      * fcm token may not be available on first load, catch it here
//      */
//     onRefreshToken = (listener)=>{
//         this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
//             console.log("refreshed token >>> "+token)
//             listener(token)
//         });
//     }
    
//     removeNotifListener=()=>{
//         if(this.notifListener){
//             this.notifListener.remove()
//         }
//     }


//     removeRefreshTokenNotifListener=()=>{
//         if(this.refreshTokenListener){
//             this.refreshTokenListener.remove()
//         }
//     }

// }

// export default new NotificationManager()