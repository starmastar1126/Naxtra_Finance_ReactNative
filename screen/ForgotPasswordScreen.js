/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,Image ,TouchableOpacity,ScrollView,SafeAreaView, ActivityIndicator, TextInput, Keyboard} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import global_style, {metrics} from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import TextComponent from '../components/TextComponent'
import { validEmail, alertMessage } from '../utils/utils'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {Fonts} from '../constants/Fonts'
import UserService from '../service/UserService';
import CodePin from 'react-native-pin-code'
// import ReactCodeInput from 'react-code-input'

export default class ForgotPasswordScreen extends Component {
    static navigationOptions = ({ navigation }) => {
            const { state } = navigation;
            return {
                header: null,
            }
    };

    state = {
        email_address : '',
        isReady : false, 
        valid_email : true,
        invalid : false,
        isLoading : false,
        step : 1,
        num1 : '',
        num2 : '',
        num3 : '',
        num4 : '',
        num5 : '',
        num6 : '',
        new_password : '',
        valid_password : true,
        showPassword : false
    }

    checkReady () {
        if (this.state.step == 1) {
            if (this.state.email_address == '') {
                this.setState({valid_email : false})
            } else {
                this.setState({valid_email : true})
            }
    
            if (this.state.email_address != '' && validEmail(this.state.email_address)) {
                this.setState({invalid : false})
            } else {
                this.setState({invalid : true})
            }
    
            if (this.state.email_address != '' && validEmail(this.state.email_address) && this.state.step)
                this.setState({isReady : true})
            else
                this.setState({isReady : false})
        } else {
            if (this.state.num1 != '' && this.state.num2 != '' && this.state.num3 != '' && this.state.num4 != '' && this.state.num5 != '' && this.state.num6 != '' && this.state.new_password != '' && this.state.new_password.length > 5 && this.state.step == 2) {
                this.setState({isReady : true})
            } else {
                this.setState({isReady : false})
            }
        }
    }

