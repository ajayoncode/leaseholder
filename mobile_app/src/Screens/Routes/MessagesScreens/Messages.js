import React, { Component } from 'react';
import { View, Text, Switch, Dimensions, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, Linking } from 'react-native';
import { Colors, Fonts, Images, Strings, Styles, Constant } from "Res";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import moment from 'moment';
import HTML from 'react-native-render-html';

import MessageHeader from './MessageHeader'
import CustomeDialog from '../CustomeDialog/CustomeDialog'
import CommonAttachmentScreen from '../../../Application/CustomComponents/CustomViews/CommonAttachmentScreen';
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';



const { width, height } = Dimensions.get('window');
const aspectRatio = 2;
var _that;
var dialogEnabled = false;
var themeColor = '';
export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTxt: '',
      showArchive: false,
      agentID: '',
      blockID: '',
      unitID: '',
      branchID: '',
      apiType: WebConstant.all_message,
      messageList: [],
      isArchieve: '0',
      filterData: [],
      isDialogVisible: false,
      isTicketModuleSubscribed: false,
      isCommentEnabledForTicket: false,
      isReportProblemEnabled: false,
      accessType: '',
      commentType: '',
      isComment: false,
      isAttachementVisible: false,
      attachmentArray: [],
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height
    };
    _that = this;
  }
  static navigationOptions = ({ navigation, screenProps }) => {
    if (screenProps.userPermissions.allowPostOnMessages === 1 || screenProps.userPermissions.reportProblemEnabled === 1) {
      return {
        headerLeft:
          <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 10 }} onPress={(dialogEnabled) ? () => { _that.openDialog() } : null}>
            <View style={{
              backgroundColor: (dialogEnabled) ? screenProps.buttonBgColour : screenProps.buttonBgColour, borderColor: (dialogEnabled) ? screenProps.buttonBgColour : screenProps.buttonBgColour, borderWidth: 1.5, borderRadius: aspectRatio > 1.6 ? 10 : 20,
              marginRight: 5, paddingEnd: 5, paddingStart: 5, marginLeft: 5, marginTop: 2, alignItems: 'center', justifyContent: 'center',
              width: aspectRatio > 1.6 ? 80 : 150, height: aspectRatio > 1.6 ? 20 : 35
            }}>
              <Text style={{ color: screenProps.buttonTextColour, fontSize: aspectRatio > 1.6 ? 11 : 22, fontFamily: Fonts.SFProDisplayBold }}>ACTION</Text>
            </View>
          </TouchableOpacity>

      }
    }

  };


  componentDidMount() {
    Dimensions.addEventListener('change',()=>{
      this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height})
     })
    this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
  }

  // screen focus
  didFocusScreen = () => {
    SessionManager.getPreferenceData(Constant.sessionKey_show_archieves).then((showArchieveData) => {
      if (showArchieveData) {
        var showArchieves = JSON.parse(showArchieveData);
        this.setState({ isArchieve: showArchieves.isArchieve })
      }
    });
    this.getUserDetail()
  }

  getUserDetail = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {

        var loginInformation = JSON.parse(loginInfo);

        this.setState({
          agentID: loginInformation.agentID, blockID: loginInformation.blockID,
          unitID: loginInformation.unitID, branchID: loginInformation.branchID
        });

        this.isTicketModuleSubscribedAPI(WebConstant.isTicketModuleSubscribed)
        // this.callAllMessageAPI(false)
        // this.callAccessAPI()

      }
    });
  }

  callAccessAPI = () => {
    var Url = WebConstant.access_api;
    this.onGetAccessApi(Url);
  }


  isTicketModuleSubscribedAPI = (accessUrl) => {
    this.setState({
      accessType: accessUrl
    })
    var Url = this.state.accessType
    this.onGetAccessApi(Url);
  }

  isReportProblemEnabledAPI = (accessUrl) => {
    this.setState({
      accessType: accessUrl
    })
    var Url = this.state.accessType
    this.onGetAccessApi(Url);
  }

  isCommentEnabledForTicketAPI = (accessUrl) => {
    this.setState({
      accessType: accessUrl
    })
    var Url = this.state.accessType
    this.onGetAccessApi(Url);
  }

  callAllMessageAPI = (showSpinner) => {
    if (showSpinner) {
      var Url = WebConstant.messages_list_prifix + WebConstant.all_message + '0/' + this.state.isArchieve
    }
    else {
      var Url = WebConstant.messages_list_prifix + WebConstant.all_message + '0/' + this.state.isArchieve
    }

    this.onGetMessages(Url, showSpinner);
  }
  /*   openActionDialog = (showSpinner) => {
  
    } */


  render() {
    return (
      <View style={{ height:this.state.height,width:this.state.width }}>
        <KeyboardAwareScrollView style={{ flex: 1, }}
          contentContainerStyle={{ flexGrow: 1, }}
          viewIsInsideTabBar={false}
          enableOnAndroid={true} bounces={false}
          keyboardShouldPersistTaps={"always"}
          showsVerticalScrollIndicator={false}>

          <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>


            {/* Filter view UI */}

            <MessageHeader
              colorTheme={this.props.screenProps}
              btnAllSelectClicked={this.btnAllSelectClicked}
              btnAgentSelectClicked={this.btnAgentSelectClicked}
              btnTicketSelectClicked={this.btnTicketSelectClicked}
              btnPostSelectClicked={this.btnPostSelectClicked} />


            {/* Search View UI */}
            <View style={{ width: this.state.width*0.9, marginTop: 10, flexDirection: 'row', height: aspectRatio > 1.6 ? 40 : 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{width: this.state.width*0.5, height: aspectRatio > 1.6 ? 35 : 55, borderRadius: aspectRatio > 1.6 ? 25 : 30, borderWidth: 1.5, borderColor: Colors.inptxt_grey, overflow: 'hidden',  justifyContent: 'center' }}>


                <TextInput style={{ padding: 5, fontSize: aspectRatio > 1.6 ? 15 : 25, color: Colors.black }}
                  ref='search'
                  placeholder='Search'
                  maxLength={50}
                  keyboardType="default"
                  underlineColorAndroid='transparent'
                  placeholderTextColor={this.props.screenProps.textColour}
                  value={this.state.searchTxt}
                  onChangeText={searchTxt => {this.searchFilterFunction(searchTxt)}}
                />

              </View>

              <Text style={{ color: this.props.screenProps.primaryColour, fontSize: ScreenRatio(1.2), marginLeft: ScreenRatio(2),marginRight:ScreenRatio(1) }}>Show Archive</Text>

              <TouchableOpacity style={{  }} activeOpacity={.8} onPress={this.onCheckChange}>
                {/* <Image source={this.state.isArchieve != '1' ? Images.ic_off : Images.ic_on} style={{ width: aspectRatio > 1.6 ? 50 : 80, height: aspectRatio > 1.6 ? 30 : 60, resizeMode: 'contain', margin: 5, }} /> */}
                <Switch
                  trackColor={{ true: this.props.screenProps.primaryColour, false: 'lightgrey' }}
                  thumbColor={'white'}
                  onValueChange={this.onCheckChange}
                  value={this.state.isArchieve != '1' ? false : true}
                  
                />
              </TouchableOpacity>
            </View>

            <View style={{ width: '90%', height: 1, marginTop: 10, backgroundColor: Colors.light_gray, marginBottom: 10 }} />

            {/* Flat list */}


            <FlatList
              data={this.state.filterData}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderRow}
              keyExtractor={item => item.email}
              ListEmptyComponent={<View style={{marginTop:100}}>
                <Text>No Record Found</Text>
                </View>}
            />

            <CustomeDialog isDialogVisible={this.state.isDialogVisible}
              hideDialog={this.hideDialog}
              messageType={this.state.apiType}
              hideDialogOnOutsideClick={this.hideDialogOnOutsideClick}
              openDialog={this.openDialog}
              reportEnabled={this.props.screenProps.userPermissions.reportProblemEnabled === 1}
              addPostEnable={this.props.screenProps.userPermissions.allowPostOnMessages === 1}
            />
          </View>
        </KeyboardAwareScrollView>
        <CommonAttachmentScreen dataArray={this.state.attachmentArray}
          visible={this.state.isAttachementVisible} attachmentModalClose={(value) => this.setState({ isAttachementVisible: value })} />
      </View>
    );
  }

  /*  onReportMessageClicked() {
     this.props.navigation.navigate('ReportMessage')
   }
  */
  hideDialog = (tabName) => {
    this.props.navigation.navigate(tabName, { callAllMessageAPI: this.callAllMessageAPI });
    this.setState({ isDialogVisible: false });
  }
  hideDialogOnOutsideClick = () => {
    this.setState({ isDialogVisible: false });
  }

  openDialog() {
    this.setState({ isDialogVisible: true });
  }

  btnAllSelectClicked() {
    _that.setState({
      apiType: WebConstant.all_message,
      searchTxt:''
    })

    var archive = _that.state.isArchieve == 0 ? '0' : '1'
    var Url = WebConstant.messages_list_prifix + WebConstant.all_message + '0/' + archive

    _that.onGetMessages(Url);
  }

  btnAgentSelectClicked() {
    _that.setState({
      apiType: WebConstant.agent_message,
      searchTxt:''

    })
    var archive = _that.state.isArchieve == 0 ? '0' : '1'
    var Url = WebConstant.messages_list_prifix + WebConstant.agent_message + archive
    _that.onGetMessages(Url);
  }

  btnTicketSelectClicked() {
    _that.setState({
      apiType: WebConstant.ticket_message,
      searchTxt:''

    })

    var archive = _that.state.isArchieve == 0 ? '0' : '1'
    var Url = WebConstant.messages_list_prifix + WebConstant.ticket_message + archive
    _that.onGetMessages(Url);
  }

  btnPostSelectClicked() {
    _that.setState({
      apiType: WebConstant.post_message,
      searchTxt:''

    })
    var archive = _that.state.isArchieve == 0 ? '0' : '1'
    var Url = WebConstant.messages_list_prifix + WebConstant.post_message + archive
    _that.onGetMessages(Url);
  }


  btnAllSelectClicked1() {
    _that.setState({
      apiType: WebConstant.all_message
    })

    var archive = _that.state.isArchieve == 0 ? '1' : '0'
    var Url = WebConstant.messages_list_prifix + WebConstant.all_message + '0/' + archive

    _that.onGetMessages(Url);
  }

  btnAgentSelectClicked1() {
    _that.setState({
      apiType: WebConstant.agent_message
    })
    var archive = _that.state.isArchieve == 0 ? '1' : '0'
    var Url = WebConstant.messages_list_prifix + WebConstant.agent_message + archive
    _that.onGetMessages(Url);
  }

  btnTicketSelectClicked1() {
    _that.setState({
      apiType: WebConstant.ticket_message
    })
    var archive = _that.state.isArchieve == 0 ? '1' : '0'
    var Url = WebConstant.messages_list_prifix + WebConstant.ticket_message + archive
    _that.onGetMessages(Url);
  }

  btnPostSelectClicked1() {
    _that.setState({
      apiType: WebConstant.post_message
    })
    var archive = _that.state.isArchieve == 0 ? '1' : '0'
    var Url = WebConstant.messages_list_prifix + WebConstant.post_message + archive
    _that.onGetMessages(Url);
  }

  onCheckChange = () => {
    this.setState({ isArchieve: this.state.isArchieve == '0' ? '1' : '0' }, () => {
      console.log("is Archieved " + this.state.isArchieve);

      var showArchieveData = {
        isArchieve: this.state.isArchieve,
      }
      SessionManager.setRecordIntoPreference(showArchieveData, Constant.sessionKey_show_archieves);
    });
    this.currentTab()
  }
  currentTab = () => {

    switch (this.state.apiType) {
      case WebConstant.all_message:
        {
          this.btnAllSelectClicked1()
          break;
        }
      case WebConstant.agent_message:
        {
          this.btnAgentSelectClicked1()
          break;
        }
      case WebConstant.ticket_message:
        {
          this.btnTicketSelectClicked1()
          break;
        }
      case WebConstant.post_message:
        {
          this.btnPostSelectClicked1()
          break;
        }
    }
  }



  searchFilterFunction = (text) => {
    this.setState({searchTxt:text})
    const newData = this.state.messageList.filter(item => {
      const itemData = `${item.title.toUpperCase()}
      ${item.message.toUpperCase()} 
      ${item.postedBy.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ filterData: newData });
  };


  onViewDoc = (item) => {
    this.setState({ isAttachementVisible: true, attachmentArray: item })
  }

  _renderRow = ({ item, index }) => {

    return (

      <View style={{ width: this.state.width, marginTop: 5, marginBottom: 5, flexDirection: 'row', flex: 1 }}>

        <View style={{
          width: this.state.width-40, borderRadius: aspectRatio > 1.6 ? 5 : 10, borderWidth: 1.5,
          borderColor: Colors.inptxt_grey,
          marginLeft: aspectRatio > 1.6 ? 25 : 45, marginRight: aspectRatio > 1.6 ? 20 : 40,
          paddingStart: 10,
          paddingTop:ScreenRatio(0.5)
        }}>

          <View style={{ margin: aspectRatio > 1.6 ? 0 : 10 }}>

            <TouchableOpacity onPress={() => this.onMessageView(item)}>

              <View style={{ flexDirection: 'row', overflow: 'hidden', alignItems: 'center', flex: 1 }}>

                <Text style={{ color: this.props.screenProps.primaryColour, fontSize: ScreenRatio(2.4), flex: .90, fontFamily: Fonts.SFProDisplayRegular }}>{item.title}</Text>
                {
                  (item.attachments[0] ? item.attachments[0].file_location : "" != "") ?
                    <TouchableOpacity onPress={() => this.onViewDoc(item)} style={[MsgStyles.viewDocumentStyle, { backgroundColor: this.props.screenProps.buttonBgColour, }]}>
                      <Text style={{ color: this.props.screenProps.buttonTextColour, fontSize: ScreenRatio(1.8) }}>{Strings.attachment}</Text>
                    </TouchableOpacity>
                    :
                    null
                }
              </View>
              {
                (item.message == undefined || item.message == "" || item.message == null) ?
                  null :
                  <HTML html={item.message} baseFontStyle={{ fontSize: ScreenRatio(1.8), flex: .7, fmarginStart: 10, color: this.props.screenProps.textColour }} />
              }
              <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.light_gray, }} />
              <View style={{ flexDirection: 'row', overflow: 'hidden', flex: 1, padding: 5 }}>
                <Text style={{ color: "#B4B4B4", fontSize: ScreenRatio(2.1), flex: 1, fontFamily: Fonts.SFProDisplayBold, fontStyle: 'italic' }}>Updated on
                  <Text>  {moment(item.updatedDate).format("Do MMM YYYY | hh:mm A")}</Text></Text>
              </View>
              <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 5, flex: 1 }}>
                {(item.type == "POST" || (this.state.isCommentEnabledForTicket && item.type == "TICKET")) ?
                  <Text style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(1.5), flex: 2.9, }}>{item.commentCount + " " + Strings.comments}</Text>
                  : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[MsgStyles.verticalTextStyle, { backgroundColor: Colors.light_gray, minHeight: 20, minWidth: 80, marginLeft: -16, marginLeft: -16, marginTop: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[{  padding: ScreenRatio(0.3), minHeight: 20, fontSize: ScreenRatio(1.2), overflow: 'visible', paddingStart: 10, paddingEnd: 10, color: this.props.screenProps.textColour }]}>{item.type}</Text>
        </View>

      </View>
    )
  }

  onGetMessages = (Url, show) => {
    if (show) {
      this.props.screenProps.showSpinner();
    }
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)
      console.log(" this is message screen and show comment data " + JSON.stringify(jsonRes))
      if (jsonRes.status == 'success') {
        var apiDataResponse = Array.isArray(jsonRes.data) ? jsonRes.data : [];
        var messageTypes = [];
        for (var i = 0; i < apiDataResponse.length; i++) {
          messageTypes.push({
            "title": apiDataResponse[i].title,
            "message": apiDataResponse[i].message,
            "priority": apiDataResponse[i].priority,
            "PriorityOrder": apiDataResponse[i].PriorityOrder,
            "updatedDate": apiDataResponse[i].updatedDate,
            "postedBy": apiDataResponse[i].postedBy,
            "type": apiDataResponse[i].type,
            "postedDate": apiDataResponse[i].postedDate,
            "commentCount": apiDataResponse[i].commentCount,
            "referenceID": apiDataResponse[i].referenceID,
            "postebById": apiDataResponse[i].postebById ? apiDataResponse[i].postebById : "",
            "actionDate": apiDataResponse[i].actionDate,
            "attachments": apiDataResponse[i].attachments ? apiDataResponse[i].attachments : ""
          })
        }
        this.setState({
          messageList: messageTypes,
          filterData: messageTypes
        })
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

  onGetAccessApi = (Url) => {
    this.props.screenProps.showSpinner();
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)
      if (this.state.accessType == WebConstant.isTicketModuleSubscribed) {
        this.setState({
          isTicketModuleSubscribed: jsonRes.ticketSubscribed == 0 ? false : true,
        })
        this.isReportProblemEnabledAPI(WebConstant.isReportProblemEnabled)
      }
      else
        if (this.state.accessType == WebConstant.isCommentEnabledForTicket) {
          this.setState({
            isCommentEnabledForTicket: jsonRes.commentsAllowed == 0 ? false : true,
          })
          if (this.state.isTicketModuleSubscribed || this.state.isReportProblemEnabled) {
            dialogEnabled = true
            themeColor = this.props.screenProps.primaryColour
          }
          this.callAllMessageAPI(false)
        }
        else
          if (this.state.accessType == WebConstant.isReportProblemEnabled) {
            this.setState({
              isReportProblemEnabled: jsonRes.enabled == 0 ? false : true,
            })
            this.isCommentEnabledForTicketAPI(WebConstant.isCommentEnabledForTicket)
          }
    }).catch((error) => {
      console.log("error ifdss " + error)
    });
  }

  onMessageView = (item) => {
    _that.setState({
      commentType: item.type == 'TICKET' ? 'TICKET' : 'WEBSYSNB'
    })
    this.props.navigation.navigate('Comment', {
      isComment: false,
      callAPI: this.state.apiType,
      archive: this.state.isArchieve,
      itemSelected: item,
      onGetMessages: this.onGetMessages.bind(this),
      commentType: this.state.commentType
    });
  }

  onMessageApi = (type, index) => {
    var Url = WebConstant.message_list_prifix + type + "/" + index

    new Promise(function (resolve, reject) {
      resolve(WebApi.getRequest(Url))
    }).then((jsonRes1) => {

      console.log("API Response " + JSON.stringify(jsonRes1));

      var jsonRes = JSON.parse(jsonRes1)
      if (jsonRes.status == 'success') {


      } else {
        if (jsonRes.message) {
          CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => { });
        }
      }
    }).catch((error) => {

      console.log("error ifdss " + error)
    });


  }

}

const MsgStyles = StyleSheet.create({


  touchableOpacityStyle: {
    flexDirection: 'row',
    flex: 1,
    fontFamily: Fonts.SFProDisplayBold,
    fontSize: 10,
    color: 'white',
    justifyContent: "center",
    alignItems: 'center'
  },
  filledTouchableOpacityStyle: {
    flexDirection: 'row',
    flex: 1,
    fontFamily: Fonts.SFProDisplayBold,
    fontSize: 10,
    color: 'white',
    backgroundColor: Colors.btn_color_orange,
    justifyContent: "center",
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 16,
    color: "#B4B4B4",
    justifyContent: "center",
    alignItems: 'center'
  },
  filledTextStyle: {
    fontSize: 16,
    color: 'white',

    justifyContent: "center",
    alignItems: 'center'
  },
  verticalTextStyle: {

    height: 20,

    padding: 2,
    marginTop: aspectRatio > 1.6 ? 40 : 80,
    fontSize: aspectRatio > 1.6 ? 12 : 24,
    color: 'white',

    borderColor: '#6B6B6B',
    borderRadius: aspectRatio > 1.6 ? 10 : 20,
    backgroundColor: '#6B6B6B',
    transform: [{ rotate: '270deg' }],
  },
  viewDocumentStyle: {
    // shadowColor: 'rgba(0,0,0, .4)', // IOS
    // shadowOffset: { height: 1, width: 1 }, // IOS
    // shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5, // Android    
    borderRadius: aspectRatio > 1.6 ? 20 : 30,
    padding: 5,
    alignItems: 'center',
    height: aspectRatio > 1.6 ? 35 : 45,
    justifyContent: 'center',
    marginRight: 10, marginTop: 10,
    width:ScreenRatio(13)
  },



})

