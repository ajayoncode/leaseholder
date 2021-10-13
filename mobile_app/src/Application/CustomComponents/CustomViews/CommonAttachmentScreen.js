import React from 'react'
import { Text, View, TouchableOpacity, Dimensions, FlatList, Linking, Modal, StyleSheet } from 'react-native'
import { Colors, Strings } from "Res";
import WebConstant from "../../../Application/NetworkController/WebConstant";

const { height, width } = Dimensions.get('window');
let aspectRatio = height / width;

class CommonAttachmentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        }
    }
    componentDidMount=()=>{
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
    }

    onCloseModalHandler = () => {
        this.props.attachmentModalClose(false)
    }

    onViewDoc = (item) => {
        Linking.openURL(WebConstant.SERVER_CORE + item.file_location)
    }

    render() {
        const { visible, dataArray } = this.props;
        return (
            <Modal visible={visible} transparent={true} onRequestClose={() => { }}>
                <View style={{ width: this.state.width, height: this.state.height, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.8)Í" }}>
                    <View style={{ padding: 8 }} >
                        <Text style={[homeStyles.attachementText, { alignSelf: "center", marginTop: 50 }]}>
                            {Strings.attachement}
                        </Text>
                        <FlatList data={dataArray.attachments} renderItem={(item, index) => this.onRenderDataRowView(item, index)} bounces={false} />
                        <TouchableOpacity onPress={() => this.onCloseModalHandler()} style={{ height: 30, width: 30, backgroundColor: '#fcfa17', justifyContent: "center", alignItems: "center", position: "absolute", right: 15, top: 50, borderRadius: 50 }}>
                            <Text style={homeStyles.closeButton}> X </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    onRenderDataRowView = ({ item, index }) => {
        return (
            <View style={{ width: this.state.width - 20, backgroundColor: Colors.white, marginTop: 5, borderRadius: 8, padding: 12 }}>
                <View style={{ flexDirection: "row", height: 50 }}>
                    <Text style={homeStyles.attachementText}> {Strings.attachmentDescription}  </Text>
                    <TouchableOpacity onPress={() => this.onViewDoc(item)} style={[homeStyles.viewDocumentStyle, { backgroundColor: '#fcfa17' }]}>
                        <Text style={[homeStyles.viewText, { color: '#060000' }]}>{Strings.view}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: this.state.width, backgroundColor: "#DDDD" }} />
                <Text style={homeStyles.documentDesc}>
                    {item.Document_Description}
                </Text>
            </View>
        )
    }
}

export default CommonAttachmentScreen


const homeStyles = StyleSheet.create({
    viewDocumentStyle: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 5, // Android    
        borderRadius: aspectRatio > 1.6 ? 20 : 30,
        padding: 5,
        alignItems: 'center',
        flex: 1,
        height: aspectRatio > 1.6 ? 35 : 45,
        justifyContent: 'center',
        position: "absolute",
        top: 0,
        right: 0,
        paddingHorizontal: 20
    },
    attachementText: {
        fontSize: aspectRatio > 1.6 ? 18 : 36,
        fontWeight: "bold"
    },
    closeButton: {
        fontSize: aspectRatio > 1.6 ? 14 : 20,
        fontWeight: "bold"
    },
    viewText: {
        color: Colors.white,
        fontSize: aspectRatio > 1.6 ? 14 : 28
    },
    documentDesc: {
        fontSize: aspectRatio > 1.6 ? 16 : 32
    }
})