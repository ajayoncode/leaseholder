import AsyncStorage from '@react-native-community/async-storage'
import { Constant } from 'Res';


//fetch session data from asyncStorage

export async function getLoginUserData() {

    try {
        const data = await AsyncStorage.getItem(Constant.sessionKey_loginResponse)
        return data

    } catch (error) {
        // Error retrieving data
    }

};

//set session data in asynStorage
export async function setLoginUserData(userData) {
    try {
        await AsyncStorage.setItem(Constant.sessionKey_loginResponse, JSON.stringify(userData));
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};

export async function getBranding() {
    try {
        const data = await AsyncStorage.getItem(Constant.branding)
        return data

    } catch (error) {

        // Error retrieving data
    }
};

//set session data in asynStorage
export async function setBranding(brandingData) {
    try {
        await AsyncStorage.setItem(Constant.branding, JSON.stringify(brandingData));
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};

export async function logoutUserData() {
    try {
        await clearStorage()
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};


export async function removeUserData(Key) {
    try {
        await AsyncStorage.removeItem(Key);
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};
// clear the whole storage
export async function clearStorage() {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};

//set session data in asynStorage
export async function setRecordIntoPreference(data, key) {

    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};

export async function getPreferenceData(key) {

    try {
        const data = await AsyncStorage.getItem(key)
        return data

    } catch (error) {

        // Error retrieving data
    }

};


export async function getAgentAndBlockData() {

    try {
        const data = await AsyncStorage.getItem(Constant.sessionKey_agentblockData)
        return data

    } catch (error) {

        // Error retrieving data
    }

};
//set session data in asynStorage
export async function setAgentAndBlockData(agentData) {

    try {
        await AsyncStorage.setItem(Constant.sessionKey_agentblockData, JSON.stringify(userData));
    } catch (error) {
        //console.log('set data in Session by this key '+sessionKey+' returing error '+JSON.stringify(error));
    }
};

/*
// getter for FCM TOKEN
export async function getFCMToken(){

    var FCM_token= await AsyncStorage.getItem(Constant.sessionKey_FCM_TOKEN);
    return FCM_token;
}

// setter for FCM TOKEN
export async function setFCMToken(fcmToken){
    await AsyncStorage.setItem(Constant.sessionKey_FCM_TOKEN,fcmToken);
}

// setter for user id
export async function setUserID(userId){
    await AsyncStorage.setItem(Constant.sessionKey_USERID,userId);
}

// getter for user id
export async function getUserID(){
    var userId= await AsyncStorage.getItem(Constant.sessionKey_USERID);
    return userId;
}

// setter for set user is remeber login detials
export async function setIsRemember(isRemeber){
    await AsyncStorage.setItem(Constant.sessionKey_IsRemember,isRemeber);
}

// getter for  get user is remeber login detials
export async function getIsRemember(){
    var isRemeber= await AsyncStorage.getItem(Constant.sessionKey_IsRemember);
    return isRemeber;
}
*/


