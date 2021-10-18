import React, { Component } from 'react';
import { Dimensions, FlatList, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import { Colors, Fonts, Styles, Constant, Strings } from "Res";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebApi, WebConstant } from "NetworkHelper";
import moment from 'moment';
import base64 from 'react-native-base64'
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';


const { width, height } = Dimensions.get('window');
let aspectRatio = height / width;
export default class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceCharge: '',
      groundRent: '',
      showGroundRent: false,
      accountList: [],
      docDirectory: '',
      agentID: '',
      unitID: '',
      blockID: '',
      pdf: '',
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height
    };
  }
  componentDidMount = () => {
    Dimensions.addEventListener('change',()=>{
      this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
     })
    this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
  };

  didFocusScreen = () => {
    SessionManager.getPreferenceData(Constant.sessionKey_show_balance).then((balance) => {
      if (balance) {
        var balanceData = JSON.parse(balance);
        this.setState({
          serviceCharge: balanceData.serviceCharge,
          showGroundRent: balanceData.showGroundRent,
          groundRent: balanceData.groundRent,
        })
      }
      this.getUserDetail()
    });
  }

  getUserDetail = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {

        var loginInformation = JSON.parse(loginInfo);

        this.setState({
          agentID: loginInformation.agentID, blockID: loginInformation.blockID,
          unitID: loginInformation.unitID, branchID: loginInformation.branchID,

        });
        this.getAccountsList('8,9,130', this.state.unitID, moment().format("YYYY-MM-DD"))
        this.getAccountStatements()

      }
    });
  }







  render() {
    return (
        <ScrollView style={{ height:this.state.height,width:this.state.width,flex: 1, backgroundColor: Colors.white, flexDirection: 'column' }}>
          <View style={{ backgroundColor: Colors.white, alignSelf:'flex-end', marginRight: 10, marginBottom: 10 }}>
            {
              (this.state.pdf != "" && this.state.pdf != null) ?
                <TouchableOpacity onPress={() => this.onAccountStateOpen()} style={[Styles.TouchableOpacityStyle, { paddingLeft:ScreenRatio(1.5),paddingRight:ScreenRatio(1.5),height: ScreenRatio(4.5), backgroundColor: this.props.screenProps.buttonBgColour }]}>
                  <Text style={{ fontSize: ScreenRatio(2.2), color: this.props.screenProps.buttonTextColour, margin: 2 }}>MY ACCOUNT STATEMENT</Text>
                </TouchableOpacity>
                :
                null
            }
          </View>

          <View style={{
            borderRadius: 5, elevation: 5, margin: 5, padding: 20,
            shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1,
            backgroundColor: Colors.white,
            marginTop: 20,
            
          }}>
            <Text style={{ fontSize: ScreenRatio(2.5), color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayRegular }}>Balance to Pay</Text>

            <View style={{ backgroundColor: Colors.white, flexDirection: 'row',marginTop:ScreenRatio(1) }}>
              <Text style={{ fontSize: ScreenRatio(3.2), color: this.props.screenProps.textColour, flex: 1, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.serviceCharge}</Text>
              {
                this.state.showGroundRent == true &&
                <Text style={{ fontSize: ScreenRatio(3.2), color: this.props.screenProps.textColour, flex: 1, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.groundRent}</Text>
              }
            </View>

            <View style={{ backgroundColor: Colors.white, flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ fontSize: ScreenRatio(2.5), flex: 1, color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayRegular }}>Service charge</Text>
              {
                this.state.showGroundRent == true &&
                <Text style={{ fontSize: ScreenRatio(2.5), flex: 1, color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayRegular }}>Ground Rent</Text>
              }
            </View>
          </View>


          <FlatList
            style={{ flex: .65 }}
            data={this.state.accountList}
            showsVerticalScrollIndicator={false}
            renderItem={this._renderRow}

          />
        </ScrollView>
    );
  }

  _renderRow = ({ item, index }) => {

    return (
      <View style={{
        flex: .35, borderRadius: 5, elevation: 5, margin: 5, padding: 20,
        shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, shadowRadius: 1,
        backgroundColor: Colors.white
      }}>
        <Text style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(2.5), fontFamily: Fonts.SFProDisplayRegular, }}>
          Date : <Text style={{ color: Colors.txt_gray, fontSize: ScreenRatio(2.5) }}>
            {moment(item[0].Date_of_Invoice).format("Do MMM YYYY")}</Text></Text>

        <Text style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(2.5), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular }}>Description : </Text>
        <Text style={{ color: Colors.txt_gray, fontSize: ScreenRatio(2.3), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>{item[0].item_description}</Text>


        <Text style={{ color: Colors.txt_gray, fontSize: ScreenRatio(2.3), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>{item[1] != undefined ? item[1].item_description : ''}</Text>


        <View style={{ backgroundColor: Colors.light_gray, height: 1, margin: 5 }}></View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          {(item[0] != null && item[0].Demands != null) && <View style={{ flex: .4, flexDirection: 'column' }}>

            <Text style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(2.5), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular }}>Demand :</Text>

            <Text style={{ color: Colors.txt_gray, fontSize: ScreenRatio(2.5), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>£ {this.getSum(item[0].Demands, item[1] != undefined ? item[1].Demands : null)}</Text>

            {/* <Text style={{ color: Colors.txt_gray, fontSize: aspectRatio>1.6?16:28, marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>{item[0].Demands!=null?'£ '+item[0].Demands:'£ 0.00'}</Text> */}

          </View>}

          {(item[0].Receipts != null) && <View style={{ flex: .4, flexDirection: 'column' }}>

            <Text style={{ color: this.props.screenProps.textColour, fontSize: ScreenRatio(2.5), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular }}>Receipt : </Text>

            <Text style={{ color: Colors.txt_gray, fontSize: ScreenRatio(2.5), marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>£ {this.getSum(item[0].Receipts, 0.00)}</Text>

            {/* <Text style={{ color: Colors.txt_gray, fontSize: aspectRatio>1.6?16:28, marginTop: 5, fontFamily: Fonts.SFProDisplayRegular, }}>{'£' +'0.00'}</Text> */}


          </View>}


          {
            (item[0].documentID != null) ?
              <TouchableOpacity onPress={() => this.onViewDoc(item[0].Date_of_Invoice, this.state.blockID, item[0].documentID)} style={[Styles.TouchableOpacityStyle, { backgroundColor: this.props.screenProps.buttonBgColour, width:ScreenRatio(8),height: ScreenRatio(3.5) }]}>
                <Text style={[Styles.btnTextStyle, { fontSize:ScreenRatio(2.5),color: this.props.screenProps.buttonTextColour }]}>{Strings.view}</Text>
              </TouchableOpacity>
              :
              null
          }



        </View>

      </View>

    )
  }
  getSum = (v1, v2) => {
    if (v1 != null && v2 != null)
      return (parseFloat(v1) + parseFloat(v2)).toFixed(2)
    else
      if (v2 == null && v1 != null)
        return parseInt(v1).toFixed(2)
      else
        if (v2 != null && v1 == null)
          return parseInt(v2).toFixed(2)
        else
          if (v2 == null && v1 == null)
            return 0.00

  }


  getAccountStatements = () => {
    // this.props.screenProps.showSpinner();

    var Url3 = WebConstant.myAccountStatement

    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url3))
    }).then((jsonRes1) => {

      // this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)
      this.setState({
        pdf: jsonRes.pdf
      })
    }).catch((error) => {
      this.props.screenProps.hideSpinner();
      console.log("error  " + error)
    });
  }



  getAccountsList = (type, unitID, endDate) => {
    this.props.screenProps.showSpinner();

    var Url3 = WebConstant.accountStatement + "AUTO" + "/" + endDate

    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url3))
    }).then((jsonRes1) => {

      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)

      if (jsonRes.status == 'success') {

        console.log("success  " + jsonRes)
        /*    var objects = []
           for (let userObject of jsonRes.data) {
             console.log(userObject);
             objects.push(userObject)
           }
   
    */
        const finalJSON = []
        const parsed = jsonRes.data;

        const result = parsed.map(entry => {
          var objects = []
          for (ob in Object.values(entry)[0]) {
            objects.push(Object.values(entry)[0][ob])
          }
          finalJSON.push(objects)
          return Object.keys(entry)[0];
        });


        // console.log('fsdhybisysdifysiydf' + JSON.parse(finalJSON));



        // console.log(result);

        this.setState({
          accountList: finalJSON,
          docDirectory: jsonRes.docDirectory
        })

        // setTimeout(() => {
        //   // this.getAccountStatements()
        // }, 100);
      } else {
        if (jsonRes.message) {
          CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
          });
        }
      }
    }).catch(() => {
      this.props.screenProps.hideSpinner();
      // console.log("error  " + error)
    });
  }

  onViewDoc = (date, blobkId, documentId) => {
    console.log("OY");
    console.log(date);
    var pdfUrl = this.state.docDirectory + '/' + (moment(date).format("YYYY")) + '/BLK' + blobkId + '/' + documentId;
    console.log("Pdf Url" + JSON.stringify(pdfUrl));
    Linking.openURL(pdfUrl)
  }


  onAccountStateOpen = () => {
    var pdfUrl = '' + this.state.pdf;
    console.log("Pdf Url" + JSON.stringify(pdfUrl));
    if (pdfUrl != "") {
      Linking.openURL(pdfUrl)
    }
  }
}