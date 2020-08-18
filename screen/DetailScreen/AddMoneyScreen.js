/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,BackHandler, ActivityIndicator} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as ErrorMessage from '../../constants/ErrorMessage'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import RNPickerSelect from 'react-native-picker-select'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts'
import TransactionService from '../../service/TransactionService'
import { alertMessage } from '../../utils/utils'
//import RNPaypal from 'react-native-paypal-lib'
// import PayPal from 'react-native-paypal-gateway';
import Stripe from 'react-native-stripe-api'
import { Paypal_Client_ID,Credit_Card_ID } from '../../utils/keyInfo'

const placeholder = {
    label : 'Select currency',
    value : null,
    color : 'gray'
}


export default class AddMoneyScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        currency_arr : [
            {
                value : 0,
                label : 'GBP'
            },
            {
                value : 1,
                label : 'USD'
            },
            {
                value : 2,
                label : 'EUR'
            },
            {
                value : 3,
                label : 'RMB'
            }
        ],
        user_arr : [],
        account_arr : [],
        isReady : false,
        amount : '',
        message : '',
        currency_type : 0,
        activeIdx : 1,
        showModal : false,
        showTime :false,
        isDatePickerVisible : false,
        isTimePickerVisible : false,
        after_day : '',
        after_hour : '',
        isLoading : false,
        selectedUser : null,
        card_number : '',
        cvc : '',
        expiry : ''
    }

    checkReady = () => {
        if (this.state.amount != '' && this.state.currency_type != -1 && global.pay_type != undefined && global.pay_type != -1 && this.state.message != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    selectType = (value) => {
        if (value == null)
            return
        this.setState({currency_type : value}, () => {this.checkReady()})
    }

    proceed = async() => {
        if (!this.state.isReady) return

        if (global.pay_type == 0) {
            const apiKey = Credit_Card_ID;
            const client = new Stripe(apiKey);

            var card_number = global.card_number

            var month = ''
            var year = ''
            if (global.expiry.length == 0) {
                month =  ''
                year = ''
            } else {
                month =  global.expiry.split('/')[0]
                year = global.expiry.split('/')[1] 
            }

            var cvc = global.cvc

            var obj = {
                number : card_number,
                exp_month : month,
                exp_year : year,
                cvc : cvc
            }
            this.setState({isLoading : true})
            client.createToken(obj).then(res => {
                const obj = {
                    amount: Number(this.state.amount),
                    stripetoken: res.id
                };
                TransactionService.cardCharge(obj).then(result => {
                    var objs = {
                        amount : Number(this.state.amount),
                        reference : this.state.message
                    }
                    TransactionService.addMoney(objs, global.token).then(res => {
                        var data = res.data.result
                        if (data.success) {
                            this.props.navigation.navigate('TabScreen', {refresh : true})
                        } else {
                            if (data.message  == undefined) {
                                alertMessage(ErrorMessage.network_error)
                            } else
                                alertMessage(data.message)
                        }
                        this.setState({isLoading : false})
                    }).catch(error => {
                        this.setState({isLoading : false})
                    })
                }).catch(error => {
                    this.setState({isLoading : false})
                })
            }).catch(error => {
                this.setState({isLoading : false})
            });
            
        } else if (global.pay_type == 1) {
            this.setState({isLoading : true})
            var obj = {
                amount : Number(this.state.amount),
                reference : this.state.message
            }
            TransactionService.addMoney(obj, global.token).then(res => {
                var data = res.data.result
                console.log('add_money = ', data)
                if (data.success) {
                    this.props.navigation.navigate('TabScreen', {refresh : true})
                } else {
                    if (data.message == undefined) {
                        alertMessage(ErrorMessage.network_error)
                    } else
                        alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                console.log('error = ', error)
                this.setState({isLoading : false})
            })
        } else if (global.pay_type == 2) {
            var obj = {
                amount : Number(this.state.amount),
                reference : this.state.message
            }
            this.setState({isLoading : true})
            TransactionService.addMoney(obj, global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.props.navigation.navigate('TabScreen', {refresh : true})
                } else {
                    if (data.message  == undefined) {
                        alertMessage(ErrorMessage.network_error)
                    } else
                        alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
            
            // PayPal.initialize(PayPal.NO_NETWORK, Paypal_Client_ID);

            // PayPal.pay({
            //     price: Number(this.state.amount).toFixed(2),
            //     currency: this.state.currency_arr[this.state.currency_type].label,
            //     description: 'Add Money',
            // }).then(confirm => {
            //     var obj = {
            //         amount : Number(this.state.amount),
            //         reference : this.state.message
            //     }
            //     this.setState({isLoading : true})
            //     TransactionService.addMoney(obj, global.token).then(res => {
            //         var data = res.data.result
            //         if (data.success) {
            //             this.props.navigation.navigate('TabScreen', {refresh : true})
            //         } else {
            //             if (data == undefined) {
            //                 alertMessage(ErrorMessage.network_error)
            //             } else
            //                 alertMessage(data.message)
            //         }
            //         this.setState({isLoading : false})
            //     }).catch(error => {
            //         this.setState({isLoading : false})
            //     })
            // })
            // .catch(error => console.log(error));
        }
    }

    constructor(props) {
        super (props)
        this.TextComponentRef = React.createRef()
    }
    setMoney = (value) => {
        this.TextComponentRef.current.onChangeText(value)
    }
    onChangeText = (text) => {
        this.setState({amount : text},() => {this.checkReady()})
    }
    onChangeMessage = (message) => {
        this.setState({message : message},() => {this.checkReady()})
    }

    gotoAddBeneficiary = () => {
        global.isManager = false
        this.props.navigation.navigate('AddBeneficiaryScreen')
    }

    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    setIdx = (item) => {
        this.setState({selectedUser : item})
    }

    componentDidMount() {
        global.exit = 0
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Add Money"  goBack ={() => {
                        this.props.navigation.goBack()
                    }}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={styles.body}>
                            <View style={{height : 80 * metrics}}></View>
                            <View style={styles.pay_body}>
                                <Text style={styles.pay_text}>Debit From</Text>
                                <View style={{flex : 0.15}}></View>
                                <View style={global.pay_type != -1 ? styles.select_body : styles.normal_body}>
                                    <TouchableOpacity style={styles.select_button} onPress={() => this.props.navigation.navigate('SelectMoneyScreen')}>
                                        <View style={{flex : 0.20 ,justifyContent : 'center'}}>
                                            {
                                                global.pay_type != 0 && global.pay_type != 1 && global.pay_type != 2 && 
                                                <View style={styles.avatar}>
                                                    <MaterialCommunityIcons name="information-outline" style={{fontFamily : Fonts.adobe_clean,fontSize : 40 * metrics, alignSelf : 'center', color : Colors.gray_color}}></MaterialCommunityIcons>
                                                </View>
                                            }
                                            {
                                                global.pay_type == 0 &&
                                                <View style={styles.avatar}>
                                                    <MaterialCommunityIcons name="credit-card" style={{fontFamily : Fonts.adobe_clean,fontSize : 40 * metrics, alignSelf : 'center', color : Colors.main_color}}></MaterialCommunityIcons>
                                                </View>
                                            }
                                            {
                                                global.pay_type == 1 &&
                                                <View style={styles.avatar}>
                                                    <MaterialCommunityIcons name="bank" style={{fontFamily : Fonts.adobe_clean,fontSize : 40 * metrics, alignSelf : 'center', color : Colors.main_color}}></MaterialCommunityIcons>
                                                </View> 
                                            }
                                            {
                                                global.pay_type == 2 &&
                                                <View style={styles.avatar}>
                                                    <MaterialCommunityIcons name="paypal" style={{fontFamily : Fonts.adobe_clean,fontSize : 40 * metrics, alignSelf : 'center', color : Colors.main_color}}></MaterialCommunityIcons>
                                                </View> 
                                            }
                                        </View>
                                        {
                                            global.pay_type != 0 && global.pay_type != 1 && global.pay_type != 2 &&
                                            <View style={styles.user_body}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : '#000' , fontWeight : '500'}}>Select Type</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.gray_color}}>.....</Text>
                                            </View>    
                                        }
                                        {
                                            global.pay_type == 0 && //card
                                            <View style={styles.user_body}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : '#000' , fontWeight : '500'}}>XXXX XXXX XXXX {global.card_number != undefined ? global.card_number.split(' ')[3] : 'XXXX'}</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.gray_color}}>Debit Card</Text>
                                            </View>    
                                        }
                                        {
                                            global.pay_type == 1 && //banking 
                                            <View style={styles.user_body}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : '#000' , fontWeight : '500'}}>Internet Banking</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.gray_color}}>Pay from your bank</Text>
                                            </View>    
                                        }
                                        {
                                            global.pay_type == 2 && // paypal
                                            <View style={styles.user_body}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : '#000' , fontWeight : '500'}}>Paypal</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.gray_color}}>Pay from Paypal</Text>
                                            </View>    
                                        }
                                        <View style={{flex : 0.2, justifyContent : 'center',alignItems :'flex-end'}}>
                                            <MaterialIcons name="play-arrow" size={18 * metrics}></MaterialIcons>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{marginTop : 15 * metrics}}></View>
                            <View>
                                <View style={!this.state.isReady ? global_style.selector_normal : global_style.selector_main}>
                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color,marginTop : 10 * metrics,marginBottom : 5 * metrics}}>Currency</Text>
                                    <RNPickerSelect
                                        onValueChange={(value) => this.selectType(value)}
                                        items={this.state.currency_arr}
                                        placeholderTextColor={'#000'}
                                        placeholder = {placeholder}
                                        value={this.state.currency_arr[this.state.currency_type].value}
                                        textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                    />
                                </View>
                                <TextComponent
                                    textPlaceHolder = {"Amount"}
                                    textValue={this.state.amount}
                                    textType="number"
                                    ready = {this.state.isReady}
                                    ref={this.TextComponentRef}
                                    onChangeText = {(value) => this.onChangeText(value)}
                                > </TextComponent>
                                <TextComponent
                                    textPlaceHolder = {"Reference"}
                                    textValue={this.state.message}
                                    textType="text"
                                    ready = {this.state.isReady}
                                    onChangeText = {(value) => this.onChangeMessage(value)}
                                > </TextComponent>
                            </View>
                            {
                                this.state.amount == '' &&
                                <View style={{flexDirection : 'row', height : 40 * metrics,marginTop : 30}}>
                                    <View style={{flex : 0.025}}></View>
                                    <TouchableOpacity style={styles.money} onPress={() => this.setMoney(50)}>
                                        <Text style={styles.money_text}>£ 50</Text>
                                    </TouchableOpacity>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={styles.money} onPress={() => this.setMoney(100)}>
                                        <Text style={styles.money_text}>£ 100</Text>
                                    </TouchableOpacity>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={styles.money} onPress={() => this.setMoney(150)}>
                                        <Text style={styles.money_text}>£ 150</Text>
                                    </TouchableOpacity>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={styles.money} onPress={() => this.setMoney(200)}>
                                        <Text style={styles.money_text}>£ 200</Text>
                                    </TouchableOpacity>
                                    <View style={{flex : 0.025}}></View>
                                </View>
                            }
                        </View>
                        <View style={{flex : 0.1,width : '85%', alignSelf : 'center'}}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.proceed()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Confirm & Add</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        alignSelf : 'center',
        backgroundColor : Colors.white_color
    },
    body : {
        width : '80%',
        flex : 1,
        flexDirection : 'column', 
        alignSelf : 'center',
    },
    pay_body : {
        height : 130 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
    },
    pay_text : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontWeight : '500',
        flex : 0.2,
        justifyContent : 'center',
    },
    normal_body : {
        flex : 0.6 ,
        borderWidth : 1,
        borderStyle : "dashed",
        borderColor : Colors.gray_color,
        borderRadius : 5
    },
    select_body : {
        flex : 0.6 ,
        borderWidth : 1,
        borderStyle : "dashed",
        borderColor : Colors.main_color,
        borderRadius : 5
    },
    select_button : {
        width : '100%',
        height : '100%',
        flexDirection : 'row',
        alignItems : 'center'
    },
    avatar : {
        width : 45 * metrics,
        height : 45 * metrics,
        borderRadius : 50,
        alignSelf : 'center',
        //borderWidth : 1,
        justifyContent: 'center',
        borderColor : Colors.main_color
    },
    img : {
        borderRadius : 50 , 
        width : '100%' , 
        height : '100%' , 
        resizeMode : 'cover'
    },
    user_body : {
        flex : 0.55 , 
        flexDirection : 'column' , 
        height : '100%',
        justifyContent : 'center'
    },
    user : {
        width : '100%', 
        height : 90 * metrics , 
        borderBottomWidth : 1, 
        borderBottomColor : Colors.white_gray_color,
        flexDirection : 'row',
        alignItems : 'center'
    },
    image : {
        width: 50 * metrics,
        height : 50 * metrics, 
        resizeMode: 'cover', 
        borderRadius : 50,
        alignSelf : 'flex-start'
    },
    money : {
        flex : 0.2, 
        borderRadius : 10, 
        elevation : 1.5 ,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.white_gray_color
    },
    money_text : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : 'black',
    }
});