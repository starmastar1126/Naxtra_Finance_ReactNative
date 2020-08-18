import React from 'react';
import {Text, View, Button,StyleSheet, TouchableOpacity, Platform, ScrollView, Image, Switch} from 'react-native';
import * as Images from '../../constants/Image'
import { SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import AccountTabHeaderScreen from '../../components/AccountTabHeaderScreen';
import { Fonts } from '../../constants/Fonts';
import CreateInovoice from './Component/CreateInovoice'

export default class SaleScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    constructor (props) {
        super(props)
        this.create_invoice = null
    }

    onChangeState () {
        console.log('ahaha')
        this.create_invoice.onChangeState()
    }
    
    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                <AccountTabHeaderScreen headerTitle="Accounts" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></AccountTabHeaderScreen>
                <View style={{flex : 1}}>
                    <CreateInovoice ref={(ref) => this.create_invoice = ref} navigation={this.props.navigation}></CreateInovoice>
                    <View style={{marginTop : 45 * metrics}}></View>
                </View>
            </SafeAreaView>
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
    }
})