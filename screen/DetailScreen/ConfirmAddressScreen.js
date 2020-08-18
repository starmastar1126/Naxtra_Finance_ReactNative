/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity, BackHandler, ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Fonts} from '../../constants/Fonts'

export default class ConfirmAddressScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        amount : '',
        message : '',
        isReady : false,
        card_item : '',
    }
    onSubmit () {
        this.props.navigation.navigate('TabScreen')
    }
    componentDidMount() {
        this.setState({card_item : global.item})
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Confirm Address"  goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <View style={styles.body}>
                    <View style={{flex : 0.05}}></View>
                    <View style={{flex: 0.75}}>
                        <View style={styles.card}>
                            <View style={{flexDirection : 'row'}}>
                                <Text style={styles.name}>
                                    {global.user_info.first_name} {global.user_info.middle_name} {global.user_info.last_name}
                                </Text>
                                <TouchableOpacity style={{flex : 0.1}}>
                                    <MaterialIcons name="edit" size={25 * metrics} color={Colors.main_color}></MaterialIcons>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.text}>{global.user_info.address}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.text}>{global.user_info.address}</Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={[styles.text, {marginBottom : 10 * metrics}]}>{global.user_info.email}</Text>
                                <Text style={styles.text}>{global.user_info.phone}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.address}>
                            <SimpleLineIcons name="plus" size={22 * metrics} style={{color : Colors.main_color}}></SimpleLineIcons>
                            <Text style={{fontSize : 15 * metrics, marginLeft : 10 * metrics}}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{flex : 0.15, alignItems : 'center'}}>
                        <TouchableOpacity  style={global_style.bottom_active_btn} onPress={()=> this.onSubmit()}>
                            <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Confirm</Text>
                                <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                            </View>
                        </TouchableOpacity>  
                    </View>
                </View>
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
    body :{
        height : '100%',
        flexDirection : 'column',
        width : '80%',
        alignSelf : 'center',
    },
    card : {
        width : '100%',
        height : 240 * metrics,
        padding : 25 * metrics,
        elevation : 1.5,
        backgroundColor : 'white',
        marginBottom : 20 * metrics,
        flexDirection : 'column'
    },
    name : {
        fontSize : 16 * metrics,
        fontWeight : '700',
        flex : 0.9
    },
    text : {
        fontSize : 15 * metrics,
    },
    item : {
        marginTop : 10 * metrics, 
        marginBottom : 10 * metrics
    },
    address : {
        flexDirection : 'row', 
        alignSelf : 'center',
        marginTop : 15 * metrics
    }
});