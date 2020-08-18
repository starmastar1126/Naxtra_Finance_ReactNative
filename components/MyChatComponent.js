import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image,ProgressBarAndroid} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Fonts} from '../constants/Fonts'
import { Avatar } from 'react-native-elements';

export default class MyChatComponent extends Component {
    componentDidMount () {
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{flex : 1 , flexDirection : 'column'}}>
                    { //text
                        this.props.data.type == 0 && 
                        <View style={styles.chatting_body_text}>
                            <Text style={styles.text}>{this.props.data.message}</Text>
                        </View>
                    }
                    { //text and audio
                        this.props.data.type == 1 &&
                        <View style={{width : '100%' , flexDirection : 'column', alignItems : 'flex-end'}}>
                            {
                                this.props.data.message != '' && 
                                <View style={styles.chatting_body_text}>
                                    <Text style={styles.text}>{this.props.data.message}</Text>
                                </View>
                            }
                            <View style={styles.audio_with_text}>
                                <View style={{flex : 0.2, justifyContent : 'center'}}>
                                    <TouchableOpacity style={{alignSelf : 'center'}}>
                                        <MaterialCommunityIcons name="play-circle" size={30 * metrics} color={Colors.main_dark_blue_color}></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex : 0.5 , justifyContent : 'center' , marginRight : 10 * metrics}}>
                                    {
                                        Platform.OS == 'android' ? 
                                        <ProgressBarAndroid 
                                            styleAttr="Horizontal"
                                            indeterminate={false}
                                            color = {Colors.main_dark_blue_color}
                                            progress={0.4}>
                                        </ProgressBarAndroid> 
                                        :
                                        <ProgressBarAndroid 
                                            styleAttr="Horizontal"
                                            indeterminate={false}
                                            color = {Colors.main_dark_blue_color}
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
        )
    }
}

MyChatComponent.propType = {
	data : PropTypes.object
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        flexDirection : 'column',
        alignItems : 'flex-end',
        marginBottom : 10 * metrics,
        marginTop : 10 * metrics
    },
    chatting_body_text : {
        minHeight : 55 * metrics,
        minWidth : '45%',
        maxWidth : '55%',
        backgroundColor : Colors.main_dark_blue_color,
        borderTopLeftRadius : 18,
        borderTopRightRadius : 18 ,
        borderBottomLeftRadius : 18 ,
        elevation : 3.5,
        //padding : 10 * metrics,
    },
    audio_with_text : {
        minHeight : 55 * metrics,
        width : '75%',
        flexDirection : 'row',
        backgroundColor : 'white',
        borderTopLeftRadius : 18,
        borderBottomRightRadius : 18 ,
        borderBottomLeftRadius : 18 ,
        elevation : 3.5
    },
    chatting_img : {
        width : '100%',
        height : 150 * metrics,
        resizeMode : "stretch",
        borderTopLeftRadius : 25,
        borderTopRightRadius : 25 ,
        borderBottomLeftRadius : 25 ,
    },
    text : {
        padding : 10 * metrics,
        paddingLeft : 12 * metrics,
        paddingRight : 12 * metrics,
        fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean,
        color : 'white',
        flexWrap : 'wrap'
    },
    time : {
        textAlign : 'right', 
        marginTop : 5 * metrics,
        color : '#aaaaaa'
    }
})