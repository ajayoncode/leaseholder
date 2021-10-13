import React, { Component } from 'react';
import { View, Text, FlatList, Image, Dimensions, TextInput, TouchableOpacity, Button, BackHandler, StyleSheet } from 'react-native';
import { Colors, Styles, Strings, Constant, Images, Fonts } from "Res";
import HTML from 'react-native-render-html';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import moment from 'moment';




const { width, height } = Dimensions.get('window');
var _that;

export default class ViewMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            commentList: [],
            item: "",
            type: "",
            agentID: '',
            blockID: '',
            unitID: '',
            branchID: '',
            loggedInUserID: '',
            commentType: '',
            isCommentEnabledForTicket: false,
        };
        _that = this;
    }
    static navigationOptions = {

        headerLeft: (
            <TouchableOpacity onPress={() => _that.handleBackPress()}>
                <Image style={{ width: 25, height: 25, marginLeft: 8 }} source={Images.ic_back} ></Image>
            </TouchableOpacity>
        ),

    };



    componentDidMount = () => {
        this.setState({
            item: this.props.navigation.getParam('onMessageView', 'NO-Item'),
            isCommentEnabledForTicket: this.props.navigation.getParam('isCommentEnabledForTicket', 'NO-Item')


        })

        BackHandler.addEventListener('hardwareBackPress', () => {

            _that.handleBackPress()
            return true;

        });

        this.onGetComments()
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.goBack()
    };

    getAPIType = (param) => {
        switch (param) {
            case "TICKET":
                return "WEBSYSTIC"
                break;
            case "AGENT":
                return "WEBSYSAGEN"
                break;
            case "POST":
                return "WEBSYSNB"
                break;
        }
    };







    render() {
        return (
            <KeyboardAwareScrollView
                viewIsInsideTabBar={true}
                bounces={false}
                keyboardShouldPersistTaps={"always"}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }} >
                <View style={{ width: width, marginTop: 5, marginBottom: 5, flexDirection: 'row', flex: 1 }}>

                    <View style={{
                        width: width - 40, borderRadius: 5, borderWidth: 1.5,
                        borderColor: Colors.inptxt_grey,
                        marginLeft: 20, marginRight: 20,
                        paddingStart: 10
                    }}>

                        <View style={{ flexDirection: 'row', overflow: 'hidden', alignItems: 'center', flex: 1 }}>

                            <Text style={{ color: this.props.screenProps.primaryColour, fontSize: 18, flex: .67, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.item.title}</Text>

                            {
                                (this.state.item.priority != "") ?
                                    <View style={{
                                        backgroundColor: this.props.screenProps.primaryColour, borderColor: this.props.screenProps.primaryColour, borderWidth: 1.5, borderRadius: 10,
                                        marginRight: 5, flex: .23, paddingEnd: 5, paddingStart: 5, marginLeft: 5, marginTop: 2, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Text style={{ color: Colors.white, fontSize: 9, fontFamily: Fonts.SFProDisplayBold }}>{this.state.item.priority}</Text>
                                    </View>
                                    :
                                    null
                            }


                        </View>

                        {/*  */}
                        <HTML html={this.state.item.message} baseFontStyle={{ fontSize: 12, flex: .7, marginLeft: 5, fmarginStart: 10, color: 'black' }} />



                        <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.light_gray, }} />


                        <View style={{ flexDirection: 'row', overflow: 'hidden', flex: 1, padding: 5 }}>

                            <Text style={{ color: "#B4B4B4", fontSize: 14, flex: 1, fontFamily: Fonts.SFProDisplayBold, fontStyle: 'italic' }}>Updated on
                                <Text>  {moment(this.state.item.updatedDate).format("Do MMM YYYY | hh:mm A")}</Text></Text>

                            {
                                (this.state.item.type != "AGENT") ?
                                    <Text onPress={() => this.onReportMessageClicked()} style={{ color: this.props.screenProps.primaryColour, fontSize: 12, flex: .2, fontFamily: Fonts.SFProDisplayRegular }}>Report</Text>
                                    :
                                    null
                            }

                        </View>


                        <View style={{ height: 1, backgroundColor: Colors.light_gray, alignItems: 'center', justifyContent: 'center', marginEnd: 5, marginStart: 5 }} />

                        <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 5, flex: 1 }}>
                            <Text style={{ color: Colors.black, fontSize: 12, flex: 4.2, fontFamily: Fonts.SFProDisplayRegular }}>Created by:<Text style={{ color: "#B4B4B4", }}> {this.state.item.postedBy}</Text></Text>
                            <Text style={{ color: "#B4B4B4", fontSize: 12, flex: 2.9 }}>{moment(this.state.item.postedDate).format("Do MMM YYYY | hh:mm A")}</Text>

                            {
                                (this.state.item.type == "POST" || (this.state.isCommentEnabledForTicket && this.state.item.type == "TICKET")) ?
                                    <Text style={{ color: this.props.screenProps.primaryColour, fontSize: 12, flex: 2.9, }}>{this.state.item.commentCount + " " + Strings.comments}</Text>
                                    :
                                    null
                            }


                        </View>
                    </View>
                    <View style={[MsgStyles.verticalTextStyle, { height: 20, width: 60, marginLeft: -10, marginTop: 40, position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={[{ padding: 2, height: 20, fontSize: 10, overflow: 'visible', paddingStart: 10, paddingEnd: 10, color: Colors.white }]}>{this.state.item.type}</Text>
                    </View>
                </View>



                {/*        <View style={{ alignSelf: 'center', justifyContent: 'center', marginBottom: 50 }}>
                    <FlatList
                        data={this.state.commentList}
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderRow}

                    />
                </View> */}


                <View style={{ flex: 1, backgroundColor: 'white', padding: 10, height: height - 150, width: width, justifyContent: 'flex-end', }}>

                    <View style={{ alignSelf: 'center', justifyContent: 'center', marginBottom: 50 }}>
                        <FlatList
                            data={this.state.commentList}
                            showsVerticalScrollIndicator={false}
                            renderItem={this._renderRow}

                        />
                    </View>
                    <View style={{ position: 'absolute', flexDirection: 'row', width: width - 20, height: 40, alignContent: 'center', alignSelf: 'center', }}>
                        <View style={{ flex: 1, justifyContent: 'center', fontFamily: Fonts.SFProDisplayRegular, marginBottom: 50 }}>

                            <TouchableOpacity onPress={this.onCommentsClicked(this.state.item)} style={[Styles.TouchableOpacityStyle, { backgroundColor: this.props.screenProps.primaryColour }]}>
                                <Text style={Styles.btnTextStyle}>{Strings.add_comment}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View >




            </KeyboardAwareScrollView>



        );
    }
    onReportMessageClicked() {
        this.props.navigation.navigate('ReportMessage')
    }

    onCommentsClicked = (item) => {


    }

    onGetComments = () => {
        this.props.screenProps.showSpinner();
        console.log("error ifdss " + this.state.item)
        const messageID = this.props.navigation.getParam('onMessageView', 'NO-Item').referenceID;
        var type = this.getAPIType(this.props.navigation.getParam('onMessageView', 'NO-Item').type)
        var Url = WebConstant.comment_list_prifix + messageID + "/" + type

        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            this.props.screenProps.hideSpinner();

            var jsonRes = JSON.parse(jsonRes1)

            if (jsonRes.status == 'success') {

                var comments = [];
                for (var i = 0; i < jsonRes.data.length; i++) {
                    comments.push({
                        "comment_ID": jsonRes.data[i].comment_ID,
                        "reference_ID": jsonRes.data[i].reference_ID,
                        "processing_reference": jsonRes.data[i].processing_reference,
                        "ticket_comment": jsonRes.data[i].ticket_comment,
                        "comment_timestamp": jsonRes.data[i].comment_timestamp,
                        "comment_by": jsonRes.data[i].comment_by,
                        "publish_to_client": jsonRes.data[i].publish_to_client,
                        "comment_sub_type": jsonRes.data[i].comment_sub_type,
                        "User_Name": jsonRes.data[i].User_Name,
                    })

                }
                this.setState({
                    commentList: comments,
                    comment: ''
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

    _renderRow = ({ item, index }) => {
        return (
            <View style={{
                width: width - 20, marginTop: 5, marginBottom: 5,
                backgroundColor: Colors.light_gray, borderRadius: 20, borderColor: Colors.txt_gray
                , padding: 16
            }}>
                <Text style={{ color: Colors.black, fontSize: 16 }}>{item.ticket_comment}</Text>
                <Text style={{ color: Colors.btn_color_orange, fontSize: 10 }}>{item.User_Name} <Text style={{ color: Colors.txt_gray, fontSize: 10 }}>  {moment(item.comment_timestamp).format("Do MMM YYYY | hh:mm A")}</Text></Text>

            </View>
        )
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
        marginTop: 40,
        fontSize: 12,
        color: 'white',

        borderColor: '#6B6B6B',
        borderRadius: 10,
        backgroundColor: '#6B6B6B',
        transform: [{ rotate: '270deg' }],
    },




})

