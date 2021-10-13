import React from 'react'
import { PermissionsAndroid } from 'react-native'

class AndroidPermissionManager {

    static requestCameraPermission = () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Sennen Property Management app camera permission",
                        message: "Allow app to access camera for capturing profile photo",
                        buttonNegative:'Cancel',
                        buttonPositive:'Ok'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                } else {
                    resolve(false)
                    this.handleError(granted)
                }
            } catch (err) {
                console.log("error in camera permission>>>>>>>>>>", JSON.stringify(err))
            }
        })
        return promise
    }

    static requestGalleryPermission = async () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Sennen Property Management app photo gallery permission",
                        message: "Allow app to access photo gallery for your profile photo",
                        buttonNegative: 'Cancel',
                        buttonPositive:'Ok'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true)
                } else {
                    resolve(false)
                    this.handleError(granted)
                }
            } catch (err) {
                console.warn(err);
            }
        });
        return promise
    }

    static handleError = (granted) => {
        switch (granted) {
            case PermissionsAndroid.RESULTS.DENIED:
                alert('Please allow app to access camera/gallery in settings.')
                break;
            case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
               alert("Please try again later with permission check in settings of device")
                break;
            default:
                break;
        }
    }


}

export default AndroidPermissionManager