/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View,Text, TouchableOpacity,ActivityIndicator,StyleSheet, Image,Alert} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import HelpService from '../../service/HelpService';
import {Fonts} from '../../constants/Fonts'
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Mailer from 'react-native-mail';
import { alertMessage } from '../../utils/utils';

export default class IssueScreen extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    state = {
        issue : '',
        isReady : false,
        isLoading : false,
        description : '',
        receipt_files : [],
    }
    setInitState () {
        this.setState({
            issue : '',
            isReady : false,
            isLoading : false,
            description : '',
            receipt_files : [],
        })
    }
    checkReady = () => {
        if (this.state.issue != '' && this.state.description && this.state.receipt_files.length > 0) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    onSubmit = () => {
        if (!this.state.isReady)
            return
        var result = []
        if (this.state.receipt_files.length > 0) {
            for (var i = 0 ;i < this.state.receipt_files.length; i++) {
                var obj = {
                    attachment_name : "Attachment " + (i + 1),
                    attachment : this.state.receipt_files[i]
                }
                result.push(obj)
            }
        }
        var obj = {
            issue_title : this.state.issue,
            message : this.state.description,
            attachment_ids : result
        }
        this.setState({isLoading : true})
        HelpService.sendSupportTicket(global.token, obj).then(res => {
            var data = res.data.result
            console.log('data = ' , data)
            if (data.success) {
                this.setInitState()
                alertMessage(data.message)
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log('error = ' , error.message)
            this.setState({isLoading : false})
        })
    }
    removeAttach (idx) {
        console.log('idx = ', idx)
        var result = []
        var resources = []
        for (var i = 0 ; i < this.state.receipt_files.length; i++) {
            if (idx != i) {
                resources.push(this.state.receipt_files[i])
            }
        }
        this.setState({receipt_files : resources})
    }
    onAttachFile = () => {
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
                var res = this.state.receipt_files
                res.push(response.data)

                this.setState({receipt_files : res}, () => this.checkReady())
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                <View style={{width : '100%' , height : '100%'}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Back" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={global_style.help_body}>
                        <ScrollView style={{flex : 0.45}}>
                            <View style={{width : '85%', alignSelf : 'center'}}>
                                <TextComponent
                                    textPlaceHolder = "Tell us about issue"
                                    textValue={this.state.issue}
                                    textType="text"
                                    ready ={ this.state.isReady}
                                    multiple = {false}
                                    onChangeText = {(value) => this.setState({issue : value},() => {this.checkReady()})}
                                > </TextComponent>
                                <View style={{marginTop : 100 * metrics}}></View>
                                <TextComponent
                                    textPlaceHolder = "Issue Description"
                                    textValue={this.state.description}
                                    textType="text"
                                    ready ={ this.state.isReady}
                                    multiple = {true}
                                    onChangeText = {(value) => this.setState({description : value},() => {this.checkReady()})}
                                > </TextComponent>
                            </View>
                        </ScrollView>
                        <View style={global_style.help_attachment}>
                            <View style={styles.attach_body}>
                                <Text style={styles.attach_text}>Attachment</Text>
                                <ScrollView  horizontal={true} style={{height : 100}}>
                                    <View style={{marginTop : 15 * metrics, flexDirection : 'row',position : 'relative'}}>
                                        <TouchableOpacity style={styles.new_receipt} onPress={() => this.onAttachFile()}>
                                            <MaterialCommunityIcons name="camera" size={25 * metrics} style={{color : Colors.main_blue_color, alignSelf : 'center'}}></MaterialCommunityIcons>
                                        </TouchableOpacity>

                                        {
                                            this.state.receipt_files.map((item, idx) => {
                                                return (
                                                    <View>
                                                        <TouchableOpacity key={idx} style={{marginRight : 8 * metrics}} onPress={() => this.gotoViewPic(item)}>
                                                            <Image source={{uri : 'data:image/png;base64,' +  item}} style={styles.img_item}></Image>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => this.closeBtn(idx)} style={styles.close_icon} onPress={() => this.removeAttach(idx)}>
                                                            <MaterialCommunityIcons name="close-circle-outline" size={30 * metrics} color={Colors.main_blue_color}></MaterialCommunityIcons>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={{flex : 0.1}}></View>
                        <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onSubmit()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Submit</Text>
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
                    </View>
                }
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    attach_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : Colors.dark_gray,
        fontWeight : 'bold',
        marginTop : 15 * metrics,
        marginLeft : 10 * metrics
    },
    attach_body : {
        width : '90%',
        alignSelf : 'center',
        marginTop : 15 * metrics,
        minHeight : 65 * metrics,
    },
    new_receipt : {
        width : 65 * metrics,
        height : 65 * metrics,
        borderWidth : 1,
        borderRadius : 8 * metrics,
        borderColor : Colors.white_gray_color,
        justifyContent : 'center',
        marginRight : 8 * metrics
    },
    img_item : {
        width : 65 * metrics,
        height : 65 * metrics,
        borderWidth : 1,
        borderRadius : 8 * metrics,
        borderColor : Colors.white_gray_color,
        justifyContent : 'center',
        marginLeft : 8 * metrics
    },
    close_icon : {
        position : 'absolute',
        top : -10,
        right : 0,
        zIndex : 9999,
        backgroundColor : 'white',
        borderRadius : 50
    },
})