/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View , Image ,TouchableOpacity,ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'

import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import MyChatComponent from '../../components/MyChatComponent'
import OtherChatComponent from '../../components/OtherChatComponent'

import global_style, { metrics } from '../../constants/GlobalStyle'
import { Avatar } from 'react-native-elements'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ChattingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        data : {
            contents : [
                {
                    message : 'Nice to meet you',
                    user_id : 0,
                    time : new Date().getTime(),
                    type : 0
                },
                {
                    message : '',
                    user_id : 0,
                    time : new Date().getTime(),
                    img_url : Images.test_img,
                    type : 2 // photo
                },
                {
                    message : '',
                    user_id : 0,
                    time : new Date().getTime(),
                    img_url : Images.test_img,
                    type : 2 // photo
                },
                {
                    message : 'Hello. Can you send me something?',
                    user_id : 1,
                    time : new Date().getTime(),
                    type : 0 // text and audio
                },
                {
                    message : 'Hello?',
                    user_id : 1,
                    time : new Date().getTime(),
                    type : 1 // text and audio
                },
                {
                    message : 'Nice to meet you.Nice to meet you.Nice to meet you.Nice to meet you.Nice to meet you.',
                    user_id : 0,
                    time : new Date().getTime(),
                    type : 0 // text
                },
                {
                    message : "This looks great.Let's test",
                    user_id : 0,
                    time : new Date().getTime(),
                    type : 1 // text
                },
                {
                    message : '',
                    user_id : 1,
                    time : new Date().getTime(),
                    img_url : Images.test_img,
                    type : 2 // photo
                },
            ]
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  type="chatting" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <ScrollView style={{width : '100%' , height : '100%', marginBottom : 55 * metrics}}>
                    <View style={{marginTop : 10 * metrics}}></View>
                    <View style={styles.body}>
                        {
                            this.state.data.contents.map((item, idx) => {
                                if (item.user_id == 0) { //my
                                    return (
                                        <MyChatComponent data={item} key={idx}></MyChatComponent>
                                    )
                                } else {
                                    return (
                                        <OtherChatComponent data={item} key={idx}></OtherChatComponent>
                                    )
                                }
                                
                            })
                        }
                    </View>
                </ScrollView>
                <View style={styles.bottom}>

                </View>
            </View>
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
    card_view : {
        width : '100%', 
        height : 80 * metrics,
        elevation : 3.5, 
        backgroundColor : 'white', 
        marginBottom : 15 * metrics,
        flexDirection : 'row',
        paddingLeft : 15 * metrics,
        paddingRight : 15 * metrics,
        shadowOffset : { width : 0 , height : -15},
    },
    body : {
        flex : 1, width : '95%', alignSelf : 'center'
    },
    bottom : {
        height : 55 * metrics,
        position : 'absolute',
        width : '100%',
        backgroundColor : 'white',
        elevation : 5.5,
        shadowOffset : {width : 0 , height : -10},
        bottom : 0
    }
});