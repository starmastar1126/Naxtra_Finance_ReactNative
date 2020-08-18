/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity ,StyleSheet ,Image, AsyncStorage,ActivityIndicator,SafeAreaView, Alert} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import { alertMessage } from '../utils/utils'
import { ScrollView } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import UserService from '../service/UserService';
import {Fonts} from '../constants/Fonts'
// import LZString from 'lz-string'

const identity_proof = {
    label : 'Select Identity Proof',
    value : null,
    color : 'gray'
}

const address_proof = {
    label : 'Select Address Proof',
    value : null,
    color : 'gray'
}

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
   

export default class UploadProofScreen extends Component {
    componentDidMount () {
        
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    state = {
        document_type : [
            {
                label : 'Nationality ID Card',
                value : 0,
                color : 'black'
            },
            {
                label : 'Driving License',
                value : 1,
                color : 'black'
            },
            {
                label : 'Passport',
                value : 2,
                color : 'black'
            },
        ],
        address_type : [
            {
                label : 'Bank or Building society statement',
                value : 0,
                color : 'black'
            },
            {
                label : 'Utility Bills',
                value : 1,
                color : 'black'
            },
            {
                label : 'Council Tax',
                value : 2,
                color : 'black'
            }
        ],
        document_type1 : [
            {
                label : 'national_identity_card',
                value : 0,
                color : 'black'
            },
            {
                label : 'driving_licence',
                value : 1,
                color : 'black'
            },
            {
                label : 'passport',
                value : 2,
                color : 'black'
            },
        ],
        address_type1 : [
            {
                label : 'bank_building_society_statement',
                value : 0,
                color : 'black'
            },
            {
                label : 'utility_bill',
                value : 1,
                color : 'black'
            },
            {
                label : 'council_tax',
                value : 2,
                color : 'black'
            }
        ],
        isLoading : false,
        id_proof : '',
        address_cam_type : 0,
        id_cam_type : 0,
        address_proof : '',

        selectedIdType : -1,
        selectedAddressType : -1,

        id_proof_img : '',
        address_proof_img : '',

        isReady : false,
        idx : -1
    }
    processOnfido = () => {
    }

    //

    checkReady = () => {
        if (this.state.id_proof !== '' && this.state.address_proof != '' && this.state.selectedIdType != -1 && this.state.selectedAddressType != -1)
            this.setState({isReady : true}) 
        else
            this.setState({isReady : false}) 
    }

    id_type = ''
    address_type = ''

    setLocalStorage = async() => {
        for (var i = 0 ;i < this.state.document_type.length;i++) {
            if (this.state.document_type[i].value == this.state.selectedIdType) {
                this.id_type = this.state.document_type1[i].label
                break;
            }
        }
        for (var i = 0 ;i < this.state.address_type.length;i++) {
            if (this.state.address_type[i].value == this.state.selectedAddressType) {
                this.address_type = this.state.address_type1[i].label
                break;
            }
        }

        var obj = {
            identity_proof : this.state.id_proof,
            identity_proof_type : this.id_type,
            address_proof : this.state.address_proof,
            address_proof_type : this.address_type,
        }
        global.id_proof_type = this.id_type
        global.address_proof_type = this.address_type

        this.setState({isLoading : true})
        UserService.uploadProof(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.gotoWelcome()
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(ErrorMessage.network_error)
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
            proof_status : '1',
            verification_state : '',
            business_status : ''

        }
        await AsyncStorage.setItem('signup_step' , JSON.stringify(obj))

        await AsyncStorage.setItem('proof_status', '1')

        var obj = {
            id_proof : global.id_proof,
            id_proof_type : global.id_proof_type,
            address_proof : global.address_proof,
            address_proof_type : global.address_proof_type
        }

        await AsyncStorage.setItem('upload_info' , JSON.stringify(obj))
        this.props.navigation.navigate('WelcomeScreen', {refresh : true})
    }

    submit () {
        if (!this.state.isReady)
            return;
        this.setLocalStorage()
    }
    changeType = (value) => {
        if (value == null) {
            this.setState({selectedIdType : -1}, () => {this.checkReady()})
        } else {
            if (value != 1) { //driving license
                var arr = this.state.address_type
                var result = this.state.address_type1

                var obj = {
                    label : 'Driving License',
                    value : 3,
                    color : 'black'
                }

                var obj1 = {
                    label : 'driving_licence',
                    value : 1,
                    color : 'black'
                }

                arr.push(obj)
                result.push(obj1)

                this.setState({address_type : arr, address_type1 : result})
            }
            this.setState({selectedIdType : value}, () => {this.checkReady()})
        }
    }

    changeAddresType = (value) => {
        if (value == null) {
            this.setState({selectedAddressType : -1}, () => {this.checkReady()})
        } else {
            this.setState({selectedAddressType : value}, () => {this.checkReady()})
        }
    }

    changeAddressProof = (value) => {
        this.setState({address_cam_type : value})
        if (value == 0) {
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };
                    var base64_data = response.data;
                    this.setState({address_proof_img : source})
                    global.address_proof = source
                    this.setState({address_proof : base64_data}, () => { this.checkReady()})
                }
            });
        } else {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };
                    var base64_data = response.data;
                    this.setState({address_proof_img : source})
                    global.address_proof = source
                    this.setState({address_proof : base64_data}, () => {this.checkReady()})
                }
            });
        }
    }

    refreshIDScan () {
        this.changeIDProof(this.state.id_cam_type)
    }
    refreshAddressIDScan () {
        this.changeAddressProof(this.state.address_cam_type)
    }

    changeIDProof = (value) => {
        this.setState({id_cam_type : value})
        if (value == 0) {
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };
                    var base64_data = 'data:image/jpeg;base64,' + response.data;

                    this.setState({id_proof_img : source}) //show Image
                    global.id_proof = source //new add
                    this.setState({id_proof : response.data}, ()=> {this.checkReady()})
                    
                }
            });
        } else {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };
                    var base64_data = response.data;

                    this.setState({id_proof_img : source}) //show Image
                    global.id_proof = source //new add
                    this.setState({id_proof : base64_data}, ()=> {this.checkReady()})
                }
            });
        }
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{width : '100%' , height : '100%'}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <ScrollView style={{width : '100%' , height : '100%'}}>
                        <View style={[global_style.input_body, {height : '100%', flexDirection : 'column'}]}>
                            <View style={{marginTop : 30 * metrics}}></View>
                            <Text style={global_style.input_title}>Upload Proofs</Text>
                            <View style={{marginTop : 30 * metrics}}></View>
                            <View style={{flex :1, flexDirection : 'column'}}>
                                <View style={{flex: 0.5 ,flexDirection : 'column'}}>
                                    <View style={{borderBottomWidth : 1}}>
                                        <RNPickerSelect
                                            onValueChange={(value) => this.changeType(value)}
                                            items={this.state.document_type}
                                            placeholderTextColor={Colors.dark_gray}
                                            style={this.state.isReady ? global_style.text_input_active : global_style.text_input}
                                            placeholder={identity_proof}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                        {
                                            Platform.OS != 'android' &&
                                            <View style={{marginTop : 10 * metrics}}></View>
                                        }
                                    </View>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    {
                                        this.state.id_proof != '' ?
                                        <View style={{flex : 1, flexDirection : 'row'}}>
                                            <Image source= {this.state.id_proof_img} style={styles.imgBtn}></Image>
                                            <View style={{flex : 0.4, flexDirection : 'column'}}>
                                                <View style={{flex : 0.25}}></View>
                                                <TouchableOpacity style={styles.right_item} onPress={() => this.setState({id_proof : ''})}>
                                                    <MaterialIcon name="trash-can-outline" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                    <Text style={styles.text}>Delete</Text>
                                                </TouchableOpacity>
                                                <View style={{flex : 0.1}}></View>
                                                <TouchableOpacity style={styles.right_item} onPress={() => this.refreshIDScan()}>
                                                    <MaterialIcon name="refresh" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                    <Text style={styles.text}>Replace</Text>
                                                </TouchableOpacity>
                                                <View style={{flex : 0.25}}></View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{flex : 1, flexDirection : 'row',marginTop : 20 * metrics}}>
                                            <View style={{flex : 0.45,justifyContent :'center'}}>
                                                <TouchableOpacity style={styles.btn} onPress={() => this.changeIDProof(0)}>
                                                    <MaterialIcon name="camera-outline" size ={25 * metrics} color={Colors.main_color}></MaterialIcon>
                                                    <Text style={{marginLeft : 10 * metrics, color : Colors.main_color , fontSize : 16 * metrics}}>Camera</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex : 0.1}}></View>
                                            <View style={{flex : 0.45,justifyContent :'center'}}>
                                                <TouchableOpacity style={styles.btn} onPress={() => this.changeIDProof(1)}>
                                                    <MaterialIcon name="image-filter" size={25 * metrics} color={Colors.main_color}></MaterialIcon>
                                                    <Text style={{marginLeft : 10 * metrics, color : Colors.main_color , fontSize : 16 * metrics}}>Gallery</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                </View>
                                <View style={this.state.id_proof == '' ? { marginTop : 100 * metrics } : {marginTop :  30 * metrics}}></View>
                                <View style={{flex: 0.5 ,flexDirection : 'column'}}>
                                    <View style={{borderBottomWidth : 1}}>
                                        <RNPickerSelect
                                            onValueChange={(value) => this.changeAddresType(value)}
                                            items={this.state.address_type}
                                            placeholder={address_proof}
                                            placeholderTextColor={Colors.dark_gray}
                                            style={this.state.isReady ? global_style.text_input_active : global_style.text_input}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                        {
                                            Platform.OS != 'android' &&
                                            <View style={{marginTop : 10 * metrics}}></View>
                                        }
                                    </View>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    {
                                        this.state.address_proof != '' ?
                                        <View style={{flex : 1, flexDirection : 'row'}}>
                                            <Image source= {this.state.address_proof_img} style={styles.imgBtn}></Image>
                                            <View style={{flex : 0.4, flexDirection : 'column'}}>
                                                <View style={{flex : 0.25}}></View>
                                                <TouchableOpacity style={styles.right_item} onPress={() => this.setState({address_proof : ''})}>
                                                    <MaterialIcon name="trash-can-outline" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                    <Text style={styles.text}>Delete</Text>
                                                </TouchableOpacity>
                                                <View style={{flex : 0.1}}></View>
                                                <TouchableOpacity style={styles.right_item} onPress={() => this.refreshAddressIDScan()}>
                                                    <MaterialIcon name="refresh" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                    <Text style={styles.text}>Replace</Text>
                                                </TouchableOpacity>
                                                <View style={{flex : 0.25}}></View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{flex : 1, flexDirection : 'row',marginTop : 20 * metrics}}>
                                            <View style={{flex : 0.45,justifyContent :'center'}}>
                                                <TouchableOpacity style={styles.btn} onPress={()=>this.changeAddressProof(0)}>
                                                    <MaterialIcon name="camera-outline" size ={25 * metrics} color={Colors.main_color}></MaterialIcon>
                                                    <Text style={{marginLeft : 10 * metrics, color : Colors.main_color ,fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics}}>Camera</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex : 0.1}}></View>
                                            <View style={{flex : 0.45,justifyContent :'center'}}>
                                                <TouchableOpacity style={styles.btn} onPress={()=>this.changeAddressProof(1)}>
                                                    <MaterialIcon name="image-filter" size={25 * metrics} color={Colors.main_color}></MaterialIcon>
                                                    <Text style={{marginLeft : 10 * metrics, color : Colors.main_color ,fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics}}>Gallery</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                </View>
                            </View>
                            
                            <View style={{marginTop : 40 * metrics}}></View>
                            <View style={{height : 50}}></View>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.submit()}>
                                    <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Submit</Text>
                                    <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                                    </View>
                                </TouchableOpacity>
                            <View style={{height : 20}}></View>
                        </View>
                    </ScrollView>
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
    imgBtn : {
        flex : 0.6 , 
        height : 150 * metrics , 
        borderColor : Colors.white_gray_color, 
        borderWidth : 1 
    },
    right_item : {
        flexDirection : 'row', 
        alignSelf : 'flex-start', 
        marginLeft : 15 * metrics,
        flex : 0.2, 
    },
    text : {
        fontSize : 18 * metrics, 
        color : Colors.main_blue_color, 
        alignSelf : 'center',fontFamily : Fonts.adobe_clean,
        marginLeft : 5 * metrics
    },
    icon : {
        alignSelf : 'center'
    },
    btn : {
        height : 50 * metrics , 
        width : '90%', 
        justifyContent : 'center' ,
        alignItems: 'center',
        borderWidth : 2,
        borderColor : Colors.main_color,
        alignSelf : 'center',
        borderRadius : 10,
        flexDirection : 'row'
    }
})