import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image, ScrollView} from 'react-native'
import { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import global_style from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {Fonts} from '../constants/Fonts'
export default class RequestMoneyComponent extends Component {

    state = {
        user_arr : []
    }
    componentDidMount () {

    }

    render () {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.body}>
                    <View style={{flex : 1 , flexDirection : 'row'}}>
                        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('PaymentLinkScreen')}>
                            <View style={global_style.roundIcon}>
                                <MaterialIcon name="link-variant" size={23 * metrics} style={global_style.icon_style}></MaterialIcon>
                            </View>
                            <Text style={global_style.btn_text}>Payment Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('AccountSettingScreen')}>
                            <View style={global_style.roundIcon}>
                                <FeatherIcon name="user" size={23 * metrics} style={global_style.icon_style}></FeatherIcon>
                            </View>
                            <Text style={global_style.btn_text}>Account Details</Text>
                        </TouchableOpacity>
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
                                            <Image source={item.img_url} style={styles.person_image}></Image>
                                            <Text style={{fontFamily : Fonts.adobe_clean,}}>{item.name}</Text>
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

RequestMoneyComponent.propType = {
	date: PropTypes.string,
    items : PropTypes.array
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
        marginTop : 5 * metrics
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
        flexDirection : 'column',
    },
    user_body : {
        flexWrap : 'wrap',
        flex : 1,
        alignSelf : 'center',
        flexDirection : 'row'
    },
    user : {
        width : '25%',
        flexDirection : 'column',
        alignSelf : 'center',
        alignItems : 'center',
        marginTop : 20 * metrics
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
    }
})