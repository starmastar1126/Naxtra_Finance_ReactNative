/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , BackHandler ,TouchableOpacity,ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import HelpService from '../../service/HelpService';
import { Fonts } from '../../constants/Fonts';

export default class FaqScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        faq_arr : [],
        selectIdx : -1
    }
    constructor(props) {
        super(props);
    }
    componentDidMount () {
        HelpService.getFaqs().then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({faq_arr : data.response})
            } else {
                this.setState({faq_arr : []})
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Frequently Asked Questions" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <ScrollView style={{width : '100%' , height : '100%'}}>
                    <View style={{width : '100%' , height : '100%' , flexDirection : 'column'}}>
                            <View style={styles.title}>
                                <Text style={styles.text}>Frequently Asked Questions</Text>
                            </View>
                            <View style={styles.body}>
                                {
                                    this.state.faq_arr.map((item , idx) => {
                                        return (
                                            <TouchableOpacity style={styles.card_view} key={idx} onPress={() => this.setState({selectIdx : idx})}>
                                                <Text style={styles.question}>{item.name}</Text>
                                                {
                                                    this.state.selectIdx == idx && 
                                                    <Text style={styles.description}>
                                                        {item.note}
                                                    </Text>
                                                }
                                                
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                    </View>
                </ScrollView>
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
        backgroundColor : Colors.white_color
    },
    title : {
        marginTop : 30 * metrics,marginBottom : 30 * metrics , width : '85%' ,flexDirection : 'column', alignSelf : 'center'
    },
    text : {
        fontSize : 15 * metrics , color : Colors.white_gray_color, fontWeight : '500',fontFamily : Fonts.adobe_clean,
    },
    body : {
        flexDirection : 'column', width : '85%' ,alignSelf : 'center'
    },
    bottom : {
        flex : 0.2 , width : '85%', alignSelf : 'center', justifyContent : 'center'
    },
    card_view : {
        width : '100%', 
        elevation : 3.5, 
        minHeight : 60 * metrics,
        backgroundColor : 'white', 
        marginBottom : 15 * metrics,
        flexDirection : 'column',
        padding : 15 * metrics,
        shadowOffset : { width : 0 , height : -15}
    },
    question : {
        fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,
        color : Colors.main_color
    },
    description : {
        fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,
        marginTop : 4 * metrics
    }
});