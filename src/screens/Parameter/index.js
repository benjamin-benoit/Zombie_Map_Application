import React, { Component } from "react";
import { ScrollView, View, ActivityIndicator, StatusBar } from "react-native";
import {
    Container,
    Text,
    Content,
    Form,
    Button
} from "native-base";

export default class Parameter extends Component {

    static navigationOptions = {
        title: "Parameter"
    };

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentWillMount() {
        console.log({ user: this.props.navigation.getParam('user', 'defaultValue') })
        this.setState({ user: this.props.navigation.getParam('user', 'defaultValue') })
    }


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <Container>
                    <Content>
                        <Form>
                            <ScrollView style={{ padding: 20 }}>
                                <Button
                                    bordered
                                    block
                                    style={{
                                        marginTop: 10
                                    }}
                                    onPress={() => navigate("ChangePassword", {})}
                                >
                                    <Text>Change my password</Text>
                                </Button>
                            </ScrollView>
                        </Form>
                    </Content>
                </Container>
            </View>
        );
    }
}
