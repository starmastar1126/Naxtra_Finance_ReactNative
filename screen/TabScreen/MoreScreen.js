/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity,StyleSheet, ScrollView,Image} from 'react-native'
import TabHeaderScreen from '../../components/TabHeaderScreen'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import { metrics } from '../../constants/GlobalStyle';
import PropTypes from 'prop-types'
import {Fonts} from '../../constants/Fonts'
import ImagePicker from 'react-native-image-picker';

export default class MoreScreen extends Component {
    componentDidMount () {
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    gotoHelp = () => {
        this.props.navigation.navigate('HelpScreen')
    }

    gotoSetting = () => {
        this.props.navigation.navigate('SettingScreen')
    }

    gotoCamera = () => {
        var options = {
            title: 'Select Card Pic',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                var res = response.data
                this.activeCard (res)
                console.log('res!!!!!!!!!!!')
            }
        });
    }

    gotoUploadInvoice () {
        global.tab_name = 'Expenses'
        this.props.navigation.navigate('AccountTabScreen', {refresh : true})
    }

    gotoCreateInvoice () {
        global.tab_name = 'Sales'
        this.props.navigation.navigate('AccountTabScreen', {refresh : true})
    }

    render() {
        return (
        <View style={{flex : 1}}>
            <TabHeaderScreen headerTitle="More" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></TabHeaderScreen>
            <ScrollView style={styles.container}>
                <View style={styles.body}>
                    <View style={{marginTop : 40 * metrics}}></View>
                    <View style={styles.setting_btn}>
                        {/* <TouchableOpacity style={styles.btn_item} onPress={() => this.props.navigation.navigate('AddMoneyScreen')}>
                            <View style={styles.item}>
                                <Image source={Images.account_add1_icon} style={styles.image}></Image>
                                <Text style={styles.text}>Add Money</Text>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.btn_item} onPress={() => this.gotoUploadInvoice()}>
                            <View style={styles.item}>
                                <SimpleLineIcons name="docs" size={40 * metrics} color={Colors.main_color}></SimpleLineIcons>
                                <Text style={styles.text}>Payment Bill</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn_item} onPress={() => this.gotoCreateInvoice()}>
                            <View style={styles.item}>
                                <SimpleLineIcons name="docs" size={40 * metrics} color={Colors.main_color}></SimpleLineIcons>
                                <Text style={styles.text}>Create Invoice</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.btn_item} onPress={() => this.gotoSetting()}>
                            <View style={styles.item}>
                                <SimpleLineIcons name="settings" size={40 * metrics} color={Colors.main_color}></SimpleLineIcons>
                                <Text style={styles.text}>Setting</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.btn_item} onPress={() => this.gotoCamera()}>
                            <View style={styles.item}>
                                <Image source={Images.camera_img} style={{width : 50 * metrics, height : 50 * metrics}}></Image>
                                
                                <Text style={styles.text}>Activate Card</Text>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.btn_item} onPress={() => this.gotoHelp()}>
                            <View style={styles.item}>
                                <SimpleLineIcons name="earphones-alt" size={35 * metrics} color={Colors.main_color}></SimpleLineIcons>
                                <Text style={styles.text}>Help</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
        );
    }
}

MoreScreen.propType = {
    showDrawer : PropTypes.func
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : Colors.white_color
    },
    body : {
        width : '85%',
        height : '100%',
        alignSelf : 'center',
    },
    setting_btn : {
        flex : 1,
        flexDirection : 'row',
        flexWrap : 'wrap'
    },
    btn_item : {
        width : '33%' , 
        borderRightWidth : 1, 
        borderBottomWidth : 1,
        borderColor : Colors.white_gray_color,
        padding : 5 * metrics
    },
    item : {
        width : 90 * metrics , 
        height : 90 * metrics , 
        flexDirection : 'column',
        alignSelf : 'center',
        alignItems : 'center',
        justifyContent : 'center'
    },
    image : {
        width : 42 * metrics, resizeMode : 'stretch',height : 42 * metrics
    },
    text : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        marginTop : 10 * metrics,
        textAlign : 'center',
    }
})