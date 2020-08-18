/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler, View,Text, TouchableOpacity,ActivityIndicator, StyleSheet,SafeAreaView,Image} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { CheckBox } from 'react-native-elements'
import {Fonts} from '../../constants/Fonts'
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton, TextInput } from 'react-native-paper'
import { APP_VERSION } from '../../utils/keyInfo';
import OtherService from '../../service/OtherService';
import ImagePicker from 'react-native-image-picker';

export default class CompanyDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    componentWillReceiveProps () {
        this.componentDidMount()
    }
    

    state = {
        issue : '',
        active_type : 1,
        account_method : 0,
        isReady : false,
        isEditVATNumber : false,
        vat_number : '',
        logo : ''
    }
    onChangeCheckbox = (idx) => {
        for (var i = 0 ; i < this.state.check_arr.length;i++) {
            if (this.state.check_arr[i].checked != -1)
                this.state.check_arr[i].checked = 0
        }
        for (var i = 0 ; i < this.state.check_arr.length;i++) {
            if (idx == i) {
                this.state.check_arr[i].checked = 1
            }
        }
        this.setState({check_arr : this.state.check_arr})
    }
    componentDidMount() {
        if (!global.user_info.vat) {
            this.setState({active_type : 1,vat_number : ''})
        } else {
            this.setState({active_type : 0,vat_number : global.user_info.vat})
        }

        if (global.user_info.vat_type != 'accural') {
            this.setState({account_method : 1})
        } else {
            this.setState({account_method : 0})
        }
        this.setState({logo : global.user_info.company_icon})
    }

    onSubmit = () => {  
        if (!this.state.isReady)
            return
        this.setState({isLoading : true})

        var obj = {
            vat_type : this.state.account_method == 1 ? "accural" : "cash",
            vat : this.state.vat_number,
            logo : this.state.logo,
            otp : '',
        }

        OtherService.getOTPByCompanydetail(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.user_info.vat = obj.vat
                global.user_info.company_icon = obj.logo
                global.user_info.vat_type = obj.vat_type

                global.update_company = obj
                global.verify_type = 'company_updating'

                this.props.navigation.navigate('VerfiyNumberScreen')
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            console.log('opt = ', err.message)
            this.setState({isLoading : false})
        })
    }

    onClickedEdit () {
        if (this.state.isEditVATNumber) {
            this.checkReady()
        }
        this.setState({isEditVATNumber : !this.state.isEditVATNumber})
    }
    checkReady () {
        var vat_type = 0
        if (global.user_info.vat_type != 'accural') {
            vat_type = 1
        } else {
            vat_type = 0
        }
        var vat = 0
        if (!global.user_info.vat)
            vat = 1
        else
            vat = 0

        if (this.state.account_method != vat_type || global.user_info.vat != this.state.vat_number || vat != this.state.active_type) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    uploadNewImage () {
        var options = {
            title: '',
            takePhotoButtonTitle: 'Camera',
            chooseFromLibraryButtonTitle: 'Photo Gallery',
            tintColor: '#57C0FD',
            noData: false,
            quality: 0.1,
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
                this.setState({logo : response.data}, () => this.checkReady())
            }
        });
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{width : '100%' , height : '100%'}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="" type="company_setting" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <ScrollView style={{flex : 0.85}}>
                            <View style={{width : '95%' , alignSelf : 'center',marginTop : 80 * metrics}}>
                                <Text style={{marginLeft : 20 * metrics, fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.white_gray_color}}>Buisness Details</Text>
                                <View style={styles.business_detail}>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>Business Name</Text>
                                        <Text style={styles.value}>{global.user_info.account_name}</Text>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>Co.Number</Text>
                                        <Text style={styles.value}>{global.user_info.account_number}</Text>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>Address</Text>
                                        <Text style={styles.value}>{global.user_info.company_address}</Text>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>Status</Text>
                                        <Text style={styles.value}>{global.user_info.company_status == 'active' ? 'Active' : 'Unactive'}</Text>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>App Version</Text>
                                        <Text style={styles.value}>{APP_VERSION}</Text>
                                    </View>
                                </View>

                                <Text style={{marginLeft : 20 * metrics,marginTop : 80 * metrics, fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.white_gray_color}}>Officer Details</Text>
                                <View style={styles.officer_detail}>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    <View style={styles.officer_item}>
                                        <Text style={styles.label}>Officer Name</Text>
                                        <Text style={styles.value}>{global.user_info.officers.length == 0 ? '' : global.user_info.officers[0].name}</Text>
                                    </View>
                                    <View style={styles.officer_item}>
                                        <Text style={styles.label}>Appointed Date</Text>
                                        <Text style={styles.value}></Text>
                                    </View>
                                    <View style={styles.officer_item}>
                                        <Text style={styles.label}>Role</Text>
                                        <Text style={styles.value}>{global.user_info.officers.length == 0 ? '' : global.user_info.officers[0].function}</Text>
                                    </View>
                                </View>
                                <View style={styles.lines}></View>
                                <View style={styles.business_detail}>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>VAT Registered</Text>
                                        <View style={{flex : 0.6, flexDirection : 'row', alignItems : 'center'}}>
                                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}}>
                                                <View style={{justifyContent : 'center'}}>
                                                    <RadioButton
                                                        value="first"
                                                        status={this.state.active_type == 0 ? 'checked' : 'unchecked'}
                                                        color={Colors.main_blue_color}
                                                        onPress={() => this.setState({active_type : 0, isShow_contact : false})}
                                                    />
                                                </View>
                                                
                                                <View style={{justifyContent : 'center'}}>
                                                    <Text style={this.state.active_type == 0 ? styles.active_option : styles.option}>Yes</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({active_type : 1, isShow_contact : false})}>
                                                <View style={{justifyContent : 'center'}}>
                                                    <RadioButton
                                                        value="second"
                                                        status={this.state.active_type == 1 ? 'checked' : 'unchecked'}
                                                        color={Colors.main_blue_color}
                                                        onPress={() => this.setState({active_type : 1, isShow_contact : false})}
                                                    />
                                                </View>
                                                <View style={{justifyContent : 'center'}}>
                                                    <Text style={this.state.active_type == 1 ? styles.active_option : styles.option}>No</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>VAT Number</Text>
                                        {
                                            !this.state.isEditVATNumber ?
                                            <Text style={styles.value}>{this.state.vat_number}</Text>
                                            :
                                            <TextInput
                                                value={this.state.vat_number}
                                                onChangeText={(value) => this.setState({vat_number:value})}
                                                style={{flex : 0.48, backgroundColor : 'transparent',fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean, height : 35 * metrics}}
                                            />
                                        }
                                        <View style={{flex : 0.02}}></View>
                                        <TouchableOpacity style={{flex : 0.13}} onPress={() => this.onClickedEdit()}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>
                                                {
                                                    !this.state.isEditVATNumber ?
                                                    "EDIT"
                                                    :
                                                    "SAVE"
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.business_item}>
                                        <Text style={styles.label}>Accounting Method</Text>
                                        <TouchableOpacity style={{flex : 0.6, flexDirection : 'row', alignItems :'center'}} onPress={() => this.setState({account_method : this.state.account_method == 0 ? 1: 0})}>
                                            {
                                                this.state.account_method == 0 &&
                                                <View style={styles.active_one_btn}>
                                                    <Text style={styles.active_text}>Accural</Text>
                                                </View>
                                            }
                                            {
                                                this.state.account_method == 0 &&
                                                <View style={styles.normal_two_btn}>
                                                    <Text style={styles.normal_text}>Cash Basis</Text>
                                                </View>
                                            }
                                            {
                                                this.state.account_method == 1 &&
                                                <View style={styles.normal_one_btn}>
                                                    <Text style={styles.normal_text}>Accural</Text>
                                                </View>
                                            }
                                            {
                                                this.state.account_method == 1 &&
                                                <View style={styles.active_two_btn}>
                                                    <Text style={styles.active_text}>Cash Basis</Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{alignItems : 'flex-end' ,justifyContent : 'center',marginTop : 15 * metrics}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 10 * metrics, color : Colors.gray_color}}>Allow taxes using cash basis</Text>
                                    </View>
                                    <View style={{marginTop : 30 * metrics}}></View>
                                    <View style={styles.business_item}>
                                        <View style={{flexDirection : 'column', flex : 0.5}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics,}}>Company Logo</Text>
                                            <TouchableOpacity style={{flexDirection : 'row',alignItems : 'center', marginTop :15 * metrics}} onPress={() => this.uploadNewImage()}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Upload New</Text>
                                                <AntDesign name="caretright" size={20 * metrics} color={Colors.dark_gray} style={{marginLeft : 30 * metrics}}></AntDesign>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{flex : 0.5, justifyContent : 'center', alignItems : 'flex-start'}}>
                                            <Image source={{uri : 'data:image/png;base64,' + this.state.logo}} style={styles.image} resizeMode="contain"></Image>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginBottom : 40 * metrics}}></View>
                            </View>
                        </ScrollView>
                        <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_submit_btn : global_style.bottom_submit_btn} onPress={()=> this.onSubmit()}>
                                <View style={styles.btn_body}>
                                    <Text style={styles.submit}>Submit</Text>
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
    item : {
        width : '100%' , 
        height : 90 * metrics , 
        marginBottom : 20 * metrics,
        flexDirection : 'row'
    },
    button : {
        width : '75%' , 
        alignSelf : 'center' ,
        height : 55 * metrics, 
        backgroundColor : Colors.main_color, 
        marginTop : 50 * metrics,
        borderRadius : 5 * metrics,
        justifyContent: 'center'
    },
    business_detail : {
        width : '90%',
        alignSelf : 'flex-end',
        justifyContent : 'center',
        flexDirection : 'column',
    },
    officer_detail : {
        width : '90%',
        alignSelf : 'flex-end',
        justifyContent : 'center',
        flexDirection : 'column',
    },
    business_item : {
        flexDirection : 'row',
        alignItems : 'center',
        marginTop : 25 * metrics
    },
    officer_item : {
        flexDirection : 'row',
        alignItems : 'center',
        marginTop : 25 * metrics
    },
    label : {
        flex : 0.4,
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.dark_gray,
        textAlign : 'left'
    },
    value : {
        flex : 0.48,
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.main_blue_color
    },
    active_option : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.main_blue_color,
        fontWeight : 'bold'
    },
    option : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.main_blue_color,
    },
    active_one_btn : {
        borderWidth : 1,
        borderRadius : 20 * metrics,
        height : 40 * metrics,
        flex : 0.45,
        zIndex : 10,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.red_color,
        borderColor : Colors.dark_gray
    },
    active_two_btn : {
        borderWidth : 1,
        borderRadius : 20 * metrics,
        height : 40 * metrics,
        flex : 0.55,
        zIndex : 10,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.red_color,
        borderColor : Colors.dark_gray
    },
    normal_one_btn : {
        borderWidth : 1,
        borderRadius : 20 * metrics,
        height : 39 * metrics,
        borderTopRightRadius : 0,
        borderBottomRightRadius : 0,
        borderRightWidth : 0,
        marginRight : -15 * metrics,
        zIndex : 1,
        flex : 0.55,
        justifyContent : 'center',
        alignItems : 'center',
        borderColor : Colors.dark_gray
    },
    normal_two_btn : {
        borderWidth : 1,
        borderLeftWidth : 0,
        borderRadius : 20 * metrics,
        height : 39 * metrics,
        borderTopLeftRadius : 0,
        borderBottomLeftRadius : 0,
        marginLeft : -15* metrics,
        zIndex : 1,
        flex : 0.55,
        justifyContent : 'center',
        alignItems : 'center',
        borderColor : Colors.dark_gray
    },
    active_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : 'white'
    },
    normal_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.dark_gray
    },
    btn_body : {
        width : '70%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    submit : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : 'white'
    },
    lines : {
        width : '90%',
        height : 2, 
        backgroundColor : Colors.dark_gray,
        alignSelf : 'center',
        marginTop : 25 * metrics,
        marginBottom : 25 * metrics,
        shadowOffset : {width : 0, height : 0},
        shadowRadius : 30,
        shadowOpacity : 0,
    },
    image : {
        width : 90 * metrics,
        height : 90 * metrics,
    }
})