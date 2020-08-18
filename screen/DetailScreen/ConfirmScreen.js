/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet,Text, View , Image ,TouchableOpacity, ImageBackground,SafeAreaView,BackHandler,AsyncStorage} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TransactionService from '../../service/TransactionService'
import { alertMessage, changeNumber } from '../../utils/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Fonts } from '../../constants/Fonts'
import UserService from '../../service/UserService';

export default class ConfirmScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    async componentDidMount() {
        console.log('1 = ' , global.pay_user.user)
        this.setState({token : global.token})
    }
    async getLocalStorage () {

    }

    state = {
        isLoading : false,
        amount : '',
        message : '',
        isReady : false,
        pay_type : '',
        token : ''
    }
    pay = () => {
        this.nextStep()
        //this.getLocalStorage()
    }
    nextStep = () => {
        if (global.send_money_invoice) {
            this.setState({isLoading : true})
            TransactionService.senMoneyWithInvoice(global.token, global.pay_info).then(res => {
                var data = res.data.result
                if (data.success) {
                    global.verify_type = "send_money"
                    global.otp = data.otp
                    this.props.navigation.navigate('ConfirmScreen')  
                } else {
                    alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                this.setState({isLoading : false})
            })
        } else {
            this.setState({isLoading : true})
            TransactionService.sendMoneyByBeneficiary(global.pay_info, global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    global.verify_type = "send_money"
                    this.props.navigation.navigate('VerfiyNumberScreen')
                    //    
                } else {
                    alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                alertMessage(error.message)
                this.setState({isLoading : false})
            })
        }
    }
    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Confirm Payment" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={{flex : 1, flexDirection : 'column', backgroundColor : Colors.white_color}}>
                        <View style={{marginTop : 20 * metrics}}></View>
                        <View style={{width :'90%',flex : 0.8, alignSelf : 'center'}}>
                            <ImageBackground source={Images.doc_img} style={{ width : '100%' , height : '100%'}} resizeMode="stretch">
                                <View style={{flex : 1, flexDirection : 'column'}}>
                                    <View style={{flex : 0.4 , alignSelf : 'center' ,width : '70%'}}>
                                        <View style={{flex : 0.2}}></View>
                                        <Text style={{flex : 0.2 ,fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : Colors.gray_color}}>To Pay</Text>
                                        <View style={{flex : 0.4, flexDirection : 'row'}}>
                                            <View style={{justifyContent : 'center',alignItems : 'flex-start',flex : 0.2}}>
                                                {
                                                    !global.pay_user.user.rb_beneficiary_icon ?
                                                    <EvilIcons name="user" style={{fontFamily : Fonts.adobe_clean,fontSize : 60 * metrics, color : Colors.main_color}}></EvilIcons>
                                                    :
                                                    <Image source={{uri : 'data:image/png;base64,' + global.pay_user.user.rb_beneficiary_icon}} style={{width : 60 * metrics , height : 60 * metrics, borderRadius : 50, resizeMode : 'cover'}}></Image>
                                                }
                                            </View>
                                            <View style={{justifyContent : 'center',flex : 0.75,marginLeft : 10 * metrics}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics}} numberOfLines={1}>{global.pay_user.user.rb_name}</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 12 * metrics, color : Colors.gray_color,marginTop : 5 * metrics}} numberOfLines={1}>Account number : {global.pay_user.user.rb_uk_account_number}</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 12 * metrics, color : Colors.gray_color,marginTop : 5 * metrics}} numberOfLines={1}>Sort code : {global.pay_user.user.rb_uk_sort_code}</Text>
                                            </View>
                                            <View style={{flex : 0.05, justifyContent : 'center', alignItems : 'flex-end'}}>
                                                <MaterialIcons name="play-arrow" size={18 * metrics}></MaterialIcons>
                                            </View>
                                        </View>
                                        <View style={{flex : 0.2}}></View>
                                    </View>
                                    <Image source={Images.border_line} style={{width : '90%',alignSelf : 'center'}} resizeMode="contain"></Image>
                                    <View style={{flex : 0.6 , alignSelf : 'center', width : '70%'}}>
                                        <View style={{flex : 0.1}}></View>
                                        <View style={{flex : 0.7 , flexDirection : 'column' , alignItems :'center'}}>
                                            <View style={{flex : 0.4}}></View>
                                            <View style ={{flexDirection : 'row',alignItems : 'center'}}>
                                                <Text style={styles.label}>Amount to send</Text>
                                                <Text style={styles.value}>£ {changeNumber(Number(global.pay_user.amount).toFixed(2)) }</Text>
                                            </View>
                                            {/* <View style={{flex : 0.2}}></View> */}
                                            {/* <View style={{flexDirection : 'row'}}>
                                                <Text style={styles.label}>Processing fee 2%</Text>
                                                <Text style={styles.value}>£ {changeNumber(Number(0).toFixed(2))}</Text>
                                            </View> */}
                                            <View style={{flex : 0.3}}></View>
                                            <View style={{flexDirection : 'row'}}>
                                                <Text style={styles.label}>Total Amount</Text>
                                                <Text style={styles.value}>£ {changeNumber((Number(global.pay_user.amount)).toFixed(2))}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex : 0.2}}></View>
                                    </View>
                                </View>
                            </ImageBackground>
                            
                        </View>
                        <View style={{flex : 0.2, justifyContent :'center', width : '85%' ,alignSelf : 'center'}}>
                            <TouchableOpacity  style={global_style.bottom_active_btn} onPress={()=> this.pay()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Confirm & Pay</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={30 * metrics}></MaterialCommunityIcons>
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
    },
    bottom : {
        flex : 0.2 , width : '85%', alignSelf : 'center', justifyContent : 'center',fontFamily : Fonts.adobe_clean,
    },
    value : {
        flex : 0.4, fontSize : 17 * metrics, fontWeight : '500',textAlign : 'center',fontFamily : Fonts.adobe_clean,
    },
    label : {
        flex : 0.6, fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,
    },
    bottom_line : {
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        borderStyle : 'dashed',
        width : '90%',
        alignSelf : 'center',

    }
});