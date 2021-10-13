import { Linking } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-root-toast';
import WebConstant from './WebConstant'
import * as CommonFunction from '../Utility/CommonFunction'
import { Strings } from 'Res';
import axios from 'axios';
import oauth from 'axios-oauth-client';
import tokenProvider from 'axios-token-interceptor';

let toast = (msg) => Toast.show(msg, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
        // calls on toast\`s appear animation start
    },
    onShown: () => {
        // calls on toast\`s appear animation end.
    },
    onHide: () => {
        // calls on toast\`s hide animation start.
    },
    onHidden: () => {
        // calls on toast\`s hide animation end.
    }
});

var instance = axios.create();

var WebApi = {

    //GET TOKEN
    initAxios: function (email, password) {
        instance = axios.create();

        const getOwnerCredentials = oauth.client(axios.create(), {
            url: WebConstant.oauth2_token,
            grant_type: 'password',
            client_id: '2',
            client_secret: 'UmlO5SMytgJXdqyJd3FQ7xtz5yLvrVMRkRLFvESj',
            username: email,
            password,
            scope: ''
        });

        instance.interceptors.request.use(
            // Wraps axios-token-interceptor with oauth-specific configuration,
            // fetches the token using the desired claim method, and caches
            // until the token expires
            oauth.interceptor(tokenProvider, getOwnerCredentials)
        )

        return getOwnerCredentials()
    },

    //GET request
    getRequest: function (requestUrl,) {
        console.log("request url is " + requestUrl)
        return NetInfo.fetch().then(netInfo => {
            if (netInfo.isConnected) {
                return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
                    if (url) {
                        var headers = {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        };

                        return instance({
                            method: 'get',
                            url: requestUrl,
                            responseType: 'text',
                            headers,
                        }).then(function (response) {
                            console.log("resonse is " + JSON.stringify(response.data))
                            return JSON.stringify(response.data);
                        }).catch((error) => {
                            console.log("error is catch " + JSON.stringify(error))
                            console.log(error)
                            CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                            });
                            return;
                        });
                    }
                }).catch(err => console.log("Could not reach to server ", +err));
            } else {
                toast('Oops! The device seems to be disconnected. Please connect to a working internet connection and try again.', 2000)
                return Promise.reject("No Network Connection")
            }
        })
    },
    //DELETE request
    deleteRequest: function (requestUrl, body) {
        console.log("request url is " + requestUrl)

        return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
            if (url) {
                var headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                };

                return instance({
                    method: 'delete',
                    url: requestUrl,
                    responseType: 'text',
                    data: JSON.stringify(body),
                    headers,
                }).then(function (response) {
                    console.log("resonse is " + JSON.stringify(response.data))
                    return JSON.stringify(response.data);

                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                    return;
                });
            }
        }).catch(err => console.log("Could not reach to server ", +err));
    },

    //PUT Request
    putRequest: function (requestUrl, body) {
        console.log("request url is " + requestUrl)

        return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
            if (url) {
                var headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                };

                return instance({
                    method: 'put',
                    url: requestUrl,
                    responseType: 'text',
                    data: JSON.stringify(body),
                    headers,
                    validateStatus: function (status) {
                        return status; // default
                    },
                }).then(function (response) {
                    console.log("resonse is " + JSON.stringify(response.data))
                    return JSON.stringify(response.data);

                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                    return;
                });
            }
        }).catch(err => console.log("Could not reach to server ", +err));
    },


    //POST request api 
    postRequest: function (requestUrl, body,) {
        console.log("request url is " + requestUrl + " body is " + JSON.stringify(body))

        return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
            console.log('base url is ' + JSON.stringify(url))
            if (url) {
                var headers = {
                    'Content-Type': 'application/json',
                    'content-type': 'multipart/form-data',
                };

                console.log("headers: " + JSON.stringify(headers))
                return instance({
                    method: 'post',
                    url: requestUrl,
                    responseType: 'text',
                    formData: JSON.stringify(body),
                    headers,
                    validateStatus: function (status) {
                        return status; // default
                    },
                }).then(function (response) {
                    console.log("resonse is " + JSON.stringify(response.data))
                    return JSON.stringify(response.data);
                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                    return;
                });

            }
        }).catch(err => console.log("Could not reach to server ", +err));
    },


    //POST request api 
    postRequestForOrders: function (requestUrl, body,) {
        console.log("request url is " + requestUrl + " body is " + JSON.stringify(body))

        return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
            console.log('base url is ' + JSON.stringify(url))
            if (url) {
                var headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                };

                console.log("headers: " + JSON.stringify(headers))
                return instance({
                    method: 'post',
                    url: requestUrl,
                    responseType: 'text',
                    data: JSON.stringify(body),
                    headers,
                    validateStatus: function (status) {
                        return status; // default
                    },
                }).then(function (response) {
                    console.log("resonse is " + JSON.stringify(response.data))
                    return JSON.stringify(response.data);
                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                    return;
                });

            }
        }).catch(err => console.log("Could not reach to server ", +err));
    },

    // delete order
    deleteCustomOrder: function (requestUrl, body,) {
        console.log("request url is " + requestUrl + " body is " + JSON.stringify(body))

        return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
            console.log('base url is ' + JSON.stringify(url))
            if (url) {
                var headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                };

                console.log("headers: " + JSON.stringify(headers))
                return instance({
                    method: 'delete',
                    url: requestUrl,
                    responseType: 'text',
                    data: JSON.stringify(body),
                    headers,
                    validateStatus: function (status) {
                        return status; // default
                    },
                }).then(function (response) {
                    console.log("resonse is " + JSON.stringify(response.data))
                    return JSON.stringify(response.data);
                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                    return;
                });

            }
        }).catch(err => console.log("Could not reach to server ", +err));
    },

    multiPartRequest: function (requestUrl, body,) {
        console.log("request url is " + requestUrl + " body is " + JSON.stringify(body))
        return NetInfo.fetch().then(netInfo => {
            if (netInfo.isConnected) {
                return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
                    console.log('base url is ' + JSON.stringify(url))
                    if (url) {
                        var bodyFormData = new FormData();
                        for (var key in body) {
                            if (body.hasOwnProperty(key)) {
                                if (Array.isArray(body[key]) && requestUrl.includes(WebConstant.create_report_problem)) {
                                    for (let index = 0; index < body[key].length; index++) {
                                        bodyFormData.append(key, body[key][index]);
                                    }
                                } else {
                                    bodyFormData.append(key, body[key]);
                                }
                            }

                        }
                        console.log("body form data is " + JSON.stringify(bodyFormData))
                        var headers = {
                            "Content-Type": "multipart/form-data",
                            "Accept": "application/json",
                        };
                        console.log("headers: " + JSON.stringify(headers))
                        return instance({
                            method: 'post',
                            url: requestUrl,
                            responseType: 'text',
                            data: bodyFormData,
                            headers,
                            validateStatus: function (status) {
                                return status; // default
                            },
                        }).then(function (response) {
                            console.log("resonse is " + JSON.stringify(response.data))
                            return JSON.stringify(response.data);
                        }).catch((error) => {
                            console.log("error is catch " + JSON.stringify(error))
                            console.log(error)
                            CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                            });
                            return;
                        });

                    }
                }).catch(err => console.log("Could not reach to server ", err));
            } else {
                toast('Oops! The device seems to be disconnected. Please connect to a working internet connection and try again.', 2000)
                return Promise.reject("No Network Connection");
            }
        })
    },

    //GET multipart request
    getMultipPartRequest: function (requestUrl,) {
        console.log("request url is " + requestUrl)
        return NetInfo.fetch().then(netInfo => {
            if (netInfo.isConnected) {
                return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
                    if (url) {
                        var headers = {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        };

                        return instance({
                            method: 'get',
                            url: requestUrl,
                            responseType: 'text',
                            headers,
                        }).then(function (response) {
                            console.log("resonse is " + JSON.stringify(response.data) + " requestUrl " + JSON.stringify(requestUrl))
                            return JSON.stringify(response.data);
                        }).catch((error) => {
                            console.log("error is catch " + JSON.stringify(error))
                            console.log(error)
                            CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                            });

                            return;
                        });
                    }
                }).catch(err => console.log("Could not reach to server ", +err));
            } else {
                toast('Oops! The device seems to be disconnected. Please connect to a working internet connection and try again.', 2000)
                return Promise.reject("No Network Connection")
            }
        })
    },





    onlyReportAproblumMultiPartRequest: function (requestUrl, body,) {
        console.log("request url is " + requestUrl + " body is " + JSON.stringify(body))
        return NetInfo.fetch().then(netInfo => {
            if (netInfo.isConnected) {
                return Linking.canOpenURL(WebConstant.SERVER_BASE).then((url) => {
                    console.log('base url is ' + JSON.stringify(url))
                    if (url) {
                        console.log("body form data is " + JSON.stringify(body))
                        var headers = {
                            "Content-Type": "multipart/form-data",
                            "Accept": "application/json",
                        };
                        console.log("headers: " + JSON.stringify(headers))
                        return instance({
                            method: 'post',
                            url: requestUrl,
                            responseType: 'text',
                            data: body,
                            headers,
                            validateStatus: function (status) {
                                return status; // default
                            },
                        }).then(function (response) {
                            console.log("resonse is " + JSON.stringify(response.data))
                            return JSON.stringify(response.data);
                        }).catch((error) => {
                            console.log("error is catch " + JSON.stringify(error))
                            console.log(error)
                            CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                            });
                            return;
                        });
                    }
                }).catch(err => console.log("Could not reach to server ", +err));
            } else {
                toast('Oops! The device seems to be disconnected. Please connect to a working internet connection and try again.', 2000)
                return Promise.reject("No Network Connection");
            }
        })
    },

}

export default WebApi;

