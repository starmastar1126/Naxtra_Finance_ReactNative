/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity, AsyncStorage, ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts';
import TransactionService from '../../service/TransactionService';
import { changeDate2,changeDatefromAccount } from '../../utils/utils';

export default class TransferScreen extends Component {
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
        isLoading : false
    }

    async componentDidMount () {
        await AsyncStorage.setItem('steps' , 'LoginScreen')
        await AsyncStorage.setItem("is_signup", '')
    }

    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    downloadReceipt () {
        this.setState({isLoading : true})
        TransactionService.downlodReceiptFile(global.pay_user.user.id, global.token).then(res => {
            var data = res.data.result
            console.log('data = ', data)
            // if (data.success) {
            //     this.props.navigation.navigate('ConfrimPaymentScreen')
            // } else {
            //     alertMessage(data.message)
            // }
            this.props.navigation.navigate('ConfrimPaymentScreen')
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex : 0.05}}></View>
                    <View style={{flex : 0.2, width : '90%' ,alignSelf : 'center'}}>
                        <TouchableOpacity  onPress={() => this.goBack()}>
                            <MaterialCommunityIcons name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex : 0.75, justifyContent: 'center', alignItems : 'center'}}>
                        <Image source={Images.like_img} style={{width : 65 * metrics, height : 65 * metrics}}></Image>
                        <View style={{marginTop : 10 * metrics}}></View>
                        <Text style={{fontWeight : '500',fontSize : 18 * metrics}}>Transfer successful</Text>
                    </View>
                </View>
                <View style={{flex : 0.05 , backgroundColor : Colors.white_color}}></View>
                <ScrollView style={{flex : 0.55}}>
                    <View style={styles.body}>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Reference</Text>
                            <Text style={styles.value}>{global.pay_user.reference}</Text>
                        </View>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Account Number</Text>
                            <Text style={styles.value}>{global.pay_user.user.rb_uk_account_number}</Text>
                        </View>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Sort Code</Text>
                            <Text style={styles.value}>{global.pay_user.user.rb_uk_sort_code}</Text>
                        </View>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Paid to</Text>
                            <Text style={styles.value}>{global.pay_user.user.rb_name}</Text>
                        </View>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Total Amount debited</Text>
                            <Text style={styles.value}>£ {(Number(global.pay_user.amount) + Number(0)).toFixed(2)}</Text>
                        </View>
                        <View style={{flexDirection : "column", marginTop : 20 * metrics}}>
                            <Text style={styles.name}>Date & Time</Text>
                            <Text style={styles.value}>{changeDatefromAccount(global.pay_user.pay_time.day)} {global.pay_user.pay_time.time}</Text>
                        </View>
                        <View style={{marginTop : 40 * metrics}}></View>
                        <TouchableOpacity style={styles.button} onPress={() => this.downloadReceipt()}>
                            <MaterialIcons name="arrow-downward" size={30 * metrics} color={Colors.main_color} style={{marginTop : 10 * metrics}}></MaterialIcons>
                            <Text style={{color : Colors.main_color, fontSize : 18 * metrics,marginTop : 13 * metrics, marginLeft : 8 * metrics,fontFamily : Fonts.adobe_clean}}>Download Receipt</Text>
                        </TouchableOpacity>
                        <View style={{marginTop : 30 * metrics}}></View>
                    </View>
                </ScrollView>
                
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
    header : {
        flex : 0.5, 
        backgroundColor : 'white', 
        elevation : 3.5,
        flexDirection : 'column',
    },
    body :{
        height : '100%',
        flexDirection : 'column',
        width : '80%',
        alignSelf : 'center',
    },
    name : {
        fontSize : 16 * metrics,
        color : Colors.gray_color,fontFamily : Fonts.adobe_clean
    },
    value : {
        fontSize : 18 * metrics,
        color : '#000',
        marginTop : 7 * metrics,fontFamily : Fonts.adobe_clean
    },
    button : {
        width : '100%' , 
        height : 55 * metrics ,
        borderRadius : 7 ,
        borderWidth : 1, 
        borderColor : Colors.main_color,
        flexDirection : 'row',
        justifyContent : 'center',
    }
});