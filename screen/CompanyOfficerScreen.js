/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity,ActivityIndicator,AsyncStorage,SafeAreaView,Alert} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import CustomOfficer from '../components/CustomOfficer'
import { ScrollView } from 'react-native-gesture-handler'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import CompanyService from '../service/CompanyService'
import { alertMessage } from '../utils/utils';
import UserService from '../service/UserService';

export default class CompanyOfficerScreen extends Component {
    componentDidMount () {
        var obj = {
            company_number : global.company_info.company_number,
        }
        this.setState({isLoading : true})
        CompanyService.getOfficerList(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                
                var arr = data.response.items
                var result_arr = []
                if (arr.length) {
                    for (var i = 0 ; i < arr.length ; i++) {
                        if (arr[i].officer_role == 'director') {
                            result_arr.push(arr[i])
                        }
                    }
                }
                var results = data.response.items
                var temp = []
                for (var i = 0 ; i < results.length ;i ++) {
                    temp.push(0)
                }

                this.setState({selectedArr : temp,officer_arr : result_arr})
            } else {
                alertMessage (data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(ErrorMessage.network_error)
            this.setState({isLoading : false})
        })

    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    state = {
        isLoading : false,
        officer_arr : [],
        isReady : false,
        idx : -1,
        selectedArr : []
    }

    officer_item = []

    checkReady = () => {
        var count = 0
        for (var i = 0 ; i < this.state.selectedArr.length ; i ++) {
            if (this.state.selectedArr[i] == 1) {
                count ++
            }
        }
        if (count > 0) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
        
        
    }

    async setLocalStorage (info) {
        var obj = {
            user : {
                email : global.user_info.email,
                password : global.user_info.password
            },
            personal_status : '1',
            proof_status : '1',
            verification_state : '1',
            business_status : '1'

        }
        await AsyncStorage.setItem('signup_step' , JSON.stringify(obj))

        await AsyncStorage.setItem('business_status', '1')
        await AsyncStorage.setItem('business_info', JSON.stringify(info))
    }

    postinfo () {
        this.officerVerification()
    }

    officerVerification () {
        if (!this.state.isReady) return

        var result_arr = []
        for (var i = 0 ; i < this.state.officer_arr.length;i++) {
            if (this.state.selectedArr[i] == 1) {
                result_arr.push(this.state.officer_arr[i])
            }
        }

        this.officer_item = result_arr
        
        this.setState({isLoading : true})
        var obj = {
            business_type : "registered",
            company_name : global.company_info.title,
            company_number : global.company_info.company_number,
            company_address : global.company_info.address_snippet,
            company_status : global.company_info.company_status,
            officer_list : {
                items : this.officer_item
            }
        }
        console.log(obj.officer_list.items)
        CompanyService.verificationOfficer(obj, global.token).then(result => {
            var data = result.data.result
            if (data.success) {
                global.business_status = true
                this.setLocalStorage(obj)
                this.props.navigation.navigate('WelcomeScreen', {refresh : true})
            } else {
                if (data.message == '' || data.message == undefined) {
                    alertMessage(ErrorMessage.network_error)
                } else {
                    Alert.alert(
                        'FAILED',
                        'Officer data not match with Companies House, Please go back and select Unregistered Account',
                        [
                          {text: 'OK', onPress: () => this.gotoBusiness()},
                        ],
                        {cancelable: false},
                    );
                    // alertMessage(data)
                }
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log(error.message)
            alertMessage(ErrorMessage.network_error)
            this.setState({isLoading : false})
        })
    }
    gotoBusiness () {
        global.unregistered = true
        this.props.navigation.navigate('BusinessDetail', {refresh : true})
    }
    proceed () {
        this.postinfo()
    }

    selectOfficer = (idx) => {
        var temp = this.state.selectedArr
        for (var i = 0 ;i < temp.length ; i ++) {
            if (i == idx) {
                if (temp[i] == 0) {
                    temp[i] = 1
                    this.officer_item.push(this.state.officer_arr[idx])
                } else {
                    temp[i] = 0
                }
                break;
            }
        }
        this.setState({selectedArr : temp}, () => {this.checkReady()})
    }

    render() {
        return (
            <SafeAreaView style={{flex :1}}>
                <View style={{width : '100%' , height : '100%'}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <View style={{flex : 1 , flexDirection : 'column'}}>
                        <View style={{flex : 0.1,justifyContent : 'center', marginLeft : 35 * metrics}}>
                            <Text style={global_style.input_title}>Select Officer</Text>
                        </View>
                        <View style={{flex : 0.8}}>
                            <ScrollView>
                                <View style={global_style.input_body}>
                                    <View style={{flexDirection : 'column'}}>
                                        {
                                            this.state.officer_arr.map((item , idx) => {
                                                return (
                                                    <TouchableOpacity style={{marginBottom : 10 * metrics}} key={idx} onPress={() => this.selectOfficer(idx)}>
                                                        <CustomOfficer
                                                            textName = {item.name}
                                                            textAddress = {item.address.premises + ' ' + item.address.locality + ' ' + item.address.country + ' ' + item.address.address_line_1}
                                                            textRole = {item.officer_role}
                                                            textBirth = {item.date_of_birth}
                                                            textAppoint = {item.appointed_on}
                                                            textNation = {item.nationality}
                                                            textResidence = {item.country_of_residence}
                                                            textOccupation = {item.occupation}
                                                            activeIdx={this.state.selectedArr[idx] == 1 ? 1 : 0}
                                                            index = {idx}
                                                            activeButton = {(value) => {
                                                                this.selectOfficer(value)
                                                            }}
                                                        ></CustomOfficer>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                        
                                    </View>
                                    
                                    <View style={{height : 20}}></View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{flex : 0.1,width :'85%', alignItems : 'center' , justifyContent : 'center',alignSelf : 'center'}}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.proceed()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                <MaterialIcon style={global_style.right_icon} name="arrow-right" size={30 * metrics}></MaterialIcon>
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