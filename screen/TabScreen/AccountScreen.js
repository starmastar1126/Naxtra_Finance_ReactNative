/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity , StyleSheet , Image , ScrollView , ActivityIndicator} from 'react-native';

import * as Images from '../../constants/Image'
import * as Colors from '../../constants/Colors'
import TabHeaderScreen from '../../components/TabHeaderScreen'
import global_style, { metrics } from '../../constants/GlobalStyle';
import PropTypes from 'prop-types'
import TransactionItem from '../../components/TransactionItem'
import { changeNumber } from '../../utils/utils'
import { Fonts } from '../../constants/Fonts'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import TransactionService from '../../service/TransactionService';
import OtherService from '../../service/OtherService'

export default class AccountScreen extends Component {
    componentDidMount () {
        console.log('init function = ', global.token)
        this.setState({isLoading : true, transaction_arr : [], origin_arr : [], offset : 0, limit : 19}, () => {
            OtherService.getBanner(global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.setState({banner_data : [], banner_item : ''})
                } else {
                    this.setState({banner_data : [], banner_item : ''})
                }
            }).catch(err => {
                console.log('error = ' , err.message)
            })  
            TransactionService.getAllBalance (global.token).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.setState({current_balance : data.response})
                }
            }).catch(error => {
                this.setState({isLoading : false})
            })
            this.getTransactionList()
        })
    }

    getTransactionList () {
        var origin_arr = this.state.origin_arr
        if (this.state.origin_arr.length == 0) {
            this.setState({pagenation : false, isLoading : true})
        } else {
            this.setState({pagenation : true, isLoading : false})
        }
        
        TransactionService.getAllTransactions(global.token, this.state.offset, this.state.limit).then(res => {
            var data = res.data.result
            if (data.success) {
                if (Number(data.response.records.length) < 20) {
                    this.setState({is_limit : true})
                } else {
                    this.setState({is_limit : false})
                }
                if (data.response.records.length > 0) {
                    for (var i = 0 ; i < data.response.records.length ; i++) {
                        origin_arr.push(data.response.records[i])
                    }
                }
                global.transaction_list = this.state.origin_arr
                this.setState({origin_arr : origin_arr, transaction_arr : []}, () => {
                    if (!this.state.is_hide && !this.state.is_reconcile) {
                        this.setState({transaction_arr : this.getAllArray(this.state.origin_arr)})
                    } else if (this.state.is_hide) {
                        this.getAllArrShow()
                    } else if (this.state.is_reconcile) {
                        this.getAllCategory()
                    }
                })
            }
            this.setState({pagenation : false,isLoading : false})
        }).catch(error => {
            this.setState({pagenation : false,isLoading : false})
        })
    }

    onChangeState = () => {
        this.componentDidMount()
    }
    getToday (date) {
        var now = new Date()
        var now_year = now.getFullYear()
        var now_month = now.getMonth() + 1
        var now_day = now.getDate()
        var data = date.split(' ')[0].split('-')
        var data_year = data[0]
        var data_month = Number(data[1])
        var data_day = Number(data[2])
        if (now_year == data_year && now_month == data_month && now_day == data_day)
            return true
        else
            return false
    }
    getYesterday(date) {
        if (date == false)
            return false
        var now = new Date()
        var now_year = now.getFullYear()
        var now_month = now.getMonth() + 1
        var now_day = now.getDate() - 1

        var data = date.split(' ')[0].split('-')
        var data_year = data[0]
        var data_month = Number(data[1])
        var data_day = Number(data[2])
        if (now_year == data_year && now_month == data_month && now_day == data_day)
            return true
        else
            return false
    }

    getAllArray = (data) => {
        var time_arr = []
        for (var i = 0 ; i < data.length;i++) {
            var obj = null
            if (!this.getYesterday(data[i].create_date.split(' ')[0])) {
                obj = {
                    time : (!data[i].create_date || this.getToday(data[i].create_date)) ? 'Today' : data[i].create_date.split(' ')[0],
                    arr : [],
                    count : 0,
                }
            } else {
                obj = {
                    time : 'Yesterday',
                    arr : [],
                    count : 0
                }
            }
            
            for (var j = 0 ; j < data.length ; j++) {
                var jtime = ''
                if (!this.getYesterday(data[j].create_date.split(' ')[0])) {
                    jtime = (!data[j].create_date || this.getToday(data[j].create_date)) ? 'Today' : data[j].create_date.split(' ')[0]    
                } else {
                    jtime = 'Yesterday'
                }
                if (obj.time == jtime) {
                    obj.arr.push(data[j])
                    obj.count ++
                }
            }
            if (time_arr.length > 0) {
                var count = 0
                for (var k = 0 ; k < time_arr.length;k ++) {
                    if (time_arr[k].time == obj.time) {
                        count ++
                    }
                }
                if (count == 0) {
                    time_arr.push(obj)               
                }
            } else {
                time_arr.push(obj)
            }
        }
        return time_arr
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    constructor(props){
        super(props);
        this.state = {
            page : 'Account',
            current_balance : '',
            transaction_arr : [],
            trans_arr_date : [],
            trans_arr_show_hide : [],
            trans_arr_category : [],
            origin_arr : [],
            isLoading : false,
            banner_data : [],
            banner_item : '',
            banner_idx : 0,
            show_banner : false,
            show_type : 'time',
            offset : 0,
            limit : 19,
            pagenation : false,
            is_limit : false,
            is_hide : false,
            is_reconcile : false,
            
        };
    }

    gotoAnalytics = () => {
        global.tabIdx = 2
        this.props.gotoTabScreen()
    }

    showDetail = (item) => {
        this.props.showDetailItem(item)
    }

    gotoAccountMoney = () => {
        global.tabIdx = 3
        global.payment_type = 'account'
        this.props.gotoTabScreen()
    }

    gotoRequestMoney = () => {
        global.tabIdx = 3
        global.payment_type = 'request'
        this.props.gotoTabScreen()
    }
    prev () {
        if (this.state.banner_idx == 0)
            return
        this.setState({banner_idx : this.state.banner_idx - 1})
    }
    next () {
        if (this.state.banner_idx == this.state.banner_data.length - 1)
            return
        this.setState({banner_idx : this.state.banner_idx + 1})
    }
    showHideBanner () {
        this.setState({show_banner : !this.state.show_banner})
    }

    sortByCategory () {
        this.setState({is_hide : false, is_reconcile : true,show_type : 'category', origin_arr : [], transaction_arr : [], offset : 0 , limit : 19}, () => this.getTransactionList())
    }

    sortByDate () {
        this.setState({is_hide : false, is_reconcile : false, offset : 0, limit : 19, origin_arr : [], transaction_arr : [],show_type : 'time'}, () => this.getTransactionList())
    }
    getAllCategory () {
        var data = this.state.origin_arr
        var default_arr = []
        var exist_arr = []
        for (var i = 0 ; i < data.length ; i ++) {
            if (!data[i].rb_classification_account_id) {
                default_arr.push(data[i])
            } else {
                exist_arr.push(data[i])
            }
        }
        var result = []
        var obj1 = {
            time : 'Default',
            arr : default_arr,
            count : default_arr.length
        }
        result.push(obj1)
        
        var obj2 = {
            time : 'Category',
            arr : exist_arr,
            count : exist_arr.length
        }
        result.push(obj2)
        this.setState({transaction_arr : result, isLoading : false})  
    }
    getAllArrShow () {
        var data = this.state.origin_arr
        var default_arr = []
        var exist_arr = []
        for (var i = 0 ; i < data.length ; i ++) {
            if (!data[i].nx_hide_transaction) {
                default_arr.push(data[i])
            } else {
                exist_arr.push(data[i])
            }
        }
        var result = []
        var obj1 = {
            time : 'Showing Transaction',
            arr : default_arr,
            count : default_arr.length
        }
        result.push(obj1)
        
        var obj2 = {
            time : 'Hiding Transaction',
            arr : exist_arr,
            count : exist_arr.length
        }
        result.push(obj2)
        this.setState({transaction_arr : result, isLoading : false})
    }

    sortByShow () {
        this.setState({offset : 0, limit : 19, origin_arr : [],is_hide : true, is_limit : false,is_reconcile : false,show_type : 'hide', transaction_arr : []}, () => this.getTransactionList())
    }

    isCloseToBottom ({layoutMeasurement, contentOffset, contentSize}) {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <View style={styles.container}>
                    <TabHeaderScreen headerTitle="Account" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></TabHeaderScreen>
                    <View style={{marginTop : 10 * metrics}}></View>
                    <View style={this.state.show_banner ? global_style.balace_body : global_style.no_balance_body}>
                        <TouchableOpacity style={{justifyContent : 'center',flexDireciton : 'column'}} onPress={() => this.showHideBanner()}>
                            {
                                this.state.current_balance != '' ?
                                <Text style={global_style.total_balance}>£ {changeNumber(Number(this.state.current_balance).toFixed(2)).toString()}</Text> 
                                :
                                <Text style={global_style.total_balance}>£ {Number('0').toFixed(2)}</Text> 
                            }
                            <Text style={global_style.md_title}>Current Balance</Text>
                        </TouchableOpacity>
                        {
                            <View style={styles.sub_body}>
                                <TouchableOpacity style={styles.item} onPress={() => this.gotoAccountMoney()}>
                                    <View style={{flex : 0.3}}></View>
                                    <Image source={Images.account_add2_icon} style={styles.image}></Image>
                                    <View style={{flexDirection : 'column' , marginLeft : 10 * metrics}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Send</Text>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Money</Text>
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('AddMoney')}>
                                    <View style={{flex : 0.1}}></View>
                                    <Image source={Images.account_add1_icon} style={styles.image}></Image>
                                    <View style={{flexDirection : 'column' , marginLeft : 15 * metrics}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Add</Text>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Money</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item} onPress={() => this.gotoRequestMoney()}>
                                    <View style={{flex : 0.1}}></View>
                                    <Image source={Images.account_add3_icon} style={styles.image}></Image>
                                    <View style={{flexDirection : 'column' , marginLeft : 10 * metrics}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Request</Text>
                                        <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>Money</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            this.state.show_banner &&
                            <View>
                                {
                                    this.state.banner_data.length > 0 &&
                                    <View style={{width : '95%' , height : 70 * metrics , borderRadius : 10, flexDirection : 'row', alignSelf : 'center'}}>
                                        <TouchableOpacity style={styles.banner_arrow} onPress={() => this.prev()}>
                                            <SimpleLineIcons name="arrow-left" size={30 * metrics}></SimpleLineIcons>
                                        </TouchableOpacity>
                                        <View style={{flex :0.8}}>
                                            <Image source={{uri : 'data:image/png;base64,' + this.state.banner_data[this.state.banner_idx].bannerimage}} style={{width : '95%', height : '100%', alignSelf : 'center'}} resizeMode="center"></Image>
                                        </View>
                                        <TouchableOpacity style={styles.banner_arrow} onPress={() => this.next()}>
                                            <SimpleLineIcons name="arrow-right" size={30 * metrics}></SimpleLineIcons>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    <View style={global_style.list_body}>
                        <View style={{flexDirection : 'row', width : '95%' , alignSelf : 'center', marginTop : 20 * metrics, marginBottom : 10 * metrics}}>
                            <TouchableOpacity style={{flex : 0.35 , justifyContent :'center', alignItems : 'center'}} onPress={() => this.sortByDate()}>
                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics}}>My Transactions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex :0.2, justifyContent : 'center', alignItems : 'center'}} onPress={() => this.sortByShow()}>
                                <Text style={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}>Show Hide</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex :0.25, justifyContent : 'center', alignItems : 'center'}} onPress={() => this.sortByCategory()}>
                                <Text style={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, color : Colors.red_color}}>To Reconcile !</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex : 0.2, alignItems : 'flex-end'}} onPress={() => this.gotoAnalytics()}>
                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color:Colors.main_blue_color}}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{flex : 1}}
                                onScroll={({nativeEvent}) => {
                                    if (this.isCloseToBottom(nativeEvent)) {
                                        if (this.state.is_limit || this.state.pagenation)
                                            return
                                            
                                        this.setState({limit : this.state.limit + 20 , offset : this.state.offset + 20}, () => {
                                            this.getTransactionList()
                                        })
                                    }
                                }}
                            >
                            <View style={this.state.show_banner ? styles.lists : styles.no_margin_lists}>
                                {
                                    this.state.transaction_arr.map((item, idx) => {
                                        return (
                                            <TransactionItem
                                                key={idx}
                                                date = {item.time}
                                                items = {item.arr}
                                                showDetail = {this.showDetail}
                                                showType={this.state.show_type}
                                            >
                                            </TransactionItem>
                                        )
                                    })
                                }
                                {
                                    this.state.pagenation &&
                                    <View>
                                        <ActivityIndicator size={30} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                                        <View style={{marginBottom : 20 * metrics}}></View>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </View>
        );
    }
}

AccountScreen.propType = {
    showDrawer : PropTypes.func,
    showDetailItem : PropTypes.func,
    gotoTabScreen : PropTypes.func
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    lists : {
        width : '90%' , 
        alignSelf : 'center' , 
        marginTop : 15 * metrics
    },
    no_margin_lists : {
        width : '90%' , 
        alignSelf : 'center' , 
        marginTop : 15 * metrics
    },
    item : {
        flex : 0.31,
        alignSelf : 'center',
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'row',
    },
    sub_body : {
        marginTop : 5 * metrics,
        flex : 1 , 
        flexDirection : 'row', 
        alignSelf : 'center',
    },
    image : {
        width : 35 * metrics , height : 35 * metrics,alignSelf : 'center'
    },
    banner_item : {
        width : '95%', height : '100%', alignSelf : 'center', borderRadius : 8 * metrics
    },
    banner_arrow : {
        flex : 0.1, justifyContent : 'center', alignSelf :'center', alignItems : 'center'
    }
  });
   