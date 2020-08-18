import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ScrollView} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import global_style from '../constants/GlobalStyle'
import { Avatar } from 'react-native-elements';
import {Fonts} from '../constants/Fonts'
import TransactionService from '../service/TransactionService';
export default class SendMoneyComponent extends Component {

    state = {
        user_arr : []
    }
    paymentLink () {
        this.props.navigation.navigate('PaymentLinkScreen')
    }
    componentDidMount () {
        // var obj = {
        //     token : global.token
        // }
        TransactionService.recentBeneficiaries(global.token).then(res => {
            var data = res.data.result
            console.log('data = ', data)
            if (data.success) {

                if (data.response.length == undefined) {
                    this.setState({user_arr : []})
                } else 
                    this.setState({user_arr : data.response})
            }
        }).catch(error => {
            console.log('error = ' , error.message)
        })
    }

    gotoManageBeneficiaries () {
        this.props.navigation.navigate('ManageBeneficiary')
    }
    render () {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.body}>
                    <View style={{flex : 1, flexDirection : 'column'}}>
                        <View style={{flex : 1 , flexDirection : 'row'}}>
                            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('NaxetraAccount')}>
                                <View style={global_style.roundIcon}>
                                    <MaterialIcon name="home-outline" size={23 * metrics} style={global_style.icon_style}></MaterialIcon>
                                </View>
                                <Text style={global_style.btn_text}>Bank Account</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('BankAccount')}>
                                <View style={global_style.roundIcon}>
                                    <MaterialIcon name="script-text-outline" size={23 * metrics} style={global_style.icon_style}></MaterialIcon>
                                </View>
                                <Text style={global_style.btn_text}>Bank Account</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.item} onPress={() => this.paymentLink()}>
                                <View style={global_style.roundIcon}>
                                    <MaterialIcon name="link-variant" size={23 * metrics} style={global_style.icon_style}></MaterialIcon>
                                </View>
                                <Text style={global_style.btn_text}>Payment Link</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item} onPress={() => this.gotoManageBeneficiaries()}>
                                <View style={global_style.roundIcon}>
                                    <FeatherIcon name="users" size={23 * metrics} style={global_style.icon_style}></FeatherIcon>
                                </View>
                                <Text style={global_style.btn_text}>Manage Beneficiary</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.recent_body}>
                        {
                            this.state.user_arr.length > 0 &&
                            <Text style={styles.recent_title}>Recent</Text>
                        }
                        <View style={styles.user_body}>
                            {
                                this.state.user_arr.map((item, index) => {
                                    return (
                                        <View style={styles.user} key={index}>
                                            {
                                                !item.rb_beneficiary_icon ?
                                                <EvilIcons name="user" style={{fontFamily : Fonts.adobe_clean,fontSize : 60 * metrics, color : Colors.main_color,alignSelf : 'center'}}></EvilIcons>
                                                :
                                                <Image source={{uri : 'data:image/png;base64,' + item.rb_beneficiary_icon}} style={{width :50 * metrics,alignSelf : 'center', height : 50 * metrics, borderRadius : 100 ,resizeMode : 'cover'}}></Image>
                                            }
                                            <Text style={{fontSize : 15 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'center'}}>{item.rb_name}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

SendMoneyComponent.propType = {
	date: PropTypes.string,
    items : PropTypes.array
}
const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        marginBottom : 55 * metrics,
        marginTop : 10 * metrics
    },
    body : {
        width : '80%',
        flex : 1,
        alignSelf : 'center',
        flexDirection : 'column',
        marginTop : 5 * metrics,
    },
    item : {
        flex : 0.25,
        height : 85 * metrics,
        flexDirection : 'column',
        justifyContent : 'center'
    },
    recent_body : {
        width : '100%',
        height : '100%',
        marginTop : 20 * metrics,
        flexDirection : 'column',
    },
    user_body : {
        flexWrap : 'wrap',
        flex : 1,
        alignSelf : 'flex-start',
        flexDirection : 'row'
    },
    user : {
        width : '25%',
        flexDirection : 'column',
        alignSelf : 'center',
        alignItems : 'center',
        marginTop : 20 * metrics,
    },
    person_image : {
        width : 45 * metrics,
        height : 45 * metrics,
        borderRadius :50,
        marginBottom : 5 * metrics
    },
    recent_title : {
        fontSize : 18 * metrics ,fontFamily : Fonts.adobe_clean,
        color : '#000' , 
        marginLeft : 15 * metrics,
        marginBottom : 10 * metrics,
        marginTop : 15 * metrics
    },
})