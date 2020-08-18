/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View , Image ,TouchableOpacity, BackHandler ,SafeAreaView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { Avatar } from 'react-native-elements'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { Fonts } from '../../constants/Fonts'

export default class HelpScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        trust : false,
        finger : false
    }
    onChangedTrust = () => {
        this.setState({trust : !this.state.trust})
    }

    onChangeFingerprint = () => {
        this.setState({finger : !this.state.finger})
    }

    gotoPassword () {
        this.props.navigation.navigate('PasswordScreen')
    }

    gotoFaqs () {
        this.props.navigation.navigate('FaqScreen')
    }

    gotoCondition () {
        this.props.navigation.navigate('TermScreen')
    }

    gotoPrivacy () {
        this.props.navigation.navigate('PrivacyScreen')
    }

    gotoAccount () {
        this.props.navigation.navigate('AccountHelpScreen')
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Help" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <View style={styles.body}>
                    {/* <View style={styles.related}>
                        <Text style={{padding : 20 * metrics, paddingBottom : 0 , color : Colors.white_gray_color,fontFamily : Fonts.adobe_clean,}}>Releated To</Text>
                        <View style={{marginTop : 10 * metrics}}></View>
                        <View style={styles.related_body}>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button} onPress={() => this.gotoAccount()}>
                                    <Image source={Images.help_account} style={styles.img_size}></Image>
                                    <Text style={styles.card_text}>Account</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button}>
                                    <Image source={Images.help_card} style={styles.img_size}></Image>
                                    <Text style={styles.card_text}>Card</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button}>
                                    <Image source={Images.help_profile} style={styles.img_size}></Image>
                                    <Text style={styles.card_text}>Profile</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button}>
                                    <Image source={Images.help_transactions} style={styles.img_size}></Image>
                                    <Text style={styles.card_text}>Transactions</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button}>
                                    <Image source={Images.help_other} style={styles.img_size}></Image>
                                    <Text style={styles.card_text}>Other</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.related_item}>
                                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('IssueScreen')}>
                                    <Image source={Images.help_ticket} style={styles.img}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> */}

                    <View style={styles.more}>
                        <View style={{marginTop : 60 * metrics}}></View>
                        <View style={styles.more_body}>
                            <TouchableOpacity style={styles.more_item} onPress={() => this.gotoFaqs()}>
                                <View style={{flex : 0.05}}></View>
                                <View style={{flex : 0.8}}>
                                    <Text style={styles.button_text}>FAQs</Text>
                                </View>
                                <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                    <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.more_item} onPress={() => this.gotoCondition()}>
                                <View style={{flex : 0.05}}></View>
                                <View style={{flex : 0.8}}>
                                    <Text style={styles.button_text}>Terms and Conditions</Text>
                                </View>
                                <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                    <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.more_item} onPress={() => this.gotoPrivacy()}>
                                <View style={{flex : 0.05}}></View>
                                <View style={{flex : 0.8}}>
                                    <Text style={styles.button_text}>Privacy and Policy</Text>
                                </View>
                                <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                    <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.more_item} onPress={() => this.props.navigation.navigate('IssueScreen')}>
                                <View style={{flex : 0.05}}></View>
                                <View style={{flex : 0.5}}>
                                    <Text style={styles.button_text}>Support Ticket</Text>
                                </View>
                                <View style={{flex : 0.3, justifyContent : 'center'}}>
                                    <Image source={Images.help_ticket} style={styles.ticket_img}></Image>
                                </View>
                                <View style={{flex : 0.1, justifyContent : 'center' , alignItems : 'center'}}>
                                    <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                </View>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor : Colors.white_color
    },
    body : {
        marginTop : 25 * metrics,
        width : '85%',
        flex : 1,
        alignSelf : 'center',
        flexDirection : 'column'
    },
    related : {
        flex: 0.5,
        flexDirection : 'column'
    },
    more : {
        flex : 0.2,
        flexDirection : 'column'
    },
    related_body : {
        flexWrap : 'wrap',
        flex: 1,
        flexDirection : 'row' ,
    },
    related_item : {
        width : '33%', 
        height : 120 * metrics, 
        alignItems : 'center',
    },
    img : {
        width: 65 * metrics,
        height : 65 * metrics,
    },
    ticket_img : {
        width: 40 * metrics,
        height : 40 * metrics,
    },
    img_size : {
        width : 45 * metrics, height : 45 * metrics
    },
    button : {
        width : '97%' , 
        height : '97%', 
        flexDirection : 'column',
        alignSelf : 'center',
        alignItems : 'center',
        backgroundColor : 'white',
        elevation : 2.5,
        justifyContent : 'center'
    },
    more_body : {
        flexDirection : 'column',
        flex : 1
    },
    more_item : {
        width : '95%',
        height : 55 * metrics,
        marginBottom : 10 * metrics,
        flexDirection : "row",
        justifyContent : 'center',
        alignItems : 'center',
        alignSelf : 'center',
        backgroundColor : 'white',
        elevation : 2.5,
        // borderWidth : Platform.OS == 'android' ? 0 : 1,
        shadowOffset: {width : 0, height :0},
        shadowOpacity :Platform.OS == 'android' ? 0 : 0.2,
        marginTop : 10 * metrics
    },
    button_text : {
        fontSize : 18 * metrics , color : '#000',fontFamily : Fonts.adobe_clean,
    },
    card_text : {
        marginTop : 5 * metrics, 
        color : '#000',
        fontSize : 14 *metrics,fontFamily : Fonts.adobe_clean,
        textAlign : 'center'
    }
});