import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Linking } from 'react-native';

import { Colors, Fonts, Images, Strings, Styles, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import moment from 'moment';
import HTML from 'react-native-render-html';
import NotificationManager from '../../../Application/Utility/CustomManagers/NotificationManager';
import base64 from 'react-native-base64'
import CommonAttachmentScreen from '../../../Application/CustomComponents/CustomViews/CommonAttachmentScreen';
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';


const { width, height } = Dimensions.get('window');
let aspectRatio = height/width ;
var _that;
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showArchive: false,
      agentID: '',
      blockID: '',
      unitID: '',
      branchID: '',
      homeList: [],
      serviceCharge: '',
      groundRent: '',
      showGroundRent: false,
      lastPaymentData: '',
      lastPaymentTransactionDate: '',
      isCommentEnabledForTicket: false,
      commentType: '',
      loggedInUserID: '',
      fcm: '',
      isAttachementVisible: false,
      attachmentArray: [],
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height

    };
    _that = this;
  }

  componentDidMount() {
    Dimensions.addEventListener('change',()=>{
      this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
     })
    this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
  }

  //  focus on screen focus
  didFocusScreen = () => {
    SessionManager.getPreferenceData(Constant.sessionKey_show_archieves).then((showArchieveData) => {
      if (showArchieveData) {
        var showArchieves = JSON.parse(showArchieveData);
        this.setState({ isArchieve: showArchieves.isArchieve }, () => {

        })
      }
    });
    SessionManager.getPreferenceData(Constant.FCM).then((fcmToken) => {
      if (fcmToken) {
        this.setState({ fcm: fcmToken })
      }
    });
    this.getUserDetail()
  }

  setNotificationToken = (token) => {
    console.log("token is insode " + token)
    var Url = WebConstant.save_fcm + base64.decode(this.state.loggedInUserID)
    let body = {
      'token': token,
    }

    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(Url, body))
    }).then((jsonRes1) => {
      setTimeout(() => {
        var jsonRes = JSON.parse(jsonRes1)
        console.log("API Responsewww home : " + JSON.stringify(jsonRes));
        if (jsonRes.status == 'success') {
          SessionManager.setRecordIntoPreference(token, Constant.FCM).then(() => {
            // var Url = WebConstant.home_data + this.state.agentID + '/' + this.state.blockID + '/' + this.state.unitID + '/' + false + '/' + this.state.showArchive 
            // this.onHomeMessages(Url)
          });
        } else {
          if (jsonRes.message) {
            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
            });
          }
        }
      }, 400);
    }).catch((error) => {
      console.log("error  " + error)
    });
  }

  getUserDetail = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {
        var loginInformation = JSON.parse(loginInfo);
        this.setState({
          agentID: loginInformation.agentID, blockID: loginInformation.blockID,
          unitID: loginInformation.unitID, branchID: loginInformation.branchID,
          loggedInUserID: loginInformation.userInternalID
        });
        // this.setNotificationToken(this.state.fcm)       
        this.onGetBalanceAPI('1')
      }
    });
  }

  render() {
    return (
      <View style={{ height:this.state.height,width:this.state.width,flex: 1 }}>
        <ScrollView style={{flex:1}}>
          <View style={{  backgroundColor: 'white', flexDirection: 'column' }}>
            <TouchableOpacity onPress={() => this.onBalanceClick()} >
              <View style={{
                 borderRadius: 5, elevation: 5, margin: 5, paddingLeft: 20, paddingTop: 10,
                shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1,
                backgroundColor: 'white',
              }}>
                <Text style={{ fontSize: ScreenRatio(2.5), color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayRegular }}>Balance to Pay</Text>
                <View style={{ flexDirection: 'row', }}>
                  <Text style={{ fontSize: ScreenRatio(2.7), color: this.props.screenProps.textColour,marginTop:ScreenRatio(0.5), flex: 1, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.serviceCharge}</Text>
                  {
                    this.state.showGroundRent == true &&
                    <Text style={{ fontSize: ScreenRatio(2.7), color: this.props.screenProps.textColour,marginTop:ScreenRatio(0.5), flex: 1, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.groundRent}</Text>
                  }
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: ScreenRatio(2.1), marginTop:ScreenRatio(0.5), flex:0.5,color: this.props.screenProps.primaryColour, marginBottom: 10 }}>SERVICE CHARGE</Text>
                  {
                    this.state.showGroundRent == true &&
                    <Text style={{ fontSize: ScreenRatio(2.1), marginTop:ScreenRatio(0.5),flex:0.5,color: this.props.screenProps.primaryColour, marginBottom: 10 }}>GROUND RENT</Text>
                  }
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onBalanceClick()} >
              <View style={{
                 borderRadius: 5, elevation: 5, margin: 5, paddingLeft: 20, paddingTop: 10,
                shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1,
                backgroundColor: 'white',
              }}>
                <Text style={{ fontSize: ScreenRatio(2.5), color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayRegular }}>Last Payment received</Text>
                <Text style={{ fontSize: ScreenRatio(2.7), marginTop:ScreenRatio(0.5),marginBottom:ScreenRatio(0.5),color: this.props.screenProps.textColour,  fontFamily: Fonts.SFProDisplayRegular, }}>{this.state.lastPaymentData}</Text>
                <Text style={{ fontSize: ScreenRatio(2),  color: this.props.screenProps.primaryColour, marginBottom: 10 }}>{this.state.lastPaymentTransactionDate}</Text>
              </View>
            </TouchableOpacity>

            {/* Flat list */}
            <FlatList
              //style={{ flex: .24 }}
              data={this.state.homeList}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderRow} />
          </View>
        </ScrollView>
       
        <CommonAttachmentScreen dataArray={this.state.attachmentArray} themeColor={this.props.screenProps}
          visible={this.state.isAttachementVisible} attachmentModalClose={(value) => this.setState({ isAttachementVisible: value })} />
      </View>
    );
  }

  onViewDoc = (item) => {
    this.setState({ isAttachementVisible: true, attachmentArray: item })
  }

  _renderRow = ({ item, index }) => {
    return (
      <View style={{
        flex:1, marginTop: 5, marginBottom: 5, flexDirection: 'row', flex: 1
      }}>
        <View style={{
          flex:1, borderRadius: 5, borderWidth: 1.5,
          borderColor: Colors.inptxt_grey,
          marginLeft: 20, marginRight: 20,
          paddingStart: 10,
          paddingTop:ScreenRatio(0.5)
        }}>
          <View style={{ margin: 5  }}>
            <TouchableOpacity onPress={() => this.onViewMessage(item)} >
              <View style={{ flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }}>
                <Text style={{ color: this.props.screenProps.primaryColour, fontSize: ScreenRatio(2.4), fontFamily: Fonts.SFProDisplayRegular }}>{item.title}</Text>
                {
                  (item.attachments[0] ? item.attachments[0].file_location : "" != "") ?
                    <TouchableOpacity onPress={() => this.onViewDoc(item)} style={[homeStyles.viewDocumentStyle, { backgroundColor: this.props.screenProps.buttonBgColour, }]}>
                      <Text style={{ color: this.props.screenProps.buttonTextColour, fontSize: ScreenRatio(2.5) }}>{Strings.attachment}</Text>
                    </TouchableOpacity>
                    :
                    null
                }
              </View>
              {
                (item.message == undefined || item.message == "" || item.message == null) ?
                  null :
                  <HTML html={item.message} baseFontStyle={{ fontSize: ScreenRatio(1.8), fmarginStart: 10, color: this.props.screenProps.textColour }} />
              }
              <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.light_gray, }} />
              <View style={{ flexDirection: 'row', overflow: 'hidden', flex: 1, padding: 5 }}>
                <Text style={{ color: "#B4B4B4", fontSize: ScreenRatio(2.2), fontFamily: Fonts.SFProDisplayBold, fontStyle: 'italic' }}>Updated on <Text> {moment(item.updatedDate).format("Do MMM YYYY | hh:mm A")}</Text></Text>
              </View>
              <View style={{ height: 1, backgroundColor: Colors.light_gray, alignItems: 'center', justifyContent: 'center', marginEnd: 5, marginStart: 5 }} />
              <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 5}}>
                {
                  (item.type == "POST" || (this.state.isCommentEnabledForTicket && item.type == "TICKET")) ?
                    <Text onPress={() => this.onCommentsClicked(item)} style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(1.5) }}>{item.commentCount + " " + Strings.comments}</Text>
                    :
                    null
                }
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[homeStyles.verticalTextStyle, { backgroundColor: Colors.light_gray, minHeight: 20, minWidth: 80, marginLeft: -16, marginTop: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ padding: ScreenRatio(0.3), minHeight: 20, fontSize: ScreenRatio(1.2), overflow: 'visible', paddingStart: 10, paddingEnd: 10, color: this.props.screenProps.textColour }}>{item.type}</Text>
        </View>
      </View>
    )
  }
  apiType = (param) => {

    switch (param) {
      case "TICKET":
        {
          return WebConstant.ticket_message
          break;
        }
      case "AGENT":
        {
          return WebConstant.agent_message
          break;
        }
      case "POST":
        {
          return WebConstant.post_message
          break;
        }
    }
  }

  onViewMessage = (item) => {

    _that.setState({
      commentType: item.type == 'TICKET' ? 'TICKET' : 'WEBSYSNB'
    })
    this.props.navigation.navigate('Comment', {
      isComment: false,
      callAPI: this.apiType(item.type),
      itemSelected: item,
      onGetMessages: this.onHomeMessages.bind(this),
      commentType: this.state.commentType
    });


  }

  onReportMessageClicked(item) {
    this.props.navigation.navigate('ReportMessage', {
      messagePacket: item,


    });
  }

  onBalanceClick() {
    this.props.navigation.navigate('MyAccount', {

    });
  }

  onHomeMessages = (Url) => {
    var Url = WebConstant.home_data + false + '/' + this.state.showArchive

    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {
      // alert(JSON.stringify(jsonRes1))

      var jsonRes = JSON.parse(jsonRes1)
      console.log("Response Home" + JSON.stringify(jsonRes1))
      if (jsonRes.status == 'success') {
        var homeData = [];
        for (var i = 0; i < jsonRes.data.length; i++) {
          homeData.push({
            "title": jsonRes.data[i].title,
            "message": jsonRes.data[i].message,
            "type": jsonRes.data[i].type,
            "priority": jsonRes.data[i].priority,
            "postedDate": jsonRes.data[i].postedDate,
            "postedBy": jsonRes.data[i].postedBy,
            "updatedDate": jsonRes.data[i].updatedDate,
            "commentCount": jsonRes.data[i].commentCount,
            "referenceID": jsonRes.data[i].referenceID,
            "postebById": jsonRes.data[i].postebById,
            "actionDate": jsonRes.data[i].actionDate,
            "attachments": jsonRes.data[i].attachments ? jsonRes.data[i].attachments : []
          })

        }
        this.setState({
          homeList: homeData,
        })

        //uncomment bottom line
        //this.setNotificationToken(this.state.fcm)
        //comment bottom line
        this.props.screenProps.hideSpinner();

        // this.onGetBalanceAPI('1')


      } else {

        if (jsonRes.message) {
          CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
          });
        }
      }
    }).catch((error) => {
      console.log("error ifdss " + error)
    });
  }

  onGetBalanceAPI = (value) => {
    setTimeout(() => {
      var Url = WebConstant.balance_data + value
      this.props.screenProps.showSpinner();
      new Promise(function (resolve, reject) {
        resolve(WebApi.getMultipPartRequest(Url))
      }).then((jsonRes1) => {
        var jsonRes = JSON.parse(jsonRes1)
        // alert(JSON.stringify(jsonRes))
        this.props.screenProps.hideSpinner();
        if (jsonRes.status == 'success') {
          this.props.screenProps.hideSpinner();
          if (value === '1') {
            var amount = jsonRes.data.toString();
            console.log("XXXXXX-----", this.numberWithCommas(jsonRes.data))
            this.setState({
              //test.toLocaleString('en')
              serviceCharge: '£' + this.numberWithCommas(jsonRes.data.toFixed(2)),
            })
            this.onGetBalanceAPI('2')
          } else if (value === '2') {
            this.setState({
              groundRent: '£' + this.numberWithCommas(jsonRes.data.toFixed(2)),
              showGroundRent: jsonRes.showGroundRent,
            })
            setTimeout(() => {
              this.onDataSaveToSync()
            }, 500);
          }
        } else {
          this.props.screenProps.hideSpinner();
          if (jsonRes.message) {
            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
            });
          }
        }
      }).catch((error) => {
        console.log("error ifdss " + error)
      });

    }, 500);
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  onGetTicketAccessApi = () => {
    var Url = WebConstant.isCommentEnabledForTicket
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {
      var jsonRes = JSON.parse(jsonRes1)
      this.setState({
        isCommentEnabledForTicket: jsonRes.commentsAllowed == 0 ? false : true,
      })
      var Url = WebConstant.home_data + false + '/' + this.state.showArchive
      this.onHomeMessages(Url)





    }).catch((error) => {
      console.log("error ifdss " + error)

    });
  }

  onCommentsClicked = (item) => {


  }

  onLastPayementReceived = () => {
    setTimeout(() => {
      var Url = WebConstant.LastPaymentReceived

      new Promise(function (resolve, reject) {
        resolve(WebApi.getMultipPartRequest(Url))
      }).then((jsonRes1) => {
        var jsonRes = JSON.parse(jsonRes1)

        this.setState({
          lastPaymentData: '£' + this.numberWithCommas(jsonRes.Transaction_amount),
          lastPaymentTransactionDate: moment(jsonRes.transaction_date).format("D MMM YYYY"),
        })
        this.onGetTicketAccessApi()

      }).catch((error) => {
        console.log("error ifdss " + error)

      });
    }, 500);
  }

  onDataSaveToSync = () => {
    var balance = {
      groundRent: this.state.groundRent,
      showGroundRent: this.state.showGroundRent,
      serviceCharge: this.state.serviceCharge
    }

    SessionManager.setRecordIntoPreference(balance, Constant.sessionKey_show_balance);
    this.onLastPayementReceived()
  }

}

const homeStyles = StyleSheet.create({
  verticalTextStyle: {
    height: 20,
    padding: 2,
    marginTop: aspectRatio > 1.6 ? 40 : 80,
    fontSize: aspectRatio > 1.6 ? 12 : 24,
    color: 'white',
    borderColor: '#6B6B6B',
    borderRadius: aspectRatio > 1.6 ? 10 : 20,

    transform: [{ rotate: '270deg' }],
  },
  viewDocumentStyle: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5, // Android    
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',
    marginRight: 10, marginTop: 10,
    marginLeft:ScreenRatio(2),
    width:ScreenRatio(12.5)
  },
})

