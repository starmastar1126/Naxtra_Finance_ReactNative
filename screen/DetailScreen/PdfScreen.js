/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions,Text, Platform, TouchableOpacity, ToastAndroid,BackHandler} from 'react-native'
import * as Colors from '../../constants/Colors'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts';
import TransactionService from '../../service/TransactionService';
import PDFView from 'react-native-pdf-view';

import RNFetchBlob from 'rn-fetch-blob'
import { WEB_API } from '../../utils/keyInfo';
const { config } = RNFetchBlob;
const DocumentDir = RNFetchBlob.fs.dirs.DownloadDir;

export default class PdfScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor (props) {
        super(props)
        this.state = {
            pageNumber : 1,
            base64 : '',
            file_name : ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount () {
        this.setState({file_name : global.file_name})
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack()
        return true
    }

    onLoad (pageNumber) {
        this.setState({pageNumber : pageNumber})
    }
    downloadPDF () {
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                title: `${this.state.file_name} file report`, 
                path: DocumentDir + `/${this.state.file_name}` + '.pdf',
                description: 'Downloading file.',
            },
        };

        var url = WEB_API + 'generate_statement/' + global.trans_id + '/'
        console.log('url = ', url)
        config(options)
            .fetch(
                "POST",
                url,
                {
                    'Content-type': 'application/pdf',
                    'user-token' : global.token,
                }
            )
            .then(response => {
                console.log('response = ', response.path())
                ToastAndroid.show('Download PDF successfully.', 1000)
                ToastAndroid.BOTTOM = 10
            })
            .catch(err => {
            return reject(err);
        });
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                {
                    global.file_path != '' &&
                    <PDFView ref={(pdf)=>{this.pdfView = pdf;}}
                        src={global.file_path}
                        onLoadComplete = {(pageCount)=>{
                        }}
                        style={styles.pdf}/>
                }
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
                    <View style={styles.download_btn}>
                        <TouchableOpacity style={{flex : 1, borderRadius : 100, justifyContent : 'center', alignSelf : 'center'}} onPress={() => this.downloadPDF()}>
                            <MaterialCommunityIcons name="download" size={35 * metrics} color={'#fff'}></MaterialCommunityIcons>
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
        position : 'relative'
    },
    header : {
        height : 150 * metrics,
        width : '100%',
        backgroundColor : Colors.main_blue_color,
        position : 'absolute',
        zIndex : 999
    },
    save_body : {
        width : '90%',
        alignSelf : 'center',
        flex : 0.5,
        flexDirection : 'row',
        alignItems : 'center'
    },
    header_title : {
        fontSize : 30 * metrics,
        color : '#fff',
        marginLeft : 40 * metrics
    },
    pdf_style : {
        flexDirection : 'row',
        alignSelf : 'center',
        alignItems : 'center',
        flex : 0.5,
        width : '80%',
    },
    pdf_text_style : {
        fontSize : 20 * metrics,
        color : 'white'
    },
    body : {
        justifyContent : 'center',
        backgroundColor : 'gray',
        position : 'absolute'
    },
    pdf: {
        width: '100%',
        height : '100%',
        alignSelf : 'center',
        justifyContent : 'center',
        marginTop : 100 * metrics
    },
    download_btn : {
        backgroundColor : '#fec400',
        position : 'absolute',
        top : 120 * metrics,
        right : 10 * metrics,
        borderRadius : 100,
        width : 50 * metrics,
        height : 50 * metrics,
        elevation : Platform.OS == 'android' ? 3 : 0.1
    }
});