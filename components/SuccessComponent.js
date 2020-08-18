import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, Image} from 'react-native'
import global_style, { metrics } from '../constants/GlobalStyle'
import PropTypes from 'prop-types'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Fonts} from '../constants/Fonts'

export default class SuccessComponent extends Component {

    state = {
        item_arr : [],
        date_title : ''
    }

    componentDidMount () {
    }

    render () {
        return (
            <View style={global_style.card_obj}>
                <View style={{alignItems : 'center', width : '90%' , alignSelf : 'center'}}>
                    <View style={{marginTop : 20 * metrics}}></View>
                    <SimpleLineIcons name="check" size={35 * metrics}></SimpleLineIcons>
                    <Text style={styles.title}>Success</Text>
                    <Text style={styles.desc}>{this.props.description}</Text>
                    <TouchableOpacity style={styles.btn} onPress={() => this.props.btnThanks()}>
                        <Text style={styles.btn_text}>Thanks!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

SuccessComponent.propType = {
    btnThanks : PropTypes.func,
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column'
    },
    title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        textAlign : 'center',
        marginTop : 20 * metrics
    },
    desc : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 13.5 * metrics,
        textAlign : 'center',
        marginTop : 20 * metrics,
        color : Colors.dark_gray
    },
    btn : {
        marginTop : 20 * metrics,
        marginBottom : 15 * metrics
    },
    btn_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        textAlign : 'center',
        color : Colors.main_color,
    }
})