import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ScrollView} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import global_style from '../constants/GlobalStyle'
import { Avatar } from 'react-native-elements';
import TransactionService from '../service/TransactionService';
import { paramDate2, getHoursAndMins, paramDate, changeNumber } from '../utils/utils'
import {Fonts} from '../constants/Fonts'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class MerchantComponent extends Component {

    state = {
        transactions_list : [],
        merchantlogo_list : [],
        merchant_list : []
    }

    componentDidMount () {
        var token = 'spdEOmAJ6kymDqpsxKwe30Y60Qm78GlH7xf37R1XhM5D9xQ9'
        this.props.showLoadingFunc(true)
        TransactionService.getTransactionsByMerchant(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({transactions_list : data.response[0]})
            } else {
                this.setState({transactions_list : []})
            }
            TransactionService.getAllMerchantLogo(global.token).then(res => {
                var data = res.data.result
                console.log('data = ' , data)
                if (data.success) {
                    this.setState({merchantlogo_list : data.response[0]})
                } else {
                    this.setState({merchantlogo_list : []})
                }
                this.gotoCalculate()
                this.props.showLoadingFunc(false)
            }).catch(error => {
                this.setState({merchantlogo_list : []})
                this.props.showLoadingFunc(false)
            })
        }).catch(error => {
            this.setState({transactions_list : []})
            this.props.showLoadingFunc(false)
        })
    }

    gotoCalculate () {
        console.log('!!!!!!!!!!!!!! = ' ,this.state.transactions_list.length, '   ' , this.state.merchantlogo_list[0])
        var arr = []
        if (this.state.merchantlogo_list.length) {
            for (var i  =0 ; i < this.state.merchantlogo_list.length ;i ++) {
                var count = 0
                for (var j =0 ; j < this.state.transactions_list.length; j++) {
                    if (this.state.merchantlogo_list[i].merchant_id == this.state.transactions_list[j].merchant_id) {
                        var obj = {
                            //merchant_category_code : this.state.transactions_list[j].merchant_category_code,
                            merchant_id : this.state.transactions_list[j].rb_beneficiary,
                            merchant_name : this.state.transactions_list[j].rb_beneficiary,
                            transaction_amount : this.state.transactions_list[j].transaction_amount,
                            transaction_count : this.state.transactions_list[j].transaction_count,
                            merchant_logo : {uri : 'data:image/png;base64,' + this.state.merchantlogo_list[j].merchant_logo}
                        }
                        arr.push(obj)
                        count = 1
                        break;
                    }
                }
                if (count == 0) {
                    var obj1 = {
                        //merchant_category_code : this.state.transactions_list[j].merchant_category_code,
                        merchant_id : this.state.transactions_list[j].rb_beneficiary,
                        merchant_name : this.state.transactions_list[j].rb_beneficiary,
                        transaction_amount : this.state.transactions_list[j].transaction_amount,
                        transaction_count : this.state.transactions_list[j].transaction_count,
                        merchant_logo : Images.default_icon,
                    }
                    arr.push(obj1)
                }
            }
            console.log('arr = ', arr.length)
            this.setState({merchant_list : arr})
        }
    }

    showDetail = (item)=> {
        //this.props.showDetailView(item)
    }

    render () {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.body}>
                    {
                        this.state.merchant_list.map((item, index) => { //
                            return (
                                <View style={styles.item} key={index}>
                                    {
                                        <Avatar
                                            rounded
                                            overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                            size="xlarge"
                                            source={item.merchant_logo}
                                            resizeMode={'stretch'}
                                            containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                            style={styles.l_img}
                                        />
                                    }
                                    <TouchableOpacity style={styles.text_body} onPress={() => this.showDetail(item)}>
                                        {
                                            !item.merchant_name ? 
                                            <Text style={styles.title}>Transaction</Text>
                                            : 
                                            <Text style={styles.title}>{item.merchant_name}</Text>
                                        }
                                        {
                                            <Text style={styles.time}>{item.transaction_count} transactions</Text>
                                        }
                                    </TouchableOpacity>
                                    <View style={styles.count_body}>
                                        {
                                            item.transaction_amount < 0 ? 
                                            <Text style={global_style.m_balance}> - £ { Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2) }</Text>
                                            :
                                            <Text style={global_style.p_balance}> + £ { Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2) }</Text>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        )
    }
}

MerchantComponent.propType = {
	date: PropTypes.string,
    transactions : PropTypes.array,
    showLoadingFunc : PropTypes.func
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        flexDirection : 'column',
        marginBottom : 55 * metrics,
        marginTop : 10 * metrics
    },
    body : {
        width : '80%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'column',
        marginTop : 20 * metrics
    },
    item : {
        flexDirection : 'row',
        flex : 1,
        marginBottom : 20 * metrics,
    },
    l_img : {
        width : 45 * metrics,
        height : 45 * metrics,
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
        marginTop : 10 * metrics,
        borderRadius : 100 ,
        borderWidth : 1,
    },
    text_body : {
        marginLeft : 25 * metrics, // made by martin
        flexDirection : 'column',
        justifyContent : 'center',
        flex : 0.8, 
    },
    title : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        marginBottom : 3 * metrics,
        color : '#000'
    },
    count_body : {
        flex : 0.3,
        justifyContent : 'center'
    },
    l_img : {
        width : 45 * metrics,
        height : 45 * metrics,
        borderRadius : 50 ,
        backgroundColor : 'red',
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
        marginTop : 10 * metrics
    },
})