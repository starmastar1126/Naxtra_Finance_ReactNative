import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ScrollView} from 'react-native'
import global_style, { metrics } from '../constants/GlobalStyle'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import { Avatar } from 'react-native-elements';
import {Fonts} from '../constants/Fonts'
import TransactionService from '../service/TransactionService';
import { paramDate2,getHoursAndMins ,changeDatefromAccount,getHoursAndMinsFromStr, changeNumber} from '../utils/utils';


export default class CategoryComponent extends Component {

    state = {
        category_arr : [],
        show_detail : false,
        transaction_arr : []
    }

    showDetail = (item)=> {
        var data = global.transaction_list
        if (data != '' && data.length > 0) {
            var arr = []
            console.log('item_cate = ', item.category_id)
            for (var i =0 ; i < data.length ;i++) {
                
                console.log('data = ', data[i].rb_classification_account_id)
                if (item.category_id == data[i].rb_classification_account_id[0]) {
                    arr.push(data[i])
                }
            }
            this.setState({show_detail : true,transaction_arr : arr})
        }
    }

    componentDidMount () {
        this.props.showLoadingFunc(true)
        TransactionService.getTransactionsByCategory(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({category_arr : data.response[0]})
            } else {
                this.setState({category_arr : []})
            }
            this.props.showLoadingFunc(false)
        }).catch(error => {
            this.setState({category_arr : []})  
            this.props.showLoadingFunc(false)
        })
    }

    render () {
        return (
            <View style={{flex : 1}}>
                <View style={this.state.show_detail ? {flex : 0.85} : {flex : 1}}>
                    <ScrollView style={styles.container}>
                        {
                            this.state.show_detail ? 
                            <View style={styles.body}>
                                {
                                    this.state.transaction_arr.map((item,idx) => {
                                        return (
                                            <View style={styles.item} key={idx}>
                                                {
                                                    !item.rb_transaction_icon ?
                                                    <Avatar
                                                        rounded
                                                        overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                                        size="xlarge"
                                                        source={Images.default_icon}
                                                        resizeMode={'stretch'}
                                                        containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                        style={styles.l_img}
                                                    />
                                                    :
                                                    <Avatar
                                                        rounded
                                                        overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                                        size="xlarge"
                                                        source={{uri : 'data:image/png;base64,' + item.rb_transaction_icon}}
                                                        resizeMode={'stretch'}
                                                        containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                        style={styles.l_img}
                                                    />
                                                }
                                                
                                                <View style={styles.text_body}>
                                                    {
                                                        <Text style={styles.title} numberOfLines={1}>{!item.transaction_info_details ? 'Transaction' : item.transaction_info_details}</Text>
                                                    }
                                                    {
                                                        !item.create_date ?
                                                        <Text style={styles.time} >{paramDate2(new Date())} {getHoursAndMins(new Date())}</Text>
                                                        :
                                                        <Text style={styles.time}>{changeDatefromAccount(item.create_date.split(' ')[0])} {getHoursAndMinsFromStr(item.create_date.split(' ')[1])}</Text>
                                                    }
                                                </View>
                                                <View style={styles.count_body}>
                                                    {
                                                        item.transaction_type == 'out' ?
                                                        <Text style={global_style.m_balance}> - £ {Number(changeNumber(Math.abs(item.rb_amount))).toFixed(2)}</Text>
                                                        :
                                                        <Text style={global_style.p_balance}> + £ {Number(changeNumber(Math.abs(item.rb_amount))).toFixed(2)}</Text>
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            :
                            <View style={styles.body}>
                                {
                                    this.state.category_arr.map((item, index) => {
                                        if (Number(item.transaction_amount) == 0)
                                            return
                                        return (
                                            <View style={styles.item} key={index}>
                                                {
                                                    !item.category_image ?
                                                    <Avatar
                                                        rounded
                                                        overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                                        size="xlarge"
                                                        source={Images.default_icon}
                                                        resizeMode={'stretch'}
                                                        containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                        style={styles.l_img}
                                                    />
                                                    :
                                                    <Avatar
                                                        rounded
                                                        overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                                        size="xlarge"
                                                        source={{uri : 'data:image/png;base64,' + item.category_image}}
                                                        resizeMode={'stretch'}
                                                        containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                        style={styles.l_img}
                                                    />
                                                }
                                                
                                                <TouchableOpacity style={styles.text_body} onPress={() => this.showDetail(item)}>
                                                    {
                                                        <Text style={styles.title} numberOfLines={1}>{item.category_name}</Text>
                                                    }
                                                    <Text style={styles.count}>{item.transaction_count} transactions</Text>
                                                </TouchableOpacity>
                                                <View style={styles.count_body}>
                                                    {
                                                        item.transaction_amount < 0 ? 
                                                        <Text style={global_style.m_balance} numberOfLines={1}> - £ {Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2)}</Text>
                                                        :
                                                        <Text style={global_style.p_balance} numberOfLines={1}> + £ {Number(changeNumber(Math.abs(item.transaction_amount))).toFixed(2)}</Text>
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        }
                    </ScrollView>
                </View>
                {
                    this.state.show_detail &&
                    <View style={{flex : 0.15, justifyContent : 'center'}}>
                        <TouchableOpacity style={styles.btn} onPress={() => this.setState({show_detail : false})}>
                            <Text style={styles.btn_text}>Back</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={{height : 58 * metrics}}></View>
            </View>
            
        )
    }
}

CategoryComponent.propType = {
	date: PropTypes.string,
    transactions : PropTypes.array,
    showLoadingFunc : PropTypes.func
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        flexDirection : 'column',
        marginTop : 10 * metrics
    },
    container1 : {
        width : '100%',
        flexDirection : 'column',
        marginTop : 10 * metrics,
        marginBottom : 55 * metrics
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
        backgroundColor : 'red',
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
        marginTop : 10 * metrics
    },
    text_body : {
        marginLeft : 25 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
        flex : 0.7, 
    },
    title : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        marginBottom : 3 * metrics,
        color : '#000'
    },
    count_body : {
        flex : 0.4,
        justifyContent : 'center'
    },
    time : {
        fontSize : 13 * metrics,
        color : Colors.gray_color,
        fontFamily : Fonts.adobe_clean
    },
    btn : {
        width : 160 * metrics,
        height : 55 * metrics,
        borderWidth : 1,
        borderRadius : 7 * metrics,
        borderColor : 'white',
        alignSelf : 'center',
        backgroundColor : Colors.main_color,
        justifyContent:'center',
        alignItems : 'center'
    },
    btn_text : {
        fontSize : 19 * metrics,
        fontFamily : Fonts.adobe_clean,
        color: 'white'
    }
})