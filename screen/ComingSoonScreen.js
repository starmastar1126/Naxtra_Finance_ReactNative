/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text,StyleSheet,Image,TouchableOpacity,SafeAreaView, Dimensions} from 'react-native';
import global_style , { metrics } from '../constants/GlobalStyle'
import { BorderlessButton } from 'react-native-gesture-handler'
import * as Colors from '../constants/Colors'
import * as Images from '../constants/Image'
import Drawer from 'react-native-drawer'
import SideMenuComponent from '../components/SideMenuComponent'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../constants/Fonts'
// import { WebView } from 'react-native-webview';

export default class ComingSoonScreen extends Component {
    componentDidMount () {
        console.log(global.web_url)
    }
    
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    }

    onMenu = () => {
        this._drawer.open()
    }

    onComingSoon () {
        this.props.navigation.navigate('TabScreen')
    }
    render() {
        return (
        <SafeAreaView style={{width : '100%' , height : '100%'}}>
            {/* <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<SideMenuComponent navigation={this.props.navigation} closeDrawer = {() => this._drawer.close() } goInit={() => this.props.navigation.navigate('TabScreen')} />}
                tapToClose={true}
                openDrawerOffset={0.3} // 20% gap on the right side of drawer
                panCloseMask={0.3}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
            >
                <View style={global_style.tab_header}>
                    <BorderlessButton style={styles.icon_btn} onPress={() => this.onMenu()}>
                        <MaterialCommunityIcons name="menu" size={ 32 * metrics} style={styles.icon}></MaterialCommunityIcons>
                    </BorderlessButton>
                    <Text style={{alignSelf : 'center', fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics}}>{global.other_title}</Text>
                </View>
                <View style={styles.body}>
                    {
                        global.web_url == '' ? 
                        <View style={styles.sb_body}>
                            <Image source={Images.coming_soon} style={styles.image}></Image>
                            <View style={{height : 20 * metrics}}></View>
                            <Text style={{fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean, textAlign : 'center', fontWeight : '500'}}>Coming Soon</Text>
                            <Text style={{width : '85%',fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, textAlign : 'center' , marginTop : 30 * metrics}}>Our team is working hard to build this feature. Stay tuned for more updates and releases.</Text>

                            <View style={{width : '100%',marginTop : 100 * metrics}}>
                                <TouchableOpacity style={global_style.bottom_active_btn} onPress={() => this.onComingSoon()}>
                                    <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 23 * metrics, color : Colors.white_color,alignSelf : 'center' , fontWeight : '500'}}>Ok, Cool</Text>
                                </TouchableOpacity>
                            </View>        
                        </View>
                        :
                        <WebView
                            source={{ uri: global.web_url }}
                            style={{width : Dimensions.get('window').width}}
                        />   
                    }
                </View>
            </Drawer> */}
        </SafeAreaView>
        );
    }
}
const drawerStyles = {
    drawer: { shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 30},
    main: {paddingLeft: 3},
}

const styles = StyleSheet.create({
    icon_btn : {
        flex : 0.2 , 
        justifyContent : 'center'
    },
    icon : {
        alignSelf : 'center'
    },
    image : {
        width : 250 * metrics, 
        height : 180 * metrics , 
        resizeMode : 'stretch'
    },
    body : {
        width : '100%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'column',
        alignItems : 'center'
    },
    sb_body : {
        width : '85%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'column',
        alignItems : 'center',
        marginTop : 100 * metrics
    }
})