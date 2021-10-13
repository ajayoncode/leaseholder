import { Dimensions, Platform, NativeModules } from 'react-native';
import Colors from './Colors';
import Fonts from './Fonts'
import { ScreenRatio } from '../Utility/ScaleRatio';
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
// custom variable uses
const window = Dimensions.get("window");
export default Styles = {

    TouchableOpacityStyle: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 5, // Android    
        marginTop: 25,
        borderRadius: 25,
        height: ScreenRatio(5.5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',

    },
    txtInpStyle: {
        flexDirection: 'row',
        flex: 1,
        height: 55,

        fontFamily: Fonts.SFProDisplayRegular,
        borderWidth: 1.5,
        borderColor: Colors.inptxt_grey,
        borderRadius: 25,
        overflow: 'hidden'
    },

    textStyle: {
        fontSize: ScreenRatio(2.3),
        fontFamily: Fonts.SFProDisplayBold,
        marginStart: 10,
        color: '#000'
    },

    btnTextStyle: {
        fontSize: ScreenRatio(3),
        color: 'white',
    }
    ,
    switchImageStyle: {
        width: (aspectRatio > 1.6) ? 50 : 80, height: (aspectRatio > 1.6) ? 30 : 45, resizeMode: 'contain'
    }


};
