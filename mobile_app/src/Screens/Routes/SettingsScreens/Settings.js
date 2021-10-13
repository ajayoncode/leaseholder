import React, { Component } from 'react';
import { Dimensions, Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Images, Colors, Strings, Fonts } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import base64 from 'react-native-base64'



const { width, height } = Dimensions.get('window');

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
      six: false,
      seven: false,
    };
  }
  componentDidMount() {
    // this.props.navigation.setParams({ btnLogout: this.btnLogout });
  }



  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1, padding: 10, width: width - 20 }}>

        <Text style={[settingStyles.headingTxtStyle, { color: "red" }]}>{Strings.demandAndReceipt}</Text>

        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.demandAndReceiptTxt1}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(1)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.one ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>


        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.demandAndReceiptTxt2}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(2)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.two ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>


        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.demandAndReceiptTxt3}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(3)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.three ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 1, width: width - 20, backgroundColor: Colors.light_gray, marginBottom: 5, marginTop: 15 }}></View>

        <Text style={[settingStyles.headingTxtStyle, { color: "red" }]}>{Strings.emailNotificationPref}</Text>

        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.emailNotificationPrefTxt1}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(4)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.four ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.emailNotificationPrefTxt2}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(5)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.five ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.emailNotificationPrefTxt3}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(6)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.six ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={settingStyles.subheadingTxtStyle}>{Strings.emailNotificationPrefTxt4}</Text>
          <TouchableOpacity onPress={() => this.onSettingChangedClick(7)} style={{ flex: .1 }} activeOpacity={.8} >
            <Image source={this.state.seven ? Images.ic_on : Images.ic_off} style={{ width: 50, height: 30, resizeMode: 'contain', margin: 5 }} />
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  onAPISubmitDemandReceipt = () => {
    let body = {
      'loggedInUserID': base64.decode(this.state.userInternalID),
      'svcgVia': this.state.two ? 'email' : 'paper',
      'receiptsViaEmail': this.state.three ? '1' : '0',
    }

    console.log(`update data: ${JSON.stringify(body)}`)
    this.props.screenProps.showSpinner();
    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(WebConstant.addDemand, body))

    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      setTimeout(() => {

        var jsonRes = JSON.parse(jsonRes1)
        if (jsonRes.status == 'success') {

        }
      }, 400);
      console.log("API Response " + JSON.stringify(jsonRes1));


    })
  }


  onEmailNotification = () => {
    let body = {
      'loggedInUserID': base64.decode(this.state.userInternalID),
      'svcgVia': this.state.two ? 'email' : 'paper',
      'receiptsViaEmail': this.state.three ? '1' : '0',
    }

    console.log(`update data: ${JSON.stringify(body)}`)
    this.props.screenProps.showSpinner();
    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(WebConstant.addDemand, body))

    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      setTimeout(() => {

        var jsonRes = JSON.parse(jsonRes1)
        if (jsonRes.status == 'success') {

        }
      }, 400);
      console.log("API Response " + JSON.stringify(jsonRes1));


    })
  }

  onSettingChangedClick = (which) => {
    console.log(`switchHandler: ${which}`)
    // if (which == 1)
    //   this.setState({ one: !this.state.one });
    // else if (which == 2)
    //   this.setState({ two: !this.state.two });
    // else if (which == 3)
    //   this.setState({ three: !this.state.three });
    // else if (which == 4)
    //   this.setState({ four: !this.state.four });
    // else if (which == 5)
    //   this.setState({ five: !this.state.five });
    // else if (which == 6)
    //   this.setState({ six: !this.state.six });
    // else if (which == 7)
    //   this.setState({ seven: !this.state.seven });

    this.onEmailNotification()
  }


}

const settingStyles = StyleSheet.create({


  headingTxtStyle: {
    fontFamily: Fonts.SFProDisplayBold,
    fontSize: 16,
    marginTop: 10,
  },

  subheadingTxtStyle: {
    fontFamily: Fonts.SFProDisplayBold,
    fontSize: 16,
    color: Colors.black,

    flex: .9
  },



})