    onSubmit = () => {
        if (!this.state.isReady) return
        var obj = {
            email : this.state.email_address
        }   
        this.setState({isLoading : true})
        UserService.forgotPassword(obj).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({step : 2, valid_password : true,isReady : false})
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }
    changeText = (num , text) => {
        switch (num) { 
            case 1 : 
                if (text != '') {
                    this.refs['number2'].focus();
                }
                this.setState({ num1: text }, () =>{this.nextStep()})
                break;
            case 2 : 
                if (text != '') {
                    this.refs['number3'].focus();
                } else {
                    this.refs['number1'].focus();
                }
                this.setState({ num2: text }, () =>{this.nextStep()})
                break;
            case 3 : 
                if (text != '') {
                    this.refs['number4'].focus();
                } else {
                    this.refs['number2'].focus();
                }
                this.setState({ num3: text }, () =>{this.nextStep()})
                break;
            case 4 : 
                if (text != '') {
                    this.refs['number5'].focus();
                } else {
                    this.refs['number3'].focus();
                }
                this.setState({ num4: text }, () =>{this.nextStep()})
                break;
            case 5 : 
                if (text != '') {
                    this.refs['number6'].focus();
                } else {
                    this.refs['number4'].focus();
                }
                this.setState({ num5: text }, () =>{this.nextStep()})
                break;
            case 6 :
                if (text == '') {
                    this.refs['number5'].focus();
                }
                this.setState({ num6: text }, () =>{this.nextStep()}) 
                break;
        }
    }
    nextStep () { 
        if (this.state.num1 != '' && this.state.num2 != '' && this.state.num3 != '' && this.state.num4 != '' && this.state.num5 != '' && this.state.num6 != '') { 
            Keyboard.dismiss()
            
        }
        this.checkReady()
    }
    gotoLogin () {
        if (!this.state.isReady) return
        var obj = {
            otp : this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6,
            new_passwd : this.state.new_password,
            email : this.state.email_address
        }
        this.setState({isLoading : true})
        UserService.forgotPasswordVerify(obj).then(res => {
            var data = res.data.result
            if (data.success) {
                this.props.navigation.navigate('LoginScreen')
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
            console.log(error)
        })
    }

    render() {
        return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.navigate('LoginScreen')}></HeaderComponent>
            <ScrollView style={{flex : 0.85}}>
                {
                    this.state.step == 1 ? 
                    <View style={{flex : 1}}>
                        <View style={{marginTop : 20 * metrics}}></View>
                
                        <View style={{alignSelf : 'center'}}>
                            <Image source={Images.splash_logo} style={{width : 200 * metrics , height : 60 * metrics , resizeMode : 'stretch', marginTop : 30 * metrics}}></Image>
                        </View>
                        <View style={{marginTop : 50 * metrics}}></View>

                        <View style={styles.body}>
                            <Text style={styles.title}>Forgot Password</Text>
                            <View style={{marginTop : 50 * metrics}}></View>
                            <TextComponent
                                textPlaceHolder = "Email Address"
                                textValue={this.state.email_address}
                                textType="text"
                                onChangeText = {(value) => this.setState({email_address : value},() => {this.checkReady()})}
                            > </TextComponent>
                            {
                                !this.state.valid_email &&
                                <Text style={global_style.error }>{ErrorMessage.error_email_required}</Text>
                            }
                            {
                                this.state.valid_email && this.state.invalid &&
                                <Text style={global_style.error }>{ErrorMessage.error_email_invalid}</Text>
                            }
                            <View style={{marginTop : 70 * metrics}}></View>
                            <Text style={{fontSize : 18 * metrics, textAlign : 'center'}}>You will receive an email to your registered email address to create new password</Text>
                        </View>
                    </View>
                    : 
                    <View style={{flex : 1, flexDirection : 'column'}}>
                        <View style={{marginTop : 20 * metrics}}></View>
                        
                        <View style={{alignSelf : 'center'}}>
                            <Image source={Images.splash_logo} style={{width : 200 * metrics , height : 60 * metrics , resizeMode : 'stretch', marginTop : 30 * metrics}}></Image>
                        </View>

                        <View style={{marginTop : 120 * metrics}}></View>
                        <Text style={{width : '90%', alignSelf : 'center', fontFamily : Fonts.adobe_clean, fontSize : 19 * metrics,color : Colors.gray_color}}>OTP</Text>
                        <View style={styles.text_body}>
                            <TextInput style={styles.verify_input}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                placeholderTextColor="gray"
                                autoCapitalize="none"
                                value={this.state.num1}
                                keyboardType={'numeric'}
                                maxLength={1}
                                ref="number1"
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
                                ref="number2"
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
                                ref="number3"
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
                                ref="number4"
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
                                ref="number5"
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
                                ref="number6"
                                onChangeText={(text) => this.changeText(6, text)}
                            />
                        </View>
                        <View style={{marginTop : 40 * metrics,width : '90%', alignSelf : 'center'}}>
                            <Text style={{fontSize : 19 * metrics, fontFamily : Fonts.adobe_clean, color : Colors.dark_gray}}>New Password</Text>
                            <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                <TextInput style={[styles.verify_input, {textAlign : 'left'}]}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.new_password}
                                    secureTextEntry={!this.state.showPassword}
                                    onChangeText={(text) => this.setState({new_password : text}, () => this.checkReady())}
                                />
                                <TouchableOpacity style={styles.eye} onPress={() => {
                                    this.setState({showPassword : !this.state.showPassword})
                                }}>
                                    {
                                        !this.state.showPassword ? 
                                        <FeatherIcon name="eye" size={23 * metrics} color={Colors.gray_color}></FeatherIcon>
                                        :
                                        <FeatherIcon name="eye-off" size={23 * metrics} color={Colors.gray_color}></FeatherIcon>
                                    }
                                    
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginTop : 40 * metrics, alignItems : 'center'}}>
                            <Text style={{fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean, color : Colors.dark_gray}}>We have sent a link to create new password to</Text>
                            <Text style={{fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean, color : Colors.main_color, marginTop : 10 * metrics}}>{this.state.email_address}</Text>
                        </View>
                    </View>
                }
                
            </ScrollView>
            <View style={global_style.bottom_button_body}>
                {
                    this.state.step == 2 ?
                    <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.gotoLogin()}>
                        <View style={global_style.btn_body}>
                        <Text style={global_style.left_text}>Go to login</Text>
                        <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onSubmit()}>
                        <View style={global_style.btn_body}>
                        <Text style={global_style.left_text}>Submit</Text>
                        <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                        </View>
                    </TouchableOpacity>
                }
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
    container: {
        flex: 1,
        backgroundColor : Colors.white
    },
    body : {
        flex : 1, 
        width : '85%', 
        alignSelf : 'center',
        marginTop : 15 * metrics
    },
    personal : {
        height : 30 * metrics,
        backgroundColor : Colors.white_gray_color,
        justifyContent : 'center'
    },
    title : {
        fontSize : 25 * metrics , color : 'black',flex : 0.4,fontFamily : Fonts.adobe_clean,
    },
    value : {
        fontSize : 20 * metrics, color : Colors.main_blue_color, flex : 0.6,fontFamily : Fonts.adobe_clean,
    },
    item : {
        flexDirection :'row',
        marginTop : 10 * metrics   
    },
    verify_body : {
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
        fontFamily: Fonts.adobe_clean
    },
    text_body : {
        height : 50 * metrics, 
        margin : 10 * metrics,
        flexDirection : 'row',
        width : '90%',
        alignSelf : 'center'
    },
    eye : {
        marginLeft : -20,
        alignSelf : 'center',
      }
});
