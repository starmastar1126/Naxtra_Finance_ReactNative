import React from 'react';
import PropTypes from 'prop-types'
import {Text, View, Button,StyleSheet, TouchableOpacity, Platform, ScrollView} from 'react-native';
import WebView from 'react-native-webview';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import AccountTabHeaderScreen from '../../components/AccountTabHeaderScreen';
import { Fonts } from '../../constants/Fonts';
import { changeNumber } from '../../utils/utils';
import Dashboard from './Component/Dashboard'


export default class ReportScreen extends React.Component {
    static navigationOptions = {
        title: 'Link'
    };
    constructor (props) {
        super(props)
        this.state = {
            isTab_selected : 0,
            profit_amount : 2589.54,
            income_amount : 15712.85,
            expenses_amount : 12847.75
        }
    }
    gotoSales () {
        this.props.gotoOthertab('Sales')
    }
    gotoBillPayment () {
        this.props.gotoOthertab('Expenses')
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                <AccountTabHeaderScreen headerTitle="Accounts" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></AccountTabHeaderScreen>
                <View style={styles.tab_body}>
                    <TouchableOpacity style={styles.tab_item} onPress={() => this.setState({isTab_selected : 0})}>
                        <Text style={this.state.isTab_selected == 0 ? styles.tab_active_text : styles.tab_text}>Dashboard</Text>
                        <View style={this.state.isTab_selected == 0 ? styles.active_line : styles.line}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab_item} onPress={() => this.setState({isTab_selected : 1})}>
                        <Text style={this.state.isTab_selected == 1 ? styles.tab_active_text : styles.tab_text}>Activity</Text>
                        <View style={this.state.isTab_selected == 1 ? styles.active_line : styles.line}></View>
                    </TouchableOpacity>
                </View>
                <View style={{flex : 1}}>
                    <ScrollView style={{flex : 1, marginBottom : 60 * metrics}}>
                        {
                            this.state.isTab_selected == 0 ?
                            <Dashboard navigation={this.props.navigation} gotoSendInvoice={() => this.gotoSales()} gotoBill={() => this.gotoBillPayment()}></Dashboard>
                            :
                            <View navigation={this.props.navigation}></View>
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
ReportScreen.propType = {
    gotoOthertab : PropTypes.func,
}
const styles = StyleSheet.create({
    tab_body : {
        width : '100%',
        height : 55 * metrics,
        backgroundColor : 'white',
        borderBottomWidth : 1,
        borderBottomColor : Colors.white_gray_color,
        flexDirection : 'row',
    },
    tab_item : {
        flex : 0.5,
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'column'
    },
    tab_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.gray_color
    },
    tab_active_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.main_color
    },
    line : {
        width : 30 * metrics ,height : 2,marginTop : 7 * metrics, backgroundColor : 'transparent', 
    },
    active_line : {
        width : 30 * metrics ,height : 2,marginTop : 7 * metrics,backgroundColor : Colors.main_color
    },
    profit : {
        width : '90%', 
        borderWidth : 1, 
        borderRadius : 8 * metrics, 
        minHeight : 200 * metrics, 
        alignSelf : 'center',
        borderColor : Colors.gray_color,
        elevation : Platform.OS == 'android' ? 0.8 : 0.5,
        flexDirection : 'column',
        paddingTop: 20 * metrics,
        paddingBottom : 20 * metrics,
        backgroundColor : 'white'
    },
    profit_title : {
        flexDirection : 'row',
        width : '85%',
        alignSelf : 'center'
    },
    profit_sub_title : {
        flexDirection : 'row',
        width : '85%',
        alignSelf : 'center',
        marginTop : 10 * metrics
    },
    profit_graphic : {
        flexDirection : 'row',
        width : '85%',
        alignSelf : 'center',
        marginTop : 20 * metrics
    },
    profit_income : {
        flex : 0.7,
        height : 30 * metrics,
        backgroundColor : '#6cf11570'
    },
    profit_expenses : {
        flex : 0.5,
        height : 30 * metrics,
        backgroundColor : '#f62a2a70'
    },
    account_balance : {
        width : '90%',
        minHeight : 300 * metrics,
        alignSelf : 'center',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        borderRadius : 8 * metrics,
        marginTop : 20 * metrics,
        backgroundColor : 'white',
        elevation : Platform.OS == 'android' ? 0.8 : 0.5,
    },
    account_balance_title : {
        borderBottomColor : Colors.gray_color, borderBottomWidth : 1, width : '90%', alignSelf : 'center', minHeight : 50 * metrics, justifyContent : 'center'
    },
    account_balance_bank : {
        borderBottomColor : Colors.gray_color, 
        borderBottomWidth : 1, 
        width : '90%', 
        alignSelf : 'center', 
        minHeight : 80 * metrics, 
        justifyContent : 'center',
        flexDirection : 'row',
        alignItems : 'center'
    },
    customer_invoice : {
        borderBottomColor : Colors.gray_color, 
        borderBottomWidth : 1, 
        borderTopColor : Colors.gray_color, 
        borderTopWidth : 1, 
        width : '90%', 
        alignSelf : 'center', 
        minHeight : 55 * metrics, 
        justifyContent : 'center',
        flexDirection : 'row',
        alignItems : 'center',
        marginTop : 10 * metrics
    },
    other_body : {
        borderBottomColor : Colors.gray_color, 
        borderBottomWidth : 1, 
        width : '90%', 
        alignSelf : 'center', 
        minHeight : 50 * metrics, 
        justifyContent : 'center',
        flexDirection : 'row',
        alignItems : 'center',
    },
    account_btn : {
        flexDirection : 'row',
        minHeight : 60 * metrics,
        marginTop : 20 * metrics
    },
    btn : {
        width : '90%', 
        alignSelf : 'center',
        height : 45 * metrics, 
        borderRadius : 8 * metrics, 
        justifyContent : 'center', 
        alignItems : 'center'
    },
    bottom : {
        flexDirection : 'row',
        alignItems : 'center',
        width : '90%',
        alignSelf : 'center',
        height : 100 * metrics
    },
    bottom_btn : {
        width : '90%', 
        alignSelf : 'center',
        borderRadius : 8 * metrics, 
        borderWidth : 1, 
        height : 70 * metrics, 
        borderColor : Colors.dark_gray,
        justifyContent : 'center'
    }
})