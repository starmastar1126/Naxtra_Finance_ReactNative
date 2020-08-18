/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,BackHandler, ImageBackground, TextInput} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'
import { alertMessage } from '../../utils/utils';

export default class PinCodeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        amount : '',
        message : '',
        isReady : false,
        pay_type : '',
        new_pin_1 : '',
        new_pin_2 : '',
        new_pin_3 : '',
        new_pin_4 : '',
        register_pin_1 : '',
        register_pin_2 : '',
        register_pin_3 : '',
        register_pin_4 : '',
        card_arr : [
            {
                img : Images.sliver_card,
                card_name : 'Silver Debit Card'
            },
            {
                img : Images.platium_card,
                card_name : 'Platinum Debit Card'
            },
            {
                img : Images.platium_sliver_card,
                card_name : 'Platinum Silver Debit Card'
            },
            {
                img : Images.gold_card,
                card_name : 'Gold Silver Debit Card'
            },
            {
                img : Images.star_card,
                card_name : 'All Star Debit Card'
            },
        ]
    }
    pay = () => {

    }
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    nextStep = () => {
        if (this.state.new_pin_1 != '' && this.state.new_pin_2 != '' && this.state.new_pin_3 != '' && this.state.new_pin_4 != '' && this.state.register_pin_1 != '' && this.state.register_pin_2 != '' && this.state.register_pin_3 != '' && this.state.register_pin_4 != '') {
            var new_pin = this.state.new_pin_1 + this.state.new_pin_2 + this.state.new_pin_3 + this.state.new_pin_4
            var register_pin = this.state.register_pin_1 + this.state.register_pin_2 + this.state.register_pin_3 + this.state.register_pin_4
            if (new_pin != register_pin) {
                alertMessage('Please match new PIN and re-new PIN')
                return
            } else {
                this.setState({
                    new_pin_1 : '',
                    new_pin_2 : '',
                    new_pin_3 : '',
                    new_pin_4 : '',
                    register_pin_1 : '',
                    register_pin_2 : '',
                    register_pin_3 : '',
                    register_pin_4 : '',
                })
                this.props.navigation.navigate('ConfirmAddressScreen')
            }
        }
    }
    changeText (number, text) { 
        switch (number) {
            case 1 : 
                if (text != '') {
                    this.refs['code_input2th'].focus();
                }
                this.setState({ new_pin_1: text }, () =>{this.nextStep()})
                break;
            case 2 : 
                if (text != '') {
                    this.refs['code_input3th'].focus();
                } else {
                    this.refs['code_input1th'].focus();
                }
                this.setState({ new_pin_2: text }, () =>{this.nextStep()})
                break;
            case 3 : 
                if (text != '') {
                    this.refs['code_input4th'].focus();
                } else {
                    this.refs['code_input2th'].focus();
                }
                this.setState({ new_pin_3: text }, () =>{this.nextStep()})
                break;
            case 4 : 
                if (text == '') {
                    this.refs['code_input3th'].focus();
                }
                this.setState({ new_pin_4: text }, () =>{this.nextStep()})
                break;
        }
    }
    changeRegisterText (number, text) {
        switch (number) {
            case 1 : 
                if (text != '') {
                    this.refs['reg_code_input2th'].focus();
                }
                this.setState({ register_pin_1: text }, () =>{this.nextStep()})
                break;
            case 2 : 
                if (text != '') {
                    this.refs['reg_code_input3th'].focus();
                } else {
                    this.refs['reg_code_input1th'].focus();
                }
                this.setState({ register_pin_2: text }, () =>{this.nextStep()})
                break;
            case 3 : 
                if (text != '') {
                    this.refs['reg_code_input4th'].focus();
                } else {
                    this.refs['reg_code_input2th'].focus();
                }
                this.setState({ register_pin_3: text }, () =>{this.nextStep()})
                break;
            case 4 : 
                if (text == '') {
                    this.refs['reg_code_input3th'].focus();
                }
                this.setState({ register_pin_4: text }, () =>{this.nextStep()})
                break;
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Set New PIN"  goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <View style={styles.body}>
                    <View style={styles.enter_body}>
                        <View style={{flex : 0.2}}></View>
                        <View style={{flex : 0.3}}>
                            <Text style={{textAlign : 'center' , fontSize : 18 * metrics}}>Enter New PIN</Text>
                        </View>
                        <View style={{flex : 0.5, flexDirection : 'row',alignSelf : 'center'}}>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.new_pin_1 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input1th"
                                    onChangeText={(text) => this.changeText(1, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.new_pin_2 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input2th"
                                    onChangeText={(text) => this.changeText(2, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.new_pin_3 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input3th"
                                    onChangeText={(text) => this.changeText(3, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.new_pin_4 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="code_input4th"
                                    onChangeText={(text) => this.changeText(4, text)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.re_enter_body}>
                        <View style={{flex : 0.2}}></View>
                        <View style={{flex : 0.3}}>
                            <Text style={{textAlign : 'center' , fontSize : 18 * metrics}}>Re-enter New PIN</Text>
                        </View>
                        <View style={{flex : 0.5, flexDirection : 'row',alignSelf : 'center'}}>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.register_pin_1 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="reg_code_input1th"
                                    onChangeText={(text) => this.changeRegisterText(1, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.register_pin_2 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="reg_code_input2th"
                                    onChangeText={(text) => this.changeRegisterText(2, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.register_pin_3 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="reg_code_input3th"
                                    onChangeText={(text) => this.changeRegisterText(3, text)}
                                />
                            </View>
                            <View style={styles.pin_body}>
                                <TextInput style={styles.verify_input}
                                    underlineColorAndroid="transparent"
                                    placeholder=""
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    value={this.state.register_pin_4 != '' && 'x'}
                                    keyboardType={'numeric'}
                                    maxLength={1}
                                    ref="reg_code_input4th"
                                    onChangeText={(text) => this.changeRegisterText(4, text)}
                                />
                            </View>
                        </View>
                    </View>

                </View>
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
        backgroundColor : Colors.white_color,
    },
    body :{
        height : '100%',
        flexDirection : 'column',
        width : '80%',
        alignSelf : 'center',
    },
    enter_body : {
        flex : 0.3,
        flexDirection : 'column',
        alignSelf : 'center',
    },
    re_enter_body : {
        flex : 0.3,
        flexDirection : 'column',
        alignSelf : 'center'
    },
    pin_body : {
        width : 45 * metrics, 
        height : 45 * metrics , 
        borderRadius : 100 ,
        borderColor : Colors.gray_color,
        alignItems : 'center',
        borderWidth : 1,
        marginLeft : 15 * metrics,
        marginRight : 15 * metrics,
        backgroundColor : 'white'
    },
    verify_input : {
        textAlign : 'center',
        fontSize : 20 * metrics,
    }
});