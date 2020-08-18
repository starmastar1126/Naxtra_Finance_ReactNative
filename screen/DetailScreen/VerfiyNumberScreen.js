/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View, ActivityIndicator ,TextInput, Keyboard,StatusBar, AsyncStorage} from 'react-native'
import * as ErrorMessage from '../../constants/ErrorMessage'
import * as Colors from '../../constants/Colors'
import global_style, {metrics} from '../../constants/GlobalStyle'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { Fonts } from '../../constants/Fonts'
import TransactionService from '../../service/TransactionService'
import { alertMessage } from '../../utils/utils'
import SuccessComponent from '../../components/SuccessComponent'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import OtherService from '../../service/OtherService';

export default class VerfiyNumberScreen extends Component {
    state = {
        num1 : '',
        num2 : '',
        num3 : '',
        num4 : '',
        num5 : '',
        num6 : '',
        isReady : false,
        isLoading : false,
        success : false,
        title : "Verify Payment"
    }
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    resendOTP () {
        
    }

    async componentDidMount () {
        await AsyncStorage.setItem('steps' , 'VerfiyNumberScreen')
        await AsyncStorage.setItem("is_signup", 'true')

        if (global.verify_type == 'add_beneficiary') {
            this.setState({title : "Verify Beneficiary"})
        } else if (global.verify_type == "payment_link") {
            this.setState({title : "Verify PaymentLink"})
        } else if (global.verify_type == "send_money") {
            this.setState({title : "Verify Payment"})
        } else if (global.verify_type == "company_updating") {
            this.setState({title : "Verify Company Update"})
        } else if (global.verify_type == "personal_updating") {
            this.setState({title : "Verify Personal Update"})
        }
    }

    async initStorage () {
        await AsyncStorage.setItem('steps' , '')
        await AsyncStorage.setItem("is_signup", 'false')
    }
    //test
    gotoNextStep (verify_num) {
        this.setState({
            num1 : verify_num[0],
            num2 : verify_num[1],
            num3 : verify_num[2],
            num4 : verify_num[3],
            num5 : verify_num[4],
            num6 : verify_num[5],
            isReady : true
        }, () => this.goVerify())
    }
    onSkipFingerPrint () {

    }
    getCodeFromSMS () {
       
    }
    gotoScreen = () => {
        this.setState({success : false})
        if (global.isManager) {
            this.props.navigation.navigate('ManageBeneficiary' , {refresh : true})
        } else {
            this.props.navigation.navigate('TabScreen')
        }
    }

