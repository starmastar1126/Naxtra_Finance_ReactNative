/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity, Share, Clipboard,ToastAndroid} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'

export default class LinkSuccessScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    async componentDidMount() {
        await AsyncStorage.setItem('steps' , 'LoginScreen')
        await AsyncStorage.setItem("is_signup", '')
        
        if (global.link != undefined && global.link != '') {
            this.setState({url : global.link})
        } else {
            this.setState({url : 'https://naxetra.com/GFTR9DS3'})
        }
    }
    state = {
        amount : '',
        message : '',
        isReady : false,
        pay_type : '',
        url : ''
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
        try {
            const result = await Share.share({
                title : 'Payment URL',
                message: this.state.url
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
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{flex : 0.05}}></View>
                    <View style={{flex : 0.2, width : '90%' ,alignSelf : 'center'}}>
                        <TouchableOpacity  onPress={() => this.goBack()}>
                            <MaterialCommunityIcons name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex : 0.75, justifyContent: 'center', alignItems : 'center'}}>
                        <Image source={Images.like_img} style={{width : 65 * metrics, height : 65 * metrics}}></Image>
                        <View style={{marginTop : 10 * metrics}}></View>
                        <Text style={{fontWeight : '500',fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,}}>Link generated successfully</Text>
                    </View>
                </View>
                <View style={{flex : 0.05 , backgroundColor : Colors.white_color}}></View>
                <View style={{flex : 0.55}}>
                    <View style={styles.body}>
                        <View style={{marginTop : 40 * metrics}}></View>
                        <Text style={{alignSelf : 'center',fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics}}>{this.state.url}</Text>
                        <View style={{marginTop : 40 * metrics}}></View>
                        <TouchableOpacity style={styles.button} onPress={() => this.copyLink()}>
                            <MaterialCommunityIcons name="content-copy" size={30 * metrics} color={Colors.main_color} style={{marginTop : 10 * metrics}}></MaterialCommunityIcons>
                            <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics,marginTop : 13 * metrics, marginLeft : 8 * metrics}}>Copy Link</Text>
                        </TouchableOpacity>
                        <View style={{marginTop : 20 * metrics}}></View>
                        <TouchableOpacity style={styles.button} onPress={() => this.shareLink()}>
                            <MaterialCommunityIcons name="share-variant" size={30 * metrics} color={Colors.main_color} style={{marginTop : 10 * metrics}}></MaterialCommunityIcons>
                            <Text style={{color : Colors.main_color, fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics,marginTop : 13 * metrics, marginLeft : 8 * metrics}}>Share Link</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
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
        backgroundColor : Colors.white_color,
    },
    header : {
        flex : 0.5, 
        backgroundColor : 'white', 
        elevation : 3.5,
        flexDirection : 'column',
    },
    body :{
        height : '100%',
        flexDirection : 'column',
        width : '80%',
        alignSelf : 'center',
    },
    name : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color
    },
    value : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
        color : '#000',
        marginTop : 7 * metrics
    },
    button : {
        width : '100%' , 
        height : 55 * metrics ,
        borderRadius : 7 ,
        borderWidth : 1, 
        borderColor : Colors.main_color,
        flexDirection : 'row',
        justifyContent : 'center',
    }
});