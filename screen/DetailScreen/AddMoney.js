/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,ScrollView, Share} from 'react-native'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import * as Images from '../../constants/Image'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
// import Share from 'react-native-share'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TransactionService from '../../service/TransactionService';
import { changeNumber ,replaceString} from '../../utils/utils'
import { Fonts } from '../../constants/Fonts';
import { Avatar } from 'react-native-elements'

export default class AddMoney extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        account_arr : [],
        current_balance : '',
        isLoading : false,
        tabIdx : 0
    }

    gotoAccount (item) {
        this.props.navigation.navigate('HelpAccountScreen')
        global.help_account = item
    }
    gotoAnalytics () {
        this.props.navigation.navigate('HelpAnalyticsScreen')
    }
    gotoIssue () {
        this.props.navigation.navigate('IssueScreen')
    }
    componentDidMount() {
        this.getTransactionBalance()
    }
    onClickedShare = async(idx) => {
        var message = ''
        var title = ''

        console.log('1 = ' ,global.user_info.account_name)

        if (idx == 0) {
            title = "For demestic transfers only"
            message = 'Beneficiary : ' +  (global.user_info.account_type == 'Personal' ? global.user_info.account_name : global.user_info.company_name) + '\n' + 
                      'Account : '  + global.user_info.account_number + '\n' + 
                      'Sort Code : ' + global.user_info.sort_code
        } else {
            title = "For international transfers only"
            message = 'Beneficiary : ' + (global.user_info.account_type == 'Personal' ? global.user_info.account_name : global.user_info.company_name) + '\n' + 
                      'Iban : '  + global.user_info.iban + '\n' + 
                      'Bic Swift : ' + global.user_info.bic_swift
        }
        console.log(message)
        try {
            const result = await Share.share({
                title : title,
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
    }
    getTransactionBalance = () => {
        this.setState({isLoading : true})
        TransactionService.getAllBalance (global.token).then(res => {
            var data = res.data.result
            console.log('data = ' , data.response)
            if (data.success) {
                this.setState({current_balance : data.response})
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Add money" type="" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={{flex: 1, justifyContent : 'center'}}>
                        <View style={styles.body}>
                            <View style={{flex : 0.3,justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={styles.top_text}>Use below details to transfer or request money into your account.</Text>
                            </View>
                            <View style={{flex :0.7 , flexDirection : 'column',justifyContent : 'center'}}>
                                <View style={{borderWidth : 3 , borderColor : Colors.white_gray_color, marginTop : 10 * metrics, marginBottom : 10 * metrics}}></View>
                                <View style={styles.tab_body}>
                                    <TouchableOpacity style={this.state.tabIdx == 0 ? styles.active_tab : styles.tab} onPress={() => this.setState({tabIdx : 0})}>
                                        <Text style={this.state.tabIdx == 0 ? styles.active_text : styles.text}>DOMESTIC</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.tabIdx == 1 ? styles.active_tab : styles.tab} onPress={() => this.setState({tabIdx : 1})}>
                                        <Text style={this.state.tabIdx == 1 ? styles.active_text : styles.text}>INTERNATIONAL</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.tabIdx == 0 &&
                                    <View style={{marginTop : 15 * metrics}}>
                                        <Text style={styles.tab_description}>For domestic transfers only</Text>
                                        <View style={styles.card}>
                                            <View style={{flexDirection : 'row', width : '90%' ,marginTop : 15 * metrics , alignSelf : 'center'}}>
                                                <View style={{flexDirection : 'column', flex : 0.9}}>
                                                    <Text style={styles.type}>Beneficiary</Text>    
                                                    <Text style={styles.value}>{global.user_info.account_type == 'Personal' ? global.user_info.account_name : global.user_info.company_name}</Text>
                                                </View>
                                                <TouchableOpacity style={{flex : 0.1}} onPress={() => this.onClickedShare(this.state.tabIdx)}>
                                                    <SimpleLineIcons name="share" size={20 * metrics} color="black" style={{textAlign : 'right'}}></SimpleLineIcons>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flexDirection : 'column', width : '90%' ,marginTop : 15 * metrics , alignSelf : 'center'}}>
                                                <View style={{flexDirection : 'column'}}>
                                                <Text style={styles.type}>Account</Text>    
                                                    <Text style={styles.value}>{global.user_info.account_number}</Text>
                                                </View>
                                                <View style={{height : 10 * metrics}}></View>
                                                <View style={{flexDirection : 'column'}}>
                                                    <Text style={styles.type}>Sort code</Text>    
                                                    <Text style={styles.value}>{global.user_info.sort_code}</Text>
                                                </View>
                                            </View>
                                            <View style={{height : 10 * metrics}}></View>
                                        </View>
                                        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent :'center', width : '100%'}}>
                                            <MaterialCommunityIcons name="lightbulb-on" size={25 * metrics} color="black" style={{flex : 0.1 , textAlign : 'center'}}></MaterialCommunityIcons>
                                            <View style={{flex : 0.05}}></View>
                                            <Text style={{flex : 0.75, fontSize : 15 * metrics}}>Use this personal UK currrent account to get salary and pay bills.</Text>
                                        </View>
                                        <View style={{height : 10 * metrics}}></View>
                                    </View>
                                }
                                {
                                    this.state.tabIdx == 1 &&
                                    <View style={{marginTop : 15 * metrics}}>
                                        <Text style={styles.tab_description}>For international transfers only</Text>
                                        <View style={styles.card}>
                                            <View style={{flexDirection : 'row', width : '90%' ,marginTop : 15 * metrics , alignSelf : 'center'}}>
                                                <View style={{flexDirection : 'column', flex : 0.9}}>
                                                    <Text style={styles.type}>Beneficiary</Text>    
                                                    <Text style={styles.value}>{global.user_info.account_type == 'Personal' ? global.user_info.account_name : global.user_info.company_name}</Text>
                                                </View>
                                                <TouchableOpacity style={{flex : 0.1}} onPress={() => this.onClickedShare(this.state.tabIdx)}>
                                                    <SimpleLineIcons name="share" size={20 * metrics} color="black" style={{textAlign : 'right'}}></SimpleLineIcons>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flexDirection : 'column', width : '90%' ,marginTop : 15 * metrics , alignSelf : 'center'}}>
                                                <View style={{flexDirection : 'column'}}>
                                                    <Text style={styles.type}>IBAN</Text>    
                                                    <Text style={styles.value}>{global.user_info.iban}</Text>
                                                </View>
                                                <View style={{height : 10 * metrics}}></View>
                                                <View style={{flexDirection : 'column'}}>
                                                    <Text style={styles.type}>BIC SWIFT</Text>    
                                                    <Text style={styles.value}>{global.user_info.bic_swift}</Text>
                                                </View>
                                            </View>
                                            <View style={{height : 10 * metrics}}></View>
                                        </View>
                                        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent :'center', width : '100%'}}>
                                            <MaterialCommunityIcons name="lightbulb-on" size={25 * metrics} color="black" style={{flex : 0.1 , textAlign : 'center'}}></MaterialCommunityIcons>
                                            <View style={{flex : 0.05}}></View>
                                            <Text style={{flex : 0.75, fontSize : 15 * metrics}}>Use this personal UK currrent account to get salary and pay bills.</Text>
                                        </View>
                                        <View style={{height : 15 * metrics}}></View>
                                    </View>
                                }
                                
                            </View>
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
        width : '85%',
        minHeight : 500 * metrics,
        alignSelf : 'center',
        marginBottom : 20 * metrics,
        borderRadius : 15 * metrics,
        backgroundColor : 'white',
        elevation : 3.5
    },
    card_view : {
        width : '100%', 
        elevation : 3.5, 
        height : 60 * metrics,
        backgroundColor : 'white', 
        marginBottom : 15 * metrics,
        flexDirection : 'row',
        padding : 15 * metrics,
        shadowOffset : { width : 0 , height : -15}
    },
    button_text : {
        fontSize : 18 * metrics , color : '#000',
        fontFamily : Fonts.adobe_clean
    },
    item_img : {
        width : 120 * metrics, 
        height : 120 * metrics,
        resizeMode : 'stretch',
        alignSelf : 'center',
        marginTop : 20 * metrics,
        zIndex : 100,
    },
    balance : {
        fontSize : 28 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        marginTop : 20 * metrics
    },
    description : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        marginTop : 10 * metrics,
    },
    round_btn : {
        width : 85 * metrics, 
        height : 85 * metrics, 
        marginLeft : 8 * metrics,
        marginRight : 8 * metrics,
        flexDirection : 'column', 
        alignItems : 'center', 
        justifyContent:'center'
    },
    button : {
        width : 40 * metrics, 
        height : 40 * metrics, 
        marginLeft : 20 * metrics,
        marginRight : 20 * metrics,
        flexDirection : 'column', 
        backgroundColor : Colors.main_blue_color, 
        alignItems : 'center', 
        borderRadius : 60,
        justifyContent:'center'
    },
    tab_body : {
        width : '100%',
        height : 40 * metrics,
        flexDirection : 'row'
    },
    active_tab : {
        flex : 0.5, borderBottomWidth : 2, borderBottomColor : 'black',justifyContent : 'center'
    },
    tab : {
        flex : 0.5, borderBottomWidth : 2, borderBottomColor : 'white',justifyContent : 'center'
    },
    active_text : {
        fontSize : 17 * metrics, 
        fontFamily : Fonts.adobe_clean, 
        textAlign: 'center', 
        color : 'black',
    },
    text : {
        fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean, textAlign: 'center', color : Colors.dark_gray
    },
    tab_description : {
        fontSize : 15 * metrics, 
        fontFamily : Fonts.adobe_clean, 
        textAlign : 'center', 
        color : Colors.dark_gray,
        marginBottom : 15 * metrics
    },
    card : {
        width : '95%',
        minHeight : 110 * metrics,
        marginBottom : 15 * metrics,
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        borderRadius : 7,
        flexDirection : 'column'
    },
    type : {
        fontSize : 13 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color
    },
    value : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
        color : Colors.main_blue_color,
    },
    top_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        textAlign : 'center',
        color : Colors.dark_gray
    }
});