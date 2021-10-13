import React, { Component, createRef } from 'react';
import { View, Text, FlatList, Image, Dimensions, TextInput, TouchableOpacity, Button, BackHandler, StyleSheet, Platform, Keyboard, findNodeHandle, Linking } from 'react-native';
import { Colors, Styles, Strings, Constant, Images, Fonts } from "Res";
import HTML from 'react-native-render-html';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebApi } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonAttachmentScreen from '../../../Application/CustomComponents/CustomViews/CommonAttachmentScreen';


import moment from 'moment';
import ActionSheet from 'react-native-action-sheet';
import base64 from 'react-native-base64';
import WebConstant from "../../../Application/NetworkController/WebConstant";


var BUTTONSiOS = [
    'Edit',
    'Delete',
    'Cancel'
];

var BUTTONSandroid = [
    'Edit',
    'Delete',
    'Cancel'
];

var BUTTONSiOSPost = [
    'Edit Post',
    'Delete Post',
    'Cancel'
];

var BUTTONSandroidPost = [
    'Edit Post',
    'Delete Post',
    'Cancel'
];

// var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

const { width, height } = Dimensions.get('window');
let aspectRatio = height / width;
var _that;

const isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
}

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            isComment: false,
            commentList: [],
            item: "",
            type: "",
            agentID: '',
            blockID: '',
            unitID: '',
            branchID: '',
            loggedInUserID: '',
            isCommentOnEditMode: false,
            editedComment: '',
            editItem: {},
            isAttachementVisible: false,
            attachmentArray: [],
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
        _that = this;
        this.commentRef = createRef();
        this.scroll = createRef();
    }

    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <TouchableOpacity onPress={() => _that.handleBackPress()}>
                <Image style={{ width: 25, height: 25, marginLeft: 8 }} source={Images.ic_back} ></Image>
            </TouchableOpacity>
        ),
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                {(navigation.state.params.showEdit ? navigation.state.params.showEdit() : null) &&
                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => {
                        ActionSheet.showActionSheetWithOptions({
                            options: (Platform.OS == 'ios') ? BUTTONSiOSPost : BUTTONSandroidPost,
                            cancelButtonIndex: CANCEL_INDEX,
                            // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                            tintColor: _that.props.screenProps.primaryColour,
                        },
                            (buttonIndex) => {
                                console.log('button clicked :', buttonIndex);
                                switch (buttonIndex) {
                                    case 0:
                                        _that.props.navigation.navigate("AddPost", { isEdit: true, item: navigation.state.params.itemSelected, handleBackPress: _that.handleBackPress });
                                        // _that portal/Messages/updateMessage/{Number -> Message Id eg.2148}/true
                                        break;
                                    case 1:
                                        CommonFunction.doubleAlertDilog("Are you sure you want to delete this post?", "No", "Yes", () => { }, () => _that.deletePostApi(_that.state.item.referenceID))
                                        break;

                                    default:
                                        break;
                                }
                            });
                    }}>
                        <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: '#696969' }} source={Images.edit} ></Image>
                    </TouchableOpacity>}
                <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { _that.openLicenseDialog() }}>
                    <Image style={{ width: 25, height: 25, marginLeft: 8 }} source={Images.ic_info} ></Image>
                </TouchableOpacity>
            </View>
        ),

    });


    showEdit = () => {
        let incrptId = _that.state.item === "" ? "" : base64.encode(_that.state.item.postebById ? String(_that.state.item.postebById) : "");
        console.log(" this is djfksdfksjdkfj jksdjfk jkdfj jdfkj " + JSON.stringify(_that.state.item) + "  incrptId" + _that.state.item.postebById)
        if ((_that.props.screenProps.userPermissions.allowPostOnMessages === 1) && (_that.state.loggedInUserID === incrptId) && (!_that.state.isComment) && (_that.state.item.type === "POST")) {
            return true
        }
        else {
            return false
        }

    }

    componentDidMount = () => {
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
        this.props.navigation.setParams({ showEdit: this.showEdit })
        BackHandler.addEventListener('hardwareBackPress', () => {
            _that.handleBackPress()
            return true;
        });


        this.getUserDetail()
    };
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }


    getUserDetail = () => {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    item: this.props.navigation.getParam('itemSelected', 'NO-Item'),
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, branchID: loginInformation.branchID,
                    loggedInUserID: loginInformation.userInternalID,
                    isComment: this.props.navigation.getParam('isComment', 'NO-Item'),
                });
                this.onGetComments();
            }
        });
    }

    openLicenseDialog = () => {
        CommonFunction.singleAlertDilogWithAction(Strings.info_comment, "Ok", () => {
        });
    }

    onViewDoc = (item) => {
        this.setState({ isAttachementVisible: true, attachmentArray: item })
    }

    render() {
        return (
            <View style={{  height:this.state.height,width:this.state.width,flex: 1 }}>
                {/* <KeyboardAwareScrollView
                    viewIsInsideTabBar={true}
                    bounces={false}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={"always"}
                    showsVerticalScrollIndicator={false}
                    innerRef={(r) => { this.scroll = r; }}
                    // extraHeight={50}
                    contentContainerStyle={{ flexGrow: 1 }}> */}

                <KeyboardAwareScrollView
                    viewIsInsideTabBar={true}
                    bounces={false}
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={"always"}
                    style={{ marginTop: 10, flex: 1, }}
                    showsVerticalScrollIndicator={false}
                    innerRef={(r) => { this.scroll = r; }}
                    contentContainerStyle={{ flex: 1, }}
                    automaticallyAdjustContentInsets={true}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    // enableOnAndroid={true} 
                    extraHeight={isIphoneX() ? 30 : 10}
                    extraScrollHeight={Platform.OS == 'ios' ? 80 : 0} >

                    {
                        (!this.state.isComment) ?
                            <View>
                                <View style={{
                                    width: this.state.width*0.95, borderRadius: 5, borderWidth: 1.5,
                                    borderColor: Colors.inptxt_grey,
                                    alignSelf:'center',
                                    paddingStart: 10
                                }}>
                                    <View style={{ margin: aspectRatio > 1.6 ? 0 : 10 }}>
                                        <View style={{ flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }}>
                                            <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 18 : 36, flex: .90, fontFamily: Fonts.SFProDisplayRegular }}>{this.state.item.title}</Text>
                                            {
                                                (this.state.item.attachments ? this.state.item.attachments.length : [].length > 0) ?
                                                    <TouchableOpacity onPress={() => this.onViewDoc(this.state.item)} style={[MsgStyles.viewDocumentStyle, { backgroundColor: this.props.screenProps.buttonBgColour, }]}>
                                                        <Text style={{ color: this.props.screenProps.buttonTextColour, fontSize: aspectRatio > 1.6 ? 14 : 28 }}>{Strings.attachment}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                            {/* {
                                            (this.state.item.priority != "") ?
                                                <View style={{
                                                    backgroundColor: this.props.screenProps.primaryColour, borderColor: this.props.screenProps.primaryColour, borderWidth: 1.5, borderRadius: aspectRatio > 1.6 ? 10 : 20,
                                                    marginRight: 5, flex: .23, paddingEnd: 5, paddingStart: 5, marginLeft: 5, marginTop: 2, alignItems: 'center', justifyContent: 'center', height: aspectRatio > 1.6 ? 15 : 35
                                                }}>
                                                    <Text style={{ color: Colors.white, fontSize: aspectRatio > 1.6 ? 9 : 18, fontFamily: Fonts.SFProDisplayBold }}>{this.state.item.priority}</Text>
                                                </View>
                                                :
                                                null
                                        } */}
                                        </View>
                                        <HTML html={this.state.item.message} baseFontStyle={{ fontSize: aspectRatio > 1.6 ? 12 : 24, flex: .7, marginLeft: 5, fmarginStart: 10, color: this.props.screenProps.textColour }} />
                                        <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.light_gray, }} />
                                        <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 5 }}>
                                            <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 14 : 28, flex: 1, fontFamily: Fonts.SFProDisplayBold, fontStyle: 'italic' }}>Updated on
                                                <Text> {moment(this.state.item.updatedDate).format("Do MMM YYYY | hh:mm A")}</Text>
                                            </Text>
                                            {
                                                (this.state.item.type != "AGENT") ?
                                                    <Text onPress={() => this.onReportMessageClicked(this.state.item)} style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 12 : 24, flex: .2, fontFamily: Fonts.SFProDisplayRegular }}>Report</Text>
                                                    :
                                                    null
                                            }
                                        </View>
                                        <View style={{ height: 1, backgroundColor: Colors.light_gray, alignItems: 'center', justifyContent: 'center', marginEnd: 5, marginStart: 5 }} />
                                        <View style={{ flexDirection: 'row', overflow: 'hidden', padding: 5 }}>
                                            <Text style={{ color: Colors.black, fontSize: aspectRatio > 1.6 ? 12 : 24, flex: 4.2, fontFamily: Fonts.SFProDisplayRegular }}>Created by:<Text style={{ color: "#B4B4B4", }}> {this.state.item.postedBy}</Text></Text>
                                            <Text style={{ color: "#B4B4B4", fontSize: aspectRatio > 1.6 ? 12 : 24, flex: 2.9 }}>{moment(this.state.item.postedDate).format("Do MMM YYYY | hh:mm A")}</Text>
                                            {/* {
                                                (this.state.item.type == "POST" || (this.state.isCommentEnabledForTicket && this.state.item.type == "TICKET")) ?
                                                    <Text style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 12 : 24, flex: 2.9, }}>{this.state.item.commentCount + " " + Strings.comments}</Text>
                                                    :
                                                    null
                                            } */}
                                        </View>
                                    </View>
                                    <View style={[MsgStyles.verticalTextStyle, { backgroundColor: Colors.light_gray, height: aspectRatio > 1.6 ? 20 : 30, width: aspectRatio > 1.6 ? 60 : 120, marginLeft: aspectRatio > 1.6 ? -30 : -58, marginTop: aspectRatio > 1.6 ? 40 : 80, position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[{ padding: 2, height: aspectRatio > 1.6 ? 20 : 30, fontSize: aspectRatio > 1.6 ? 9 : 19, overflow: 'visible', paddingStart: 10, paddingEnd: 10, color: this.props.screenProps.textColour }]}>{this.state.item.type}</Text>
                                    </View>
                                </View>
                            </View> : null
                    }
                    <View style={{ paddingTop: 30, flex: 1, padding: 10, width: this.state.width, justifyContent: 'center' }}>
                        <View style={{ alignSelf: 'center', justifyContent: 'center', position: 'relative' }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: this.showCommentView() ? 150 : 20 }}
                                keyboardShouldPersistTaps={'never'}
                                keyboardDismissMode={'on-drag'}
                                data={this.state.commentList}
                                showsVerticalScrollIndicator={false}
                                renderItem={this._renderRow}
                            />
                        </View>
                        {/* height: aspectRatio > 1.6 ? 40 : 60, */}
                        {/* {
                        (this.state.item.type != "AGENT") ? 
                            (this.state.item.type === "TICKET")  ? (this.props.screenProps.userPermissions.allowCommentOnTickets === "1") ?
                            this.getCommentView():
                            null
                            :this.getCommentView()
                            :
                            null
                    } */}
                        {this.showCommentView() ? this.getCommentView() : null}
                    </View >
                </KeyboardAwareScrollView>
                <CommonAttachmentScreen dataArray={this.state.attachmentArray}
                    visible={this.state.isAttachementVisible} attachmentModalClose={(value) => this.setState({ isAttachementVisible: value })
                    } />
            </View>
        );
    }

    _scrollToInput = (reactNode) => {
        this.setState({ commentBtnDisable: false })
        // Add a 'scroll' ref to your ScrollView
        // this.scroll.props.scrollToFocusedInput(reactNode)
    }

    showCommentView = () => {
        if (this.state.item.type != "AGENT") {
            if (this.state.item.type === "TICKET") {
                if (this.props.screenProps.userPermissions.allowCommentOnTickets === 1) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        } else {
            return false
        }
    }

    getCommentView = () => {
        return <View style={{ position: 'absolute', width: this.state.width - 20, alignContent: 'center', alignSelf: 'center', bottom: 0, backgroundColor: "white", maxHeight: 100, minHeight: 50, paddingVertical: 8 }}>
            <View style={{ flex: 1, flexDirection: 'row', maxHeight: 100 }}>
                <View style={{ width:this.state.width*0.93,flexDirection: 'row', borderColor: Colors.inptxt_grey, borderRadius: 20, borderWidth: 1, padding: 4, marginBottom: 20 }}>

                    <View style={{ flex: 1, justifyContent: 'center', fontFamily: Fonts.SFProDisplayRegular, flexDirection: 'row' }}>
                        <TextInput style={{ flex: 1, padding: 5, fontSize: aspectRatio > 1.6 ? 15 : 30, color: Colors.black }}
                            ref={this.commentRef}
                            placeholder="Write a comment..."
                            value={this.state.isCommentOnEditMode ? this.state.editedComment : this.state.comment}
                            multiline={true}
                            maxHeight={100}
                            placeholderTextColor={Colors.inptxt_grey}
                            onFocus={(event) => {
                                // `bind` the function if you're using ES6 classes
                                this._scrollToInput(findNodeHandle(event.target))
                            }}
                            underlineColorAndroid='transparent'
                            onChangeText={(comment) => this.setState(this.state.isCommentOnEditMode ? { editedComment: comment, commentBtnDisable: false } : { comment, commentBtnDisable: false })} />
                        {this.state.isCommentOnEditMode && <TouchableOpacity onPress={() => {
                            this.setState({ isCommentOnEditMode: false, editItem: {}, editedComment: '' }, Keyboard.dismiss)
                        }} style={{ alignSelf: 'center', marginLeft: 8, marginRight: 4 }}>
                            <Image source={Images.deleteSmall} style={{ height: 20, width: 20 }} />
                        </TouchableOpacity>}
                    </View>

                    {/* {/ <Image source={Images.ic_attached_icon} style={{ flex: .1, width: 25, height: 25, resizeMode: 'contain', }} /> /} */}
                </View>
                <TouchableOpacity disabled={this.state.commentBtnDisable} onPress={this.state.isCommentOnEditMode ? this.editCommeentApi : this.onSendClicked} style={{ flex: .10, }}>
                    <Image source={Images.ic_send} style={{ margin: 8, width: aspectRatio > 1.6 ? 25 : 35, height: aspectRatio > 1.6 ? 25 : 35, resizeMode: 'contain', tintColor: this.props.screenProps.buttonBgColour }} />
                </TouchableOpacity>
            </View>
        </View>

    }

    onBackButtonClick = () => {
        // this.props.navigation.goBack(null);
        // this.props.navigation.state.params.getAllMessages()
    }

    deleteCommentApi = (item) => {
        this.props.screenProps.showSpinner();
        let url = WebConstant.removeComment

        let body = {
            "comment_id": item.comment_ID
        }

        // item.comment_ID
        new Promise(function (resolve, reject) {
            resolve(WebApi.deleteRequest(url, body))
        }).then((jsonRes1) => {
            // this.hideSpinner();
            this.props.screenProps.hideSpinner();
            this.onGetComments()
        })
    }

    deletePostApi = (refId) => {
        this.props.screenProps.showSpinner();
        let url = WebConstant.deletePost

        let body = {
            "id": refId
        }

        new Promise(function (resolve, reject) {
            resolve(WebApi.deleteRequest(url, body))
        }).then((jsonRes1) => {
            // this.hideSpinner();
            this.props.screenProps.hideSpinner();
            var jsonRes = JSON.parse(jsonRes1)
            console.log('Response: ' + 'URL-----' | +url + JSON.stringify(jsonRes1))
            this.handleBackPress()
            //    this.onGetComments()
        })
    }


    editCommeentApi = () => {
        let { editedComment } = this.state

        if (CommonFunction.isNull(editedComment)) {
            CommonFunction.singleAlertDilog('comment cannot be empty', "ok")
        }
        else {
            this.props.screenProps.showSpinner();
            const commentID = this.state.editItem.comment_ID

            // base64 converted
            // POST:- UE9TVA==
            // TICKET:-  VElDS0VU

            var body = {
                comment: this.state.editedComment.trim(),
                messageID: commentID
            };

            let url = WebConstant.editComment
            new Promise(function (resolve, reject) {
                // WEBSYSTIC
                resolve(WebApi.multiPartRequest(url, body))
            }).then((jsonRes1) => {
                this.props.screenProps.hideSpinner();
                var jsonRes = JSON.parse(jsonRes1)
                if (jsonRes.status == 'success') {
                    this.setState({ isCommentOnEditMode: false, editItem: {}, editedComment: '' }, () => {
                        Keyboard.dismiss()
                        setTimeout(() => {
                            CommonFunction.singleAlertDilogWithAction('Comment updated successfully', "Ok", () => {
                                this.onGetComments();
                            });
                        }, 400)
                    })

                }
            }).catch((error) => {
                console.log("error ifdss ", JSON.stringify(error))
            });
        }

    }

    _renderRow = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                if (_that.state && _that.state.loggedInUserID === base64.encode(String(item.comment_by))) {
                    ActionSheet.showActionSheetWithOptions({
                        options: (Platform.OS == 'ios') ? BUTTONSiOS : BUTTONSandroid,
                        cancelButtonIndex: CANCEL_INDEX,
                        // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        tintColor: this.props.screenProps.primaryColour
                    },
                        (buttonIndex) => {
                            console.log('button clicked :', buttonIndex);
                            switch (buttonIndex) {
                                case 0:
                                    // _that.comment.focus()
                                    _that.commentRef.current.focus();
                                    _that.setState({ isCommentOnEditMode: true, editedComment: item.ticket_comment, editItem: item })
                                    break;
                                case 1:
                                    CommonFunction.doubleAlertDilog("Are you sure you want to delete this comment?", "No", "Yes", () => { }, () => this.deleteCommentApi(item))
                                    break;

                                default:
                                    break;
                            }
                        });
                }
            }} style={{
                width: this.state.width*0.97, marginTop: 5, marginBottom: 5,
                backgroundColor: Colors.light_gray, borderRadius: 20, borderColor: Colors.txt_gray
                , padding: 16
            }}>
                <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 16 : 32 }}>{item.ticket_comment}</Text>
                <Text style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 10 : 20 }}>{item.User_Name} <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 10 : 20 }}>  {moment(item.comment_timestamp).format("Do MMM YYYY | hh:mm A")}</Text></Text>

            </TouchableOpacity>
        )
    }
    getType = (param) => {
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
    }


    getMessageType = (param) => {
        return param
        // switch (param) {
        //     case "TICKET":
        //         return "TICKET"
        //         break;
        //     case "POST":
        //         // return "WEBSYSNB"
        //         return "POST"
        //         break;
        // }
    }

    onReportMessageClicked(item) {
        this.props.navigation.navigate('ReportMessage', {
            messagePacket: item,


        });
    }


    onSendClicked = () => {
        this.setState({ commentBtnDisable: true })
        let { comment } = this.state

        if (CommonFunction.isNull(comment)) {
            CommonFunction.singleAlertDilog('comment cannot be empty', "ok")
        }
        else {
            this.props.screenProps.showSpinner();
            const messageID = this.props.navigation.getParam('itemSelected', 'NO-Item').referenceID;
            var type = this.getMessageType(this.props.navigation.getParam('itemSelected', 'NO-Item').type)
            var commentType = this.props.navigation.getParam('commentType', 'NO-Item')


            console.log("onSendClicked", type)
            var body = {
                agentID: this.state.agentID,
                blockID: this.state.blockID,
                loggedInUserID: this.state.loggedInUserID,
                referenceID: messageID,
                type: type,
                comment: this.state.comment.trim(),
            };
            new Promise(function (resolve, reject) {
                // WEBSYSTIC
                resolve(WebApi.multiPartRequest(WebConstant.messageComment, body))
            }).then((jsonRes1) => {
                this.props.screenProps.hideSpinner();
                var jsonRes = JSON.parse(jsonRes1)
                Keyboard.dismiss()
                if (jsonRes.status == 'success') {

                    this.onGetComments();

                } else {
                    if (jsonRes.message) {
                        CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                        });
                    }
                }
            }).catch((error) => {
                console.log("error ifdss ", JSON.stringify(error))
            });
        }

    }

    handleBackPress = () => {
        const apiType = this.props.navigation.getParam('callAPI', 'NO-Item');
        const archive = this.props.navigation.getParam('archive', 'NO-Item');

        if (apiType == WebConstant.all_message)
            var Url = WebConstant.messages_list_prifix + WebConstant.all_message + '0/' + archive
        else if (apiType == WebConstant.ticket_message)
            var Url = WebConstant.messages_list_prifix + WebConstant.ticket_message + archive
        else if (apiType == WebConstant.post_message)
            var Url = WebConstant.messages_list_prifix + WebConstant.post_message + archive
        else if (apiType == WebConstant.agent_message)
            var Url = WebConstant.messages_list_prifix + WebConstant.agent_message + archive

        this.props.navigation.state.params.onGetMessages(Url)
        this.props.navigation.goBack(null)
    };

    onGetComments = () => {
        this.props.screenProps.showSpinner();
        const messageID = this.props.navigation.getParam('itemSelected', 'NO-Item').referenceID;
        var type = this.getType(this.props.navigation.getParam('itemSelected', 'NO-Item').type)

        var Url = WebConstant.comment_list_prifix + messageID + "/" + type

        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            this.props.screenProps.hideSpinner();

            var jsonRes = JSON.parse(jsonRes1)

            if (jsonRes.status == 'success') {
                var apiDataResponse = Array.isArray(jsonRes.data) ? jsonRes.data : [];
                var comments = [];

                for (var i = 0; i < apiDataResponse.length; i++) {
                    comments.push({
                        "comment_ID": apiDataResponse[i].comment_ID,
                        "reference_ID": apiDataResponse[i].reference_ID,
                        "processing_reference": apiDataResponse[i].processing_reference,
                        "ticket_comment": apiDataResponse[i].ticket_comment,
                        "comment_timestamp": apiDataResponse[i].comment_timestamp,
                        "comment_by": apiDataResponse[i].comment_by,
                        "publish_to_client": apiDataResponse[i].publish_to_client,
                        "comment_sub_type": apiDataResponse[i].comment_sub_type,
                        "User_Name": apiDataResponse[i].User_Name,
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
            console.log("error ifdss ", JSON.stringify(error))
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
        fontSize: 12,
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
        flex: .35,
        height: aspectRatio > 1.6 ? 35 : 45,
        justifyContent: 'center',
        marginRight: 10, marginTop: 10



    },


})