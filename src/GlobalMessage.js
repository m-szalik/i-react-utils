import React, {PropTypes} from 'react';
import {devOnly} from './utils';

/**
 */
export default class GlobalMessage extends React.Component {

    static childContextTypes = {
        messenger : PropTypes.object
    };

    constructor(props) {
        super();
        this.props = props;
        this.messages = [];
        this.state = { messages : this.messages };
        this.message = this.message.bind(this);
        this.clear = this.clear.bind(this);
        this._inUse = false;
    }

    componentWillMount() {
        this._inUse = true;
        this.setState({messages: this.messages});
    }

    componentWillUnmount() {
        this._inUse = false;
    }

    message(type, msg) {
        const messenger = this;
        let msgObj = {
            type : type,
            msg : msg,
            close() {
                messenger.close(msgObj);
            },
            timeout(timeout) {
                if (timeout > 0) {
                    setTimeout(function() { messenger.close(msgObj);}, timeout);
                }
            }
        };
        let newArray = this.messages.slice(0);
        newArray.push(msgObj);
        if (this._inUse) {
            this.setState({messages: newArray});
        } else {
            devOnly(() => {console.log("GlobalMessage: New message on an unmounted GlobalMessage Component:", "type=" + type, "message=" + msg);});
        }
        this.messages = newArray;
        return msgObj;
    }

    close(message) {
        let index = this.messages.indexOf(message);
        if (index > -1) {
            let newArray = this.messages.slice(0);
            newArray.splice(index, 1);
            if (this._inUse) {
                this.setState({messages: newArray});
            }
            this.messages = newArray;
        }
    }

    clear() {
        let array = [];
        if (this._inUse) {
            this.setState({messages: array});
        }
        this.messages = array;
    }

    getChildContext() {
        const _messenger = this;
        return {
            messenger : {
                success(msg) {
                    return _messenger.message('success', msg);
                },
                info(msg) {
                    return _messenger.message('info', msg);
                },
                warning(msg) {
                    return _messenger.message('warning', msg);
                },
                danger(msg) {
                    return _messenger.message('danger', msg);
                },
                warn(msg) {
                    return _messenger.message('warning', msg);
                },
                error(msg) {
                    return _messenger.message('danger', msg);
                },
                clear() {
                    _messenger.clear();
                },
                close(message) {
                    _messenger.close(message);
                }
            }
        };
    }

    generateHtml(_messages, _alertType){
        const key = 'globalMessage-typeContainer-' + _alertType;
        return (<div key={key} className={`alert-container custom-alert-${_alertType}`}><div className={`container`}><span className="ico"></span>{_messages}</div></div>)
    }

    render() {
        const messages = [], rdyToRenderMsgs = [];
        let id = 0;
        this.state.messages.forEach((m) => {
            let key='globalMessage-' + id;
            messages[m.type] = messages[m.type] ? messages[m.type] : [];
            messages[m.type].push((<div key={key} className={`alert alert-${m.type}`} role="alert" dangerouslySetInnerHTML={{__html: m.msg}}/>));
            id++;
        });

        for (let key in messages) {
            rdyToRenderMsgs.push(this.generateHtml(messages[key], key));
        }

        return (
            <div {...this.props}>
                <div className="globalMessages">{rdyToRenderMsgs}</div>
                {this.props.children}
            </div>
        );
    }
}

