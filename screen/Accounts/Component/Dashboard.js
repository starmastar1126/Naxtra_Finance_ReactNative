import React from 'react';
import {Text, View, Button,StyleSheet, TouchableOpacity, Platform, ScrollView} from 'react-native';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../../constants/GlobalStyle'
import * as Colors from '../../../constants/Colors'
import { Fonts } from '../../../constants/Fonts';
import { changeNumber } from '../../../utils/utils';
import PropTypes from 'prop-types'
import TransactionService from '../../../service/TransactionService';


export default class Dashboard extends React.Component {
    static navigationOptions = {
        title: 'Link'
    };
    constructor (props) {
        super(props)
        this.state = {
            isTab_selected : 0,
            profit_amount : 0,
            income_amount : 0,
            expenses_amount : 0,
            current_balance : 0
        }
    }

    sendInvoice () {
        this.props.gotoSendInvoice()
    }
    billPayment () {
        this.props.gotoBill()
    }
    componentDidMount () {
        TransactionService.getAllBalance(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({current_balance : data.response})
            }
        }).catch(error => {

        })
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                <View style={{flex : 1}}>
                    <View style={{marginTop : 20 * metrics}}></View>
                    <View style={styles.profit}>
                        <View style={styles.profit_title}>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, flex : 0.5}}>PROFIT AND LOSS</Text>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, flex : 0.5, textAlign : 'center'}}>£ {changeNumber(Number(this.state.profit_amount).toFixed(2)).toString()}</Text>
                        </View>
                        <View style={styles.profit_sub_title}>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 15 * metrics, flex : 0.5, color : Colors.dark_gray}}>January 2020</Text>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, flex : 0.5, textAlign : 'center', color : 'green'}}>Profit</Text>
                        </View>
                        <View style={styles.profit_graphic}>
                            <View style={styles.profit_income}></View>
                            <View style={{flexDirection : 'column', alignItems : 'center',flex : 0.3, justifyContent :'center'}}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 * metrics, color : 'green'}}>N/A</Text>
                                {/* £ {changeNumber(Number(this.state.income_amount).toFixed(2)).toString()} */}
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 12 * metrics, color : 'green'}}>INCOME</Text>
                            </View>
                        </View>
                        <View style={styles.profit_graphic}>
                            <View style={styles.profit_expenses}></View>
                            <View style={{flexDirection : 'column', alignItems : 'center',flex : 0.5, justifyContent :'center'}}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 * metrics, color : '#e60423'}}>N/A</Text>
                                {/* £ {changeNumber(Number(this.state.expenses_amount).toFixed(2)).toString()} */}
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 12 * metrics, color : '#e60423'}}>EXPENSES</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.account_balance}>
                        <View style={styles.account_balance_title}>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color: Colors.main_blue_color}}>ACCOUNT BALANCES</Text>
                        </View>
                        <View style={styles.account_balance_bank}>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left', color : Colors.main_blue_color}}>Cash In Bank</Text>
                            <TouchableOpacity style={{flex : 0.5}} onPress={() => {
                                global.tabIdx = 1
                                this.props.navigation.navigate('TabScreen', {refresh : true})
                            }}>
                                <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'right', color : Colors.main_blue_color}}>£ {changeNumber(Number(this.state.current_balance).toFixed(2)).toString()}</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.customer_invoice}>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left', color : 'green'}}>Customer Invoices</Text>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'right', color : 'green'}}>N/A</Text>
                            {/* £ {changeNumber(Number("0").toFixed(2)).toString()} */}
                        </View>
                        <View style={styles.other_body}>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left', color : Colors.dark_red_color}}>Bills to Pay</Text>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'right', color : Colors.dark_red_color}}>N/A</Text>
                            {/* £ {changeNumber(Number("0").toFixed(2)).toString()} */}
                        </View>
                        <View style={styles.other_body}>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left', color : Colors.dark_red_color}}>Expenses to settle</Text>
                            {/* £ {changeNumber(Number("0").toFixed(2)).toString()} */}
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'right', color : Colors.dark_red_color}}>N/A</Text>
                        </View>
                        <View style={styles.other_body}>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left', color : Colors.dark_red_color}}>Tax VAT to Pay</Text>
                            <Text style={{flex : 0.5, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'right', color : Colors.dark_red_color}}>N/A</Text>
                            {/* £ {changeNumber(Number("0").toFixed(2)).toString()} */}
                        </View>
                        <View style={styles.account_btn}>
                            <View style={{flex : 0.5}}>
                                <TouchableOpacity style={[styles.btn, { backgroundColor : Colors.white_green_color}]} onPress={() => this.sendInvoice()}>
                                    <Text>Send Invoice</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex : 0.5}}>
                                <TouchableOpacity style={[styles.btn, {backgroundColor : Colors.white_red_color}]} onPress={() => this.billPayment()}>
                                    <Text>Bill Payment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <View style={{flex : 0.25}}>
                            <TouchableOpacity style={[styles.bottom_btn, { backgroundColor : Colors.white_green_color }]}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 13 * metrics, textAlign : 'center', color : 'green'}}>Aged Receivables</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex : 0.25}}>
                            <TouchableOpacity style={[styles.bottom_btn, { backgroundColor : Colors.white_red_color }]}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 13 * metrics, textAlign : 'center', color : 'red'}}>Aged Payables</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex : 0.25}}>
                            <TouchableOpacity style={[styles.bottom_btn, { backgroundColor : Colors.white_gray_color }]}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 13 * metrics, textAlign : 'center', color : 'black'}}>Cash flow</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex : 0.25}}>
                            <TouchableOpacity style={[styles.bottom_btn, { backgroundColor : Colors.white_purple_color }]}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 13 * metrics, textAlign : 'center', color : 'black'}}>Analytics Reports</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
Dashboard.propType = {
    gotoSendInvoice : PropTypes.func,
    gotoBill : PropTypes.func
}
const styles = StyleSheet.create({
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