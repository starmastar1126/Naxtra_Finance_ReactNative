/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image ,TextInput, Keyboard,SafeAreaView} from 'react-native'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import { TouchableOpacity } from 'react-native-gesture-handler'
import UserService from '../service/UserService'
import { alertMessage } from '../utils/utils';
import {Fonts} from '../constants/Fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class VerifyEmailComponent extends Component {
    state = {
        num1 : '',
        num2 : '',
        num3 : '',
        num4 : '',
        num5 : '',
        num6 : '',
        isLoading : false
    }
    resendOTP () {
        var obj = {
            email : global.user_info.email
        }
        this.props.onChangeLoadingBar(true)
        UserService.resendEmailOTP(obj).then(res => {
            var data = res.data.result
            if (data.success)
                alertMessage(ErrorMessage.success_email_otp)
            else
                alertMessage(ErrorMessage.failed_email_otp)
            this.props.onChangeLoadingBar(false)
        }).catch(error => {
            alertMessage(ErrorMessage.network_error)
            this.props.onChangeLoadingBar(false)
        })
    }
    changeText (number, text) {
        switch (number) {
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
            this.props.onChangeLoadingBar(true)
            var obj = {
                email : global.user_info.email,
                otp : this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4 + this.state.num5 + this.state.num6
            }
            UserService.verifyEmail (obj).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.props.changeVerifyStep()  
                } else 
                    alertMessage(data.message)
                    this.props.onChangeLoadingBar(false)
            }).catch(error => {
                this.props.onChangeLoadingBar(false)
                alertMessage (ErrorMessage.network_error)
            })
        }
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                <View style={{flex : 1}}>
                    <View style={{flex : 0.1}}></View>
                    <View style={global_style.vbody}>
                        <Text style={styles.title}>Verify Email Address</Text>
                        <Text style={styles.sub_title}>{this.props.textEmail}</Text>

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
                                ref="code_input4th"
                                keyboardType={'numeric'}
                                maxLength={1}
                                onChangeText={(text) => this.changeText(4, text)}
                            />
                            <TextInput style={styles.verify_input}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                placeholderTextColor="gray"
                                autoCapitalize="none"
                                value={this.state.num5}
                                ref="code_input5th"
                                keyboardType={'numeric'}
                                maxLength={1}
                                onChangeText={(text) => this.changeText(5, text)}
                            />
                            <TextInput style={styles.verify_input}
                                underlineColorAndroid="transparent"
                                placeholder=""
                                placeholderTextColor="gray"
                                autoCapitalize="none"
                                value={this.state.num6}
                                keyboardType={'numeric'}
                                ref="code_input6th"
                                maxLength={1}
                                onChangeText={(text) => this.changeText(6, text)}
                            />
                        </View>
                        <View style={{flexDirection : 'row',margin : 10 * metrics,}}>
                            <Text style={{fontSize : 15 * metrics, fontFamily: Fonts.adobe_clean}}>Don't you receive verify code?</Text>
                            <TouchableOpacity style={{marginLeft : 15 * metrics}} onPress={() => this.resendOTP()}>
                                <Text style={styles.link_text}>Resend OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
                </KeyboardAwareScrollView>
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
        fontWeight : '500', fontFamily: Fonts.adobe_clean
    },
    sub_title : {
        fontSize : 16 * metrics,
        color : Colors.main_color, fontFamily: Fonts.adobe_clean
    },
    text_body : {
        height : 50 * metrics, 
        margin : 10 * metrics,
        marginTop : 20 * metrics,
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
		fontSize: 20  * metrics, fontFamily: Fonts.adobe_clean
    },
    link_text : {
        fontSize : 15 * metrics,
        color : Colors.main_blue_color,
        textDecorationLine : 'underline', fontFamily: Fonts.adobe_clean
    }
});

VerifyEmailComponent.propType = {
	textEmail: PropTypes.string,
    changeVerifyStep : PropTypes.func,
    onChangeLoadingBar : PropTypes.func
}