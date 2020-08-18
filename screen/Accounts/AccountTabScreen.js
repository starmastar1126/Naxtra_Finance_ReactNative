/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,ActivityIndicator,AsyncStorage ,TouchableOpacity,ScrollView} from 'react-native'
import * as ErrorMessage from '../../constants/ErrorMessage'
import * as Colors from '../../constants/Colors'
import global_style, {metrics} from '../../constants/GlobalStyle'
import SideMenuComponent from '../../components/SideMenuComponent'
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { BorderlessButton } from 'react-native-gesture-handler';
import {Fonts} from '../../constants/Fonts'
import Drawer from 'react-native-drawer'
import Tabs from 'react-native-tabs';

import ReportScreen from './ReportScreen'
import SaleScreen from './SaleScreen';
import ExpenseScreen from './ExpenseScreen';
import ContactScreen from './ContactScreen';
import MoreScreen from './MoreScreen';

// const resetAction = (routeName) => StackActions.reset({
// 	index: 0,
// 	actions: [
// 		NavigationActions.navigate({ routeName: routeName }),
// 	]
// });


export default class AccountTabScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };

  constructor (props) {
    super(props)
    this.state = {
      isLoading : false,
      page : 'Reports',
      isShowSide : false
    }
    this.sales_ref = null;
    this.expenses_ref = null
  }

  gotoLink = () => {
    
  }

  changeTab (value) {
    this.setState({page : value.props.name})
  }
  
  componentDidMount () {
    console.log('!!! = ', global.tab_name)
    if (global.tab_name == 'Sales') {
      this.setState({page : global.tab_name} ,() => {
        if (this.sales_ref != null)
          this.sales_ref.onChangeState()
      })
    } else if (global.tab_name == 'Expenses') {
      this.setState({page : global.tab_name} ,() => {
        if (this.expenses_ref != null)
          this.expenses_ref.onChangeState()
      })
    } else {
      if (global.tab_name == '') {
        this.setState({page : 'Reports'})
      }
    }
  }
  componentWillReceiveProps () {
    this.componentDidMount()
  } 

  closeDrawer = () => {
    this.setState({isShowSide : false})
    this._drawer.close()
  }

  openDrawer = () => {
    this.setState({isShowSide : true})
    this._drawer.open()
  }
  Logout (flag) {
    global.tabIdx = 1
    this.setState({isLoading : flag})
  }
  gotoOtherScreen (value) {
    this.setState({page: value})
  }

  render() {
    return (
      <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
        {
          <View style={styles.container}>
            <Drawer
              ref={(ref) => this._drawer = ref}
              type="overlay"
              content={<SideMenuComponent isLoadingfunc={(flag) => this.Logout(flag)} goInit={() => console.log('hahah')} navigation={this.props.navigation} closeDrawer = {() => this.closeDrawer() }/>}
              tapToClose={true}
              openDrawerOffset={0.2} // 20% gap on the right side of drawer
              panCloseMask={0.2}
              closedDrawerOffset={-2}
              onDragStart={() => this.setState({isShowSide : false})}
              onClose={() => this.setState({isShowSide : false})}
              styles={drawerStyles}
              tweenHandler={(ratio) => ({
                  main: { opacity:(2-ratio)/2 },
              })}
            >
              {
                this.state.page == 'Reports' &&
                <ReportScreen navigation={this.props.navigation}  showDrawer = {() => this.openDrawer()} gotoOthertab={(value) => this.gotoOtherScreen(value)} ></ReportScreen>
              }
              {
                this.state.page == 'Sales' &&
                <SaleScreen ref={(ref) => this.sales_ref = ref} navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></SaleScreen>
              }
              {
                this.state.page == 'Expenses' &&
                <ExpenseScreen ref={(ref) => this.expenses_ref = ref}  navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></ExpenseScreen>
              }
              {
                this.state.page == 'Contacts' &&
                <ContactScreen  navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></ContactScreen>
              }
              {
                this.state.page == 'More' &&
                <MoreScreen   navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></MoreScreen>
              }
            </Drawer>
            {
              !this.state.isShowSide && 
              <Tabs selected={this.state.page} style={styles.tab_body} selectedStyle={{color:'red'}} onSelect={value=> this.changeTab(value)}>
                <View name="Reports" style={styles.tab_item}>
                  <BorderlessButton style={styles.tabBarIcon}>
                    <MaterialCommunityIcons name="chart-bar" size={25 * metrics} style={this.state.page == 'Reports' && {color : Colors.red_color}}></MaterialCommunityIcons>
                    {
                      this.state.page == 'Reports' ?
                      <Text style={{color : Colors.red_color,fontFamily : Fonts.adobe_clean}}>Reports</Text>
                      :
                      <Text style={{color : Colors.dark_gray,fontFamily : Fonts.adobe_clean}}>Reports</Text>
                    }
                  </BorderlessButton>
                </View>
                <View name="Sales" style={styles.tab_item}>
                  <BorderlessButton style={styles.tabBarIcon}>
                    <MaterialCommunityIcons name="wallet-giftcard" size={25 * metrics} style={this.state.page == 'Sales' && {color : Colors.red_color}}></MaterialCommunityIcons>
                    {
                      this.state.page == 'Sales' ?
                      <Text style={{color : Colors.red_color,fontFamily : Fonts.adobe_clean}}>Sales</Text>
                      :
                      <Text style={{color : Colors.dark_gray,fontFamily : Fonts.adobe_clean}}>Sales</Text>
                    }
                  </BorderlessButton>
                </View>
                <View name="Expenses" style={styles.tab_item}>
                  <BorderlessButton style={styles.tabBarIcon}>
                    <MaterialCommunityIcons name="credit-card" size={25 * metrics} style={this.state.page == 'Expenses' && {color : Colors.red_color}}></MaterialCommunityIcons>
                    {
                      this.state.page == 'Expenses' ?
                      <Text style={{color : Colors.red_color,fontFamily : Fonts.adobe_clean}}>Expenses</Text>
                      :
                      <Text style={{color : Colors.dark_gray,fontFamily : Fonts.adobe_clean}}>Expenses</Text>
                    }
                  </BorderlessButton>
                </View>
                <View name="Contacts" style={styles.tab_item}>
                  <BorderlessButton style={styles.tabBarIcon}>
                    <EvilIcons name="user" size={30 * metrics} style={this.state.page == 'Contacts' && {color : Colors.red_color}}></EvilIcons>
                    {
                      this.state.page == 'Contacts' ?
                      <Text style={{color : Colors.red_color,fontFamily : Fonts.adobe_clean}}>Contacts</Text>
                      :
                      <Text style={{color : Colors.dark_gray,fontFamily : Fonts.adobe_clean}}>Contacts</Text>
                    }
                  </BorderlessButton>
                </View>
                <View name="More" style={styles.tab_item}>
                  <BorderlessButton style={styles.tabBarIcon}>
                    <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={25 * metrics} style={this.state.page == 'More' && {color : Colors.red_color}}></MaterialCommunityIcons>
                    {
                      this.state.page == 'More' ?
                      <Text style={{color : Colors.red_color,fontFamily : Fonts.adobe_clean,}}>Bills</Text>
                      :
                      <Text style={{color : Colors.dark_gray,fontFamily : Fonts.adobe_clean}}>Bills</Text>
                    }
                  </BorderlessButton>
                </View>
            </Tabs>
            
            }
            </View>
        }
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
const drawerStyles = {
  drawer: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 50},
  main: {paddingLeft: 3,},
}

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
  },
  tab_body : {
    backgroundColor : 'white',
    height : 60 * metrics,
    elevation : Platform.OS == 'android'  ? 10 : 0.5,
  },
  tabBarIcon : {
    width : '100%',
    height : '90%',
    flexDirection : 'column',
    justifyContent : 'center',
    alignSelf : 'center',
    alignItems : 'center'
  },
});
