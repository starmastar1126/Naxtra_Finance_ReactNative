
import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity, StyleSheet} from 'react-native'
import TabHeaderScreen from '../../components/TabHeaderScreen'
import SendMoneyComponent from '../../components/SendMoneyComponent'
import RequestMonmeyComponent from '../../components/RequestMoneyComponent'
import { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import PropTypes from 'prop-types'
import {Fonts} from '../../constants/Fonts'

export default class PaymentScreen extends Component {
    componentDidMount () {
        if (global.payment_type != 'request') {
            this.setState({isActive : 1})
        } else {
            this.setState({isActive : 2})
        }
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    state = {
        isActive : -1
    }

    render() {
        return (
            <View style={{width : '100%' , height : '100%' , backgroundColor : Colors.white_color}}>
                <TabHeaderScreen headerTitle={this.state.isActive == 1 ? "Send Money" : "Request Money"} navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></TabHeaderScreen>
                <View style={styles.tab_body}>
                    <TouchableOpacity style={styles.tab_item} onPress={() => this.setState({isActive : 1})}>
                        <View style={styles.text_body}>
                            <Text style={ this.state.isActive == 1 ? styles.active_text : styles.text}>Send Money</Text>
                        </View>
                        <View style={styles.line}>
                            <View style={this.state.isActive == 1 ? styles.line_color : styles.noraml_color}></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab_item} onPress={() => this.setState({isActive : 2})}>
                        <View style={styles.text_body}>
                            <Text style={this.state.isActive == 2 ? styles.active_text : styles.text}>Request Money</Text>
                        </View>
                        <View style={styles.line}>
                            <View style={this.state.isActive == 2 ? styles.line_color : styles.noraml_color}></View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex : 1}}>
                    {
                        this.state.isActive == 1 ? 
                        <SendMoneyComponent navigation ={this.props.navigation}></SendMoneyComponent> : 
                        <RequestMonmeyComponent navigation ={this.props.navigation}></RequestMonmeyComponent>
                    }
                </View>
            </View>
        );
    }
}


PaymentScreen.propType = {
    showDrawer : PropTypes.func
}

const styles = StyleSheet.create({
    tab_body : {
        width : '100%',
        height : 55 * metrics,
        backgroundColor : 'white',
        borderBottomWidth : 1,
        borderBottomColor : Colors.white_gray_color,
        flexDirection : 'row',
    },
    tab_item : {
        flex : 0.5,
        flexDirection : 'column',
        justifyContent : 'center'
    },
    text_body : {
        alignSelf : 'center', 
        flex : 0.8, 
        justifyContent : 'center'
    },
    text : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.white_gray_color
    },
    active_text : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color
    },
    line : {
        width : 35 , alignSelf : 'center' ,flex : 0.1,marginTop : 5 * metrics
    },
    line_color : {
        width : '100%' , 
        height : 2 * metrics , 
        backgroundColor : Colors.main_color
    },
    noraml_color : {
        width : '100%' , 
        height : 2 * metrics , 
        backgroundColor : Colors.white_color
    }
})