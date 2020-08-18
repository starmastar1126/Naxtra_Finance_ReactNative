/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet,Text, View , Image ,ActivityIndicator, ScrollView,SafeAreaView,BackHandler, TouchableOpacity} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import TransactionService from '../../service/TransactionService';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {Fonts} from '../../constants/Fonts'
import { convertJSON } from '../../utils/utils';

export default class ManageBeneficiary extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        beneficiaries_arr : [],
        isReady : false,
        isLoading : false,
        show_select : false
    }
    componentDidMount() {
        if (global.is_accounting) {
            this.setState({show_select : true})
        }
        this.setState({isLoading : true})
        TransactionService.getAllBeneficiary(global.token).then(res => {
            var data = res.data.result
            console.log('data = ' , data)
            if (data.success) {
                var data_arr = data.response.records
                this.setState({beneficiaries_arr : data_arr})
                // if (data_arr.length > 0) {
                //     var arr = []
                //     for (var i = 0 ;i < data_arr.length; i++) {
                //         var check = 0;
                //         for (var j = i + 1 ;j < data_arr.length; j++) {
                //             if (data_arr[i].rb_uk_account_number == data_arr[j].rb_uk_account_number) {
                //                 check = 1
                //             }
                //         }    
                //         if (check == 0) {
                //             arr.push(data_arr[i])
                //         }
                //     }
                //     this.setState({beneficiaries_arr : arr})
                // } else {
                //     this.setState({beneficiaries_arr : []})
                // }
            } else {
                this.setState({beneficiaries_arr : []})
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log('error = ' , error.message)
            this.setState({isLoading : false})
        })
    }
    componentWillReceiveProps () {
        this.componentDidMount()
    }

    generateLink = () => {
        this.props.navigation.navigate('LinkSuccessScreen')
    }
    gotoAccountTabScreen (item) {
        this.props.navigation.navigate('AccountTabScreen', {refresh : true})
        global.tab_name = 'Expenses'
        global.beneficiary_info = item
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="My Beneficiaries" goBack ={() => this.props.navigation.goBack()} navigation = {this.props.navigation}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <ScrollView style={{flexDirection : 'column', width : '100%' ,alignSelf : 'center'}}>
                            {
                                this.state.beneficiaries_arr.map((item, idx) => {
                                    return (
                                        <View key={idx} style={styles.item}>
                                            <View style={{flex : 0.05}}></View>
                                            <View style={{flex : 0.2 , justifyContent : 'center', alignItems : 'center'}}>
                                                {
                                                    !item.rb_beneficiary_icon ?
                                                    <EvilIcons name="user" style={{fontFamily : Fonts.adobe_clean,fontSize : 60 * metrics, color : Colors.main_color,alignSelf : 'flex-start'}}></EvilIcons>
                                                    :
                                                    <Image source={{uri : 'data:image/png;base64,' + item.rb_beneficiary_icon}} style={{width :50 * metrics,alignSelf : 'flex-start', height : 50 * metrics, borderRadius : 100 ,resizeMode : 'cover'}}></Image>    
                                                }
                                            </View>
                                            <View style={{flex : 0.5,flexDirection : 'column', justifyContent : 'center'}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics , color : 'black'}}>{item.rb_name}</Text>
                                                <View style={{marginTop : 5 * metrics}}></View>
                                                <View style={{flexDirection : 'column'}}>
                                                    <View style={{flexDirection : 'row'}}>
                                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : '#000', marginRight : 10 * metrics}}>Account Number : </Text>
                                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : Colors.gray_color}}>{item.rb_uk_account_number}</Text>
                                                    </View>
                                                    <View style={{marginTop : 5 * metrics}}></View>
                                                    <View style={{flexDirection : 'row'}}>
                                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : '#000', marginRight : 10 * metrics}}>Sort Code : </Text>
                                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, color : Colors.gray_color}}>{item.rb_uk_sort_code}</Text>
                                                    </View>
                                                </View>
                                                
                                            </View>
                                            <View style={{flex : 0.25,justifyContent : 'center'}}>
                                                {
                                                    this.state.show_select ?
                                                    <TouchableOpacity onPress={() => this.gotoAccountTabScreen(item)}>
                                                        <Text style={{textAlign : 'center', color : Colors.main_color,fontFamily : Fonts.adobe_clean,}}>{this.state.show_select ? 'Select' : ''}</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <Text style={{textAlign : 'center', color : Colors.main_color,fontFamily : Fonts.adobe_clean,}}>{this.state.show_select ? 'Select' : ''}</Text>
                                                }
                                                
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
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
    },
    bottom : {
        flex : 0.2 , width : '85%', alignSelf : 'center', justifyContent : 'center'
    },
    item : {
        flexDirection : 'row' , 
        height : 90 * metrics, 
        borderBottomWidth : 1 ,
        borderBottomColor : Colors.white_gray_color
    }
});