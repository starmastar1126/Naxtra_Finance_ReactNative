import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image,AsyncStorage} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import { Avatar } from 'react-native-elements';
import { StackActions, NavigationActions, ScrollView } from 'react-navigation'
import UserService from '../service/UserService'
import { alertMessage } from '../utils/utils';
import {Fonts} from '../constants/Fonts'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { APP_VERSION } from '../utils/keyInfo';

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});

export default class SideMenuComponent extends Component {
    componentDidMount () {
        //console.log('name = ', global.user_info)
    }
    async setLocalStorage () {
        await AsyncStorage.setItem('logout', '1')
        await AsyncStorage.setItem('token' , '')
        await AsyncStorage.setItem('register_user', '')
    }
    async Logout () {
        global.init_account = 'false'
        this.props.isLoadingfunc(true)
        this.closeDrawer()
        var finger = await AsyncStorage.getItem('finger_print')

        UserService.logoutUser(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.token = ''
            } else {
                
            }
            global.token = ''
            
            this.props.isLoadingfunc(false)
            clearInterval(global.timeout) //clear timeout
            this.setLocalStorage()
            if (finger == 'true') {
                this.props.navigation.dispatch(resetAction('SplashScreen'))
            } else {
                this.props.navigation.dispatch(resetAction('LoginScreen'))
            }
        }).catch(error => {
            this.props.isLoadingfunc(false)
            alertMessage(error.message)
        })
    }
    onBanking () {
        global.tabIdx = 1
        global.init_account = 'true'
        this.closeDrawer()
        this.props.navigation.navigate('TabScreen', {refresh : true})
    }
    onCRM() {
        this.props.navigation.navigate('CRMListScreen')
        this.closeDrawer()
    }
    onPurchase () {
        this.props.navigation.navigate('ComingSoonScreen')
        this.closeDrawer()
    }
    onSetting () {
        global.tabIdx = 5
        this.props.navigation.navigate('SettingScreen')
        this.closeDrawer()
    }
    onSales () {
        global.web_url = 'https://dev.naxetra.com/web#view_type=kanban&model=stock.picking.type&menu_id=363&action=424'
        global.other_title = 'Inventory'
        this.props.navigation.navigate('ComingSoonScreen')
        this.closeDrawer()
    }
    onAccount () {
        global.web_url = ''
        global.other_title = 'Accounting'
        global.tab_name = 'Reports'
        this.props.navigation.navigate('AccountTabScreen')
        this.closeDrawer()
    }

    closeDrawer() {
        this.props.closeDrawer()
    }

    gotoHelp () {
        this.props.navigation.navigate('HelpScreen')
        this.closeDrawer()
    }
    
    render () {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.user_body}>
                        <View style={{flex : 0.3, flexDirection : 'column',justifyContent : 'center'}}>
                            <View style={{flexDirection : 'row', alignSelf :'flex-end', marginRight : 15 * metrics}}>
                                <TouchableOpacity style={{marginRight : 10 * metrics}} onPress={() => this.onSetting()}>
                                    <MaterialCommunityIcons name="settings-outline" size={30 * metrics} color={Colors.gray_color}></MaterialCommunityIcons>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.Logout()}>
                                    <MaterialCommunityIcons name="logout" size={30 * metrics} color={Colors.gray_color}></MaterialCommunityIcons>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.user}>
                            <View style={{marginLeft : 20 * metrics}}></View>
                            <Avatar
                                rounded
                                overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                size="xlarge"
                                source={{uri : 'data:image/png;base64,' + global.user_info.selfie}}
                                resizeMode={'stretch'}
                                containerStyle={{borderColor: '#000' ,borderWidth : 1}}
                                style={styles.avatar}
                            />
                            <View style={{flex : 0.1}}></View>
                            <View style={styles.user_info}>
                                <Text style={styles.user_name}>{global.user_info.first_name} {global.user_info.middle_name} {global.user_info.last_name}</Text>
                                {
                                    global.user_info.account_type == 'Business' &&
                                    <Text style={styles.company_name}>{global.user_info.account_name}</Text>
                                }
                                <View style={{flexDirection : 'row'}}>
                                    <Text style={styles.text}>Account</Text>
                                    <Text style={styles.value}>{global.user_info.account_number}</Text>
                                </View>
                                <View style={{flexDirection : 'row'}}>
                                    <Text style={styles.text}>Sort Code</Text>
                                    <Text style={styles.value}>{global.user_info.sort_code}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.button_body}>
                        <ScrollView style={{flex : 1, flexDirection : 'column',paddingTop : 20 * metrics}}>
                            <TouchableOpacity style={styles.button_item} onPress={() => this.onBanking()}>
                                <Image source={Images.side_banking} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={{fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,marginLeft : 15 * metrics, color : 'black'}}>Banking</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button_item} onPress={() => this.onCRM()}>
                                <Image source={Images.side_team} style={{width : 28 * metrics, height : 25 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>CRM</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.web_url = ''
                                global.other_title = 'Expenses'
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_pie_chart} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Expenses</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.button_item} onPress={() => this.onAccount()}>
                                <Image source={Images.side_account} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Accounting</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => this.onSales()}>
                                <Image source={Images.side_box} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Inventory</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.web_url = ''
                                global.other_title = 'MTD'
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_banking} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>MTD</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.web_url = ''
                                global.other_title = 'Projects'
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_briefcase} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Projects</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.other_title = 'HR'
                                global.web_url = "https://playlive.naxetra.com/web#view_type=kanban&model=hr.employee&menu_id=111&action=119"
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_magnifer} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>HR</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.web_url = ''
                                global.other_title = 'Payroll'
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_funds} style={{width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Payroll</Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={styles.button_item} onPress={() => {
                                global.web_url = 'https://dev.naxetra.com/web#view_type=kanban&model=ir.module.module&menu_id=45&action=31'
                                global.other_title = 'Other Apps'
                                this.props.navigation.navigate('ComingSoonScreen')
                                this.closeDrawer()
                            }}>
                                <Image source={Images.side_apps} style={{width : 25 * metrics, height : 25 * metrics, resizeMode : 'stretch'}}></Image>
                                <Text style={styles.sidebar_text}>Other Apps</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.button_item} onPress={() => this.gotoHelp()}>
                                <SimpleLineIcons name="earphones-alt" size={25 * metrics} color={Colors.main_color}></SimpleLineIcons>
                                <Text style={styles.sidebar_text}>Help</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={styles.bottom}>
                        <Image source={Images.small_logo} style={styles.logo}></Image>
                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics,color : Colors.main_color, textAlign : 'center'}}>{APP_VERSION}</Text>
                    </View>
                    <View style={{flex : 0.05}}></View>
                </View>
                {

                }
            </>
        )
    }
}

