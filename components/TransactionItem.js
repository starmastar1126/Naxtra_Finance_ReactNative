import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import { Avatar } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { getHoursAndMinsFromStr,paramDate2,getHoursAndMins, changeDatefromAccount } from '../utils/utils';
import {Fonts} from '../constants/Fonts'
export default class TransactionItem extends Component {

    state = {
        item_arr : [],
        date_title : ''
    }

    componentDidMount () {
        this.setState({
            item_arr : this.props.items,
            date_title : this.props.date
        })
        
    }

    gotoDetail = (item) => {
        this.props.showDetail(item)
    }

    render () {
        return (
            <View style={styles.container}>
                {
                    this.props.showType == 'time' && 
                    <Text style={{fontSize : 16 * metrics, color : Colors.white_gray_color, fontFamily: Fonts.adobe_clean}}>
                        {(this.state.date_title == "Today" || this.state.date_title == "Yesterday") ? this.state.date_title : changeDatefromAccount(this.state.date_title)}            
                    </Text>
                }
                {
                    this.props.showType == 'category' &&
                    <Text style={{fontSize : 16 * metrics, color : Colors.white_gray_color, fontFamily: Fonts.adobe_clean}}>
                        {this.state.date_title}            
                    </Text>
                }
                {
                    this.props.showType == 'hide' &&
                    <Text style={{fontSize : 16 * metrics, color : Colors.white_gray_color, fontFamily: Fonts.adobe_clean}}>
                        {this.state.date_title}            
                    </Text>
                }
                
                <View style={styles.body}>
                    {
                        this.state.item_arr.map((item, index) => {
                            var date = new Date(item.nx_transaction_date.split(' ')[0] + 'T' + item.nx_transaction_date.split(' ')[1]).toISOString().toLocaleString('en-GB', { timeZone: 'Europe/London'})
                            return (
                                <View style={styles.item} key={index}>
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
                                    
                                    <TouchableOpacity style={styles.text_body} onPress={() => this.gotoDetail(item)}>
                                        {
                                            // item.transaction_type == 'out' ? 
                                            // <Text style={styles.title} numberOfLines={1}>{!item.rb_beneficiary ? 'Transaction' : item.rb_beneficiary[1]}</Text>
                                            // :
                                            <Text style={styles.title} numberOfLines={1}>{!item.transaction_info_details ? 'Transaction' : item.transaction_info_details}</Text>
                                        }
                                        {
                                            !item.nx_transaction_date ?
                                            <Text style={styles.time} >{paramDate2(new Date())} {getHoursAndMins(new Date().toUTCString())}</Text>
                                            :
                                            <Text style={styles.time}>{changeDatefromAccount(date.toString().split('T')[0])} {getHoursAndMinsFromStr(date.toString().split('T')[1])}</Text>
                                        }
                                    </TouchableOpacity>
                                    <View style={{flex :0.25, flexDirection : 'row',paddingLeft : 10 * metrics, paddingRight : 10 * metrics}}>
                                        {
                                            
                                            <View style={{justifyContent : 'center', flex : 0.5}}>
                                                {
                                                    item.nx_attachment && item.rb_transaction_add_notes != '' &&
                                                    <Image source={Images.add_note_attach} style={{width : 30 * metrics, height: 30 * metrics}}></Image>
                                                }
                                                {
                                                    item.nx_attachment  && item.rb_transaction_add_notes == '' &&
                                                    <Image source={Images.add_attach} style={{width : 27 * metrics, height: 27 * metrics}}></Image>
                                                }
                                                {
                                                    !item.nx_attachment  && item.rb_transaction_add_notes != '' &&
                                                    <Image source={Images.add_note} style={{width : 30 * metrics, height: 30 * metrics}}></Image>
                                                }    
                                            </View>
                                        }
                                        {
                                            !item.rb_classification_account_id && 
                                            <View style={{justifyContent : 'center',alignItems : 'center', flex : 0.5}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 30 * metrics, color:Colors.red_color}}>!</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={styles.count_body}>
                                        {
                                            item.transaction_type == 'out' ?
                                            <Text style={styles.m_balance}> - £ { Math.abs(item.rb_amount).toFixed(2)}</Text>
                                            :
                                            <Text style={styles.p_balance}> + £ { Math.abs(item.rb_amount).toFixed(2)}</Text>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

TransactionItem.propType = {
	showDetail : PropTypes.func
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        flexDirection : 'column',
        marginBottom : 10 * metrics,
        marginTop : 10 * metrics
    },
    body : {
        flex : 1, 
        flexDirection : 'column',
        marginTop : 20 * metrics
    },
    item : {
        flexDirection : 'row',
        flex : 1,
        marginBottom : 20 * metrics
    },
    l_img : {
        width : 45 * metrics,
        height : 45 * metrics,
        borderRadius : 50 ,
        backgroundColor : 'red',
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
    },
    text_body : {
        marginLeft : 25 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
        flex : 0.6,
    },
    title : {
        fontSize : 18 * metrics,
        marginBottom : 3 * metrics,
        color : '#000', fontFamily: Fonts.adobe_clean,
        flexWrap : 'nowrap'
    },
    time : {
        fontSize : 13 * metrics,
        color : Colors.gray_color,
        fontFamily : Fonts.adobe_clean
    },
    count_body : {
        flex : 0.35,
        justifyContent : 'center'
    },
    p_balance : {
        fontSize : 14 * metrics,
        textAlign : 'right',
        color : 'green', 
        fontFamily: Fonts.adobe_clean
    },
    m_balance : {
        fontSize : 14 * metrics,
        textAlign : 'right',
        color : 'red', 
        fontFamily: Fonts.adobe_clean
    }
})