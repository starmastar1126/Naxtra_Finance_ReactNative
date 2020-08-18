/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import { Avatar } from 'react-native-elements'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class MessageScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    componentDidMount() {
    }

    componentWillUnmount() {
        
    }
      
    _onUnreadChange = ({ count }) => {
       
    }

    gotoChatting = (item) => {
        this.props.navigation.navigate('ChattingScreen')
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Message" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                {/* <ScrollView style={{width : '100%' , height : '100%'}}>
                    <View style={{marginTop : 20 * metrics}}></View>
                    <View style={{width : '90%' , height : '100%' , flexDirection : 'column', alignSelf : 'center'}}>
                        <TouchableOpacity style={styles.card_view} onPress={() => this.gotoChatting('1')}>
                            <Avatar
                                rounded
                                overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                size="xlarge"
                                source={Images.person}
                                resizeMode={'stretch'}
                                containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                style={styles.img}
                            />
                            <View style={styles.user_info}>
                                <Text style={styles.user_name}>Alex Sanchez</Text>
                                <Text style={styles.message} numberOfLines={1}>Hi nice to meet you.I am here.How is your condition?</Text>
                            </View>
                            <View style={styles.time_info}>
                                <View style={styles.time}>
                                    <Text style={{ fontSize : 15 * metrics, textAlign : 'right'}}>9 :45 AM</Text>
                                </View>
                                <View style={styles.badge_body}> 
                                    <View style={styles.badge}>
                                        <Text style={styles.badge_text}>2</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card_view}>
                            <Avatar
                                rounded
                                overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                size="xlarge"
                                source={Images.person1}
                                resizeMode={'stretch'}
                                containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                style={styles.img}
                            />
                            <View style={styles.user_info}>
                                <Text style={styles.user_name}>John Doe</Text>
                                <Text style={styles.message} numberOfLines={1}>Hi nice to meet you.I am here.How is your condition?</Text>
                            </View>
                            <View style={styles.time_info}>
                                <View style={styles.time}>
                                    <Text style={{ fontSize : 15 * metrics, textAlign : 'right'}}>2 :45 PM</Text>
                                </View>
                                <View style={styles.badge_body}> 
                                    <View style={styles.badge}>
                                        <Text style={styles.badge_text}>1</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView> */}
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
    card_view : {
        width : '100%', 
        height : 80 * metrics,
        elevation : 3.5, 
        backgroundColor : 'white', 
        marginBottom : 15 * metrics,
        flexDirection : 'row',
        // padding : 15 * metrics,
        paddingLeft : 15 * metrics,
        paddingRight : 15 * metrics,
        shadowOffset : { width : 0 , height : -15},
    },
    img : {
        width : 65 * metrics,
        height : 65 * metrics,
        alignSelf : 'center',
        resizeMode : "stretch"
    },
    user_info : {
        flex : 0.7 , 
        height : '100%',
        flexDirection : 'column',
        paddingLeft : 20 * metrics,
        alignSelf : 'flex-start',
        justifyContent : 'center'
    },
    user_name : {
        fontSize : 18 * metrics,
        color : Colors.main_color
    },
    message : {
        fontSize : 17 * metrics
    },
    time_info : {
        flex : 0.3,
        height : '70%',
        alignSelf : 'center',
        alignItems : 'center',
        flexDirection : 'column',
        justifyContent : 'center'
    },
    time : {
        flex : 0.35, 
        justifyContent : 'center', 
        width : '100%'
    },
    badge : {
        width : 20 * metrics, 
        height : 20  * metrics, 
        borderRadius : 50 , 
        backgroundColor : Colors.main_blue_color,
        alignItems : 'center'
    },
    badge_body : {
        flex : 0.65 ,
        width :'100%', 
        justifyContent : 'center' , 
        alignItems : 'flex-end'
    },
    badge_text : {
        fontSize : 14 * metrics,
        color : Colors.white_color
    }
});