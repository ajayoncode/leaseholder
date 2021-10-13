import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image, StyleSheet, Linking } from 'react-native';
import { Colors, Fonts, Images, Strings, Styles, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
const { width, height } = Dimensions.get('window');
let aspectRatio = height/width;

export default class CustomeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSettingsOpen: false,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height

        };
    }
    componentDidMount=()=>{
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
    }


    render() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.isDialogVisible}
                style={{ width: 400, height: 400 }}

                onRequestClose={() => {
                    //   Alert.alert('Modal has been closed.');
                }}>


                <View onPress={() => this.props.hideDialogOnOutsideClick()} style={{
                    width: this.state.width, height: this.state.height,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', flex: 1,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}>

                    <View style={{ height: this.state.height, flex: 1, }}>
                        <TouchableWithoutFeedback onPress={() => this.props.hideDialogOnOutsideClick()} style={{ flex: 1, height: this.state.height }}>
                            <Text style={{ height: this.state.height }}></Text>
                        </TouchableWithoutFeedback>

                    </View>

                    <View style={{
                        width: aspectRatio>1.6?280:400, height: aspectRatio>1.6?150:200, justifyContent: 'center',
                        alignContent: 'center', position: 'absolute', backgroundColor: Colors.white,
                        borderWidth: 1.5, borderRadius: aspectRatio>1.6?20:40, marginRight: 5, paddingEnd: 5, paddingStart: 15, marginLeft: 5, marginTop: 2
                    }}>

                        {
                            (this.props.addPostEnable) ?



                                <TouchableOpacity onPress={() => this.props.hideDialog("AddPost")}>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Image source={Images.ic_add_post} style={{ width: aspectRatio>1.6?25:40, height: aspectRatio>1.6?25:40, resizeMode: 'contain', }} />
                                        <Text style={MenuStype.textStyle}>Add new Post</Text>
                                    </View>

                                </TouchableOpacity>

                                :
                                null
                        }

                        {
                            (this.props.reportEnabled && (this.props.addPostEnable)) ?
                                <View style={{ backgroundColor: Colors.txt_gray, width: aspectRatio>1.6?280:400, height: .5, alignSelf: 'center', marginTop: 10, marginBottom: 10 }}></View>
                                :
                                null
                        }
                        {
                            (this.props.reportEnabled) ?
                                <TouchableOpacity onPress={() => this.props.hideDialog("ReportProblem")}>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Image source={Images.ic_report_problem} style={{ width: aspectRatio>1.6?25:40, height: aspectRatio>1.6?25:40, resizeMode: 'contain', }} />
                                        <Text style={MenuStype.textStyle}>{Strings.report_problem}</Text>
                                    </View>

                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                </View>
            </Modal>
        );
    }

    settingsOpen = () => {
        this.setState({ isSettingsOpen: !this.state.isSettingsOpen });
    }

}

const MenuStype = StyleSheet.create({
    textStyle: {
        fontSize: aspectRatio>1.6?16:32,
        color: "#000",
        marginLeft: 10,
        fontFamily: Fonts.SFProDisplayBold,
        justifyContent: "center",
        alignItems: 'center'
    },
    textStyleSimple: {
        fontSize: aspectRatio>1.6?14:28,
        color: "#000",
        marginLeft: 10,
        justifyContent: "center",
        alignItems: 'center'
    },

})
