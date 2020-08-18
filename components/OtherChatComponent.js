import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ProgressBarAndroid} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import { Avatar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Fonts} from '../constants/Fonts'
export default class OtherChatComponent extends Component {
    componentDidMount () {
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{width : 50  , height : 50,marginRight : 15 * metrics}}>
                    <Image source={Images.person} style={{width : '100%', height : '100%' , borderRadius : 50}}></Image>
                </View>
                <View style={{flexDirection : 'column' , width : '100%'}}>
                    <View style={{width : '100%', flexDirection : 'column'}}>
                        { //text
                            this.props.data.type == 0 && 
                            <View style={styles.chatting_body_text}>
                                <Text style={styles.text}>{this.props.data.message}</Text>
                            </View>
                        }
                        { //text and audio
                            this.props.data.type == 1 &&
                            <View style={{width : '100%' , flexDirection : 'column', alignItems : 'flex-start'}}>
                                {
                                    this.props.data.message != '' && 
                                    <View style={styles.chatting_body_text}>
                                        <Text style={styles.text}>{this.props.data.message}</Text>
                                    </View>
                                }
                                <View style={styles.audio_with_text}>
                                    <View style={{flex : 0.2, justifyContent : 'center'}}>
                                        <TouchableOpacity style={{alignSelf : 'center'}}>
                                            <MaterialCommunityIcons name="play-circle" size={30 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex : 0.5 , justifyContent : 'center' , marginRight : 10 * metrics}}>
                                        {
                                            Platform.OS == 'android' ? 
                                            <ProgressBarAndroid 
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                color = {Colors.main_color}
                                                progress={0.4}>
                                            </ProgressBarAndroid> 
                                            :
                                            <ProgressBarAndroid 
                                                styleAttr="Horizontal"
                                                indeterminate={false}
                                                color = {Colors.main_color}
                                                progress={0.5}>
                                            </ProgressBarAndroid> 
                                        }
                                    </View>
                                    <View style={{flex : 0.35 ,justifyContent : 'center', alignItems : 'center'}}>
                                        <Text style={{fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean, textAlign : 'center'}}>00:34/1:12</Text>
                                    </View>
                                    <View style={{flex : 0.2, justifyContent : 'center',alignItems : 'center'}}>
                                        <SimpleLineIcons name="microphone" size={20 * metrics}></SimpleLineIcons>
                                    </View>
                                </View>
                            </View>
                            
                        }
                        { //image
                            this.props.data.type == 2 &&
                            <View style={styles.chatting_body_text}>
                                <Image source={this.props.data.img_url} style={styles.chatting_img}></Image>
                            </View>
                        }
                        <Text style={styles.time}>16:55 PM</Text>
                    </View>
                </View>
            </View>
        )
    }
}

OtherChatComponent.propType = {
	data : PropTypes.object
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        flexDirection : 'row',
        alignItems : 'flex-start',
        marginTop : 5 * metrics
    },
    chatting_body_text : {
        minHeight : 50 * metrics,
        minWidth : '45%',
        maxWidth : '55%',
        backgroundColor : Colors.main_color,
        borderTopRightRadius : 18,
        borderBottomRightRadius : 18 ,
        borderTopLeftRadius : 18 ,
        elevation : 3.5,
        //padding : 10 * metrics,
    },
    audio_with_text : {
        minHeight : 50 * metrics,
        width : '70%',
        flexDirection : 'row',
        backgroundColor : 'white',
        borderBottomRightRadius : 18,
        borderTopRightRadius : 18 ,
        borderBottomLeftRadius : 18 ,
        elevation : 3.5
    },
    chatting_img : {
        width : '100%',
        height : 150 * metrics,
        resizeMode : "stretch",
        borderTopRightRadius : 25,
        borderBottomRightRadius : 25 ,
        borderTopLeftRadius : 25 ,
    },
    text : {
        padding : 10 * metrics,
        paddingLeft : 12 * metrics,
        paddingRight : 12 * metrics,
        fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean,
        flexWrap : 'wrap',
        color : 'white'
    },
    time : {
        textAlign : 'left', 
        marginTop : 5 * metrics,
        color : '#aaaaaa'
    }
})