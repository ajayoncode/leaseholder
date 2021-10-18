import React,{Component} from 'react';
import {Modal,ActivityIndicator,View,StyleSheet} from 'react-native';
// custom class declares
import {Colors,Images,Styles,Strings} from 'Res';

class Spinner extends Component{
    constructor(props){
        super(props)
        this.state={
            // loaderColor : props.screenProps.loaderColor?props.screenProps.loaderColor:'blue'
        }

    }

    componentDidMount(){

        // let objTest = this.props.screenProps.colorTheme();

        // console.log("Color theme "+objTest);




    }

    render(){
        
        const {visible,color,screenProps} = this.props
        return(
            <Modal visible = {visible} animationType={"none"} transparent = {true} onRequestClose={()=>{}}  supportedOrientations={['portrait', 'landscape']}            >
                <View style = {[{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:Colors.background_light_black_color}]}>
                    <View style = {SpinnerStyle.loading_cont}>
                        <ActivityIndicator animating = {visible} size = {"large"} color = {color?color:Colors.white}/>
                    </View>
                </View>
            </Modal>
        )
    }
}

const SpinnerStyle = StyleSheet.create({
    loading_cont:{
        width:80,
        height:80,
        backgroundColor: '#A6ABAB',
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 10,
    }
})

export default Spinner