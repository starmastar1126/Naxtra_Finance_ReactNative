import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ScrollView} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import global_style from '../constants/GlobalStyle'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import { Avatar } from 'react-native-elements';
import {Fonts} from '../constants/Fonts'
import Flag from 'react-native-flags';
import TransactionService from '../service/TransactionService';
import { changeNumber } from '../utils/utils';

export default class CountryComponent extends Component {

    state = {
        item_arr : [],
        date_title : ''
    }

    componentDidMount () {
        this.props.showLoadingFunc(true)
        TransactionService.getTransactionsByCountry(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({item_arr : this.calculateArr(data.response[0])})
            } else {
                this.setState({item_arr : []})
            }
            this.props.showLoadingFunc(false)
        }).catch(error => {
            this.setState({item_arr : []})
            this.props.showLoadingFunc(false)
        })
    }
    showDetail = (item)=> {
        //this.props.showDetailView(item)
        
    }
    calculateArr (data) {
        if (data.length > 0) {
            var count = 0
            var arrs = []
            for (var i = 0 ; i < data.length ; i++) {
                if (data[i].country_code == 'GB') {
                    arrs.push(data[i])
                    break
                }
                // for (var j = i +1 ; j < data.length; j++) {
                //     if (data[i].country_code == 'GB' && data[i].country_id == data[j].country_id && data[i].transaction_count == data[j].transaction_count && data[i].transaction_amount == data[j].transaction_amount) {
                //     } else {
                //         count ++
                //         arrs.push(data[i])
                //     }
                // }
            }
            //console.log('arr = ' ,arr)

            // arrs.push(data[0])
            // arrs.push(data[1])

            console.log('arr = ' , arrs)

            return arrs
            // if (count == 0) {
            //     var arr = []
            //     return arr.push(data[0])
            // } else {
            //     return arrs
            // }
        }
    }
    
    render () {
        
        return (
            <ScrollView style={styles.container}>
                <View style={styles.body}>
                    {
                        this.state.item_arr.map((item, index) => { //this.props.transactions
                            return (
                                <View style={styles.item} key={index}>
                                    <Flag
                                        code={item.country_code}
                                        size={32}
                                        style={styles.l_img}
                                    />
                                    <TouchableOpacity style={styles.text_body} onPress={() => this.showDetail(item)}>
                                        {
                                            <Text style={styles.title} numberOfLines={1}>{item.country_name}</Text>
                                        }
                                        <Text style={styles.count}>{item.transaction_count} transactions</Text>
                                    </TouchableOpacity>
                                    <View style={styles.count_body}>
                                        {
                                            item.transaction_amount < 0 ? 
                                            <Text style={global_style.m_balance} numberOfLines={1}> - £ { Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2)}</Text>
                                            :
                                            <Text style={global_style.p_balance} numberOfLines={1}> + £ {Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2)}</Text>
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

CountryComponent.propType = {
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
        borderRadius : 50 ,
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
    },
    text_body : {
        marginLeft : 25 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
        flex : 0.7, 
    },
    title : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
        marginBottom : 3 * metrics,
        color : '#000'
    },
    time : {

    },
    count_body : {
        flex : 0.4,
        justifyContent : 'center'
    },
    p_balance : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        textAlign : 'right',
        color : 'green'
    },
    m_balance : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        textAlign : 'right',
        color : Colors.main_color
    }
})