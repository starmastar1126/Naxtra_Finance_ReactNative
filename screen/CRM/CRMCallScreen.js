import React from 'react';
import {Text, View, Picker, TouchableOpacity, StyleSheet, ScrollView,TextInput, ImageBackground,Linking} from 'react-native';
import CRMHeaderComponent from '../../components/CRMHeaderComponent'
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import { Fonts } from '../../constants/Fonts'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

export default class CRMCallScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        type : 'java',
        user_id : 'js',
        now_day : '',
        marked : null,
        date_ym : '',
        date_time : '',
        date : new Date(),
        isDatePickerVisible : false,
        isTimePickerVisible : false,
        description : 'Notes',
        isReady : false,
        isShow : true,
        user : ''
    }
    componentDidMount () {
        console.log(global.select_customer)
        this.setState({user : global.select_customer})
    }

    goBack () {
        this.props.navigation.navigate('CRMListScreen')
    }
    gotoActiveScreen () {
        this.props.navigation.navigate('ActiveScreen')
    }

    callPhone () {
        const url='tel:' + this.state.user.phone
        Linking.openURL(url)
    }
    render() {
        var onDay = 'asdfasdf'
        return (
            <View style={{flex : 1}}>
                <View style={{flex : 1 }}>
                    <CRMHeaderComponent navigation={this.props.navigation} goBack={() => this.goBack()} ref={(ref) => this.header_ref = ref} type={3}></CRMHeaderComponent>
                    <View style={styles.container}>
                        <View style={{marginTop : 10 * metrics}}></View>
                        <ImageBackground source={Images.phone_bg} style={styles.body} resizeMode="contain" borderRadius={10 * metrics}>
                            <View style={styles.container}>
                                <View style={{flex : 0.25,justifyContent : 'center', alignSelf :'center',marginTop : 10 * metrics}}>
                                    <EvilIcons name="user" size={120 * metrics} color="white"></EvilIcons>
                                </View>
                                <View style={{flex : 0.5}}>
                                    {
                                        this.state.isShow && 
                                        <View style={styles.modal}>
                                            <View style={styles.modal_header}>
                                                <View style={{flex : 0.2,justifyContent :'center' , alignItems : 'center'}}>
                                                    <TouchableOpacity>
                                                        <SimpleLineIcons name="settings" size={35 * metrics} color="white"></SimpleLineIcons>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex : 0.7,flexDirection : 'column'}}>
                                                    <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                                        <Text style={styles.name}>{this.state.user.name}</Text>
                                                        <View style={styles.customer_btn}>
                                                            <Text style={{fontSize : 10 * metrics, color:'white'}}>CUSTOMER</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                                        <Text style={{fontSize: 15 * metrics,fontFamily :Fonts.adobe_clean, color :'white'}}>0 mins. ago, 11:06 PM</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex : 0.1}}></View>
                                            </View>
                                            
                                            <View style={styles.modal_body}>
                                                <View style={styles.buttons}>
                                                    <TouchableOpacity style={styles.follow_btn} onPress={() => this.gotoActiveScreen()}>
                                                        <Text style={{fontSize : 13 * metrics}}>Follow Up</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.pending_btn} onPress={() => this.gotoActiveScreen()}>
                                                        <Text style={{fontSize : 13 * metrics, color : 'white'}}>Pending Payment</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.vip_btn} onPress={() => this.gotoActiveScreen()}>
                                                        <Text style={{fontSize : 13 * metrics}}>VIP</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.modal_title}>
                                                    <Text style={{fontSize : 17 * metrics}}>Penthouse owner - Brooklyn</Text>
                                                    <Text style={{fontSize : 17 * metrics}}>Apr 9, 2018:</Text>
                                                    <Text style={{fontSize : 15 * metrics}}>You send price proposal Q-1059.pdf of</Text>
                                                    <Text style={{fontSize : 15 * metrics}}>$10,500.00</Text>
                                                </View>
                                                
                                            </View>
                                            <View style={styles.bottom_btn}>
                                                <TouchableOpacity style={styles.btm_item_btn}>
                                                    <SimpleLineIcons name="social-dribbble" size={22 * metrics} color='#6f00e2'></SimpleLineIcons>
                                                    <Text style={{fontSize : 15 * metrics, color : '#6f00e2'}}>Manage Customer</Text>
                                                </TouchableOpacity>
                                                <View style={{marginRight : 8 * metrics}}></View>
                                                <TouchableOpacity style={styles.btm_item_btn} onPress={() => this.setState({isShow : false})}>
                                                    <AntDesign name="close" size={22 * metrics} color={Colors.main_blue_color}></AntDesign>
                                                    <Text style={{fontSize : 15 * metrics, color : Colors.main_blue_color}}>Close Window</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                    
                                </View>
                                {
                                    !this.state.isShow &&
                                    <View style={{width : '100%' , height : 50 * metrics, justifyContent : 'center', alignItems : 'center'}}>
                                        <TouchableOpacity style={styles.arrow_btn} onPress={() => this.setState({isShow : true})}>
                                            <SimpleLineIcons name="arrow-up" size={30 * metrics} color={Colors.main_blue_color}></SimpleLineIcons>
                                        </TouchableOpacity>
                                    </View>
                                }
                                <View style={styles.bottom}>
                                    <TouchableOpacity style={styles.info_btn}>
                                        <MaterialCommunityIcons name="radiobox-marked" size={35 * metrics} color="white"></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                    <View style={{marginLeft : 25 * metrics}}></View>
                                    <TouchableOpacity style={styles.call_btn} onPress={() => this.callPhone()}>
                                        <MaterialCommunityIcons name="phone" size={35 * metrics} color="white"></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                    <View style={{marginLeft : 25 * metrics}}></View>
                                    <TouchableOpacity style={styles.call_end_btn} onPress={() => this.props.navigation.navigate('CRMListScreen')}>
                                        <MaterialCommunityIcons name="phone-hangup" size={35 * metrics} color="white"></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={{marginTop : 10 * metrics}}></View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex :1 , width : '95%' , alignSelf: 'center'
    },
    body : {
        width : '100%',
        alignSelf : 'center',
        flex: 1.0,
    },
    active_body : {
        width : '90%',
        alignSelf : 'center',
    },
    active_name : {
        flexDirection : 'column'
    },
    text_input : {
        borderBottomWidth : 1,
        borderBottomColor : Colors.dark_gray,
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        padding : 0,
        marginTop : 15 * metrics
    },
    ative_item : {
        flexDirection : 'row',
        marginTop : 20 * metrics,
        alignItems : 'center',
    },
    fullType : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        marginLeft : 5 * metrics,   
    },
    emptyType : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color,
        marginLeft : 5 * metrics,
    },
    modal : {
        width : '90%',
        alignSelf : 'center',
        borderRadius : 10 * metrics,
        borderWidth : 1,
        borderColor : 'white',
        backgroundColor : "#6f00e2",
        flexDirection : 'column',
        minHeight : 200 * metrics
    },
    modal_header : {
        flexDirection : 'row',
        paddingTop : 10 * metrics
    },
    customer_btn : {
        width : 70 * metrics,
        height : 20 * metrics,
        borderWidth : 1,
        marginLeft : 10 * metrics,
        borderRadius : 5 * metrics,
        borderColor : 'white',
        justifyContent : 'center',
        alignItems : 'center'
    },
    name : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : 'white'
    },
    modal_body : {
        width : '95%',
        alignSelf : 'center',
        backgroundColor : 'white',
        marginTop : 15 * metrics,
        padding : 10 * metrics
    },
    btm_item_btn : {
        flex : 0.5,
        backgroundColor : 'white',
        borderRadius : 5 * metrics,
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center'
    },
    bottom_btn : {
        width : '95%',
        alignSelf : 'center',
        flexDirection : 'row',
        //backgroundColor : 'white',
        marginTop : 10 * metrics,
        marginBottom : 10 * metrics,
        height : 60 * metrics
    },
    buttons : {
        flexDirection : 'row',
        alignSelf : 'center'
    },
    follow_btn : {
        minWidth : 50 * metrics,
        height : 25 * metrics,
        backgroundColor : Colors.white_green_color,
        borderRadius : 5 * metrics,
        paddingLeft : 8 * metrics,
        paddingRight : 8 * metrics,
        paddingTop : 3 * metrics,
        paddingBottom : 3 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 10 * metrics
    },
    pending_btn : {
        minWidth : 50 * metrics,
        height : 25 * metrics,
        backgroundColor : Colors.main_blue_color,
        borderRadius : 5 * metrics,
        paddingLeft : 8 * metrics,
        paddingRight : 8 * metrics,
        paddingTop : 3 * metrics,
        paddingBottom : 3 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 10 * metrics
    },
    vip_btn : {
        minWidth : 50 * metrics,
        height : 25 * metrics,
        backgroundColor : Colors.white_red_color,
        borderRadius : 5 * metrics,
        paddingLeft : 8 * metrics,
        paddingRight : 8 * metrics,
        paddingTop : 3 * metrics,
        paddingBottom : 3 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 10 * metrics
    },
    modal_title : {
        alignItems : 'center',
        marginTop : 10 * metrics,
        flexDirection : 'column'
    },
    bottom : {
        flex : 0.25, flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center'
    },
    info_btn : {
        width : 70 * metrics,
        height : 70 * metrics,
        borderRadius : 100,
        backgroundColor : Colors.dark_gray,
        justifyContent : 'center',
        alignItems : 'center'
    },
    call_btn : {
        width : 70 * metrics,
        height : 70 * metrics,
        borderRadius : 100,
        backgroundColor : '#1bbb31',
        marginTop : -50 * metrics,
        justifyContent : 'center',
        alignItems : 'center'
    },
    call_end_btn : {
        width : 70 * metrics,
        height : 70 * metrics,
        borderRadius : 100,
        backgroundColor : 'red',
        justifyContent : 'center',
        alignItems : 'center'
    },
    arrow_btn : {
        width : 45 * metrics, height : 45 * metrics,justifyContent :'center', alignSelf : 'center', alignItems : 'center'
    }
})