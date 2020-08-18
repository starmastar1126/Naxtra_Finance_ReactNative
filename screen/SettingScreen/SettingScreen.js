/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View , BackHandler ,TouchableOpacity, ScrollView ,Switch , AsyncStorage,ActivityIndicator,SafeAreaView, Linking} from 'react-native'
import * as Colors from '../../constants/Colors'
import { StackActions, NavigationActions } from 'react-navigation'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { Avatar } from 'react-native-elements'
import global_style, { metrics } from '../../constants/GlobalStyle'
import { alertMessage } from '../../utils/utils'
import UserService from '../../service/UserService'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'
import { google_url, facebook_url, twitter_url } from '../../utils/keyInfo'
import CodePin from 'react-native-pin-code'

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});

const optionalConfigObject = {
    title: "Authentication Required", // Android
    color: "#e00606", // Android,
    fallbackLabel: "Show Passcode" // iOS (if empty, then label is hidden)
}

export default class SettingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor(props) {
        super(props);
        this.state = {
            trust : false,
            finger : false,
            show_finger : false,
            isLoading : false,
            isReady : false,
            pin_code : ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    onChangedTrust = () => {
        this.setState({trust : !this.state.trust}, () => this.setLocalStorage())
    }

    onChangeFingerprint = () => {
        if (this.state.finger) {
            this.setState({finger : !this.state.finger, show_finger : false} , () => this.setLocalStorage())
        } else {
            this.setState({finger : !this.state.finger, show_finger : true} , () => this.setLocalStorage())
        }
        
    }

    async setLocalStorage () {
        console.log(this.state.pin_code)
        var finger = 'false'
        if (this.state.finger) {
            finger = 'true'
        }
        var trust = 'false'
        if (this.state.trust) {
            trust = 'true'    
        }

        if (this.state.finger) {
            var user_info = {
                email : global.user_info.email,
                password : global.user_info.password,
                username : global.user_info.first_name + ' ' + global.user_info.middle_name +  ' ' + global.user_info.last_name,
                pin_code : this.state.pin_code
            }
            await AsyncStorage.setItem('finger_user' , JSON.stringify(user_info))
        } else {
            await AsyncStorage.setItem('finger_user' , '')
        }
        await AsyncStorage.setItem('finger_print' , finger)
        await AsyncStorage.setItem('trust' , trust)

        console.log(this.state.pin_code)
        if (this.state.pin_code != '') {
            this.setState({show_finger : false})
        }
    }

    gotoPassword () {
        this.props.navigation.navigate('PasswordScreen')
    }

    goBack = () => {
        this.props.navigation.navigate('TabScreen')
    }  

    gotoSocialLink = (value) => {
        // switch (value) {
        //     case 'google' :
        //         Linking.openURL(google_url).catch(err => console.error('An error occurred', err));
        //         break
        //     case 'twitter' :
        //         Linking.openURL(twitter_url).catch(err => console.error('An error occurred', err));
        //         break
        //     case 'facebook' :
        //         Linking.openURL(facebook_url).catch(err => console.error('An error occurred', err));
        //         break
        // }
    }

    logout = () => {
        global.init_account = 'false'
        this.setState({isLoading : true})
        UserService.logoutUser(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.token = ''
            } else {
                //alertMessage(data.message)
            }
            clearInterval(global.timeout) //clear timeout
            this.setState({isLoading : false})
            this.setLogoutLocalStorage()
            if (this.state.finger) {
                this.props.navigation.dispatch(resetAction('SplashScreen'))    
            } else {
                this.props.navigation.dispatch(resetAction('LoginScreen'))    
            }
        }).catch(error => {
            this.setState({isLoading : false})
            alertMessage(error.message)
        })
    }
    async setLogoutLocalStorage () {
        await AsyncStorage.setItem('logout', '1')
        await AsyncStorage.setItem('token' , '')
        await AsyncStorage.setItem('register_user', '')
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    //
    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        if (await AsyncStorage.getItem('finger_print') == 'true') {
            this.setState({finger : true})
        } else {
            this.setState({finger : false})
        }
        if (await AsyncStorage.getItem('trust') == 'true') {
            this.setState({trust : true})
        } else {
            this.setState({trust : false})
        }
    }
    handleBackButtonClick() { 
        if (this.state.show_finger) {
            this.setState({show_finger : false, finger : false}, () => this.setLocalStorage())
            return true
        } else {
            return false
        }
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                {
                    !this.state.show_finger && 
                    <View style={styles.container}>
                        <DetailHeaderComponent navigation={this.props.navigation}  title="Settings" goBack ={this.goBack}></DetailHeaderComponent>
                        <ScrollView style={{flex : 1}}>
                            <View style={styles.avatar_body}>
                                <Avatar
                                    rounded
                                    overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                    size="xlarge"
                                    source={{uri : 'data:image/png;base64,' + global.user_info.selfie}}
                                    resizeMode={'stretch'}
                                    containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                    style={styles.item_img}
                                />
                                {
                                    (global.user_info.account_type == "Business" || global.user_info.account_type == "business") ? 
                                    <View>
                                        <Text style={styles.user_name}>{global.user_info.first_name} {global.user_info.last_name}</Text>
                                        <Text style={styles.company_name}>{global.user_info.company_name.toUpperCase()}</Text>
                                    </View>
                                    :
                                    <Text style={styles.user_name}>{global.user_info.first_name} {global.user_info.last_name}</Text>
                                }
                                
                            </View>
                            <View style={styles.body}>
                                <View style={styles.setting_view}>
                                    <View style={{marginTop : 5 * metrics}}></View>
                                    <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('PersonalSettingScreen')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Personal Detail</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('AccountSettingScreen')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Account Detail</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity>
                                    
                                    {
                                        global.user_info.account_type == 'Business' && 
                                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('CompanyDetail')}>
                                            <View style={{flex : 0.05}}></View>
                                            <View style={{flex : 0.8}}>
                                                <Text style={styles.button_text}>Company Detail</Text>
                                            </View>
                                            <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                                <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>

                                <View style={styles.setting_view}>
                                    <View style={{marginTop : 5 * metrics}}></View>
                                    
                                    <TouchableOpacity style={styles.button} onPress={() => this.gotoPassword()}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Change Password</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('PrivacyScreen')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Privacy</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('PriceSettingScreen')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Price Plan</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity> */}
                                    {/* <View style={styles.button}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Trust this Device</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <Switch
                                                onValueChange = {() => this.onChangedTrust()}
                                                value = {this.state.trust}
                                                trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                thumbColor={Colors.white_color}
                                            />
                                        </View>
                                    </View> */}
                                    <View style={styles.button}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Sign in with Fingerprint</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <Switch
                                                onValueChange = {() => this.onChangeFingerprint()}
                                                value = {this.state.finger}
                                                trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                thumbColor={Colors.white_color}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.finger && 
                                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ChangePinScreen')}>
                                            <View style={{flex : 0.05}}></View>
                                            <View style={{flex : 0.8}}>
                                                <Text style={styles.button_text}>Change PIN Code</Text>
                                            </View>
                                            <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                                <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                            </View>
                                        </TouchableOpacity>
                                    }                                
                                </View>

                                <View style={styles.setting_view}>
                                    {/* <TouchableOpacity style={styles.button} onPress={() => this.gotoSocialLink('google')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Rate us on Google Play</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialCommunityIcons name="google-play" size={ 25 * metrics } color={Colors.dark_gray}></MaterialCommunityIcons>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}  onPress={() => this.gotoSocialLink('twitter')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Follow us Twitter</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialCommunityIcons name="twitter-circle" size={ 25 * metrics } color={Colors.dark_gray}></MaterialCommunityIcons>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}  onPress={() => this.gotoSocialLink('facebook')}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Like us Facebook</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialCommunityIcons name="facebook-box" size={ 25 * metrics } color={Colors.dark_gray}></MaterialCommunityIcons>
                                        </View>
                                    </TouchableOpacity> */}
                                    {/* <TouchableOpacity style={styles.button}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Sign in with Fingerprint</Text>
                                        </View>
                                        <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                            <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>     
                                        </View>
                                    </TouchableOpacity> */}
                                </View>
                                

                                <View style={styles.setting_view}>
                                    <View style={{marginTop : 5 * metrics}}></View>
                                    {/* <TouchableOpacity style={styles.button}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Close Account</Text>
                                        </View>
                                        <View style={{flex : 0.1}}></View>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={styles.button} onPress={() => this.logout()}>
                                        <View style={{flex : 0.05}}></View>
                                        <View style={{flex : 0.8}}>
                                            <Text style={styles.button_text}>Logout</Text>
                                        </View>
                                        <View style={{flex : 0.10}}></View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                }
                
                {
                    this.state.show_finger && 
                    <View style={{width : '100%' , height : '100%' , backgroundColor : 'white'}}>
                        <DetailHeaderComponent navigation={this.props.navigation}  title="Fingerprint" goBack ={() => this.setState({show_finger : false, finger : false}, () => this.setLocalStorage())}></DetailHeaderComponent>
                        <View style={{flex :1}}>
                            <View style={{flex : 0.2}}></View>
                            <View style={{flex : 0.6, justifyContent : 'center'}}>
                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray, width : '70%', alignSelf : 'center', textAlign : 'center'}}>Remember this PIN. If you forget it, you 'll need to reset your fingerprint.</Text>
                                <CodePin
                                    containerStyle ={{width : '100%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center', paddingTop : 10* metrics,paddingBottom : 10 * metrics}}
                                    keyboardType="numeric"
                                    pinStyle = {{backgroundColor : 'white', borderWidth : 1, borderColor : Colors.dark_gray}}
                                    number={5} // You must pass number prop, it will be used to display 4 (here) inputs
                                    checkPinCode={(code, callback) =>this.setState({pin_code : code} , () => callback(code !== '')) }
                                    success={() => this.setState({isReady : true})} // If user fill '2018', success is called
                                    text={Platform.OS == 'ios' ? '' : "Enter your security code to unlock"} // My title
                                    error="You fail" // If user fail (fill '2017' for instance)
                                    autoFocusFirst={false} // disabling auto-focus
                                />
                            </View>
                            <View style={{flex : 0.2, justifyContent : 'center', width : '85%' , alignSelf : 'center'}}>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.setLocalStorage()}>
                                    <View style={global_style.btn_body}>
                                        <Text style={global_style.left_text}>Proceed</Text>
                                        <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                    </View>
                                </TouchableOpacity>
                            </View>
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
    avatar_body : {
        marginTop : 20 * metrics,
        width : '85%',
        alignSelf : 'center',
        alignItems : 'center',
        flexDirection : 'column'
    },
    item_img : {
        width : 95 * metrics, 
        height : 95 * metrics,
        resizeMode : 'stretch',
        elevation : 3.5,
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        borderRadius : 50 ,
    },
    user_name : { 
        fontFamily : Fonts.adobe_clean,
        fontSize : 25 * metrics , 
        color : '#000', 
        textAlign : 'center',
        marginTop : 15 * metrics
    },
    company_name : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics , 
        color : '#000', 
        textAlign : 'center',
        marginTop : 15 * metrics
    },
    body : {
        width : '85%',
        alignSelf : 'center'
    },
    setting_view : {
        width : '100%',
        resizeMode : "stretch",
        backgroundColor : 'white',
        elevation : Platform.OS == 'android' ?  3.5 : 0.8,
        shadowOffset : { width : 10 , height : 10},
        marginBottom : 20 * metrics,
        marginTop : 20 * metrics,
    },
    button : {
        width : '100%',
        height : 45 * metrics,
        marginBottom : 5 * metrics,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },
    button_text : {
        fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics , color : '#000'
    }
});