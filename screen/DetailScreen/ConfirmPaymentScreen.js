/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet,Text, View ,Clipboard, Image ,TouchableOpacity, ImageBackground,SafeAreaView,ToastAndroid,Share} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TransactionService from '../../service/TransactionService'
import { alertMessage, changeNumber } from '../../utils/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Fonts } from '../../constants/Fonts'

export default class ConfrimPaymentScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    componentDidMount() {
        if (global.link != undefined && global.link != '') {
            this.setState({url : global.link})
        } else {
            this.setState({url : 'https://www.naxetra.com/'})
        }
    }
    constructor (props) {
        super(props)
        this.account_ref = null;
        this.state = {
            isLoading : false,
            amount : '',
            message : '',
            isReady : false,
            pay_type : '',
            token : '',
            account_screen : false
        }
    }
    
    pay = () => {
        this.nextStep()
        //this.getLocalStorage()
    }
    nextStep = () => {
        this.props.navigation.navigate('TransferScreen')
    }
    copyLink = async() => {
        await Clipboard.setString(this.state.url)
        ToastAndroid.showWithGravityAndOffset(
            'You have copied web url.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    }
    shareLink = async() => {
        console.log(global.pay_user)
        var message = "Reference : " + global.pay_user.reference  + '\n' + "Account Number : " + global.pay_user.user.rb_uk_account_number + '\n' + "Sort Code : " + global.pay_user.user.rb_uk_sort_code + '\n' + "Paid to : " + global.pay_user.user.rb_name + '\n' + "Amount : £ " + global.pay_user.amount
        try {
            const result = await Share.share({
                title : 'Transactions',
                message: message
            });
      
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
        } catch (error) {
            //alert(error.message);
        }
        //Linking.openURL(this.state.url).catch(err => console.error('An error occurred', err));
    }
    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Confirm Payment" goBack ={() => {
                        global.tabIdx = 1
                        global.init_account == 'true'
                        this.props.navigation.navigate('TabScreen', {refresh : true})
                    }}></DetailHeaderComponent>
                    <View style={{flex : 1, flexDirection : 'column', backgroundColor : Colors.white_color}}>
                        <View style={{marginTop : 20 * metrics}}></View>
                        <View style={{width :'90%',flex : 0.7, alignSelf : 'center'}}>
                            <ImageBackground source={Images.doc_img} style={{ width : '100%' , height : '100%'}} resizeMode="stretch">
                                <View style={{flex : 1, flexDirection : 'column'}}>
                                    <View style={{flex : 0.4 , alignSelf : 'center' ,width : '70%'}}>
                                        <View style={{flex : 0.2}}></View>
                                        <Text style={{flex : 0.2 ,fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : Colors.gray_color}}>To Pay</Text>
                                        <View style={{flex : 0.4, flexDirection : 'row'}}>
                                            <View style={{justifyContent : 'center',flex : 0.2, alignItems : 'flex-start'}}>
                                                {
                                                    !global.pay_user.user.rb_beneficiary_icon ?
                                                    <EvilIcons name="user" style={{fontFamily : Fonts.adobe_clean,fontSize : 60 * metrics, color : Colors.main_color}}></EvilIcons>
                                                    :
                                                    <Image source={{uri : 'data:image/png;base64,' + global.pay_user.user.rb_beneficiary_icon}} style={{width : 60 * metrics , height : 60 * metrics, borderRadius : 50, resizeMode : 'cover'}}></Image>
                                                }
                                                
                                            </View>
                                            <View style={{justifyContent : 'center', marginLeft : 10 * metrics, flex : 0.75}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>{global.pay_user.user.rb_name}</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 12 * metrics, color : Colors.gray_color,marginTop : 5 * metrics}} numberOfLines={1}>Account number : {global.pay_user.user.rb_uk_account_number}</Text>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 12 * metrics, color : Colors.gray_color,marginTop : 5 * metrics}} numberOfLines={1}>Sort code : {global.pay_user.user.rb_uk_sort_code}</Text>
                                            </View>
                                            <View style={{flex : 0.05, justifyContent : 'center', alignItems : 'flex-end'}}>
                                                <MaterialIcons name="play-arrow" size={18 * metrics}></MaterialIcons>
                                            </View>
                                        </View>
                                        <View style={{flex : 0.2}}></View>
                                    </View>
                                    <Image source={Images.border_line} style={{width : '90%',alignSelf : 'center'}} resizeMode="contain"></Image>
                                    <View style={{flex : 0.6 , alignSelf : 'center', width : '70%'}}>
                                        <View style={{flex : 0.1}}></View>
                                        <View style={{flex : 0.7 , flexDirection : 'column' , alignItems :'center'}}>
                                            <View style={{flex : 0.5}}></View>
                                            <View style ={{flexDirection : 'row',alignItems : 'center'}}>
                                                <Text style={styles.label}>Amount to send</Text>
                                                <Text style={styles.value}>£ {changeNumber(Number(global.pay_user.amount).toFixed(2)) }</Text>
                                            </View>
                                            {/* <View style={{flexDirection : 'row'}}>
                                                <Text style={styles.label}>Processing fee 2%</Text>
                                                <Text style={styles.value}>£ {changeNumber(Number(0).toFixed(2))}</Text>
                                            </View> */}
                                            <View style={{flex : 0.2}}></View>
                                            <View style={{flexDirection : 'row'}}>
                                                <Text style={styles.label}>Amount to send</Text>
                                                <Text style={styles.value}>£ {changeNumber(Number(global.pay_user.amount).toFixed(2))}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex : 0.2}}></View>
                                    </View>
                                </View>
                            </ImageBackground>
                            
                        </View>
                        <View style={{flex : 0.3, justifyContent :'center', width : '85%' ,alignSelf : 'center'}}>
                            <TouchableOpacity  style={styles.button} onPress={()=> this.copyLink()}>
                                <View style={{flexDirection : 'row', alignSelf : 'center',alignItems : 'center'}}>
                                    <MaterialCommunityIcons name="content-copy" size={25 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                    <Text style={styles.btn_text}>Copy Link</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{marginTop : 20 * metrics}}></View>
                            <TouchableOpacity  style={styles.button} onPress={()=> this.shareLink()}>
                                <View style={{flexDirection : 'row', alignSelf : 'center',alignItems : 'center'}}>
                                    <MaterialCommunityIcons name="share-variant" size={25 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                    <Text style={styles.btn_text}>Share Link</Text>
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
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        alignSelf : 'center',
    },
    bottom : {
        flex : 0.2 , width : '85%', alignSelf : 'center', justifyContent : 'center',fontFamily : Fonts.adobe_clean,
    },
    value : {
        flex : 0.4, fontSize : 17 * metrics, fontWeight : '500',textAlign : 'center',fontFamily : Fonts.adobe_clean,
    },
    label : {
        flex : 0.6, fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,
    },
    button : {
        width : '95%',
        height : 50 * metrics,
        backgroundColor : 'white',
        alignSelf : 'center',
        borderColor : Colors.main_color,
        borderWidth : 1,
        justifyContent : 'center',
        borderRadius : 5 
    },
    btn_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 16 * metrics,
        color : Colors.main_color,
        marginLeft : 15 * metrics
    }
});