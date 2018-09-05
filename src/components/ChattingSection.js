import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import ChatWindow from './ChatWindow';
import SendMessageForm from './SendMessageForm';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
    chatWindow : {
        background: '#eee',
        height: '515px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        padding: '12px'
    }
}

class ChattingSection extends Component {
    constructor (props) {
        super();

        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: []
        }

        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }

    componentDidMount () {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:4b9830d2-44d5-464b-8a84-225ed473b5ba',
            userId: this.props.username,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://localhost:3001/authenticate'
            })
        })

        chatManager
        .connect()
        .then(currentUser => {
          this.setState({ currentUser })
          return currentUser.subscribeToRoom({
            roomId: 15412514,
            messageLimit: 100,
            hooks: {
              onNewMessage: message => {
                this.setState({
                  messages: [...this.state.messages, message],
                })
              },
              onUserCameOnline: () => this.forceUpdate(),
              onUserWentOffline: () => this.forceUpdate(),
              onUserJoined: () => this.forceUpdate()
            }
          })
        })
        .then(currentRoom => {
          this.setState({ currentRoom })
          this.scrollToBottom()
        })
        .catch(error => console.error('error', error))
    }

    scrollToBottom() {
        
    }

    render() {
        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={8}>
                        <div  ref='scroll' style={styles.chatWindow}>
                            <ChatWindow
                                messages={this.state.messages}
                            />
                        </div>
                            <SendMessageForm 
                                onSubmit={this.sendMessage}
                            />

                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default ChattingSection;