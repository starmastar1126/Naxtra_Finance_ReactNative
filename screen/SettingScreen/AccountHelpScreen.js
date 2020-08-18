/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , BackHandler ,TouchableOpacity,ScrollView,ActivityIndicator} from 'react-native'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import HelpService from '../../service/HelpService';
import { Fonts } from '../../constants/Fonts';

export default class AccountHelpScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        account_arr : [],
        isLoading : false
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
    componentDidMount () {
        this.setState({isLoading : true})
        HelpService.getAllAccount().then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({account_arr : data.response})
            } else {
                this.setState({account_arr : []})
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
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Help - Account" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <ScrollView style={{width: '100%' ,height : '100%'}}>
                        <View style={styles.body}>
                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.white_gray_color}}>Reservation issue</Text>

                            <View style={{marginTop : 15 * metrics}}></View>
                            {
                                this.state.account_arr.map((item, idx) => {
                                    return (
                                        <TouchableOpacity style={styles.card_view} onPress={()=> this.gotoAccount(item)} key={idx}>
                                            <View style={{flex : 0.05}}></View>
                                            <View style={{flex : 0.8}}>
                                                <Text style={styles.button_text}>{item.name}</Text>
                                            </View>
                                            <View style={{flex : 0.15, justifyContent : 'center' , alignItems : 'center'}}>
                                                <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            {/* <TouchableOpacity style={styles.card_view} onPress={()=> this.gotoIssue()}>
                                <View style={{flex : 0.05}}></View>
                                <View style={{flex : 0.8}}>
                                    <Text style={styles.button_text}>My issue is not listed.</Text>
                                </View>
                                <View style={{flex : 0.15, justifyContent : 'center' , alignItems : 'center'}}>
                                    <MaterialIcon name="keyboard-arrow-right" size={ 30 * metrics } color={Colors.white_gray_color}></MaterialIcon>
                                </View>
                            </TouchableOpacity> */}
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
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        alignSelf : 'center',
        backgroundColor : Colors.white_color
    },
    body : {
        width : '85%',
        height : '100%',
        alignSelf : 'center',
        paddingTop : 50 * metrics,
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
    }
});