SideMenuComponent.propType = {
    closeDrawer : PropTypes.func,
    goInit : PropTypes.func,
    isLoadingfunc : PropTypes.func
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        backgroundColor : 'white',
        elevation : Platform.OS =='android' ? 10 : 0.5,
        zIndex : 999,
    },
    user_body : {
        flex : 0.3, 
        flexDirection : 'column',
        backgroundColor : '#fff3ea'
    },
    button_body : {
        flex : 0.7,
        marginBottom : 20 * metrics,
        flexDirection : 'column',
    },
    avatar : {
        width : 75 * metrics,
        height : 75 * metrics,
        elevation : 3.5,
        alignSelf: 'center',
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        borderRadius : 50 ,
        shadowOffset : { width : 0 , height : -5}
    },
    user : {
        flexDirection : 'row',
        width : '90%',
        backgroundColor : 'white',
        alignSelf : 'center',
        borderRadius : 6 * metrics,
        elevation : 3.5,
        flex : 0.6
    },
    user_info : {
        marginLeft : 15 * metrics,
        width : '60%',
        flexDirection : 'column',
        alignSelf : 'center'
    },
    user_name : {
        fontSize : 20 * metrics,
        color : '#000',
        fontWeight : '500'
    },
    company_name : {
        fontSize : 13 * metrics,
        marginTop : 2 * metrics,
        marginBottom : 5 * metrics,
    },
    button_item : {
        justifyContent : 'center',
        flex : 0.5
    },
    button : {
        width : '90%',
        height : '90%',
        justifyContent : 'center',
        alignSelf :'center',
        alignItems : 'center',
    },
    text : {
        fontSize : 16 * metrics
    },
    value : {
        fontSize : 16 * metrics,
        color : Colors.main_blue_color,
        marginLeft : 10 * metrics
    },
    border_line1 : {
        borderRightWidth : 1,
        borderBottomWidth : 1,
        borderColor : Colors.white_gray_color
    }, 
    border_line2 : {
        borderBottomWidth : 1,
        borderColor : Colors.white_gray_color
    },
    border_line3 : {
        borderRightWidth : 1,
        borderColor : Colors.white_gray_color
    }, 
    border_line4 : {
    },
    button_text : {
        fontSize : 17 * metrics,
        color : Colors.main_color,
        fontWeight : '500',
        marginTop : 10 * metrics
    },
    bottom : {
        position : 'absolute',
        width : '100%',
        bottom :5,
        flexDirection : 'column',
        justifyContent : 'center',

    },
    logout : {
        alignSelf : 'center', 
        borderWidth : 1, 
        borderColor : Colors.white_gray_color , 
        width : 120 * metrics, 
        height : 40 * metrics,
        borderRadius : 5,
        marginTop : 5 * metrics,
        justifyContent : 'center'
    },
    logo : {
        width : 150 * metrics,
        height : 40 * metrics,
        marginTop : 10 * metrics,
        marginBottom : 10 * metrics,
        resizeMode : "stretch",
        alignSelf : 'center'
    },
    sidebar_text : {
        fontFamily : Fonts.adobe_clean,fontSize : 17 * metrics,marginLeft : 15 * metrics, color : 'black'
    },
    button_item : {
        width : '85%', height : 55 * metrics,alignSelf : 'flex-end', flexDirection : 'row',alignItems : 'center'
    },
    icon : {
        width : 28 * metrics, height : 28 * metrics, resizeMode : 'stretch'
    }
})