import React from 'react';
import * as Colors from '../../constants/Colors'
import AccountTabHeaderScreen from '../../components/AccountTabHeaderScreen';
import {Text, View, Button, StyleSheet,TouchableOpacity, ScrollView, Image, Switch} from 'react-native';
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Images from '../../constants/Image'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Fonts } from '../../constants/Fonts';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper'
import BillPayment from './Component/BillPayment';

const placeholder_terms = {
    label : 'Payment Terms',
    value : null,
    color : 'gray'
}
const placeholder_tax = {
    label : 'Tax is   (Excluded from amounts)',
    value : null,
    color : 'gray'
}


export default class ExpenseScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor (props) {
        super(props)
        this.bill_payment = null
    }
    state = {
        isReady : false,
        repeat_invoice : false,
        name : '',
        email : '',
        terms_arr : [
            {
                label : '(No Terms Security)',
                value : 0,
                color : 'black'
            },
            {
                label : 'Due pm receive',
                value : 1,
                color : 'black'
            },
            {
                label : 'Net 15 Days',
                value : 2,
                color : 'black'
            },
            {
                label : 'Net 30 Days',
                value : 3,
                color : 'black'
            },
            {
                label : 'Net 60 Days',
                value : 4,
                color : 'black'
            },
        ],
        tax_arr : [
            {
                label : 'Excluded from amount',
                value : 0,
                color : 'black'
            },
            {
                label : 'Included in amount',
                value : 1,
                color : 'black'
            },
            {
                label : 'Not applicable',
                value : 2,
                color : 'black'
            },
        ],
        vat : '',
        activeIdx : 0,
        invoice_date : '',
        repeat_util : '',
        reference : '',
        notes : '',
        address : '',
        phone : ''
    }
    proceed () {

    }
    onChangeInvoice () {
        this.setState({repeat_invoice : !this.state.repeat_invoice})
    }
    componentDidMount() {
        global.invoice_arr = []
    }

    onChangeState () {
        this.bill_payment.onChangeState()
    }

    render() {
        return (
            <View style={styles.container}>
                <AccountTabHeaderScreen headerTitle="Accounts" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></AccountTabHeaderScreen>
                <View style={{flex : 1}}>
                    <BillPayment ref={(ref) => this.bill_payment = ref} navigation={this.props.navigation}></BillPayment>
                    <View style={{marginTop : 45 * metrics}}></View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    top_setting : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1, 
        borderRadius : 10 * metrics,
        flexDirection : 'row',
        padding : 7 * metrics,
        borderColor : Colors.dark_gray,
        alignItems : 'center',
        marginTop : 20 * metrics
    },
    setting_item : {
        flex : 0.13,
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'center'
    },
    item_img : {
        width : 30 * metrics, height : 30 * metrics
    },
    item_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 11 * metrics,
        textAlign : 'center',
        color : Colors.gray_color,
        marginTop : 5 * metrics
    },
    right_setting : {
        flex : 0.5,
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
        marginLeft : 5 * metrics
    },
    right_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 13 * metrics,
    },
    customer : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 10 * metrics
    },
    payment_terms : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        marginTop : 15 * metrics,
        flexDirection : 'column',
    },
    date : {
        width : '90%',
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row'
    },
    date_item : {
        flex : 0.45,
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        flexDirection : 'row',
        padding : 10 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        minHeight : 50 * metrics
    },
    vat : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 55 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center'
    },
    add_product : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center'
    },
    payment_detail : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 12 * metrics,
        alignItems : 'flex-start',
        borderRadius : 10 * metrics
    },
    detail_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        marginBottom : 15 * metrics
    },
    detail_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
        color : 'black',
        marginBottom : 8 * metrics
    },
    plan_setting : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 10 * metrics,
        alignItems : 'flex-start',
        backgroundColor : "#fbf6f6"
    },
    check_box : {
        flexDirection : 'row',
        width : '100%',
        alignSelf : 'center'
    },
    plan_payment : {
        flex : 0.45,
        borderRadius : 10 * metrics,
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        justifyContent : 'flex-end',
        minHeight : 30 * metrics
    },
    plan_payment_term : {
        fontSize : 12 * metrics,
        fontFamily : Fonts.adobe_clean,
        width : '100%',
        borderBottomWidth : 1,
        borderColor : Colors.gray_color,
        flexDirection : 'row'
    },
    plan_item : {
        marginTop :15 * metrics,
        flexDirection : 'row',
        width : '90%',
        alignSelf : 'center',
    },


    pay_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 16 * metrics,
        color : 'white'
    },
    pay_btn : {
        width : '90%', 
        borderWidth : 1, 
        borderRadius : 30 * metrics, 
        height : 45 * metrics, 
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.red_color
    },
    product_item : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        minHeight : 120 * metrics,
        marginTop : 15 * metrics,
        borderColor : Colors.dark_gray,
        padding : 20 * metrics
    },
    product_item_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : Colors.dark_gray
    }
})