/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, View,Text,StyleSheet,Image,TouchableOpacity,SafeAreaView, ScrollView, BackHandler, Platform} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import * as ErrorMessage from '../../constants/ErrorMessage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Fonts } from '../../constants/Fonts'
import CRMHeaderComponent from '../../components/CRMHeaderComponent';
import { RadioButton } from 'react-native-paper'
import { CheckBox } from 'react-native-elements'
import TextComponent from '../../components/TextComponent'
import { validEmail, alertMessage } from '../../utils/utils';
import PhoneInput from 'react-native-phone-input';
import UserService from '../../service/UserService'
import RNPickerSelect from 'react-native-picker-select';
import CrmService from '../../service/CrmService'
import ContactChildComponent from '../../components/ContactChildComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const address_placholder = {
    label: 'Select Address',
    value: null,
    color: '#9EA0A4',
}

const country_placeholder = {
    label: 'Country',
    value: null,
    color: '#9EA0A4',
}

const contact_placeholder = {
    label: 'Select ...',
    value: null,
    color: '#9EA0A4',
}

export default class CreateCRMScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isSelectedType : -1, // all - 0 : companies , 1 : individuals
            isReady : false,
            active_type : 0 ,// componies
            check_supplier : false,
            check_coustomers : false,
            check_beneficiary : false,
            //
            country_list : [],
            company_name : '',
            post_code : '',
            show_post_code : '',
            house_no : '',
            street_name : '',
            city : '',
            county : '',
            country : '',
            phone_number : '',
            email : '',
            contact_email : '',
            contact_phonenumber : '',
            web_site : '',
            building_name : '',
            address_info : '',
            
            exist_email : true,
            invalid_email : false,
            isLoading : false,
            isValidPhone : true,
            isValidContactPhone : true,
            country_code : '+44',
            contact_country_code : '+44',

            address_arr : [],
            real_address_arr : [],
            address : '',
            contact_arr : [
                {
                    label: 'Contact1',
                    value: 0,
                },
                {
                    label: 'Contact2',
                    value: 1,
                }
            ],
            title : '',
            first_name : global.user_info.first_name,
            last_name : global.user_info.last_name,
            job_position : '',
            notes : '',
            country_value : 235,
            isShow_contact : false,
            is_show_add : false,
            is_edit : false,
            customer_id : -1
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.header_ref = null
    }
    handleBackButtonClick () {
        if (this.state.isShow_contact) {
            this.setState({isShow_contact : false})
            return true
        } else {
            return false
        }
    }
    gotoList () {
        this.setState({isShow_contact : false})
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    setValueFromEdit () {
        if (global.detail_info.company_type == 'person') {
            this.setState({
                active_type : 1,
                company_name : !global.detail_info.name ? '' : global.detail_info.name,
            })
        } else {
            this.setState({
                active_type : 0,
                company_name : !global.detail_info.name ? '' : global.detail_info.name,
            })

        }
        console.log(global.detail_info)
        this.setState({
            customer_id :global.detail_info.id, 
            post_code : '',
            house_no : !global.detail_info.house_number ? '' : global.detail_info.house_number,
            street_name : !global.detail_info.street ? '' : global.detail_info.street,
            city : !global.detail_info.city ? '' : global.detail_info.city,
            county : !global.detail_info.county ? '' : global.detail_info.county,
            country : !global.detail_info.country ? '' : global.detail_info.country,
            phone_number : !global.detail_info.phone ? '' : global.detail_info.phone,
            email : !global.detail_info.email ? '' : global.detail_info.email,
            web_site : !global.detail_info.website ? '' : global.detail_info.website,
            is_show_add : true,
            is_edit : true,
            check_coustomers : global.detail_info.customer,
            check_supplier : global.detail_info.supplier
        })
    }
    componentDidMount () {
        if (global.is_edit) {
            this.setValueFromEdit()
        }
        if (global.is_customer) {
            this.setState({check_coustomers : true})
        }
        if (global.is_supplier) {
            this.setState({check_supplier : true})
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({item_arr : this.state.total_list,isSelectedType : -1,})
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
                        console.log('i = ' ,i)
                        this.setState({country_value : i})
                    }
                    temp.push(obj)
                }
                this.setState({country_list : temp})
            } else {
                console.log(data)
            }
        })
        if (global.is_edit) {

        } else {
            this.setState({is_show_add : false})
        }

        setTimeout(() => {
            global.is_edit = false
            global.is_customer = false
            global.is_supplier = false
        }, 500);
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    }
    goBack = () => {
        this.props.navigation.goBack()
    }
    changeMobileNumber = (value) => {
		this.setState({ isValidPhone : this.phone.isValidNumber() })
        this.setState({ country_code: '+' + this.phone.getCountryCode() })
        this.setState({ phone_number: value })
        this.checkReady()
    }
    changeContactNumber (value) {
        this.setState({ isValidContactPhone : this.contact_phone.isValidNumber() })
        this.setState({ contact_country_code: '+' + this.contact_phone.getCountryCode() })
        this.setState({ contact_phonenumber: value })
        this.checkReady()    
    }

    checkReady () {
        if (!this.state.isShow_contact) {
            if (this.state.company_name != '' && this.state.phone_number && this.state.email != '' && this.state.first_name != '' && this.state.last_name != '') { //&& this.state.post_code != '' && this.state.show_post_code != '' && this.state.country != '' && this.state.phone_number != '' && this.state.isValidPhone && this.state.exist_email && !this.state.invalid_email && this.state.web_site != ''
                this.setState({isReady : true})
            } else {
                this.setState({isReady : false})
            }
        } else {
            if (this.state.company_name != '' && this.state.phone_number && this.state.email != '' && this.state.first_name != '' && this.state.last_name != '') { //&& this.state.post_code != '' && this.state.show_post_code != '' && this.state.country != '' && this.state.phone_number != '' && this.state.isValidPhone && this.state.exist_email && !this.state.invalid_email && this.state.web_site != '' && this.state.first_name != '' && this.state.last_name != '' && this.state.job_position != ''
                this.setState({isReady : true})
            } else {
                this.setState({isReady : false})
            }
        }
        
    }
    checkReadyIndividuals () {
        if (this.state.title != '' && this.state.first_name != '' && this.state.last_name != '' && this.state.job_position != '' && this.state.notes != '' && this.state.phone_number !='' && this.state.isValidPhone && this.state.exist_email && !this.state.invalid_email) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    onConfirm () {
        if (global.vender_edit) {
            console.log('edit')
            var arr = []
            if (this.state.check_supplier) {
                arr.push(1)
            }
            if (this.state.check_coustomers){
                arr.push(2)
            }
            if (this.state.check_beneficiary) {
                arr.push(3)
            }
            var obj = {
                company_type: this.state.active_type == 0 ? "company" : "person",
                name: this.state.company_name,
                house_number: this.state.house_no,
                building_name: this.state.building_name,
                address_info: this.state.address_info,
                street: this.state.street_name,
                street2:"",
                city: this.state.city,
                county:this.state.city,
                zip:this.state.post_code.toString().toUpperCase(),
                country_id: this.state.country_value,//this.state.country_value,
                category_id : arr,
                phone: this.state.phone_number,
                email: this.state.email,
                website: this.state.web_site,
                function : "Founder",
                ref : "Externeal reference",
                comment : "Internal Note Purpose",
                rb_first_name : this.state.first_name,
                rb_last_name: this.state.last_name
            }
            global.supplier_info = obj
            this.props.navigation.navigate('VendorEdit', {refresh : true})
        } else {
            
            if (this.state.is_edit) {
                var arr = []
                if (this.state.check_supplier) {
                    arr.push(1)
                }
                if (this.state.check_coustomers){
                    arr.push(2)
                }
                if (this.state.check_beneficiary) {
                    arr.push(3)
                }
                var obj = {
                    id : this.state.customer_id,
                    company_type: this.state.active_type == 0 ? "company" : "person",
                    name: this.state.company_name,
                    house_number: this.state.house_no,
                    building_name: this.state.building_name,
                    address_info: this.state.address_info,
                    street: this.state.street_name,
                    street2:"",
                    city: this.state.city,
                    county:this.state.city,
                    zip:this.state.post_code.toString().toUpperCase(),
                    country_id: this.state.country_value,//this.state.country_value,
                    category_id : arr,
                    phone: this.state.phone_number,
                    email: this.state.email,
                    website: this.state.web_site,
                    function : "Founder",
                    ref : "Externeal reference",
                    comment : "Internal Note Purpose",
                    rb_first_name : this.state.first_name,
                    rb_last_name: this.state.last_name
                }
                this.setState({isLoading : true})
                CrmService.updateCustomerWithoutContacts(global.token, obj, obj.id).then(res => {
                    var data = res.data.result
                    if (data.success) {
                        this.props.navigation.navigate('CRMListScreen', {refresh : true})
                    } else {
                        alertMessage(data.message)
                        console.log('error= ',data.message)
                    }
                    this.setState({isLoading : false})
                }).catch(error => {
                    console.log('error = ' , error.message)
                    this.setState({isLoading : false})
                })
            } else {
                var arr = []
                if (this.state.check_supplier) {
                    arr.push(1)
                }
                if (this.state.check_coustomers){
                    arr.push(2)
                }
                if (this.state.check_beneficiary) {
                    arr.push(3)
                }
                var obj = {
                    company_type: this.state.active_type == 0 ? "company" : "person",
                    name: this.state.company_name,
                    house_number: this.state.house_no,
                    building_name: this.state.building_name,
                    address_info: this.state.address_info,
                    street: this.state.street_name,
                    street2:"",
                    city: this.state.city,
                    county:this.state.county,
                    zip:this.state.post_code.toString().toUpperCase(),
                    country_id: this.state.country_value,//this.state.country_value,
                    category_id : arr,
                    phone: this.state.phone_number,
                    email: this.state.email,
                    website: this.state.web_site,
                    function : "Founder",
                    ref : "Externeal reference",
                    comment : "Internal Note Purpose",
                    rb_first_name : this.state.first_name,
                    rb_last_name: this.state.last_name
                }
                this.setState({isLoading : true})
                
                CrmService.createCustomerWithoutContacts(global.token, obj).then(res => {
                    var data = res.data.result
                    console.log('obj = ', data)
                    if (data.success) {
                        this.props.navigation.navigate('CRMListScreen', {refresh : true})
                    } else {
                        alertMessage(data.message)
                        console.log('error1= ',data.message)
                    }
                    this.setState({isLoading : false})
                }).catch(error => {
                    console.log('error = ' , error.message)
                    this.setState({isLoading : false})
                })
            }
            
        }
        
    }
    selectedCountry = (value) => {
        if (value == null) {
            this.setState({country : ''}, () => {
                this.checkReady()
            })
            return;
        }
        this.setState({country_value : value})
        this.setState({country : this.state.country_list[value].id}, () => {
            this.checkReady()
        })
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
                show_post_code : this.state.post_code.toString().toUpperCase(),
                building_name : address_info.building_name,
                house_no : address_info.building_number,
                address_info : address_info.sub_building_name,
                street_name : street_name
            },() => this.checkReady())
        }
    }
    selectContact = (value) => {

    }

    initData = () => {
        this.setState({
            isSelectedType : -1, // all - 0 : companies , 1 : individuals
            isReady : false,
            check_supplier : false,
            check_coustomers : false,
            check_beneficiary : false,
            //
            company_name : '',
            post_code : '',
            show_post_code : '',
            house_no : '',
            street_name : '',
            city : '',
            county : '',
            country : 235,
            phone_number : '',
            contact_phonenumber : '',
            contact_email : '',
            email : '',
            web_site : '',
            
            exist_email : true,
            invalid_email : false,
            isLoading : false,
            isValidPhone : true,
            isValidContactPhone :true,
            country_code : '+44',

            address_arr : [],
            real_address_arr : [],
            address : '',
            contact_arr : [
                {
                    label: 'Contact1',
                    value: 0,
                },
                {
                    label: 'Contact2',
                    value: 1,
                }
            ],
            title : '',
            first_name : '',
            last_name : '',
            job_position : '',
            notes : ''
        })
    }
    onChangeSupplier = () => {
        this.setState({check_supplier : !this.state.check_supplier, check_coustomers : false, check_beneficiary : false})
    }
    onChangeCustomer = () => {
        this.setState({check_coustomers : !this.state.check_coustomers, check_supplier : false, check_beneficiary : false})
    }
    onChangeBeneficiary = () => {
        this.setState({check_beneficiary : !this.state.check_beneficiary, check_coustomers : false, check_supplier : false})
    }
    render() {
        return (
            <SafeAreaView style={{width : '100%' , height : '100%'}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                    <View style={{flex : 1}}>
                        <CRMHeaderComponent navigation={this.props.navigation} goBack={() => this.goBack()} ref={(ref) => this.header_ref = ref} type={1}></CRMHeaderComponent>
                        <View style={{flexDirection :'column' , flex : 1}}>
                            <View style={styles.crm_type}>
                                <View style={styles.crm_item}>
                                    <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({active_type : 0, isShow_contact : false},() => this.initData())}>
                                        <View style={{justifyContent : 'center'}}>
                                            <RadioButton
                                                value="first"
                                                status={this.state.active_type == 0 ? 'checked' : 'unchecked'}
                                                color={Colors.main_color}
                                                onPress={() => this.setState({active_type : 0, isShow_contact : false}, () => this.initData())}
                                            />
                                        </View>
                                        
                                        <View style={{justifyContent : 'center'}}>
                                            <Text style={this.state.active_type == 0 ? styles.active_option : styles.option}>Companies</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({active_type : 1, isShow_contact : false},() => this.initData())}>
                                        <View style={{justifyContent : 'center'}}>
                                            <RadioButton
                                                value="second"
                                                status={this.state.active_type == 1 ? 'checked' : 'unchecked'}
                                                color={Colors.main_color}
                                                onPress={() => this.setState({active_type : 1, isShow_contact : false}, () => this.initData())}
                                            />
                                        </View>
                                        <View style={{justifyContent : 'center'}}>
                                            <Text style={this.state.active_type == 1 ? styles.active_option : styles.option}>Individuals</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.crm_item}>
                                    <View style={styles.check_body}>
                                        <CheckBox
                                            title='Suppliers'
                                            checked={this.state.check_supplier}
                                            containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                            textStyle={!this.state.check_supplier ? styles.check_title : styles.checked_title}
                                            checkedColor={Colors.main_color}
                                            onPress={()=> this.onChangeSupplier()}
                                        />
                                    </View>

                                    <View style={styles.check_body}>
                                        <CheckBox
                                            title='Customers'
                                            checked={this.state.check_coustomers}
                                            containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                            textStyle={!this.state.check_coustomers ? styles.check_title : styles.checked_title}
                                            checkedColor={Colors.main_color}
                                            onPress={()=> this.onChangeCustomer()}
                                        />
                                    </View>

                                    <View style={styles.check_body}>
                                        <CheckBox
                                            title='Beneficiary'
                                            checked={this.state.check_beneficiary}
                                            containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                            textStyle={!this.state.check_beneficiary ? styles.check_title : styles.checked_title}
                                            checkedColor={Colors.main_color}
                                            onPress={()=> this.onChangeBeneficiary()}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={!this.state.isShow_contact ? {flex : 0.65} : {flex : 0.7}}>
                                <ScrollView style={{flex : 1,marginBottom : 10 * metrics}}>
                                    <View style={styles.container}>
                                        <View style={{marginTop : 10 * metrics}}></View>
                                        {
                                            this.state.active_type == 1 ?
                                            <TextComponent
                                                textPlaceHolder = "User Name"
                                                textValue={this.state.company_name}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({company_name : value},() => {this.checkReady()})}
                                            />
                                            // <View style={{flexDirection : 'row'}}>
                                            //     <View style={{flex : 0.85}}>
                                            //         <TextComponent
                                            //             textPlaceHolder = "Company Name"
                                            //             textValue={this.state.company_name}
                                            //             textType="text"
                                            //             ready={this.state.isReady}
                                            //             onChangeText = {(value) => this.setState({company_name : value},() => {this.checkReady()})}
                                            //         />
                                            //     </View>
                                            //     <TouchableOpacity style={{flex : 0.15 ,justifyContent : 'flex-end', alignItems : 'flex-end'}}>
                                            //         <SimpleLineIcons name="magnifier" size={30 * metrics} color={Colors.dark_gray}></SimpleLineIcons>
                                            //     </TouchableOpacity>
                                            // </View>
                                            :
                                            <TextComponent
                                                textPlaceHolder = "Company Name"
                                                textValue={this.state.company_name}
                                                textType="text"
                                                ready={this.state.isReady}
                                                onChangeText = {(value) => this.setState({company_name : value},() => {this.checkReady()})}
                                            />
                                        }
                                        <View style={{flexDirection : 'row'}}>
                                            <View style={{flex : 0.85}}>
                                                <TextComponent
                                                    textPlaceHolder = "Enter Post Code"
                                                    textValue={this.state.post_code}
                                                    textType="text"
                                                    ready={this.state.isReady}
                                                    onChangeText = {(value) => this.setState({post_code : value},() => {this.checkReady()})}
                                                />
                                            </View>
                                            <TouchableOpacity style={{flex : 0.15 ,justifyContent : 'flex-end',alignItems : 'flex-end'}} onPress={() => this.onSearchPostCode()}>
                                                <SimpleLineIcons name="magnifier" size={30 * metrics} color={Colors.dark_gray}></SimpleLineIcons>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{marginTop : 15 * metrics}}></View>
                                        <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                            {
                                                this.state.address != '' && 
                                                <Text style={{marginTop : 15 * metrics,fontFamily :Fonts.adobe_clean, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Address</Text>
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
                                            />
                                        </View>

                                        <TextComponent
                                            textPlaceHolder = "House Number"
                                            textValue={this.state.house_no}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({house_no : value},() => {this.checkReady()})}
                                        />
                                        <TextComponent
                                            textPlaceHolder = "Street Name"
                                            textValue={this.state.street_name}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({street_name : value},() => {this.checkReady()})}
                                        />
                                        <TextComponent
                                            textPlaceHolder = "City"
                                            textValue={this.state.city}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({city : value},() => {this.checkReady()})}
                                        />
                                        <TextComponent
                                            textPlaceHolder = "County"
                                            textValue={this.state.county}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({county : value},() => {this.checkReady()})}
                                        />
                                        <TextComponent
                                            textPlaceHolder = "Post Code"
                                            textValue={this.state.show_post_code}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({show_post_code : value},() => {this.checkReady()})}
                                        />
                                        <View style={this.state.isReady ? global_style.selector_main : global_style.selector_normal}>
                                            {
                                                this.state.country != '' && 
                                                <Text style={{marginTop : 15 * metrics,fontFamily :Fonts.adobe_clean, marginLeft : 5 * metrics, color: Colors.dark_gray}}>Country</Text>
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
                                        {
                                            this.state.phone_number != '' &&
                                            <Text style={{marginTop : 15 * metrics ,fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color, marginLeft : 4 * metrics}}>PhoneNumber</Text>
                                        }
                                        <PhoneInput
                                            ref={ref => {
                                            this.phone = ref;
                                            }}
                                            textProps={{ placeholder: "Phone number" }}
                                            style={this.state.isReady ? [global_style.text_input_active, { marginTop : 10 * metrics}] : [global_style.text_input, { marginTop : 10 * metrics}]}
                                            value={this.state.phone_number}
                                            onSelectCountry={(value) => console.log(value)}
                                            onChangePhoneNumber={(value) => this.changeMobileNumber(value)}
                                            initialCountry={"gb"}
                                            textStyle ={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                        {
                                            this.state.phone_number != '' && !this.state.isValidPhone &&
                                            <Text style={global_style.error }>{ErrorMessage.error_phone_number_invalid}</Text>
                                        }
                                        <TextComponent
                                            textPlaceHolder = "Email"
                                            textValue={this.state.email}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({email : value},() => {
                                                if (this.state.email != '')
                                                    this.setState({exist_email : true})
                                                else
                                                    this.setState({exist_email : false})
                                                
                                                if (this.state.email != '' && validEmail(this.state.email)) 
                                                    this.setState({invalid_email : false})
                                                else
                                                    this.setState({invalid_email : true})
                                                this.checkReady()
                                            })}
                                        />
                                        {
                                            !this.state.exist_email && this.state.invalid_email && 
                                            <Text style={global_style.error}>{ErrorMessage.error_email_required}</Text>
                                        }
                                        {
                                            this.state.exist_email && this.state.invalid_email &&
                                            <Text style={global_style.error}>{ErrorMessage.error_email_invalid}</Text>
                                        }
                                        <TextComponent
                                            textPlaceHolder = "Website"
                                            textValue={this.state.web_site}
                                            textType="text"
                                            ready={this.state.isReady}
                                            onChangeText = {(value) => this.setState({web_site : value},() => {this.checkReady()})}
                                        />
                                    </View>
                                </ScrollView>
                            </View>
                            {
                                (!this.state.isShow_contact && this.state.is_show_add) ?
                                <View style={styles.add_contacts}>
                                    <Text style={styles.add_contacts_text}>Contacts</Text>
                                    <TouchableOpacity style={{marginLeft : 20 * metrics}} onPress={() => this.setState({isShow_contact : true})}>
                                        <MaterialCommunityIcons name="plus-box" size={40 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.add_contacts}>
                                </View>
                            }
                            <View style={global_style.bottom_button_body}>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onConfirm()}>
                                    <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Confirm</Text>
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
                            <Text style={global_style.loading_text}>Loading ...</Text>
                        </View>
                    }
                    {
                        this.state.isShow_contact &&
                        <View style={global_style.modal_bg}>
                            <View style={styles.modal_body}>
                                <ContactChildComponent navigation={this.props.navigation} gotoList={() => this.gotoList()}></ContactChildComponent>
                            </View>
                        </View>
                    }
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    crm_type : {
        flex : 0.15, 
        flexDirection : 'column',
        width : '90%',
        alignSelf : 'center'
    },
    crm_item : {
        flex : 0.5, flexDirection : 'row'
    },
    check_body : {
        flex : 0.333,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    checked_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color,
    }, 
    check_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.dark_gray,
    },
    active_option : {
        fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.main_color
    },
    option : {
        fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.dark_gray
    },
    container : {
        width : '85%' , alignSelf : 'center', flexDirection : 'column'
    },
    add_contacts : {
        flex : 0.05 ,
        flexDirection : 'row', 
        alignItems : 'center', 
        width : '85%' ,
        alignSelf : 'center'
    },
    add_contacts_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.main_color
    },
    select_box : {
        width : '75%',
        flex : 0.5,
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        flexDirection : 'row',
        alignItems : 'center'
    },
    modal_body :{
        width : '90%',
        alignSelf : 'center',
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems :'center',
        marginTop : 120 * metrics
    }
})