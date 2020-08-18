/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity, BackHandler, ScrollView, ActivityIndicator} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts';
import TransactionService from '../../service/TransactionService';

export default class ViewAllScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor (props) {
        super(props)
        this.state = {
            transaction_arr : [],
            isLoading : false
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    pay = () => {

    }
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
        return true
    }
    componentDidMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({isLoading : true})
        TransactionService.getTransactionViewAll(global.token,global.trans_id).then(res => {
            var data = res.data.result
            console.log('view = ' , data)
            if (data.success) {
                this.setState({transaction_arr : data.response})
            } else {
                this.setState({transaction_arr : []})
            }
            this.setState({isLoading :false})
        }).catch(error => {
            this.setState({transaction_arr : []})
            this.setState({isLoading :false})
        })
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back_button} onPress={() => this.goBack()}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={30 * metrics}></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View>
                <ScrollView >
                    <View style={styles.scroll_view}>
                        {
                            this.state.transaction_arr.map((item, idx) => {
                                return (
                                    <View style={{flexDirection : 'row', height : 50 * metrics}}>
                                        <Text style={styles.date}>{item.date}</Text>  
                                        {
                                            Number(item.total_amount) < 0 ? 
                                            <Text style={styles.value} numberOfLines={1}> - £ {item.total_amount}</Text>
                                            :
                                            <Text style={styles.value} numberOfLines={1}> + £ { item.total_amount}</Text>
                                        }                  
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        alignSelf : 'center',
        backgroundColor : Colors.white_color,
    },
    header : {
        width : '100%',
        height : 60 * metrics,
    },
    back_button : {
        justifyContent : 'center',
        marginTop : 15 * metrics,
        marginLeft : 15 * metrics
    },
    scroll_view : {
        marginTop : 40 * metrics,
        width : '90%',
        alignSelf : 'center'
    },
    date : {
        flex : 0.5,
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.dark_gray
    },
    value : {
        flex : 0.5,
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'right',
        color : Colors.dark_gray
    }
});