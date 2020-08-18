/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity ,ActivityIndicator , StyleSheet} from 'react-native';
import TabHeaderScreen from '../../components/TabHeaderScreen'
import { metrics } from '../../constants/GlobalStyle'
// import LineChart from "react-native-responsive-linechart"
import * as Colors from '../../constants/Colors'
import global_style from '../../constants/GlobalStyle'
import PropTypes from 'prop-types'
import MerchantComponent from '../../components/MerchantComponent'
import CountryComponent from '../../components/CountryComponent'
import CategoryComponent from '../../components/CategoryComponent'
import TransactionService from '../../service/TransactionService'
import {Fonts} from '../../constants/Fonts'
//const data = [0,-50, 40, 120, 32, 15, 52 , 40, 0];
const data = [0,-0, 16, 5, 3, 15, -2 , 20, 0];
const labels = ["","Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", ""];
const config = {
  line: {
    strokeWidth: 2,
    strokeColor: "#ff8636"
  },
  area: {
    gradientFrom: "#fd9450",
    gradientFromOpacity: 1,
    gradientTo: "#fffcfb",
    gradientToOpacity: 1
  },
  yAxis: {
    visible : false
  },
  xAxis : {
      visible : true,
      labelFontSize: 14,
  },
  grid: {
    strokeColor: "#c8d6e5",
    stepSize: 20,
    visible : false
  },
  
  insetY: 10,
  insetX: 1,
  backgroundColor: "#fff"
};

export default class AnalyticsScreen extends Component {
    token = ''
    constructor (props) {
        super()
        this.state = {
            transactions_list : [],
            category_list : [],
            country_list : [],
            merchant_list : [],
            merchang_logo : [],
            tabIdx : 1,
            isLoading : false
        }
    }
    getTransactionListByMerchant () {
        TransactionService.getTransactionsByMerchant(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({merchant_list : data.response[0]})
            } else {
                this.setState({merchant_list : []})
            }
            TransactionService.getAllMerchantLogo(this.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.setState({merchang_logo : data.response[0]})
                } else {
                    this.setState({merchang_logo : []})
                }
            }).catch(error => {
                this.setState({merchang_logo : []})
            })
        }).catch(error => {
            this.setState({merchant_list : []})
        })
        
    }
    getTransactionListByCountry() {
        TransactionService.getTransactionsByCountry(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({country_list : data.response[0]})
            } else {
                this.setState({country_list : []})
            }
            this.setState({isLoading : false, tabIdx : 1})
        }).catch(error => {
            this.setState({country_list : []})
            this.setState({isLoading : false, tabIdx : 1})
        })
    }
    getTransactionListByCategory() {
        TransactionService.getTransactionsByCategory(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({category_list : data.response[0]})
            } else {
                this.setState({category_list : []})
            }
        }).catch(error => {
            this.setState({category_list : []})  
        })
    }

    componentDidMount () {
        //this.getTransactionList()
        //this.setState({isLoading : true})
        this.token = 'spdEOmAJ6kymDqpsxKwe30Y60Qm78GlH7xf37R1XhM5D9xQ9'
        //this.getTransactionListByCategory()
        //this.getTransactionListByMerchant()
        //this.getTransactionListByCountry()
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    
    showFunc = (item) => {
        this.props.showDetailItem(item)
    }

    showLoading = (flag) => {
        this.setState({isLoading : flag})
    }

    render() {
        return (
            <>
                <View style={{flex : 1}}>
                    <TabHeaderScreen headerTitle="Analytics" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></TabHeaderScreen>
                    {/* <View style={styles.charts}>
                        <LineChart style={{ flex: 1 }} config={config} data={data} xLabels={labels}/>
                    </View> */}
                    <View style={styles.tabs_header}>
                        <View style={{flex : 0.05}}></View>
                        <TouchableOpacity style={this.state.tabIdx == 1 ? styles.active_tab_item:styles.tab_item} onPress={() => this.setState({tabIdx : 1})}>
                            <Text style={this.state.tabIdx == 1 ? styles.active_tab_title :styles.tab_title}>Category</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={this.state.tabIdx == 2 ? styles.active_tab_item: styles.tab_item} onPress={() => this.setState({tabIdx : 2})}>
                            <Text style={this.state.tabIdx == 2 ? styles.active_tab_title : styles.tab_title}>Merchant</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={this.state.tabIdx == 3 ? styles.active_tab_item:styles.tab_item} onPress={() => this.setState({tabIdx : 3})}>
                            <Text style={this.state.tabIdx == 3 ? styles.active_tab_title :styles.tab_title}>Country</Text>
                        </TouchableOpacity>
                        <View style={{flex : 0.05}}></View>
                    </View>
                    {
                        this.state.tabIdx != -1 && 
                        <View style={styles.tab_body}>
                            {
                                this.state.tabIdx == 1 &&
                                <CategoryComponent navigation ={this.props.navigation} showLoadingFunc = {this.showLoading} transactions = {this.state.category_list}></CategoryComponent>
                            }
                            {/* {
                                this.state.tabIdx == 2 && 
                                <MerchantComponent navigation ={this.props.navigation} showLoadingFunc = {this.showLoading} transactions = {this.state.merchant_list} logo_list={this.state.merchang_logo}></MerchantComponent>
                            } */}
                            {
                                this.state.tabIdx == 3 &&
                                <CountryComponent navigation ={this.props.navigation} showLoadingFunc = {this.showLoading} transactions = {this.state.country_list}></CountryComponent>
                            }
                        </View>
                    }
                </View>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </>
        );
    }
}

AnalyticsScreen.propType = {
    showDrawer : PropTypes.func,
    showDetailItem : PropTypes.func
}
const styles = StyleSheet.create({
    charts : {
        width : '100%' , 
        height : 180 * metrics , 
    },
    tabs_header : {
        marginTop : 15 * metrics,
        width :'100%',
        flexDirection : 'row', 
        height : 55 * metrics ,
    },
    active_tab_item : {
        flex : 0.5,
        flexDirection : 'column',
        justifyContent : 'center',
        borderBottomColor : Colors.main_color,
        borderBottomWidth : 2
    },
    tab_item : {
        flex : 0.5,
        flexDirection : 'column',
        justifyContent : 'center',
        borderBottomColor : 'white',
        borderBottomWidth : 2
    },
    tab_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.white_gray_color,
        textAlign : 'center'
    },
    active_tab_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : '#000',
        textAlign : 'center'
    },
    tab_body : {
        flex : 1,
    }
})