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
import {Fonts} from '../../constants/Fonts'

export default class CardDetailScreen extends Component {
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
        arr : [
            {
                img : Images.icon_star,
                txt : 'Lorem ipsum dolor sit amet'
            },
            {
                img : Images.icon_star,
                txt : 'Lorem ipsum dolor sit amet'
            },
            {
                img : Images.icon_star,
                txt : 'Lorem ipsum dolor sit amet'
            },
            {
                img : Images.icon_star,
                txt : 'Lorem ipsum dolor sit amet'
            }
        ]
    }
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    onSubmit () {
        this.props.navigation.navigate('PinCodeScreen')
    }

    componentDidMount () {
        console.log(global.item)
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Card Details"  goBack ={() => {
                    this.props.navigation.goBack()
                }}></DetailHeaderComponent>
                <View style={styles.body}>
                    <View style={{flex : 0.1}}>
                        <Text style={styles.card_title}>{global.item.card_name}</Text>
                    </View>
                    <View style={{flex : 0.3}}>
                        <Image source={global.item.img} style={{width : '98%' , height : 200 * metrics,alignSelf : 'center', resizeMode : 'stretch'}}></Image>
                    </View>
                    <View style={{flex : 0.4, flexDirection : 'column'}}>
                        <View style={{flex : 0.4, marginTop : 10 * metrics, marginBottom : 10* metrics}}>
                            <ScrollView>
                                <Text style={{fontSize : 15 * metrics}}>
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                                </Text>
                            </ScrollView>
                        </View>
                        <View style={{flex : 0.6}}>
                            {
                                this.state.arr.map((item, idx) => {
                                    return (
                                        <View style={{flexDirection : 'row', flex : 0.25}} key={idx}>
                                            <Image source={item.img} style={styles.img}></Image>
                                            <Text style={{alignSelf : 'center' , marginLeft : 20 * metrics , fontSize : 15 * metrics}}>{item.txt}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={{flex : 0.02}}></View>
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
    card_title : {
        textAlign : 'center',
        fontSize : 18 * metrics,
        fontWeight : '100',
        color : '#000',
        marginTop : 25 * metrics
    },
    img : {
        width : 20 * metrics,
        height : 20 * metrics,
        alignSelf : 'center'
    }
});