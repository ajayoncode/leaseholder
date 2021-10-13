import React from 'react'
import { Text, View, StyleSheet, Platform,TouchableOpacity,Dimensions ,NativeModules} from 'react-native'
import {Picker} from '@react-native-community/picker'

const window=Dimensions.get('window');
const { width, height } = Dimensions.get('window');
const aspectRatio = height/width;
// var PickerItem = Picker.Item;


const CustomPicker = (props) => {
    const { isVisible,androidPickerValue,imageName,cancelButtonPress,selectedValue,onChangeSelectedValue,arrOfPicker,requestButtonPress } = props

        const srvItems = []; 
        for (var i = 0; i < arrOfPicker.length; i++) 
        {   
            s = arrOfPicker[i]; 
            srvItems.push(<Picker.Item key={i} value={i} label={s} />); 

        }


    if (isVisible && Platform.OS=='ios' ) {
      return(

        <View style={styles.noLoadingStyle}>
        { 
            (isVisible) 
            ?
              <View style={styles.loadingStyle}>
              
                <View style={{justifyContent: 'space-between',flexDirection:'row',marginTop:15,backgroundColor:'white'}}>

                    <TouchableOpacity onPress={() => cancelButtonPress('valawdfdsue')} style={{marginLeft:10}}>
                      <Text style={{color:'#F2A03D',fontSize:aspectRatio>1.6?15:30,}}>Cancel</Text>                  
                    </TouchableOpacity>

                    <Text style={{color:'#435963',fontSize:aspectRatio>1.6?16:32,}}></Text>

                    <TouchableOpacity onPress={() => requestButtonPress()} style={{marginRight:10}}>
                      <Text style={{color:'#F2A03D',fontSize:aspectRatio>1.6?15:30,}}>Done</Text>                                      
                    </TouchableOpacity>


                </View>

                <View style={{width:window.width,height:1,backgroundColor:'#ededed',marginTop:15}} />

                <Picker style={{ width: window.width,backgroundColor:'white',justifyContent:'center' }}
                        itemStyle={{fontSize:aspectRatio>1.6?20:40}}
                        selectedValue={selectedValue}
                        onValueChange={ (arrOfPicker) => onChangeSelectedValue(arrOfPicker) }>
                    {srvItems}
                </Picker>


              </View>
          :
          <View/> 
      }
      </View>
  
      )

    }else if(isVisible && Platform.OS=='android'){
      
          return(

            <View></View>

          )
          
     
    }
    else{
      return(
        <View>
        </View>
    )
    }

    
}

export default CustomPicker

const styles =StyleSheet.create({
  loadingStyle : {
    position: 'absolute',
    width: window.width,
    height: aspectRatio>1.6?300:400,
    marginTop:aspectRatio>1.6?window.height-400:window.height-510,
    backgroundColor:"white",
    shadowOpacity:0.5
  },
  noLoadingStyle : {
    position: 'absolute',
    width: window.width,
    height: window.height,
    

  }
})