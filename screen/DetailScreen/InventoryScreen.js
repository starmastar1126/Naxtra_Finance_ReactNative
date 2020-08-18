/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions,Text, Platform, TouchableOpacity, ToastAndroid} from 'react-native'
import * as Colors from '../../constants/Colors'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//import Pdf from 'react-native-pdf';
import { Fonts } from '../../constants/Fonts';

export default class InventoryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        pageNumber : 0
    }

    componentDidMount () {
    }

    onLoad (pageNumber) {
        this.setState({pageNumber : pageNumber})
    }
    downloadPDF () {
        ToastAndroid.show('Download PDF successfully.', 1000)
        ToastAndroid.BOTTOM = 10
    }
    render() {
        //const source = {uri:'file://' + global.pdf.filePath};
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.save_body}>
                        <MaterialCommunityIcons name="download" size={35 * metrics} color={'#fff'}></MaterialCommunityIcons>
                        <Text style={styles.header_title}>Save as PDF</Text>
                    </View>
                    <View style={styles.pdf_style}>
                        <Text style={styles.pdf_text_style}>Copies : {this.state.pageNumber}</Text>
                        <View style={{marginLeft : 60 * metrics}}></View>
                        <Text style={styles.pdf_text_style}>Paper size : Letter</Text>     
                    </View>
                </View>
                <View style={styles.body}>
                    {/* <Pdf
                        source={source}
                        onLoadComplete={(numberOfPages,filePath)=>{
                            this.onLoad(numberOfPages)
                        }}
                        onPageChanged={(page,numberOfPages)=>{
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error)=>{
                            console.log(error);
                        }}
                        onPressLink={(uri)=>{
                            console.log(`Link presse: ${uri}`)
                        }}
                        style={styles.pdf}/>
                        <View style={styles.download_btn}>
                            <TouchableOpacity style={{flex : 1, borderRadius : 100, justifyContent : 'center', alignSelf : 'center'}} onPress={() => this.downloadPDF()}>
                                <MaterialCommunityIcons name="download" size={35 * metrics} color={'#fff'}></MaterialCommunityIcons>
                            </TouchableOpacity>
                        </View> */}
                </View>
                <View style={{height : 50 * metrics, flexDirection : 'row' , alignItems : 'center'}}>
                    <View style={{flex: 0.9}}></View>
                    <View style={{flex: 0.1}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <MaterialCommunityIcons name="arrow-left" size={30 * metrics}></MaterialCommunityIcons>
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
    header : {
        flex : 0.2, 
        backgroundColor : Colors.main_blue_color,
        position : 'relative'
    },
});