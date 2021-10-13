import React from 'react'
import { Platform, Text,TextInput,View,Dimensions,TouchableOpacity } from "react-native";
import {Colors,Styles,Images} from 'Res'

const AuthTextInput=props=>{
    const txtInputContStyle = props.txtInputContStyle
    const placeholder = props.placeholder
    const inputValue = (props.value)?props.value:""
    return(
            <View style={[Styles.floatingTxtCnt,{height:55,flexDirection:'row',justifyContent:'space-between',},txtInputContStyle]}>
                        
                            
                            <TextInput 
                            ref={(ref)=>{props.refs(ref)}}
                            style={[ Styles.floatingTxtInp]}
                            placeholderTextColor={Colors.light_black}
                            placeholder={placeholder}
                            selectionColor={Colors.black}
                            secureTextEntry={props.secureTextEntry}
                            autoCorrect={false}
                            autoCapitalize ='none'
                            autoComplete={"off"}
                            underlineColorAndroid='transparent'                          
                            blurOnSubmit={false}
                            {...props}
                            />  
                        
                       
                </View>
            
    )
}



export default AuthTextInput;