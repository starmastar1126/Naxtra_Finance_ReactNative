/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text,ScrollView,TouchableOpacity, ActivityIndicator, AsyncStorage,SafeAreaView} from 'react-native'
import global_style , { metrics } from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import FontistoIcon from 'react-native-vector-icons/Fontisto'
import TextComponent from '../components/TextComponent'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import { Fonts } from '../constants/Fonts'
import { validEmail , alertMessage} from '../utils/utils'
import UserService from '../service/UserService';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const address_placholder = {
    label: 'Select Address',
    value: null,
    color: Colors.gray_color,
}
const address_placholder2 = {
    label: 'Select Address',
    value: null,
    color: '#9EA0A4',
}

const nation_placeholder = {
    label: 'Nationality',
    value: null,
    color: '#9EA0A4',
}

const country_placeholder = {
    label: 'Country',
    value: null,
    color: '#9EA0A4',
}

export default class PersonalDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        post_code : '',
        address : '',
        house_no : '',
        building_name : '',
        address_info : '',
        street_name : '',
        city : '',
        country : '',
        county : '',
        nationality : '',
        isReady : false,
        isLoading : false,
        post_address : '',
        address_arr : [],
        real_address_arr : [],
        valid_post_code : true,
        valid_address : true,
        valid_house_no : true,
        valid_address_info : true,
        valid_street_name : true,
        valid_building_name : true,
        valid_city : true,
        valid_country : true,
        valid_county : true,
        valid_nationallity : true,
        country_list : [],
        national_list : [],
        nation_value : -1,
        country_value : 235
    }

    componentDidMount () {
        this.setState({isLoading : true})
        this.getCountryList()
        this.getNationalityList()
    }

    getCountryList () {
        if (global.token == undefined)
        {
            this.props.navigation.navigate('LoginScreen')
            this.setState({isLoading : false})
            return
        }
        // var token = "&aeT9&G[4}Vaag}R[7*,RA3I9<J88v)pu2m.$l8?k[1wWGfN8043000000001"
        UserService.getCountryList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var temp = []
                for (var i = 0 ;i < data.response.length ;i++) {    
                    var obj = {
                        label : data.response[i].name,
                        value :i ,
                        id : data.response[i].id,
                    }
                    if (obj.label == 'United Kingdom') {
                        this.setState({country_value : i})
                    }
                    temp.push(obj)
                }
                this.setState({country_list : temp})
            }
        })
    } 

    getNationalityList () {
        if (global.token == undefined)
        {
            this.props.navigation.navigate('LoginScreen')
            this.setState({isLoading : false})
            return
        }
        // var token = "&aeT9&G[4}Vaag}R[7*,RA3I9<J88v)pu2m.$l8?k[1wWGfN8043000000001"
        UserService.getNationalityList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var temp = []
                for (var i = 0 ;i < data.response.length ;i++) {
                    var obj = {
                        label : data.response[i].name,
                        value :i ,
                        id : data.response[i].id,
                        code : data.response[i].code
                    }
                    // if (obj.label == 'British') {
                    //     this.setState({nation_value : i})
                    // }
                    temp.push(obj)
                }
                this.setState({national_list : temp})
            } else {
                alert(data.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
        })
    }

    checkReady = () => {
        if (this.state.post_code != '' && this.state.city != '' && this.state.country != '' && this.state.nationality != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }

    }

    onSubmit = async() => {
        if (!this.state.isReady)
            return;
        global.personal_status = true;

        var personalData = {
            post_code : this.state.post_code,//, //'NN13ER'
            address : this.state.address,
            house_no : this.state.house_no,
            account_type : global.accountType == 0 ? 'personal' : 'business',
            building_name : this.state.building_name,
            address_info : this.state.address_info,
            street_name : this.state.street_name,
            city : this.state.city,
            country : this.state.country,
            county : this.state.county,
            nationality : this.state.nationality,
        }
        global.personalData = personalData
        this.setState({isLoading : true})
        UserService.signUpPersonalDetail(personalData, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                if (global.accountType != 0) { 
                    var obj = {
                        //token: global.token,
                        account_type : global.accountType == 0 ? 'personal' : 'business',
                        post_code : global.personalData.post_code,
                        address : global.personalData.address,
                        house_no : global.personalData.house_no,
                        building_name : global.personalData.building_name,
                        address_info : global.personalData.address_info,
                        street_name : global.personalData.street_name,
                        city : global.personalData.city,
                        county:global.personalData.county,
                        country : global.personalData.country,
                        nationality : global.personalData.nationality,
                        identity_proof : "g",
                        identity_proof_type : "driving_licence",
                        address_proof : "g",
                        address_proof_type : "Bill_of_electricity",
                        take_selfie : "g",
                        upload_video : "g",
                        // 'sign-urn' : global.signup_urn
                    }
                    console.log(obj)
                    UserService.signupPostInfo(obj, global.token).then(result => {
                        var data = result.data.result
                        if (data.success) {
                            this.gotoWelcome()
                        } else {
                            alertMessage(data.message)
                        }
                        //this.gotoWelcome()
                        this.setState({isLoading : false})
                    }).catch(error => {
                        console.log(error)
                        this.setState({isLoading : false})
                    })
                } else {
                    this.gotoWelcome()
                }
                
            } else {
                console.log('error = ' , data.message)
                this.setState({isLoading : false})    
            }
        }).catch(error => {
            console.log(error)
            this.setState({isLoading : false})
        })
    }

    async gotoWelcome () {
        var obj = {
            user : {
                email : global.user_info.email,
                password : global.user_info.password
            },
            personal_status : '1',
            proof_status : '',
            verification_state : '',
            business_status : ''

        }
        await AsyncStorage.setItem('signup_step' , JSON.stringify(obj))
        await AsyncStorage.setItem('personal_status', '1')
        this.props.navigation.navigate('WelcomeScreen', {refresh : true})
    }

    showMessage = (value) => {
        switch (value) {
            case "post_code" :
                if (this.state.post_code != '')
                    this.setState({valid_post_code : true})
                else
                    this.setState({valid_post_code : false})
                break;
            case "address" :
                if (this.state.address != '')
                    this.setState({valid_address : true})
                else
                    this.setState({valid_address : false})
                break;
            case "house_no" :
                if (this.state.house_no != '')
                    this.setState({valid_house_no : true})
                else
                    this.setState({valid_house_no : false})
                break;
            case "building" :
                if (this.state.building_name != '')
                    this.setState({valid_building_name : true})
                else
                    this.setState({valid_building_name : false})
                break;
            case "address_info" :
                if (this.state.address_info != '')
                    this.setState({valid_address_info : true})
                else
                    this.setState({valid_address_info : false})
                break;
            case "street_name" :
                if (this.state.street_name != '')
                    this.setState({valid_street_name : true})
                else
                    this.setState({valid_street_name : false})
                break;
            case "city" :
                if (this.state.city != '')
                    this.setState({ valid_city : true})
                else
                    this.setState({ valid_city : false})
                break;
            case "country" :
                if (this.state.country != '')
                    this.setState({valid_country : true})
                else
                    this.setState({valid_country : false})
                break;
            case "nation" :
                if (this.state.nationality != '')
                    this.setState({valid_nationallity : true})
                else
                    this.setState({valid_nationallity : false})
                break;
            case "county" :
                if (this.state.county != '')
                    this.setState({valid_county : true})
                else
                    this.setState({valid_county : false})
                break;
        }
    }
    onSearchPostCode = () => {
        if (this.state.post_code == '') {
            alertMessage(ErrorMessage.error_post_code_message)
            return;
        }
        this.setState({address_arr : []}) 
        // var post_code = "NN13er" //test post code
        var token = global.token
        var obj = {
            post_code : this.state.post_code,
            token : token
        }
        this.setState({isLoading : true})
        UserService.getAddressInfo(obj).then(res => {
            var data = res.data.result
            
            if (data.success) {
                if (data.response == null) {
                    this.setState({address_arr : []})
                } else {
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
                                key : i
                            }
                            temp.push(obj)
                        }
                    }
                    this.setState({address_arr : temp})    
                }
            }

            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(error.message)
            this.setState({isLoading : false})
        })
    }

    selectedCountry = (value) => {
        if (value == null) {
            this.setState({country : ''}, () => {
                this.checkReady()
            })
            return;
        }
        this.setState({country_value : value})
        this.setState({country : this.state.country_list[value].label}, () => {
            this.checkReady()
        })
    }   

    selectedNationality = (value) => {
        if (value == null) {
            this.setState({nationality : ''}, () => {
                this.checkReady()
            })
            return;
        }
        this.setState({nation_value : value})
        this.setState({nationality : this.state.national_list[value].label}, () => {
            this.checkReady()
        })
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
            var origin_number = address_info.building_number
            var house_no = ''
            for (var i = 0; i < origin_number.length; i ++) {
                if (Number(origin_number[i]).toString() != "NaN") {
                    house_no = house_no + origin_number[i]
                }
            }
            this.setState({
                city : address_info.town_or_city,
                county : address_info.county,
                // country : address_info.country,
                building_name : address_info.building_name,
                house_no : house_no,
                address_info : address_info.sub_building_name,
                street_name : street_name
            },() => this.checkReady())
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
                <View style={{width : '100%' , height : '100%'}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={{flex : 0.9}}>
                            <ScrollView style={{flex : 1}}>
                                <View style={global_style.input_body}>
                                    <View style={{marginTop : 30 * metrics}}></View>
                                    <Text style={global_style.input_title}>Personal Details</Text>
                                    <View style={{flexDirection : 'row', alignItems :'center', justifyContent : 'center'}}>
                                        <TextComponent
                                            textPlaceHolder = "Postcode"
                                            textValue={this.state.post_code}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({post_code : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TouchableOpacity style={this.state.post_code == '' ? global_style.search_btn : global_style.search_move_btn} onPress={() => this.onSearchPostCode()}>
                                            <FontistoIcon name="search" size={18 * metrics} color={Colors.gray_color} style={global_style.search_icon}></FontistoIcon>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    {
                                        !this.state.valid_post_code &&
                                        <Text style={global_style.error}>{ErrorMessage.error_post_code_required}</Text>
                                    }

                                    <View style={{marginTop : 15 * metrics}}></View>
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
                                            useNativeAndroidPickerStyle = {false}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                            disabled={this.state.address_arr.length > 0 ? false : true}
                                        />
                                    </View>
                                    {
                                        !this.state.valid_address &&
                                        <Text style={global_style.error}>{ErrorMessage.error_address_required}</Text>
                                    }

                                    <View style={{flexDirection : 'row'}}>
                                        <View style={{flex : 0.45}}>
                                            <TextComponent
                                                textPlaceHolder = "House No"
                                                textValue={this.state.house_no}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({house_no : value},() => {this.checkReady()})}
                                            > </TextComponent>
                                            {
                                                !this.state.valid_house_no &&
                                                <Text style={global_style.error}>{ErrorMessage.error_houseno_required}</Text>
                                            }
                                        </View>
                                        <View style={{flex : 0.1}}></View>
                                        <View style={{flex : 0.45}}>
                                            <TextComponent
                                                textPlaceHolder = "Building Name"
                                                textValue={this.state.building_name}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({building_name : value},() => {this.checkReady()})}
                                            > </TextComponent>
                                            {
                                                !this.state.valid_building_name &&
                                                <Text style={global_style.error}>{ErrorMessage.error_building_name_required}</Text>
                                            }
                                        </View>
                                    </View>
                                    <TextComponent
                                        textPlaceHolder = "Address Info"
                                        textValue={this.state.address_info}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({address_info : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    {
                                        !this.state.valid_address_info &&
                                        <Text style={global_style.error}>{ErrorMessage.error_address_info_required}</Text>
                                    }
                                    <TextComponent
                                        textPlaceHolder = "Street Name"
                                        textValue={this.state.street_name}
                                        textType="text"
                                        ready={this.state.isReady}
                                        onChangeText = {(value) => this.setState({street_name : value},() => {this.checkReady()})}
                                    > </TextComponent>
                                    {
                                        !this.state.valid_street_name &&
                                        <Text style={global_style.error}>{ErrorMessage.error_street_name_required}</Text>
                                    }
                                    <View style={{flexDirection : 'row'}}>
                                        <View style={{flex : 0.45}}>
                                            <TextComponent
                                                textPlaceHolder = "City"
                                                textValue={this.state.city}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({city : value},() => {this.checkReady()})}
                                            > </TextComponent>
                                            {
                                                !this.state.valid_city &&
                                                <Text style={global_style.error}>{ErrorMessage.error_city_required}</Text>
                                            }
                                        </View>
                                        <View style={{flex : 0.1}}></View>
                                        <View style={{flex : 0.45}}>
                                            <TextComponent
                                                textPlaceHolder = "County"
                                                textValue={this.state.county}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({county : value},() => {this.checkReady()})}
                                            > </TextComponent>
                                            {
                                                !this.state.valid_county &&
                                                <Text style={global_style.error}>{ErrorMessage.error_county_required}</Text>
                                            }
                                        </View>
                                    </View>
                        
                                    <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                        <View style={{marginTop : 15 * metrics}}></View>
                                        {
                                            this.state.country != '' && 
                                            <Text style={{marginTop : 15 * metrics, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Country</Text>
                                        }
                                        {
                                            Platform.OS == 'ios' &&
                                            <View style={{marginTop : 15 * metrics}}></View>
                                        }
                                        <RNPickerSelect
                                            onValueChange={(value) => this.selectedCountry(value)}
                                            value={this.state.country_value}
                                            items={this.state.country_list}
                                            placeholderTextColor={Colors.dark_gray}
                                            placeholder = {country_placeholder}
                                            useNativeAndroidPickerStyle = {false}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                    </View>
                                    <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                        <View style={{marginTop : 15 * metrics}}></View>
                                        {
                                            this.state.nationality != '' && 
                                            <Text style={{marginTop : 15 * metrics, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Nationality</Text>
                                        }
                                        {
                                            Platform.OS == 'ios' &&
                                            <View style={{marginTop : 15 * metrics}}></View>
                                        }
                                        <RNPickerSelect
                                            onValueChange={(value) => this.selectedNationality(value)}
                                            value={this.state.nation_value}
                                            items={this.state.national_list}
                                            placeholderTextColor={Colors.dark_gray}
                                            placeholder = {nation_placeholder}
                                            useNativeAndroidPickerStyle = {false}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                    </View> 
                                    <View style={{marginTop : 60 * metrics}}></View>

                                    
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{flex : 0.1, width : '85%' , alignSelf : 'center'}}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onSubmit()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Submit</Text>
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