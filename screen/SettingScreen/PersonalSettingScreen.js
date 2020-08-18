/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,TextInput,ActivityIndicator} from 'react-native'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as ErrorMessage from '../../constants/ErrorMessage'
import { Fonts } from '../../constants/Fonts';
import { Avatar } from 'react-native-elements'
import { validEmail, alertMessage } from '../../utils/utils';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-picker';
import { APP_VERSION } from '../../utils/keyInfo';
import OtherService from '../../service/OtherService';

export default class PersonalSettingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        isLoading : false,
        editing_address : false,
        editing_phone : false,
        editing_email : false,
        address_val : '',
        email_val : '',
        phone_number : '',
        selife : '',
        empty_email : false,
        invalid_email : false,
        invalidPhone : false,
    }

    gotoAccount (item) {
        this.props.navigation.navigate('HelpAccountScreen')
        global.help_account = item
    }
    gotoAnalytics () {
        this.props.navigation.navigate('HelpAnalyticsScreen')
    }
    gotoIssue () {
        this.props.navigation.navigate('IssueScreen')
    }
    constructor(props) {
        super(props);
    }

    changeMobileNumber = (value) => {
		this.setState({ 
            invalidPhone : this.phone.isValidNumber() ,
            country_code: '+' + this.phone.getCountryCode() ,
            phone_number: value
        }, () => {
            this.checkReady('phone')
        })
    }

    componentDidMount () {
        console.log(global.user_info.phone)
        this.setState({
            address_val : global.user_info.address_info,
            phone_number : global.user_info.phone,
            email_val : global.user_info.email,
            selife : global.user_info.selfie
        })
    }
    checkReady (value) {
        if (value == 'email') {
            if (this.state.email_val == '') {
                this.setState({empty_email : true})
            } else {
                if (this.state.email_val != '' && validEmail(this.state.email_val)) {
                    this.setState({invalid_email : false, empty_email : false})
                } else {
                    this.setState({invalid_email : true, empty_email : false})
                }
            }
        }
    }

    saveDate() {
        var obj = {
            otp : '',
            name : global.user_info.first_name + ' ' + global.user_info.middle_name + ' ' + global.user_info.last_name,
            rb_first_name : global.user_info.first_name,
            rb_last_name : global.user_info.last_name,
            address_info : this.state.address_val,
            phone : this.state.phone_number,
            email : this.state.email_val,
            image : this.state.selife
        }
        this.setState({isLoading: true})
        OtherService.getOTPPersonal(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                
                // global.user_info.vat = obj.vat
                // global.user_info.company_icon = obj.logo
                // global.user_info.vat_type = obj.vat_type

                global.update_company = obj
                global.verify_type = 'personal_updating'

                this.props.navigation.navigate('VerfiyNumberScreen')
                console.log('data = ', obj)
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading: false})
        }).catch(err => {
            this.setState({isLoading: false})
        })
    }

    changeSelife () {
        var options = {
            title: '',
            takePhotoButtonTitle: 'Camera',
            chooseFromLibraryButtonTitle: 'Photo Gallery',
            tintColor: '#57C0FD',
            noData: false,
            quality: 0.1,
            // allowsEditing: true,
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({selife : response.data}, () => this.saveDate())
            }
        });
    }
    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="" type="personal_setting" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={styles.body}>
                        <View style={{position : 'relative'}}>
                            <Avatar
                                rounded
                                overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                size="xlarge"
                                source={{uri : 'data:image/png;base64,' + this.state.selife}}
                                resizeMode={'stretch'}
                                containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                style={styles.item_img}
                            />
                            <TouchableOpacity  style={styles.carmera} onPress={() => this.changeSelife()}>
                                <MaterialIcons name="camera-alt" size={28 * metrics} color={Colors.main_blue_color}></MaterialIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.type}>Full name and date of birth</Text>
                            <Text style={styles.value}>{global.user_info.first_name} {global.user_info.last_name}</Text>
                        </View>  
                        {
                            !this.state.editing_address ?
                            <View style={styles.item}>
                                <Text style={styles.type}>Address</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.value, {flex : 0.85}]}>{this.state.address_val}</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => this.setState({editing_address : true})}>
                                        <MaterialIcons name="edit" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View> 
                            :
                            <View style={styles.item}>
                                <Text style={styles.type}>Address</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput 
                                        underlineColorAndroid = "transparent"
                                        autoCapitalize="none"
                                        placeholderTextColor = {Colors.gray_color}
                                        multiline = {false}
                                        value={this.state.address_val}
                                        secureTextEntry={false}
                                        onChangeText={(text) => this.setState({address_val : text})}
                                        style={[styles.editing_value, {flex : 0.85}]}
                                    />
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => {
                                        if (this.state.address_val == '') 
                                            return
                                        this.saveDate()
                                        this.setState({
                                            editing_address : false,
                                        })
                                    }}>
                                        <MaterialIcons name="save" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            !this.state.editing_phone ? 
                            <View style={styles.item}>
                                <Text style={styles.type}>Phone number</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.value, {flex : 0.9}]}>{this.state.phone_number}</Text>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => this.setState({editing_phone : true})}>
                                        <MaterialIcons name="edit" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={styles.editing_item}>
                                <Text style={styles.type}>Phone number</Text>
                                <View style={{flexDirection: 'row', marginTop : 10 * metrics}}>
                                    <View style={{flex : 0.85, flexDirection : 'column'}}>
                                        <PhoneInput
                                            ref={ref => {
                                                this.phone = ref;
                                            }}
                                            textProps={{ placeholder: "Phone number" }}
                                            style={styles.editing_phone_value}
                                            value={this.state.phone_number}
                                            onSelectCountry={(value) => console.log(value)}
                                            onChangePhoneNumber={(value) => this.changeMobileNumber(value)}
                                            initialCountry={"gb"}
                                            textStyle ={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                        <View style={{borderBottomWidth : 1, marginTop : 5 * metrics}}></View>
                                        {/* {
                                            this.state.phone_number != '' && this.state.invalidPhone &&
                                            <Text style={global_style.error }>{ErrorMessage.error_phone_number_invalid}</Text>
                                        } */}
                                    </View>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => {
                                        if (this.state.phone_number == '') {
                                            return
                                        }
                                        this.saveDate()
                                        this.setState({editing_phone : false})
                                    }}>
                                        <MaterialIcons name="save" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View> 
                        }
                        {
                            !this.state.editing_email ? 
                            <View style={styles.item}>
                                <Text style={styles.type}>Email</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.value, {flex : 0.9}]}>{this.state.email_val}</Text>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => this.setState({editing_email : true})}>
                                        <MaterialIcons name="edit" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                            :
                            <View style={styles.editing_item}>
                                <Text style={styles.type}>Email</Text>
                                <View style={{flexDirection: 'row', marginBottom : 10 * metrics}}>
                                    <View style={{flexDirection : 'column', flex : 0.85}}>
                                        <TextInput 
                                            underlineColorAndroid = "transparent"
                                            autoCapitalize="none"
                                            placeholder={"Email"}
                                            placeholderTextColor = {Colors.gray_color}
                                            multiline = {false}
                                            secureTextEntry={false}
                                            value={this.state.email_val}
                                            onChangeText={(text) => this.setState({email_val : text}, () => {this.checkReady('email')})}
                                            style={styles.editing_value}
                                        />
                                        {
                                            this.state.empty_email && !this.state.invalid_email &&
                                            <Text style={global_style.error }>{ErrorMessage.error_email_required}</Text>
                                        }
                                        {
                                            this.state.invalid_email && !this.state.empty_email &&
                                            <Text style={global_style.error }>{ErrorMessage.error_email_invalid}</Text>
                                        }
                                    </View>
                                    <View style={{flex : 0.05}}></View>
                                    <TouchableOpacity style={{flex : 0.1, alignSelf : 'center',textAlign : 'right'}} onPress={() => {
                                        if (this.state.email_val == '') {
                                            return
                                        }
                                        this.saveDate()
                                        this.setState({
                                            editing_email : false
                                        })
                                    }}>
                                        <MaterialIcons name="save" color={Colors.main_blue_color} size={28 * metrics}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {
                            (this.state.editing_address || this.state.editing_email || this.state.editing_phone) &&
                            <View style={{marginTop : 30 * metrics , width : '100%', marginBottom : 10 * metrics}}>
                                <TouchableOpacity style={{width : 120 * metrics, height : 40 * metrics, backgroundColor : Colors.main_blue_color, borderRadius : 5 * metrics, justifyContent : 'center', alignSelf : 'center'}} onPress={() => {
                                    
                                    // this.saveDate()
                                    this.setState({
                                        editing_address : false,
                                        editing_phone : false,
                                        editing_email : false
                                    })
                                }}>
                                    <Text style={{textAlign : 'center', fontFamily : Fonts.adobe_clean , fontSize : 15 * metrics, color : 'white'}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>

                    <View style={{height : 50 * metrics}}></View>
                    <View style={{width : '100%', height : 50 * metrics, position : 'absolute',bottom : 10,justifyContent : 'center'}}>
                        <Text style={{textAlign : 'center', fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.main_color}}>VERSION : {APP_VERSION}</Text>
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
        backgroundColor : Colors.white_color
    },
    body : {
        width : '85%',
        minHeight : 400 * metrics,
        alignSelf : 'center',
        marginTop : 100 * metrics,
        borderRadius : 10 * metrics,
        backgroundColor : 'white',
        elevation : 1.5,
    },
    card_view : {
        width : '100%', 
        elevation : 3.5, 
        height : 60 * metrics,
        backgroundColor : 'white', 
        marginBottom : 15 * metrics,
        flexDirection : 'row',
        padding : 15 * metrics,
        shadowOffset : { width : 0 , height : -15}
    },
    button_text : {
        fontSize : 18 * metrics , color : '#000',
        fontFamily : Fonts.adobe_clean
    },
    item_img : {
        width : 75 * metrics, 
        height : 75 * metrics,
        resizeMode : 'stretch',
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        borderRadius : 50 ,
        marginTop : 20 * metrics,
        zIndex : 100,
    },
    item : {
        width : '90%', 
        minHeight : 55 * metrics, 
        alignSelf : 'center',
        marginTop : 15 * metrics,
        justifyContent : 'center'
    },
    editing_item : {
        width : '90%', 
        minHeight : 55 * metrics, 
        alignSelf : 'center',
        marginTop : 15 * metrics,
        marginBottom : 5 * metrics,
        justifyContent : 'center'
    },
    type : {
        fontSize : 14 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color
    },
    value : {
        fontSize : 15 * metrics,
        marginTop : 5 * metrics,
        fontFamily : Fonts.adobe_clean,
    },
    editing_value : {
        //marginBottom : 5 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
        padding : 0,
        borderBottomWidth: 1,
    },
    editing_phone_value : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
        padding : 0,
    },
    carmera : {
        // position : 'absolute',
        alignSelf : 'center',
        marginTop : -25 * metrics,
        marginLeft : 40 * metrics,
        elevation : 1.5,
        backgroundColor : 'transparent',
        
        zIndex : 999
    }
});