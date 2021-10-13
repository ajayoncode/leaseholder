import React, { Component } from 'react';
import { Spinner } from 'CustomComponent';

import * as CommonFunction from '../Application/Utility/CommonFunction';
import * as SessionManager from '../Application/Utility/CustomManagers/SessionManager';

import { WebApi, WebConstant } from "NetworkHelper";

export default class BaseComponent extends Component {
    constructor(props) {
        super(props);
    }

    viewSpinner = () => {
        return <Spinner visible={this.state.isLoadingVisible} />
    }

    showSpinner = () => {
        this.setState({ isLoadingVisible: true });
    }

    hideSpinner = () => {
        this.setState({ isLoadingVisible: false });
    }

    getBranding = (successCall) => {
        var Url = WebConstant.branding;
        console.log("API Request :=>" + Url);

        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            var jsonRes = JSON.parse(jsonRes1)

            console.log("API Response :=>" + JSON.stringify(jsonRes));
            if (jsonRes.status == 'success') {

                SessionManager.setBranding(jsonRes.branding).then(() => {
                    successCall(jsonRes.branding)
                });
            } else {
                if (jsonRes.message) {
                    CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                    });
                }
            }
        }).catch((error) => {
            console.log("error  " + error)
        });
    }
}
