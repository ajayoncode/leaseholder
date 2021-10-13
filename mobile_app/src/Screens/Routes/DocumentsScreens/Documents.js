import moment from 'moment';
import { WebApi } from "NetworkHelper";
import React, { Component } from 'react';
import { Dimensions, FlatList, Linking, PickerIOS, PickerItemIOS, Platform, StyleSheet, Text, TouchableOpacity, View, NativeModules, Image } from 'react-native';
import { Colors, Fonts, Strings, Images } from "Res";
import Picker from '@react-native-community/picker'
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import CustomPicker from '../../../Application/CustomComponents/CustomViews/CustomPicker';
const PickerAndroid = NativeModules.PickerModule;
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import RNPickerSelect from 'react-native-picker-select';
import WebConstant from "../../../Application/NetworkController/WebConstant";
import {ScreenRatio} from '../../../Application/Utility/ScaleRatio';


const { width, height } = Dimensions.get('window');

let aspectRatio = height / width;
var _that;

export default class Documents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      documentsList: [],
      selected: "All",
      extraData: false,
      isApiCalled: false,
      pageNumber: 1,
      loading: false,
      selectedPicker: false,
      documentTypeList: [],
      isVisiblePikcer: false,
      selectedValueIndex: 0,
      spinnerArray: [""],
      array: [],
      agentID: '',
      blockID: '',
      unitID: '',
      branchID: '',
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

  didFocusScreen = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {
        var loginInformation = JSON.parse(loginInfo);
        this.setState({
          agentID: loginInformation.agentID, blockID: loginInformation.blockID,
          unitID: loginInformation.unitID, branchID: loginInformation.branchID
        });
        this.onGetDocuments('all');
        // this.onTestALlApisDocuments()
      }
    });
  }

  render() {
    let pickerObj = this.state.spinnerArray.map((item) => {
      return {
        label: item, value: item
      }
    })
      return (
      <View style={{ height:this.state.height,width:this.state.width,flex: 1, alignItems: 'center', backgroundColor: 'white' }}>

        {/*   <TouchableOpacity onPress={this.onPressOpenPicker} style={{
          width: width - 60, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          height: aspectRatio>1.6?50:60, borderRadius: aspectRatio>1.6?25:30, borderWidth: 1.5, borderColor: Colors.inptxt_grey, overflow: 'hidden'
        }}>
          <Text style={{ width: width - 100,marginStart: aspectRatio>1.6?8:30, fontSize: aspectRatio>1.6?15:30, color: 'black' }}>{this.state.selected}</Text>
          <Image style={{ width: aspectRatio>1.6?15:25, height: aspectRatio>1.6?15:25, alignSelf: 'center', marginRight:  aspectRatio>1.6?8:30, }} source={Images.ic_down_arrow} ></Image>
        </TouchableOpacity> */}

        <View style={{
          width: this.state.width - 60, height: aspectRatio > 1.6 ? 50 : 60, alignItems: 'center', borderColor: Colors.inptxt_grey,
          borderRadius: 25,
          justifyContent: "center",
          borderWidth: 0.5,
          paddingLeft: 8,
          borderWidth: 1.5,
        }}>
          <RNPickerSelect
            onValueChange={(value) => this.onGetDocumentsWithID(value)}
            style={{ inputIOS: { color: "#000",fontSize:ScreenRatio(2) }, inputAndroid: { color: "#000",fontSize:ScreenRatio(2) }, placeholderColor: "#000", }}
            items={pickerObj}
            value={this.state.selected}
            placeholder={{}}
          />
        </View>
        <View style={{ alignItems: "center", marginTop: 10, marginBottom: 70 }}>
          {
            (this.state.documentsList.length === 0) ?
              <View style={[{ alignItems: "center", justifyContent: "center", flex: 1, height: this.state.height, width: this.state.width, backgroundColor: Colors.white }]}>
                <Text style={{ textAlign: "center", fontSize: aspectRatio > 1.6 ? 17 : 30, color: Colors.black }}>{Strings.NO_DOCUMENT}</Text>
              </View>
              :
              <FlatList
                data={this.state.documentsList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.Document_ID}
                renderItem={this._renderRow}
              />
          }
        </View>

        <CustomPicker isVisible={this.state.isVisiblePikcer}
          cancelButtonPress={this.onPressClosePicker} selectedValue={this.state.selectedValueIndex}
          onChangeSelectedValue={this.onPressSelectedPicker} arrOfPicker={this.state.spinnerArray}
          requestButtonPress={this.onPressSelectedAction} />

      </View>
    );
  }


  _renderRow = ({ item, index }) => {

    return (
      <View style={{
        width: this.state.width - 20,
        elevation: 6, shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1,
        shadowRadius: 1,
        backgroundColor: 'white',
        margin: 10,
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 20,
        paddingBottom: 30,
      }}
        extraData={this.state.extraData}>

        <View style={{ flexDirection: 'row', marginTop: 10,justifyContent:'space-between' }}>

          <Text style={[DocStyles.textStyle, { color: this.props.screenProps.textColour, fontWeight: 'bold' }]}>
            {item.Document_Description}
          </Text>

          {
            (item.doc_name.length > 3) ?
              <TouchableOpacity onPress={() => this.onViewDoc(item)} style={[DocStyles.TouchableOpacityStyle, { backgroundColor: this.props.screenProps.buttonBgColour,marginRight:ScreenRatio(2) }]}>
                <Text style={[DocStyles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{Strings.view}</Text>
              </TouchableOpacity>
              :
              null
          }
        </View>

        <Text style={[DocStyles.textStyle, { color: this.props.screenProps.textColour }]}>
          {Strings.posted_date}
          <Text style={{ color: '#8A8989' }}>
            {moment(item.Date_posted).format("Do MMM YYYY")}
          </Text>
        </Text>

      </View>
    )
  }

  onPressOpenPicker = () => {
    console.log("marital Clicked" + JSON.stringify(this.state.spinnerArray));

    if (Platform.OS === 'android') {

      PickerAndroid.showDialog({ "itemArray": this.state.spinnerArray, "selectedData": "", "selectedIndex": this.state.selectedValueIndex })
        .then(function (result) {
          _that.setState({ selected: result.selectedData, selectedValueIndex: result.selectedIndex });

          setTimeout(() => {
            _that.onPressSelectedAction(result.selectedData);
          }, 500);


        })

    } else {
      this.setState({ isVisiblePikcer: true });
    }
  }
  onPressClosePicker = () => {
    this.setState({ isVisiblePikcer: false })
  }
  onPressSelectedPicker = (value) => {
    console.log("Selecred Valeeee " + value);
    this.setState({ selectedValueIndex: value })

  }

  onPressSelectedAction = () => {
    var all = this.state.spinnerArray[this.state.selectedValueIndex]
    if (all == 'All') {

      var itemID = this.state.documentTypeList[this.state.selectedValueIndex].Document_Type_ID
      this.setState({ selected: all, isVisiblePikcer: false })
      this.onGetDocuments("all");
    } else {
      var value = this.state.documentTypeList[this.state.selectedValueIndex].Document_Type_description
      var itemID = this.state.documentTypeList[this.state.selectedValueIndex].Document_Type_ID
      this.setState({ selected: value, isVisiblePikcer: false })
      this.onGetDocuments(itemID);
    }




  }

  onTestALlApisDocuments = () => {
    this.props.screenProps.showSpinner();
    var Url = WebConstant.allApiDocument
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {

      this.props.screenProps.hideSpinner();

      var jsonRes = JSON.parse(jsonRes1)

      if (jsonRes.status == 'success') {

        console.log("success  " + jsonRes)

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



  onPostTest = () => {
    var body = {
      Complain: 'dkjghkdfh',


    };

    new Promise(function (resolve, reject) {
      resolve(WebApi.multiPartRequest(WebConstant.onPostTest, body))
    }).then((jsonRes1) => {
      this.props.screenProps.hideSpinner();
      var jsonRes = JSON.parse(jsonRes1)
      console.log('API ----body' + JSON.stringify(body))
      console.log('API ----Response' + JSON.stringify(jsonRes))
      if (jsonRes.status == 'success') {

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

  onGetDocuments = (value) => {
    this.props.screenProps.showSpinner();
    var Url = WebConstant.document_list_prifix + value
    new Promise(function (resolve, reject) {
      resolve(WebApi.getMultipPartRequest(Url))
    }).then((jsonRes1) => {

      this.props.screenProps.hideSpinner();

      var jsonRes = JSON.parse(jsonRes1)

      if (jsonRes.status == 'success') {
        if (!this.state.isApiCalled) {
          var SampleArray = ["All"];
          var documentTypes = ["All"];
          for (var i = 0; i < jsonRes.documentTypeList.length; i++) {
            documentTypes.push({
              "Document_Type_ID": jsonRes.documentTypeList[i].Document_Type_ID,
              "Document_Type_description": jsonRes.documentTypeList[i].Document_Type_description,
              "default_historic_display": jsonRes.documentTypeList[i].default_historic_display,
              "available_for_historic_display": jsonRes.documentTypeList[i].available_for_historic_display,
              "Display_order": jsonRes.documentTypeList[i].Display_order,
              "Active": jsonRes.documentTypeList[i].Active,
              "document_pref": jsonRes.documentTypeList[i].document_pref,
              "core_document": jsonRes.documentTypeList[i].core_document,
            })
           
            SampleArray.push(jsonRes.documentTypeList[i].Document_Type_description.toString());
          }
          this.setState({
            spinnerArray: SampleArray,
            documentTypeList: documentTypes,
            isApiCalled: true,
            documentsList: jsonRes.documents,
            extraData: !this.state.extraData
          })
        } else {
          this.setState({
            documentsList: jsonRes.documents,
            extraData: !this.state.extraData
          })
        }


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



  onGetDocumentsWithID = (value) => {
    // if (value === "All") {

    // } else {
    this.setState({ selected: value })
    setTimeout(() => {
      let selectedValueInInt = "all"
      this.state.documentTypeList.map((item) => {
        if (item.Document_Type_description === value) {
          selectedValueInInt = parseInt(item.Document_Type_ID);
        }
      })
      console.log("selectedValueInInt================= " + selectedValueInInt)
      console.log("Value================= " + value)
      console.log("selected================= " + selectedValueInInt)

      this.props.screenProps.showSpinner();
      var Url = WebConstant.document_list_prifix + selectedValueInInt
      new Promise(function (resolve, reject) {
        resolve(WebApi.getMultipPartRequest(Url))
      }).then((jsonRes1) => {
        this.props.screenProps.hideSpinner();
        var jsonRes = JSON.parse(jsonRes1)
        if (jsonRes.status == 'success') {
          if (!this.state.isApiCalled) {
            var SampleArray = ["All"];
            var documentTypes = ["All"];
            for (var i = 0; i < jsonRes.documentTypeList.length; i++) {
              documentTypes.push({
                "Document_Type_ID": jsonRes.documentTypeList[i].Document_Type_ID,
                "Document_Type_description": jsonRes.documentTypeList[i].Document_Type_description,
                "default_historic_display": jsonRes.documentTypeList[i].default_historic_display,
                "available_for_historic_display": jsonRes.documentTypeList[i].available_for_historic_display,
                "Display_order": jsonRes.documentTypeList[i].Display_order,
                "Active": jsonRes.documentTypeList[i].Active,
                "document_pref": jsonRes.documentTypeList[i].document_pref,
                "core_document": jsonRes.documentTypeList[i].core_document,
              })
              SampleArray.push(jsonRes.documentTypeList[i].Document_Type_description.toString());
            }
            this.setState({
              documentTypeList: documentTypes,
              documentsList: jsonRes.documents,
              extraData: !this.state.extraData
            })
          } else {
            this.setState({
              documentsList: jsonRes.documents,
              extraData: !this.state.extraData
            })
          }
        } else {
          if (jsonRes.message) {
            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
            });
          }
        }
      }).catch((error) => {
        console.log("error ifdss " + error)
      });
    }, 500);
    // }
  }



  onViewDoc = (item) => {
    if (item.doc_name.length > 3) {
      var pdfUrl = WebConstant.PDF_PREFIX_URL + ((item.core_document === "Yes") ? 'core/' : (moment(item.Date_posted).format("YYYY")) + "/") + WebConstant.BLK + item.Block_ID + "/" + item.doc_name;
      console.log("Pdf Url" + JSON.stringify(pdfUrl));
      Linking.openURL(pdfUrl)
    }
  }

}



const DocStyles = StyleSheet.create({

  TouchableOpacityStyle: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 5, // Android    
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    // flex: .12,
    height: ScreenRatio(3.5),
    justifyContent: 'center',
    paddingLeft:ScreenRatio(1.5),
    paddingRight:ScreenRatio(1.5),    
  },

  btnTextStyle: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: aspectRatio > 1.6 ? 16 : 28,
    color: 'white',

  },
  textStyle: {
    fontSize: aspectRatio > 1.6 ? 16 : 28,
    marginStart: 10,
    fontFamily: Fonts.SFProDisplayRegular,
    color: '#000'
  },

})
