/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler, StyleSheet,Text, View , Image ,ScrollView,SafeAreaView} from 'react-native'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { metrics } from '../../constants/GlobalStyle';
import {Fonts} from '../../constants/Fonts'
import HelpService from '../../service/HelpService'

export default class PrivacyScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    state = {
        privacy_arr : []
    }
    constructor(props) {
        super(props);
    }
    componentDidMount () {
        HelpService.getPrivacys().then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({privacy_arr : data.response})
            } else {
                this.setState({privacy_arr : []})
            }
        }).catch(error => {
            this.setState({privacy_arr : []})
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Privacy" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <ScrollView style={{width: '100%' ,height : '100%'}}>
                    {
                        this.state.privacy_arr.map((item, idx) => {
                            return(
                                <View style={styles.body} key={idx}>
                                    <Text style={styles.header}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.description}>
                                        {item.note}
                                    </Text>
                                </View>
                            )
                        })
                    }
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
    },
    body : {
        width : '85%',
        height : '100%',
        alignSelf : 'center',
        paddingTop : 30 * metrics,
    },
    header : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
        color : '#000'
    },
    description : {
        fontSize : 17 * metrics,fontFamily : Fonts.adobe_clean,
        marginTop : 20 * metrics,
        marginBottom : 20 * metrics
    }
});