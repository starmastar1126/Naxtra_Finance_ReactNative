/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity,ActivityIndicator,SafeAreaView} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import HeaderComponent from '../components/HeaderComponent'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import CustomSelector from '../components/CustomSelector'
import { ScrollView } from 'react-native-gesture-handler';
import CompanyService from '../service/CompanyService'
import { alertMessage } from '../utils/utils';

export default class CompanyScreen extends Component {
    componentDidMount () {
        //test 
        var obj = {
            company_name : global.businessData.company_name,
            company_number : '',
            items_per_page : '20',
            start_index : '0',
        }
        this.setState({isLoading : true})
        CompanyService.getCompanyList(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                if (data.response != null)
                    this.setState({company_arr : data.response.items})
            } else {
                alertMessage (data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(ErrorMessage.network_error)
            this.setState({isLoading : false})
        })
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    state = {
        company_arr : [],
        isReady : false,
        idx : -1,
        isLoading : false
    }
    checkReady = () => {
        this.setState({isReady : true})
        global.company_info = this.state.company_arr[this.state.idx]
    }
    proceed () {
        if (!this.state.isReady) return
        this.props.navigation.navigate('CompanyOfficer')
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <View style={{width : '100%' , height : '100%'}}>
                    <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
                    <View style={{flex : 1 , flexDirection : 'column'}}>
                        <View style={{flex : 0.1,justifyContent : 'center', marginLeft : 35 * metrics}}>
                            <Text style={global_style.input_title}>Select Company</Text>
                        </View>
                        <View style={{flex : 0.8}}>
                            <ScrollView>
                                <View style={global_style.input_body}>
                                    <View style={{flexDirection : 'column'}}>
                                        {
                                            this.state.company_arr.map((item , idx) => {
                                                return (
                                                    <TouchableOpacity style={{marginBottom : 10 * metrics}} key={idx} onPress={() => this.setState({idx : idx}, () => {this.checkReady()})}>
                                                        <CustomSelector
                                                            textName = {item.title}
                                                            textDate = {item.description.split('-')[1]}
                                                            textNumber = {item.description.split('-')[0]}
                                                            textDescription = {item.address_snippet}
                                                            activeIdx={idx == this.state.idx ? 1 : 0}
                                                            index = {idx}
                                                            activeButton = { (value) => {
                                                                this.setState({idx : value}, () => {this.checkReady()})
                                                            }}
                                                        ></CustomSelector>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                        
                                    </View>
                                    <View style={{height : 20}}></View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{flex : 0.1,width :'85%', alignItems : 'center' , justifyContent : 'center',alignSelf : 'center'}}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.proceed()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
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
            </SafeAreaView>
        
        );
    }
}