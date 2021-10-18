import React, { useState ,useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
const { width, height } = Dimensions.get('window');
let aspectRatio = 2;
import { Colors, Fonts, Images, Strings, Styles } from "Res";

const MessageHeader = props => {


    const [isAllSelect, setAllSelect] = useState(true)
    const [isAgentSelect, setAgentSelect] = useState(false)
    const [isTicketSelect, setTicketSelect] = useState(false)
    const [isPostSelect, setPostSelect] = useState(false)
    const [height,setHeight] = useState(Dimensions.get('window').height)
    const [width,setWidth] = useState(Dimensions.get('window').width)

    btnAllClicked = () => {
        setAllSelect(true);
        setAgentSelect(false);
        setTicketSelect(false);
        setPostSelect(false);
        props.btnAllSelectClicked();
    }

    btnAgentClicked = () => {
        setAllSelect(false);
        setAgentSelect(true);
        setTicketSelect(false);
        setPostSelect(false);
        props.btnAgentSelectClicked();
    }

    btnTicketClicked = () => {
        setAllSelect(false);
        setAgentSelect(false);
        setTicketSelect(true);
        setPostSelect(false);
        props.btnTicketSelectClicked();
    }

    btnPostClicked = () => {
        setAllSelect(false);
        setAgentSelect(false);
        setTicketSelect(false);
        setPostSelect(true);
        props.btnPostSelectClicked();
    }

    useEffect(() => {
        Dimensions.addEventListener('change',()=>{
            setHeight(Dimensions.get('window').height)
            setWidth(Dimensions.get('window').width)
            // aspectRatio=Dimensions.get('window').height/Dimensions.get('window').width
           })
        
    }, [])

    return (
        <View style={{
            width: width*0.9, marginTop: 20, flexDirection: 'row', height: aspectRatio>1.6?40:60, borderRadius: 10,
            borderWidth: 1.5, borderColor: Colors.inptxt_grey, overflow: 'hidden',
        }}>

            <TouchableOpacity style={{
                width:'15%',
                fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio>1.6?10:20, color: 'white', height: aspectRatio>1.6?40:60, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isAllSelect ? props.colorTheme.buttonBgColour : 'white',
            }}
                onPress={this.btnAllClicked}
            >
                <Text style={isAllSelect ? [MsgStyles.filledTextStyle ,{color:'white'}]: [MsgStyles.textStyle,{color:props.colorTheme.textColour}]}>All</Text>
            </TouchableOpacity>

            <View style={{ width: 1, height: aspectRatio>1.6?40:60, backgroundColor: Colors.inptxt_grey, }} />

            <TouchableOpacity style={{
                width:'37%',
                fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio>1.6?10:20, color: 'white', height: aspectRatio>1.6?40:60, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isAgentSelect ? props.colorTheme.buttonBgColour : 'white',
            }}
                onPress={this.btnAgentClicked}
            >
                <Text style={isAgentSelect ? [MsgStyles.filledTextStyle ,{color:'white'}] : [MsgStyles.textStyle,{color:props.colorTheme.textColour}]}>Agent Messages</Text>
            </TouchableOpacity>
            <View style={{ width: 1, height: aspectRatio>1.6?40:60, backgroundColor: Colors.inptxt_grey, }} />

            <TouchableOpacity style={{
                width:'25%',
                fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio>1.6?10:20, color: 'white', height: aspectRatio>1.6?40:60, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isPostSelect ? props.colorTheme.buttonBgColour : 'white',

            }}
                onPress={this.btnPostClicked}
            >
                <Text style={isPostSelect ? [MsgStyles.filledTextStyle ,{color:'white'}] : [MsgStyles.textStyle,{color:props.colorTheme.textColour}]}>Post</Text>
            </TouchableOpacity>
            <View style={{ width: 1, height: 40, backgroundColor: Colors.inptxt_grey, }} />

            <TouchableOpacity style={{
                width:'23%',
                fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio>1.6?10:20, color: 'white', height: aspectRatio>1.6?40:60, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isTicketSelect ? props.colorTheme.buttonBgColour : 'white',
            }}
                onPress={this.btnTicketClicked}
            >
                <Text style={isTicketSelect ? [MsgStyles.filledTextStyle ,{color:'white'}] : [MsgStyles.textStyle,{color:props.colorTheme.textColour}]}>Tickets</Text>
            </TouchableOpacity>
        </View>
    );

}

export default MessageHeader;

const MsgStyles = StyleSheet.create({


    touchableOpacityStyle: {
        flexDirection: 'row',
        
        fontFamily: Fonts.SFProDisplayBold,
        fontSize: aspectRatio>1.6?10:20,
        color: 'white',
        justifyContent: "center",
        alignItems: 'center'
    },
    filledTouchableOpacityStyle: {
        flexDirection: 'row',
       
        fontFamily: Fonts.SFProDisplayBold,
        fontSize: aspectRatio>1.6?10:20,
        color: 'white',
        backgroundColor: Colors.btn_color_orange,
        justifyContent: "center",
        alignItems: 'center'
    },
    textStyle: {
        fontSize: aspectRatio>1.6?16:30,
        color: "#B4B4B4",
        justifyContent: "center",
        alignItems: 'center'
    },
    filledTextStyle: {
        fontSize: aspectRatio>1.6?16:30,
        color: 'white',

        justifyContent: "center",
        alignItems: 'center'
    },
    verticalTextStyle: {

        height: aspectRatio>1.6?20:40,

        padding: 2,
        marginTop: 40,
        fontSize: 12,
        color: 'white',

        borderColor: '#6B6B6B',
        borderRadius: aspectRatio>1.6?10:20,
        backgroundColor: '#6B6B6B',
        transform: [{ rotate: '270deg' }],
    },




})