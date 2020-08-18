/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component,useRef} from 'react';
import {Platform, View,Text, TouchableOpacity ,StyleSheet ,Image, AsyncStorage,ActivityIndicator} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import { alertMessage } from '../utils/utils'
import ImagePicker from 'react-native-image-crop-picker'
//import ImagePicker from 'react-native-image-picker';
import RNThumbnail from 'react-native-thumbnail'
import { Fonts } from '../constants/Fonts'

import RNFS from 'react-native-fs'
import UserService from '../service/UserService'
import { SafeAreaView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    cameraType : 'back',
    mediaType : 'photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class BiometricScreen extends Component {
    componentDidMount () {
        this.setState({isShow : false})
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    
    submit = () => {
        if (!this.state.isReady) return
        this.uploadPhoto()
    }

    state = {
        isReady : false,
        img_url : '',
        video_url : '',
        thumb_img : '',
        isShow : false,
        recording : false,
        isLoading : false,

        img_data : null,
        video_data : ''
    }

    capture = (type) => {
        if (type == 0) { //Selfie
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropperCircleOverlay : true,
                includeBase64 : true,
                cropping: true,
            }).then(image => {
                const source = {uri : image.path}
                global.selfie = source
                this.setState({
                    img_data : image,
                    img_url : source
                }, () => {this.checkReady()})
            });
        } else { //Video
            ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropperCircleOverlay : true,
                cropping: false,
                mediaType : 'video',
                includeBase64 : true,
            }).then(video => {
                this.setState({video_data : video ,video_url : video.path}, () => {this.checkReady()})
                RNFS.readFile(video.path, 'base64').then(result => {
                    var base64_data = result
                    this.setState({video_data : base64_data})
                })
                RNThumbnail.get(video.path).then((result) => {
                    this.setState({thumb_img : {uri : result.path}})
                    global.video_img = {uri : result.path}
                })
            });
        }
    }
    checkReady = () => {
        if (this.state.img_data != null) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    playVideo = () => {
        
    }

    uploadPhoto () {
        var data = {
            token : global.token,
            take_selfie : this.state.img_data.data,
            upload_video : this.state.video_data,
        }
        this.setState({isLoading : true})
        UserService.uploadBiometic(data, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.gotoBack()
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log('error = ' , error.message)
            alertMessage(ErrorMessage.network_error)
            this.setState({isLoading : false})
        })
    }
    gotoBack = async() => {
        var obj = {
            user : {
                email : global.user_info.email,
                password : global.user_info.password
            },
            personal_status : '1',
            proof_status : '1',
            verification_state : '1',
            business_status : ''
        }
        await AsyncStorage.setItem('signup_step' , JSON.stringify(obj))

        await AsyncStorage.setItem('verification_state' , '1')
        var obj = {
            selfie : global.selfie,
            video_img : global.video_img
        }
        await AsyncStorage.setItem('bio_info' , JSON.stringify(obj))
        await this.props.navigation.navigate('WelcomeScreen', {refresh : true})
    }
    render() {
        return (
            <SafeAreaView style={{flex :1,backgroundColor : 'white'}}>
                <View style={{width : '100%' , height : '100%',zIndex : 10}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <ScrollView style={{width : '100%' , height : '100%'}}>
                        <View style={[global_style.input_body, { width : '75%'}]}>
                            <View style={{marginTop : 30 * metrics}}></View>
                            <Text style={global_style.input_title}>Biometric Verification</Text>
                            <View style={{flex : 1, flexDirection : 'column'}}>
                                <View style={{marginTop : 30 * metrics}}></View>
                                <View style={{marginBottom : 30 * metrics , flexDirection : 'column'}}>
                                    <Text style={styles.title}>Take Selfie</Text>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    <View style={this.state.img_url == '' ? styles.card_view : [styles.card_view, {borderColor : 'white'}]}>
                                        {
                                            this.state.img_url == '' ? 
                                            <TouchableOpacity style={styles.capture_btn} onPress={() => this.capture(0)}>
                                                <MaterialIcon name="tooltip-image-outline" size={30 * metrics} color={Colors.gray_color}></MaterialIcon>
                                            </TouchableOpacity>
                                            :
                                            <View style={{ flex : 1 , flexDirection  :'row'}}>
                                                <Image 
                                                    style={styles.thumImg}
                                                    source={this.state.img_url}
                                                ></Image>
                                                <View style={{flex : 0.4, flexDirection : 'column', justifyContent : 'center'}}>
                                                    <View style={{flex : 0.25}}></View>
                                                    <TouchableOpacity style={styles.right_item} onPress={() => this.setState({img_url : ''})}>
                                                        <MaterialIcon name="trash-can-outline" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                        <Text style={styles.text}>Delete</Text>
                                                    </TouchableOpacity>
                                                    <View style={{marginTop : 20 * metrics}}></View>
                                                    <TouchableOpacity style={styles.right_item} onPress={() => this.capture(0)}>
                                                        <MaterialIcon name="refresh" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                        <Text style={styles.text}>Replace</Text>
                                                    </TouchableOpacity>
                                                    <View style={{flex : 0.25}}></View>
                                                </View>
                                            </View>
                                        }
                                        
                                    </View>
                                </View>
                                <View style={{marginTop : 20 * metrics}}></View>
                                <View style={{flex : 0.3 , flexDirection : 'column'}}>
                                    <Text style={styles.title}>Upload Video</Text>
                                    <View style={{marginTop : 10 * metrics , marginBottom : 10 * metrics}}>
                                        <Text style={styles.video_text}>Please read this text to record your video.</Text>
                                        <Text style={styles.video_text}>"Hi, My name is {global.user_info.first_name} {global.user_info.last_name}.</Text>
                                        <Text style={styles.video_text}>I would like to open Naxetra Account"</Text>
                                    </View>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    <View style={this.state.video_url == '' ? styles.card_view : [styles.card_view, {borderColor : 'white'}]}>
                                        {
                                            this.state.video_url != '' ?
                                            <View style={{ flex : 1 , flexDirection  :'row'}}>
                                                <TouchableOpacity style={styles.thumImg} onPress={() => this.playVideo()}>
                                                    <Image 
                                                        style={{flex : 1, resizeMode : 'stretch'}}
                                                        source={this.state.thumb_img}
                                                    >
                                                    </Image>
                                                    <View style={{position : "absolute", alignItems : 'center', justifyContent : 'center', width : '100%', height : '100%'}}>
                                                        <MaterialIcon name="play-circle-outline" size={30 * metrics} style={{alignSelf : 'center'}} color={Colors.gray_color}></MaterialIcon>
                                                    </View>
                                                </TouchableOpacity>
                                                
                                                <View style={{flex : 0.4, flexDirection : 'column', justifyContent : 'center'}}>
                                                    <View style={{flex : 0.25}}></View>
                                                    <TouchableOpacity style={styles.right_item} onPress={() => this.setState({video_url : '', thumImg : ''})}>
                                                        <MaterialIcon name="trash-can-outline" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                        <Text style={styles.text}>Delete</Text>
                                                    </TouchableOpacity>
                                                    <View style={{marginTop : 20 * metrics}}></View>
                                                    <TouchableOpacity style={styles.right_item} onPress={() => this.capture(1)}>
                                                        <MaterialIcon name="refresh" size={30 * metrics} color={Colors.main_blue_color} style={styles.icon}></MaterialIcon>
                                                        <Text style={styles.text}>Replace</Text>
                                                    </TouchableOpacity>
                                                    <View style={{flex : 0.25}}></View>
                                                </View>
                                            </View> 
                                            : 
                                            <TouchableOpacity style={styles.capture_btn} onPress={() => this.capture(1)}>
                                                <MaterialIcon name="video-outline" size={35 * metrics} color={Colors.gray_color}></MaterialIcon>
                                            </TouchableOpacity>
                                        }
                                        
                                    </View>
                                </View>
                                <View style={{marginTop : 40 * metrics}}></View>
                                <View style={{flex : 0.2}}>
                                    <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.submit()}>
                                        <View style={global_style.btn_body}>
                                        <Text style={global_style.left_text}>Submit</Text>
                                            <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginTop : 20 * metrics}}></View>
                            </View>
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
        fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,
        color : Colors.main_blue_color, 
        alignSelf : 'center',
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
    },
    title : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
    },
    card_view : {
        flex : 0.9,
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        borderRadius : 5,
    },
    capture_btn : {
        flex : 1, 
        flexDirection : 'column', 
        alignItems : 'center', 
        justifyContent : 'center',
        height : 180 * metrics
    },
    thumImg : {
        flex : 0.6,
        height : 180 * metrics,
        borderWidth : 1, 
        borderColor : Colors.white_gray_color,
        borderRadius : 5
    },
    text : {
        fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,
        color : Colors.main_blue_color, 
        alignSelf : 'center',
        marginLeft : 5 * metrics
    },
    record_btn : {
        width : 120 * metrics , 
        height : 50 * metrics , 
        backgroundColor : Colors.white_color, 
        borderRadius : 10 * metrics,
        position : 'absolute', 
        bottom : 20 ,
        alignSelf : 'center',
        justifyContent  :'center'
    },
    video_text : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color: Colors.dark_gray,
        marginTop : 7 * metrics
    }
})