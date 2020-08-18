import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import FastImage from 'react-native-fast-image';


export default class VendorEdit extends React.Component {
    static navigationOptions = {
        title: 'Edit Vendor'
    };
    componentWillReceiveProps() {
        this.gotoBot()
    }
    async gotoBot () {
        var obj = global.supplier_info
        console.log('obj = ' , obj)
        await fetch('https://naxetra.zeva.ai/naxetra/send/?id='+id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body: 
                //samples provided for different scenarios

                JSON.stringify({
                    "purpose": "vendor",
                    "result": {
                        "vendor":{
                                "id":12,
                                "supplier":"ACME LTD"
                            }
                        }
                    }
                ),
        }).then((Response)=>Response.json()).then((responseJson)=>{
                console.log('Success', responseJson);
                this.props.navigation.goBack(null);
        }).catch(err => {
            console.log('Error while sending data',err)
        })
    }
    sendToBot = async (id, data)=> {
        console.log(id)
        global.vender_edit = true
        this.props.navigation.navigate('CreateCRMScreen')
    }

    render() {
        const {navigation} = this.props;
        var vendor = navigation.getParam('data',{});
        var id = navigation.getParam('conversationID', "");
        console.log(vendor)
        return (
            <View style={{flex:1, justifyContent: "center"}}>
                <Text style={{justifyContent: "center", alignSelf:"center"}}>This is Screen for editing Vendor </Text>
                <TouchableOpacity onPress={()=> this.sendToBot(id, vendor)} 
                    style={{
                        alignItems: "center", 
                        justifyContent: "center",
                        backgroundColor: "#DDDDDD", 
                        
                        height: 40, margin: 50} }>
                            <Text>Click Here to send details to bot</Text>
                </TouchableOpacity>
            </View>
        );
    }
}