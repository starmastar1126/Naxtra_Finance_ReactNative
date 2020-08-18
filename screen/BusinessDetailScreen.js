/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity,StyleSheet,ActivityIndicator, AsyncStorage,SafeAreaView} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import FontistoIcon from 'react-native-vector-icons/Fontisto'
import TextComponent from '../components/TextComponent'
import UserService from '../service/UserService';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper'
import { Fonts } from '../constants/Fonts'
import { ScrollView } from 'react-native-gesture-handler';
import { alertMessage } from '../utils/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const placeholder = {
    label : 'Select Company type',
    value : null,
    color : 'gray'
}
const address_placholder = {
    label: 'Address',
    value: null,
    color: '#9EA0A4',
}

export default class BusinessDetailScreen extends Component {
    componentDidMount () {
        // if (global.unregistered == true) {
        //     this.setState({activeIdx : 2})
        // }
        // global.token = '&aeT9&G[4}Vaag}R[7*,RA3I9<J88v)pu2m.$l8?k[1wWGfN8043000000001'
        if (this.state.activeIdx == 1) {
            var objs = {
                type : 'registered'
            }
            UserService.getBusinessType(objs, global.token).then(result => {
                var data = result.data.result
                global.company_type = data.response
                var mid_arr = []
                for (var i = 0 ; i < global.company_type.length ; i++) {
                    var res = {
                        label : global.company_type[i].name,
                        txt : global.company_type[i].value,
                        value : i
                    }
                    mid_arr.push(res)
                }
                this.setState({business_arr : mid_arr})
            }).catch(error => {
                console.log(error)
            })
        }
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    state = {
        b_type : '',
        company_name : '',
        company_number : '',
        isReady : false,
        business_arr : [],
        activeIdx : 1,
        address_arr : [],
        post_code : '',
        business_name : '',
        address : '',
        country : '',
        county : '',
        city : '',
        house_no : '',
        building_name : '',
        address_info : '',
        street_name : '',
        isLoading : false
    }
    checkReady = () => {
        if (this.state.b_type != '' && this.state.company_name != '' && this.state.activeIdx == 1) 
            this.setState({isReady : true})
        else if (this.state.business_name != '' && this.state.address != '' && this.state.city != '' && this.state.country != '' && this.state.county && this.state.activeIdx == 2)
            this.setState({isReady : true})
        else 
            this.setState({isReady : false})
    }
    selectType = (value) => {
        this.setState({b_type : this.state.business_arr[value].txt}, () => {this.checkReady()})
    }

    async setLocalStorage (data) {
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
        await AsyncStorage.setItem('business_info', JSON.stringify(data))
    }

    async validate () {
        if (this.state.activeIdx == 2) {
            if (!this.state.isReady)
                return
            var obj = {
                business_type : "unregistered",
                business_name : this.state.business_name,
                post_code : this.state.post_code,
                address : this.state.address,
                house_no : this.state.house_no,
                building_name : this.state.building_name,
                address_info : this.state.address,
                street_name : this.state.street_name,
                city : this.state.city,
                county: this.state.county,
                country : this.state.country,
            }
            console.log('address = ', this.state.address)
            this.setState({isLoading : true})
            UserService.signUpUnregistered(obj, global.token).then(res => {
                var data = res.data.result
                if (data.success && data.message != '') {
                    var objs = {
                        business_type : "unregistered",
                        company_name : this.state.business_name,
                        company_number : '',
                        company_address : this.state.address,
                        company_status : 'Active',
                        token : global.token, //test
                        officer_list : {
                            items : []
                        }
                    }
                    this.setLocalStorage(objs)
                    this.props.navigation.navigate('WelcomeScreen', {refresh : true})
                } else {
                    if (data.message == undefined) {
                        var objs = {
                            business_type : "unregistered",
                            company_name : this.state.business_name,
                            company_number : '',
                            company_address : this.state.address,
                            company_status : 'Active',
                            token : global.token, //test
                            officer_list : {
                                items : []
                            }
                        }
                        this.setLocalStorage(objs)
                        this.props.navigation.navigate('WelcomeScreen', {refresh : true})
                    }
                    else
                        alertMessage(data.message)
                }
                this.setState({isLoading : false})
            }).catch(error => {
                console.log(error)
                this.setState({isLoading : false})
            })
        } else {
            if (!this.state.isReady)
                return;
            var obj = {
                b_type : this.state.b_type,
                company_name : this.state.company_name,
                company_number : this.state.company_number
            }
            global.businessData = obj
            this.setState({
                company_name : '',
                b_type : -1,
                isReady : false
            })
            this.props.navigation.navigate('CompanyScreen')
        }
    }
    selectAddress = (value) => { 
        if (value == null) {
            this.setState({address : ''})
            return;
        }
        this.setState({address : this.state.address_arr[value].label})
        if (value != null) {
            var address_info = this.state.real_address_arr[value]
            
            var arr = address_info.line_1.split(' ')
            var street_name = ''
            for (var i = 0; i < arr.length ; i++) {
                if (arr[i] != address_info.building_number) {
                    if (i == arr.length -1) {
                        street_name += arr[i]
                    } else {
                        street_name += arr[i] + ' '
                    }
                }
            }

            this.setState({
                city : address_info.town_or_city,
                county : address_info.county,
                country : address_info.country,
                building_name : address_info.building_name,
                house_no : address_info.building_number,
                address_info : address_info.sub_building_name,
                street_name : street_name
            },() => this.checkReady())
        }
    }
    onSearchPostCode = () => {
        if (this.state.post_code == '') {
            alertMessage(ErrorMessage.error_post_code_message)
            return;
        }
        this.setState({address_arr : []}) 
        var token = global.token
        var obj = {
            post_code : this.state.post_code,
            token : token
        }
        this.setState({isLoading : true})
        UserService.getAddressInfo(obj).then(res => {
            var data = res.data.result
            
            if (data.success) {
                var arr = data.response.addresses
                this.setState({real_address_arr : arr})
                if (arr.length > 0) {
                    var temp = []
                    for (var i = 0 ; i < arr.length ; i++) {
                        var address = ''
                        if (arr[i].formatted_address.length > 0) {
                            for (var j = 0 ; j < arr[i].formatted_address.length ; j++) {
                                address += arr[i].formatted_address[j] + ' '
                            }
                        } else {
                            address = ''
                        }
                        var obj = {
                            label : address,
                            value : i,
                        }
                        temp.push(obj)
                    }
                }
                this.setState({address_arr : temp}) 
            }

            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(error.message)
            this.setState({isLoading : false})
        })
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                <View style={{width : '100%' , height : '100%'}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <View style={global_style.input_body}>
                        <View style={{marginTop : 30 * metrics}}></View>
                        <Text style={global_style.input_title}>Business Details</Text>
                        <View style={{height : 35 * metrics, flexDirection : 'row' ,marginTop : 40 * metrics}}>
                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({activeIdx : 1})}>
                                <View style={{justifyContent : 'center'}}>
                                    <RadioButton
                                        value="first"
                                        status={this.state.activeIdx == 1 ? 'checked' : 'unchecked'}
                                        color={Colors.main_color}
                                        onPress={() => this.setState({isReady : false , activeIdx : 1})}
                                    />
                                </View>
                                
                                <View style={{justifyContent : 'center'}}>
                                    <Text>Registered</Text>
                                </View>
                                
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({activeIdx : 2})}>
                                <View style={{justifyContent : 'center'}}>
                                    <RadioButton
                                        value="second"
                                        status={this.state.activeIdx == 2 ? 'checked' : 'unchecked'}
                                        color={Colors.main_color}
                                        onPress={() => this.setState({isReady : false , activeIdx : 2})}
                                    />
                                </View>
                                
                                <View style={{justifyContent : 'center'}}>
                                    <Text>Unregistered</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.activeIdx == 1 && 
                            <View style={{marginTop : 40 * metrics}}>
                                <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                    {
                                        this.state.b_type != '' && 
                                        <Text style={{marginTop : 15 * metrics, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Company Type</Text>
                                    }
                                    <View style={{marginTop : 15 * metrics}}></View>
                                    <RNPickerSelect
                                        onValueChange={(value) => this.selectType(value)}
                                        items={this.state.business_arr}
                                        placeholderTextColor={Colors.dark_gray}
                                        placeholder = {placeholder}
                                        style={styles.picker_style}
                                        useNativeAndroidPickerStyle={false}
                                        textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                    />
                                </View> 
                                <TextComponent
                                    textPlaceHolder = "Company Name"
                                    textValue={this.state.company_name}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({company_name : value},() => {this.checkReady()})}
                                > </TextComponent>
                            </View>
                        }
                        {
                            this.state.activeIdx == 2 && 
                            <View style={{marginTop : 20 * metrics, marginBottom : 20 * metrics}}>
                                <Text style={styles.officer}>OFFICER : {global.user_info.first_name} {global.user_info.middle_name} {global.user_info.last_name}</Text>
                                <ScrollView style={{height : '70%'}}>
                                    <TextComponent
                                        textPlaceHolder = "Business Name"
                                        textValue={this.state.business_name}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({business_name : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    <View style={{flexDirection : 'row', alignItems :'center', justifyContent : 'center'}}>
                                        <TextComponent
                                            textPlaceHolder = "Postcode"
                                            textValue={this.state.post_code}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({post_code : value},() => {this.checkReady('post_code')})}
                                        > </TextComponent>
                                        <TouchableOpacity style={this.state.post_code == '' ? global_style.search_btn : global_style.search_move_btn} onPress={() => this.onSearchPostCode()}>
                                            <FontistoIcon name="search" size={18 * metrics} color={Colors.gray_color} style={global_style.search_icon}></FontistoIcon>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{marginTop : 10 * metrics}}></View>
                                    <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                        {
                                            this.state.address != '' && 
                                            <Text style={{marginTop : 15 * metrics, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Address</Text>
                                        }
                                        {
                                            Platform.OS == 'ios' &&
                                            <View style={{marginTop : 15 * metrics}}></View>
                                        }
                                        <RNPickerSelect
                                            onValueChange={(value) => this.selectAddress(value)}
                                            items={this.state.address_arr}
                                            placeholderTextColor={Colors.dark_gray}
                                            placeholder={address_placholder}
                                            style={styles.picker_style}
                                            useNativeAndroidPickerStyle={false}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                    </View>
                                    <TextComponent
                                        textPlaceHolder = "City"
                                        textValue={this.state.city}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({city : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    <TextComponent
                                        textPlaceHolder = "County"
                                        textValue={this.state.county}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({county : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    <TextComponent
                                        textPlaceHolder = "Country"
                                        textValue={this.state.country}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({country : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    <View style={{height : 70 * metrics}}></View>
                                </ScrollView>
                                
                            </View>
                        }

                        <View style={{position : 'absolute', bottom : 20 , width : '100%' , height : 60 * metrics}}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.validate()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
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
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    picker_style : {
        fontSize : 20 * metrics,
        color : 'black'
    },
    officer : {
        fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, color : 'blue'
    }
})