import React, { Component } from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator
} from 'react-native';
import { Container, Text, Button, Content, Form, Input, Item } from 'native-base';

export default class Register extends Component {

    render() {
        const {navigate} = this.props.navigation;
        return (
            <Container>
              <Content>
                  
                <Form>
            <ScrollView style={{padding: 20}}>
            <Item inlineLabel>
              <Input 
					ref={component => this._nickname = component}
					placeholder='Nickname' 
					onChangeText={(nickname) => this.setState({nickname})}
					autoFocus={true}
					onFocus={this.clearNickname}/>
            </Item>
            <Item inlineLabel>
              <Input 
					ref={component => this._nickname = component}
					placeholder='Email' 
					onChangeText={(nickname) => this.setState({nickname})}
					autoFocus={true}
					onFocus={this.clearNickname}/>
            </Item>
            <Item inlineLabel>
				<Input 
					ref={component => this._password = component}
					placeholder='Password' 
					onChangeText={(password) => this.setState({password})}
					secureTextEntry={true}
					onFocus={this.clearPassword}
					onSubmitEditing={this._userLogin}
				/>
                </Item>
            <Item inlineLabel>
				<Input 
					ref={component => this._password = component}
					placeholder='Password confirmation' 
					onChangeText={(password) => this.setState({password})}
					secureTextEntry={true}
					onFocus={this.clearPassword}
					onSubmitEditing={this._userLogin}
				/>
                </Item>
          <Button block style={{
                marginTop: 10
              }}
              onPress={() => navigate('Register', {})}>
            <Text>S'inscrire</Text>
          </Button>
            </ScrollView>
            </Form>
        </Content>
      </Container>
        )
    }
}