import React, { Component } from 'react';
import { Dimensions, Image, Text, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Images, Colors, Strings } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';


const { width, height } = Dimensions.get('window');
const aspectRatio = height/width;
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ btnLogout: this.btnLogout });
  }


  render() {
    return (


      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <KeyboardAwareScrollView style={{ flex: 1, }} contentContainerStyle={{ flexGrow: 1, }} viewIsInsideTabBar={true} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps={"always"}>
          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onDictionaryClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_directory} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray,fontSize: (aspectRatio>1.6)?15:25 }}>{Strings.directory}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>


          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onReportProblemClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_report_problem} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.report_problem}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onDictionaryClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_manage_profile} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.manage_profile}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onSettingClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_setting} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.setting}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onContactUsClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_contact} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.contact_us}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>


          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onDictionaryClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_privacy_policy} style={{width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.privacy_policy}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>


          <View style={{ paddingStart: 20, paddingEnd: 20, }}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_term_service} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.terms}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </View>

          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.onDictionaryClicked()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_your_property_detail} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.property_detail}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: Colors.light_gray, }} />
          </TouchableOpacity>

          <TouchableOpacity style={{ paddingStart: 20, paddingEnd: 20, }} onPress={() => this.btnLogout()}>
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
              <Image source={Images.ic_logout} style={{ width:  (aspectRatio>1.6)?25:35, height:  (aspectRatio>1.6)?25:35, resizeMode: 'contain', }} />
              <Text style={{ marginStart: 10, color: Colors.txt_gray }}>{Strings.logout}</Text>
            </View>

          </TouchableOpacity>


        </KeyboardAwareScrollView>
      </View>
    );
  }
  
  onReportProblemClicked = () => {

    this.props.navigation.navigate("ReportProblem");
  }
  onSettingClicked = () => {

    this.props.navigation.navigate("Settings");
  }
  onDictionaryClicked = () => {

    this.props.navigation.navigate("Dictionary");
  }
  onContactUsClicked = () => {
    this.props.navigation.navigate("ContactUs");
  }


  btnLogout = () => {

    CommonFunction.doubleAlertDilog(Strings.logoutText, Strings.ok, Strings.cancel, () => {

      this.props.screenProps.logoutUser();
      this.props.navigation.navigate("AuthStack");


    }, () => {
      console.log("Negative Button press");

    });
  }


}
