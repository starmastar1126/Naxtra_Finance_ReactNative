/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,ScrollView, ActivityIndicator ,DatePickerAndroid,TimePickerAndroid ,BackHandler, Platform, } from 'react-native'
import { RadioButton } from 'react-native-paper'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import RNPickerSelect from 'react-native-picker-select';
import { paramDate2,convertDate,getHoursAndMins, alertMessage } from '../../utils/utils'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from "react-native-modal-datetime-picker"
import TransactionService from '../../service/TransactionService'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {Fonts} from '../../constants/Fonts'

const placeholder = {
    label : 'Select Currency',
    value : null,
    color : 'gray'
}

export default class BankScreen extends Component {
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
        date : new Date()
    }

    checkReady = () => {
        if (this.state.amount != '' && this.state.currency_type != -1) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    selectType = (value) => {
        if (value == null) {
            return
        }
        this.setState({currency_type : value}, () => {this.checkReady()})
    }

    proceed = () => {
        if (!this.state.isReady) return

        var pay_time = {}

        var pay_now = ''
        var pay_schedule = ''
        if (this.state.activeIdx == 1) { //now
            pay_time = {
                day : paramDate2(new Date()),
                time : getHoursAndMins(new Date())
            }
            pay_now = 'True'
            pay_schedule = ''
        } else {
            pay_time = {
                day : this.state.after_day != '' ? paramDate2(new Date(this.state.after_day)) : paramDate2(new Date()),
                time : this.state.after_hour !='' ? this.state.after_hour :getHoursAndMins(new Date())
            }
            pay_now = 'False'
            pay_schedule = pay_time.day +' ' + pay_time.time
        }

        var obj = {
            //token : global.token,
            amount : Number(this.state.amount),
            beneficiary_id : this.state.selectedUser.id,
            reference : this.state.message,
            pay_now : pay_now,
            pay_schedule : pay_schedule
        }
        console.log('obj - ' , obj)
        this.setState({isLoading : true})
        TransactionService.sendMoneyByBeneficiary(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var obj = {
                    user : this.state.selectedUser,
                    pay_time : pay_time,
                    amount : this.state.amount
                }
                console.log('account = ' , data)
                global.verify_type = "send_money"
                global.pay_user = obj
                global.otp = data.otp
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

    constructor(props) {
        super (props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getAllUsers()
    }
    handleBackButtonClick () {
        if (this.state.showModal) {
            this.setState({showModal : false})
            return true
        } else {
            return false
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    getAllUsers () {
        TransactionService.getAllBeneficiary(global.token).then(result => {
            var data = result.data.result
            console.log(data.response)
            if (data.success) {
                var data_arr = data.response.records
                if (data_arr.length > 0) {
                    var arr = []
                    for (var i = 0 ;i < data_arr.length; i++) {
                        var check = 0;
                        for (var j = i + 1 ;j < data_arr.length; j++) {
                            if (data_arr[i].rb_uk_account_number == data_arr[j].rb_uk_account_number) {
                                check = 1
                            }
                        }    
                        if (check == 0) {
                            arr.push(data_arr[i])
                        }
                    }
                    this.setState({account_arr : arr})
                } else {
                    this.setState({account_arr : []})
                }
                
            } else {
                this.setState({account_arr : []})
            }
        }).catch(error => {
            alertMessage(error.message)
        })
    }
    gotoAddBeneficiary = () => {
        global.isManager = false
        this.props.navigation.navigate('AddBeneficiaryScreen')
    }

    showDatePicker = async() => {
        if (Platform.OS == 'ios') {
            this.setState({ isDatePickerVisible: true });
        } else {
            try {
                const {action, year, month, day} = await DatePickerAndroid.open({
                  date: this.state.date,
                  mode : 'spinner'
                });
                
                if (action !== DatePickerAndroid.dismissedAction) {
                  var mon = month + 1
                  var days = day
          
                  if (month < 10) 
                    mon = '0' + mon
                  if (day < 10 )
                    days = '0' + day
          
                  var time = year + '-' + mon + '-' + days
                  var date = new Date(time)
                 
                  this.handleDatePicked(date)
                }
            } catch ({code, message}) {
                console.warn('Cannot open date picker', message);
            }
        }
    };
    
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };
    showTimePicker = async() => {
        if (Platform.OS == 'ios') {
            this.setState({isTimePickerVisible : true})
        } else {
            try {
                const {action, hour, minute} = await TimePickerAndroid.open({
                  hour: new Date().getHours(),
                  minute: new Date().getMinutes(),
                  mode : 'spinner',
                  is24Hour: true, // Will display '2 PM'
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                    var hours = hour
                    var mins = minute
                    var secs = 0
                    
                    if (hours < 10) 
                        hours = '0' + hours
                    if (mins < 10) 
                        mins = '0' + mins
                    if (secs < 10) 
                        secs = '0' + secs
                    this.setState({after_hour : hours + ':' + mins + ':' + secs})
                }
            } catch ({code, message}) {
                console.warn('Cannot open time picker', message);
            }
        }
    };
    
    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };
    handleDatePicked = date => {
        this.setState({date : date})
        this.setState({after_day : convertDate (date)})
        this.hideDatePicker();
    };
    
    handleTimePicked = time => {
        this.setState({after_hour : getHoursAndMins(time)})
        this.hideTimePicker()
    }

    setIdx = (item) => {
        this.setState({selectedUser : item})
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Bank Account"  goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={styles.body}>
                        <ScrollView style={{width : '100%' , height : '100%'}}>
                            
                            <View style={{height : 80 * metrics}}></View>
                            <View style={styles.pay_body}>
                                <Text style={styles.pay_text}>Pay</Text>
                                <View style={{flex : 0.1}}></View>
                                <View style={styles.select_body}>
                                    <TouchableOpacity style={styles.select_button} onPress={() => this.setState({showModal : true})}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.20 ,justifyContent : 'center'}}>
                                            {
                                                this.state.selectedUser != null && 
                                                <View style={styles.avatar}>
                                                    {
                                                        !this.state.selectedUser.rb_beneficiary_icon ?
                                                        <EvilIcons name="user" style={{fontSize : 60 * metrics, color : Colors.main_color}}></EvilIcons>
                                                        :
                                                        <Image source={{uri : 'data:image/png;base64,' + this.state.selectedUser.rb_beneficiary_icon}} style={styles.img}></Image>  
                                                    }
                                                </View>
                                            }
                                        </View>
                                        <View style={styles.user_body}>
                                            <Text style={{marginLeft : 5 * metrics,fontFamily : Fonts.adobe_clean,fontSize : 17 * metrics, color : '#000' , fontWeight : '500'}}>{this.state.selectedUser == null ? '' : this.state.selectedUser.rb_name}</Text>
                                            {/* <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.gray_color}}>{this.state.selectedUser == null ? '' : this.state.selectedUser.rb_nick_name}</Text> */}
                                        </View>
                                        <View style={{flex : 0.10, justifyContent : 'center',alignItems :'flex-end'}}>
                                            <MaterialIcons name="play-arrow" size={18 * metrics}></MaterialIcons>
                                        </View>
                                        <View style={{flex : 0.05}}></View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{marginTop : 15 * metrics}}></View>
                            <View>
                                <View style={!this.state.isReady ? global_style.selector_normal : global_style.selector_main}>
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
                                    textPlaceHolder = "Amount"
                                    textValue={this.state.amount}
                                    textType="number"
                                    ready = {this.state.isReady}
                                    onChangeText = {(value) => this.setState({amount : value},() => {this.checkReady()})}
                                > </TextComponent>
                                <TextComponent
                                    textPlaceHolder = "Message Optional"
                                    textValue={this.state.message}
                                    textType="text"
                                    ready = {this.state.isReady}
                                    onChangeText = {(value) => this.setState({message : value},() => {this.checkReady()})}
                                > </TextComponent>
                            </View>
                            <View style={{marginTop : 25 * metrics}}></View>
                            <View style={{flexDirection : 'row'}}>
                                <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({activeIdx : 1, showTime : false})}>
                                    <View style={{justifyContent : 'center'}}>
                                        <RadioButton
                                            value="first"
                                            status={this.state.activeIdx == 1 ? 'checked' : 'unchecked'}
                                            color={Colors.main_color}
                                            onPress={() => this.setState({activeIdx : 1, showTime : false})}
                                        />
                                    </View>
                                    
                                    <View style={{justifyContent : 'center'}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean,}}>Pay Now</Text>
                                    </View>
                                    
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({activeIdx : 2 , showTime : true})}>
                                    <View style={{justifyContent : 'center'}}>
                                        <RadioButton
                                            value="second"
                                            status={this.state.activeIdx == 2 ? 'checked' : 'unchecked'}
                                            color={Colors.main_color}
                                            onPress={() => this.setState({activeIdx : 2, showTime : true})}
                                        />
                                    </View>
                                    
                                    <View style={{justifyContent : 'center'}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean,}}>Pay Later</Text>
                                    </View>
                                </TouchableOpacity>
                                
                            </View>
                            {
                                this.state.showTime &&
                                <View style={styles.time}>
                                    <View style={{flex : 0.5 ,flexDirection : 'row', alignItems : 'center' , justifyContent : 'flex-start'}}>
                                        <MaterialCommunityIcons name="calendar-range-outline" size={30 * metrics}></MaterialCommunityIcons>
                                        <TouchableOpacity style={{marginLeft : 10 * metrics}} onPress={() => this.showDatePicker()}>
                                            <Text>{this.state.after_day != '' ? this.state.after_day : convertDate(new Date())}</Text>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode="date"
                                            isVisible={this.state.isDatePickerVisible}
                                            onConfirm={this.handleDatePicked}
                                            onCancel={this.hideDatePicker}
                                        />
                                    </View>
                                    <View style={{flex : 0.5,flexDirection : 'row', alignItems : 'center' , justifyContent : 'flex-start'}}>
                                        <MaterialCommunityIcons name="clock-outline" size={30 * metrics}></MaterialCommunityIcons>
                                        <TouchableOpacity style={{marginLeft : 10 * metrics}} onPress={() => this.showTimePicker()}>
                                            <Text style={{fontFamily : Fonts.adobe_clean,}}>{this.state.after_hour != '' ? this.state.after_hour : '00:00:00'}</Text>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode = "time"
                                            is24Hour={true}
                                            isVisible={this.state.isTimePickerVisible}
                                            onConfirm={this.handleTimePicked}
                                            onCancel={this.hideTimePicker}
                                        />
                                    </View>
                                </View>
                            }
                            <View style={{marginTop : 20 * metrics}}></View>
                        </ScrollView>
                    </View>
                    
                    <View style={{flex : 0.1,width : '85%' , alignSelf : 'center'}}>
                        <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.proceed()}>
                            <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.showModal &&
                    <View style={{width : '100%', height :'100%' , position : 'absolute'}}>
                        <View style={{backgroundColor : 'black' , flex : 1 , opacity : 0.8,zIndex : 10}}></View>
                        <View style={styles.modal}>
                            <View style={styles.modal_header1}>
                                <Text style={styles.header1_title}>Select Beneficiary</Text>
                            </View>
                            <TouchableOpacity style={styles.modal_header2} onPress={() => this.gotoAddBeneficiary()}>
                                <View style={styles.add_icon}>
                                    <MaterialCommunityIcons name="plus" size={20 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                </View>
                                <Text style={{fontWeight : '500', fontSize : 18 * metrics, marginLeft : 20 * metrics,fontFamily : Fonts.adobe_clean,}}>Add New Beneficiary</Text>
                            </TouchableOpacity>
                            <ScrollView style={styles.modal_body}>
                                {
                                    this.state.account_arr.map((item, idx) => {
                                        
                                        return (
                                            <TouchableOpacity style={styles.user} key={idx} onPress={() => this.setState({showModal : false}, () => {
                                                this.setIdx(item)
                                            })}>
                                                <View style={{flex : 0.1}}></View>
                                                <View style={{flex : 0.2,justifyContent : 'center'}}>
                                                    {
                                                        !item.rb_beneficiary_icon ?
                                                        <EvilIcons name="user" style={{fontFamily : Fonts.adobe_clean,fontSize : 60 * metrics, color : Colors.main_color, alignSelf : 'flex-start'}}></EvilIcons>
                                                        :
                                                        <Image source={{uri : 'data:image/png;base64,' + item.rb_beneficiary_icon}} style={styles.image}></Image>    
                                                    }
                                                </View>
                                                <View style={{flex : 0.4, marginLeft : 10 * metrics}}>
                                                    <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 17 * metrics}}>{item.rb_name}</Text>
                                                    <View style={{marginTop : 5 * metrics}}></View>
                                                    <View style={{flexDirection : 'column'}}>
                                                        <View style={{flexDirection : 'row'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : '#000', marginRight : 10 * metrics}}>AccountNumber : </Text>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : Colors.gray_color}}>{item.rb_uk_account_number}</Text>
                                                        </View>
                                                        <View style={{marginTop : 5 * metrics}}></View>
                                                        <View style={{flexDirection : 'row'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : '#000', marginRight : 10 * metrics}}>Sort Code : </Text>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : Colors.gray_color}}>{item.rb_uk_sort_code}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex : 0.1}}></View>
                                                <View style={{flex : 0.15}}>
                                                    <Text style={{textAlign : 'right' ,color: Colors.main_color}}>Select</Text>
                                                </View>
                                                <View style={{flex : 0.05}}></View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                }
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
        flex : 0.9,
        flexDirection : 'column', 
        alignSelf : 'center',
    },
    pay_body : {
        height : 130 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
    },
    pay_text : {
        fontSize : 20 * metrics,fontFamily : Fonts.adobe_clean,
        fontWeight : '500',
        flex : 0.2,
        justifyContent : 'center',
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
        width : 55 * metrics,
        height : 55 * metrics,
        borderRadius : 50,
        alignSelf : 'center',
        justifyContent : 'center'
        // borderWidth : 1,
        // borderColor : Colors.white_gray_color
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
    modal : {
        width : '100%', 
        height : '90%',
        zIndex : 999,
        backgroundColor : 'white',
        position : 'absolute', 
        bottom : 0,
        borderTopRightRadius : 30, 
        borderTopLeftRadius : 30
    },
    modal_header1 : {
        width : '100%', 
        height : 80 * metrics , 
        backgroundColor : Colors.white_gray_color, 
        borderTopLeftRadius : 30 , 
        borderTopRightRadius : 30,
        justifyContent : 'center'
    },
    modal_header2 : {
        width : '100%', 
        height : 80 * metrics , 
        backgroundColor : Colors.white_color,
        borderBottomColor : Colors.white_gray_color,
        borderBottomWidth : 1 ,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center'
    },
    modal_body : {
        width : '100%',
        height : '100%',
    },
    header1_title : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        color : '#000',
        fontWeight : '500'
    },
    add_icon : {
        width : 55* metrics , 
        height : 55 * metrics , 
        borderRadius : 50, 
        borderStyle : "dashed" , 
        borderWidth : 2,
        borderColor : Colors.main_color,
        justifyContent : 'center',
        alignItems : 'center'
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
    time : {
        width : '100%' ,
        height : 55 * metrics , 
        flexDirection : 'row',
    }
});