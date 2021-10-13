// static file
import React, { Component } from 'react';
import { Dimensions, Image, Switch, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';

// react-native libray
import base64 from 'react-native-base64'

// resouces file  and Common function file
import Colors from "../../../Application/Res/Colors";
import Strings from "../../../Application/Res/Strings";
import Fonts from "../../../Application/Res/Fonts";
import Images from "../../../Application/Res/Images";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';

// network file
import WebApi from "../../../Application/NetworkController/WebApi";
import WebConstant from "../../../Application/NetworkController/WebConstant";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';

// variable declretion
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropDown: false,
      serviceCharge: "",
      paymentReceiptMyMail: false,
      notifyAgentBroadcastMessage: false,
      reportedIsUpdate: false,
      problemAddedOrUpdate: false,
      myPostsAreUpdated: false,
      postAreAddedOrUpdate: false,
      userInternalID: "",
      demandDeliveryOption: 0,
      tintColor: props.tintColor,
      unSelectedImage: props.unSelectedImage,
      selectedImage: props.selectedImage,
      tabName: props.tabName,
      primaryColor: Colors.btn_color_orange,
    };
  }

  getServiceChargeOptions() {
    const { demandDeliveryOption } = this.state;

    let options = [
      { type: "paper" },
      { type: "email" },
    ];

    if (demandDeliveryOption === 225) {
      options.push({ type: "paper / email" });
    }

    return options;
  }

  componentDidMount() {
    this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
    SessionManager.getBranding().then((branding) => {
      if (branding) {
        var appBranding = JSON.parse(branding);

        this.setState({
          primaryColor: appBranding.primaryColour,
          buttonBgColour: appBranding.buttonBgColour,
          buttonTextColour: appBranding.buttonTextColour,
          textColour: appBranding.textColour,
          footerBgColour: appBranding.footerBgColour,
          footerTextColour: appBranding.footerTextColour,
          agentLogo: appBranding.agentLogo,
        });
      }
    });

  }

  didFocusScreen = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {
        var loginInformation = JSON.parse(loginInfo);
        this.setState({ userInternalID: loginInformation.userInternalID });
        this.onGetAllPersonalSettingApiCall()
      }
    });
  }

  // render calling ...
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <ScrollView>
          <View>
            {this.onTextAndSwitchRenderView(Strings.demandAndReceiptTxt3, this.state.paymentReceiptMyMail, "paymentReceiptMyMail", aspectRatio > 1.6 ? 155 : 225)}
            <TouchableOpacity onPress={() => this.onUpdateDemandsAndReceipts()} activeOpacity={8} style={{ height: (aspectRatio > 1.6) ? 50 : 65, width: width - 50, alignSelf: "center", backgroundColor: this.props.screenProps.buttonBgColour, borderRadius: 5, marginTop: 35, justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
              <Text style={{ fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio > 1.6 ? 16 : 32, color: this.props.screenProps.buttonTextColour }}>{Strings.update}</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio > 1.6 ? 20 : 40, marginTop: 20, marginLeft: 25, marginBottom: 20 }}>{Strings.emailNotificationPref}</Text>
            {this.onTextAndSwitchRenderView(Strings.emailNotificationPrefTxt1, this.state.notifyAgentBroadcastMessage, "notifyAgentBroadcastMessage", 0)}
            <View style={{ height: 1, width: width - 50, alignSelf: "center", backgroundColor: "#DDDD", marginTop: 15, marginBottom: 15 }} />
            {this.onTextAndSwitchRenderView(Strings.emailNotificationPrefTxt2, this.state.reportedIsUpdate, "reportedIsUpdate", 0)}
            <View style={{ height: 1, width: width - 50, alignSelf: "center", backgroundColor: "#DDDD", marginTop: 15, marginBottom: 15 }} />
            {this.onTextAndSwitchRenderView(Strings.emailNotificationPrefTxt3, this.state.problemAddedOrUpdate, "problemAddedOrUpdate", 0)}
            <View style={{ height: 1, width: width - 50, alignSelf: "center", backgroundColor: "#DDDD", marginTop: 15, marginBottom: 15 }} />
            {this.onTextAndSwitchRenderView(Strings.emailNotificationPrefTxt4, this.state.myPostsAreUpdated, "myPostsAreUpdated", 0)}
            <View style={{ height: 1, width: width - 50, alignSelf: "center", backgroundColor: "#DDDD", marginTop: 15, marginBottom: 15 }} />
            {this.onTextAndSwitchRenderView(Strings.emailNotificationPrefTxt5, this.state.postAreAddedOrUpdate, "postAreAddedOrUpdate", 0)}
            <View style={{ height: 1, width: width - 50, alignSelf: "center", backgroundColor: "#DDDD", marginTop: 15, marginBottom: 15 }} />

            <TouchableOpacity onPress={() => this.onUpdateEmailNotificationPreferences()} activeOpacity={8} style={{ height: (aspectRatio > 1.6) ? 50 : 65, width: width - 50, alignSelf: "center", backgroundColor: this.props.screenProps.buttonBgColour, borderRadius: 5, marginTop: 15, justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
              <Text style={{ fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio > 1.6 ? 16 : 32, color: this.props.screenProps.buttonTextColour }}>{Strings.update}</Text>
            </TouchableOpacity>

            {this.onDropDownRenderView()}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render view of Drop down view
  onDropDownRenderView = () => {
    const { isDropDown, serviceCharge } = this.state;
    return (
      <View style={{ alignSelf: "center", position: "absolute", top: 5 }}>
        <Text style={{ fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio > 1.6 ? 20 : 40, marginTop: 5, marginLeft: 10 }}>{Strings.demandAndReceipt}</Text>
        <Text style={{ fontFamily: Fonts.SFProDisplayRegular, fontSize: aspectRatio > 1.6 ? 18 : 36, marginTop: 10, marginLeft: 10 }}>{Strings.demandAndReceiptTxt1}</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ isDropDown: !this.state.isDropDown })} style={{
          flexDirection: "row", padding: (aspectRatio > 1.6) ? 15 : 22, width: width - 50, alignSelf: "center",
          borderTopRightRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: isDropDown ? 0 : 5, borderBottomRightRadius: isDropDown ? 0 : 5, borderWidth: 1,
          borderColor: Colors.gray, marginTop: 15, borderBottomColor: isDropDown ? Colors.white : Colors.gray
        }}>
          <View activeOpacity={0.8} style={{ flex: 0.93 }}>
            <Text style={{ fontFamily: Fonts.SFProDisplayRegular, fontSize: aspectRatio > 1.6 ? 16 : 32, justifyContent: "center" }}>{serviceCharge === "both" ? "Paper & Email" : serviceCharge}</Text>
          </View>
          <TouchableOpacity hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} onPress={() => this.setState({ isDropDown: !this.state.isDropDown })} activeOpacity={0.8} style={{ flex: 0.1, alignItems: "center", justifyContent: "center", marginRight: -8 }}>
            <Image source={Images.iconDropdown} style={{ height: 12, width: 17, alignSelf: "center" }} />
          </TouchableOpacity>
        </TouchableOpacity>
        {isDropDown &&
          <View style={{ width: width - 50, backgroundColor: Colors.white, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderWidth: 1, borderColor: Colors.gray, alignSelf: "center" }}>
            <FlatList style={{ backgroundColor: Colors.white, width: width - 60, alignSelf: "center", }} data={this.getServiceChargeOptions()}
              renderItem={(item, index) => this.onDropDownRenderRowView(item, index)} bounces={false} showsVerticalScrollIndicator={false} />
          </View>
        }
      </View>
    )
  }

  // render dropdown render row view
  onDropDownRenderRowView = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ serviceCharge: item.type, isDropDown: false })} style={{ width: "100%", padding: 15, backgroundColor: Colors.white, marginBottom: 5 }}>
        <Text style={{ fontFamily: Fonts.SFProDisplayRegular, fontSize: aspectRatio > 1.6 ? 16 : 32, justifyContent: "center" }}>{item.type}</Text>
      </TouchableOpacity>
    )
  }


  // Render common text and switch view
  onTextAndSwitchRenderView = (text, isToglingValue, switchText, marginTop) => {
    return (
      <View style={{ flexDirection: 'row', flex: 1, marginTop: marginTop, width: width - 50, alignSelf: "center", }}>
        <Text style={{ fontFamily: Fonts.SFProDisplayRegular, fontSize: aspectRatio > 1.6 ? 18 : 36, flex: aspectRatio > 1.6 ? .85 : .9 }}>{text}</Text>
        <TouchableOpacity onPress={() => this.onSwitchBtnHandler(switchText)} style={{ flex: .1,marginLeft:20 }} activeOpacity={.8} >
          {/* <Image source={isToglingValue === true ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5, }} /> */}
          <Switch
            trackColor={{ true: this.props.screenProps.primaryColour, false: 'lightgrey' }}
            thumbColor={'white'}
            onValueChange={value => { this.onSwitchBtnHandler(switchText) }}
            value={isToglingValue}
          />
        </TouchableOpacity>
      </View>
    )
  }

  // on switch button togling 
  onSwitchBtnHandler = (switchText) => {
    switch (switchText) {
      case "paymentReceiptMyMail": {
        this.setState({ paymentReceiptMyMail: !this.state.paymentReceiptMyMail })
        break;
      }
      case "notifyAgentBroadcastMessage": {
        this.setState({ notifyAgentBroadcastMessage: !this.state.notifyAgentBroadcastMessage })
        break;
      }
      case "reportedIsUpdate": {
        this.setState({ reportedIsUpdate: !this.state.reportedIsUpdate })
        break;
      }
      case "problemAddedOrUpdate": {
        this.setState({ problemAddedOrUpdate: !this.state.problemAddedOrUpdate })
        break;
      }
      case "myPostsAreUpdated": {
        this.setState({ myPostsAreUpdated: !this.state.myPostsAreUpdated })
        break;
      }
      case "postAreAddedOrUpdate": {
        this.setState({ postAreAddedOrUpdate: !this.state.postAreAddedOrUpdate })
        break;
      }
    }
  }

  // Fetch all personal setting data api call
  onGetAllPersonalSettingApiCall = () => {
    this.props.screenProps.showSpinner();
    const Url = WebConstant.getAllPersonalSettingData
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)
      this.setState({
        demandDeliveryOption: jsonRes.demandDeliveryOption,
        serviceCharge: jsonRes.demandsAndReceipts.serviceCharge,
        paymentReceiptMyMail: jsonRes.demandsAndReceipts.paymentReceiptMyMail == "1",
        notifyAgentBroadcastMessage: jsonRes.emailNotificationPreferences.notifyAgentBroadcastMessage == "1",
        reportedIsUpdate: jsonRes.emailNotificationPreferences.notifyMyProblemUpdated == "1",
        problemAddedOrUpdate: jsonRes.emailNotificationPreferences.notifyAnyproblemUpdated == "1",
        myPostsAreUpdated: jsonRes.emailNotificationPreferences.notifyMyPostUpdated == "1",
        postAreAddedOrUpdate: jsonRes.emailNotificationPreferences.notifyPostUpdates == "1",
      })
    }).catch((error) => {
      console.log("error ifdss " + error)
    });
  }

  // ON update Demands And Receipts
  onUpdateDemandsAndReceipts = () => {
    this.props.screenProps.showSpinner();
    const Url = WebConstant.updateUserPreferences;
    const body = {
      type: 1,
      svcgVia: this.state.serviceCharge,
      receiptsViaEmail: this.state.paymentReceiptMyMail === false ? "0" : "1"
    }
    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(Url, body))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)

      if (jsonRes.status === 1) {
        setTimeout(() => {
          CommonFunction.singleAlertDilogWithAction(Strings.demandAndReceiptUpdateSucces, Strings.ok, () => { });
        }, 1500);
      }
    }).catch((error) => {
      this.props.screenProps.hideSpinner();
      console.log("error ifdss " + error)
    });
  }

  // ON update Email Notification Preferences
  onUpdateEmailNotificationPreferences = () => {
    this.props.screenProps.showSpinner();
    const Url = WebConstant.updateUserPreferences;
    const body = {
      type: 2,
      notifyAgentBroadcastMessage: this.state.notifyAgentBroadcastMessage === false ? "0" : "1",
      notifyPostUpdates: this.state.postAreAddedOrUpdate === false ? "0" : "1",
      notifyMyProblemUpdated: this.state.reportedIsUpdate === false ? "0" : "1",
      notifyAnyproblemUpdated: this.state.problemAddedOrUpdate === false ? "0" : "1",
      notifyMyPostUpdated: this.state.myPostsAreUpdated === false ? "0" : "1",
    }
    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(Url, body))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)

      if (jsonRes.status === 1) {
        setTimeout(() => {
          CommonFunction.singleAlertDilogWithAction(Strings.emailNotificationPrefrenceUpdateSucces, Strings.ok, () => { });
        }, 1500);
      }
    }).catch((error) => {
      this.props.screenProps.hideSpinner();
      console.log("error ifdss " + error)
    });
  }
}