    goVerify = () => {
        //this.props.navigation.navigate('ConfirmScreen')
        if (!this.state.isReady)
            return
        if (global.verify_type == 'add_beneficiary') {
            var obj = {
                otp : this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6
            }
            this.setState({isLoading : true})
            TransactionService.verfiyBeneficiary(obj , global.beneficiary_id, global.token).then(res => {
                var data = res.data.result
                if (data.response.sucess) {
                    this.setState({success : true})
                } else {
                    this.setState({success : false})
                }
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
        } else if (global.verify_type == 'payment_link') {
            var obj = {
                transaction_id : global.transaction_id,
                otp : this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6
            }
            this.setState({isLoading : true})
            TransactionService.generatePaymentLink(obj , global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    global.link = data.response.link
                    this.props.navigation.navigate('LinkSuccessScreen')
                } else {
                    alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(err => {
                this.setState({isLoading : false})
            })
        } else if (global.verify_type == 'send_money') {
            var obj = {
                otp : this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6
            }
            this.setState({isLoading : true})
            TransactionService.verifySendMoney(obj, global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.props.navigation.navigate('TransferScreen')
                } else {
                    alertMessage(data.message)
                }
                //this.props.navigation.navigate('TransferScreen')
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
        } else if (global.verify_type == 'company_updating') {
            this.setState({isLoading : true})
            var obj = global.update_company
            obj.otp = this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6

            console.log('obj = ', obj)
            OtherService.updateCompanyDetail(global.token, obj).then(res => {
                var data = res.data.result
                console.log('data = ', data)
                if (data.success) {
                    this.props.navigation.navigate('CompanyDetail', {refresh : true})
                } else {
                    alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
        } else if (global.verify_type == 'personal_updating') {
            this.setState({isLoading : true})
            var obj = global.update_company
            obj.otp = this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6

            OtherService.updatePersonal(global.token, obj).then(res => {
                var data = res.data.result
                if (data.success) {
                    global.user_info.email = global.update_company.email
                    global.user_info.phone = global.update_company.phone
                    global.user_info.address_info = global.update_company.address_info
                    
                    this.props.navigation.navigate('PersonalSettingScreen', {refresh : true})
                } else {
                    alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
        }
    }

    changeText (idx , text) {
        switch (idx) {
            case 1 : 
                if (text != '') {
                    this.refs['code_input2th'].focus();
                }
                this.setState({ num1: text }, () =>{this.nextStep()})
                break;
            case 2 : 
                if (text != '') {
                    this.refs['code_input3th'].focus();
                } else {
                    this.refs['code_input1th'].focus();
                }
                this.setState({ num2: text }, () =>{this.nextStep()})
                break;
            case 3 : 
                if (text != '') {
                    this.refs['code_input4th'].focus();
                } else {
                    this.refs['code_input2th'].focus();
                }
                this.setState({ num3: text }, () =>{this.nextStep()})
                break;
            case 4 : 
                if (text != '') {
                    this.refs['code_input5th'].focus();
                } else {
                    this.refs['code_input3th'].focus();
                }
                this.setState({ num4: text }, () =>{this.nextStep()})
                break;
            case 5 : 
                if (text != '') {
                    this.refs['code_input6th'].focus();
                } else {
                    this.refs['code_input4th'].focus();
                }
                this.setState({ num5: text }, () =>{this.nextStep()})
                break;
            case 6 : 
                if (text == '') {
                    this.refs['code_input5th'].focus();
                }
                this.setState({ num6: text }, () =>{this.nextStep()})
                break;
        }
    }
    nextStep () {
        if (this.state.num1 != '' && this.state.num2 != '' && this.state.num3 != '' && this.state.num4 != '' && this.state.num5 != '' && this.state.num6 != '') {
            Keyboard.dismiss()
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    render() {
        return (
            <SafeAreaView>
                <StatusBar
                    //translucent
                    backgroundColor={"white"}
                    barStyle="dark-content"
                />
                <View style={{width : '100%', height : '100%', alignItems : 'center'}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title={this.state.title}  goBack ={() => {
                        this.initStorage()
                        this.props.navigation.goBack()
                    }}></DetailHeaderComponent>
                    <View style={{flexDirection : 'column', width : '80%', flex : 1}}>
                        <View style={{flex : 0.2}}></View>
                        <View style={{flex : 0.7}}>
                            <Text style={styles.sub_title}>We are awaiting for the confirmation from the bank for one time password verification.</Text>
                            <View style={styles.text_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num1}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input1th"
                                    onChangeText={(text) => this.changeText(1, text)}
                                />
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num2}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input2th"
                                    onChangeText={(text) => this.changeText(2, text)}
                                />
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num3}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input3th"
                                    onChangeText={(text) => this.changeText(3, text)}
                                />
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num4}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input4th"
                                    onChangeText={(text) => this.changeText(4, text)}
                                />
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num5}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input5th"
                                    onChangeText={(text) => this.changeText(5, text)}
                                />
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.num6}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input6th"
                                    onChangeText={(text) => this.changeText(6, text)}
                                />
                            </View>
                            <View style={{flexDirection : 'row', margin : 10 * metrics, marginTop : 20 * metrics}}>
                                <TouchableOpacity style={{marginLeft : 15 * metrics}} onPress={() => this.resendOTP()}>
                                    <Text style={styles.link_text}>Resend OTP</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{marginTop : 35 * metrics, width :'100%' , height : 55 * metrics,flexDirection : 'row'}}>
                                <View style={{flex : 0.4, backgroundColor : Colors.main_color,borderRadius : 10 * metrics}}>
                                    <TouchableOpacity style={{height : '100%',justifyContent : 'center', alignItems : 'center', flexDirection : 'row'}} onPress={() => this.getCodeFromSMS()}>
                                        <MaterialCommunityIcons name="message-reply-text" size={30 * metrics} color="white"></MaterialCommunityIcons>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 15 * metrics, color : 'white', marginLeft : 10 * metrics}}>GetSMS</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex : 0.1}}></View>
                                <View style={{flex : 0.4, backgroundColor : Colors.main_color,borderRadius : 10 * metrics,}}>
                                    <TouchableOpacity style={{height : '100%',justifyContent : 'center', alignItems : 'center', flexDirection : 'row'}}  onPress={() => this.onSkipFingerPrint()}>
                                        <MaterialCommunityIcons name="fingerprint" size={30 * metrics}  color="white"></MaterialCommunityIcons>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 15 * metrics, color : 'white', marginLeft : 10 * metrics}}>Fingerprint</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                        </View>
                        <View style={{flex : 0.1}}> 
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.goVerify()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Verify</Text>
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
                {
                    this.state.success && 
                    <View style={global_style.black_body}>
                        <SuccessComponent btnThanks={() => this.gotoScreen()} description = {ErrorMessage.success_add_beneficiary}></SuccessComponent>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    body : {
        paddingLeft : 30 * metrics,
        paddingRight : 30 * metrics,
    },
    title : {
        fontSize : 21 * metrics,
        fontWeight : '500',fontFamily : Fonts.adobe_clean
    },
    sub_title : {
        fontSize : 18 * metrics,
        color : 'black',fontFamily : Fonts.adobe_clean
    },
    text_body : {
        height : 50 * metrics, 
        margin : 10 * metrics,
        marginTop : 80 * metrics,
        flexDirection : 'row'
    },
    verify_input: {
		flexDirection : 'row',
		flex : 20,
		marginRight: 5 * metrics,
		marginLeft: 5  * metrics,
		textAlign: 'center',
		height: 50  * metrics,
		borderBottomColor: '#d8d8d8',
		borderBottomWidth: 1,
        fontSize: 20  * metrics,
        fontFamily : Fonts.adobe_clean,
    },
    link_text : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_blue_color,
        textDecorationLine : 'underline'
    }
});