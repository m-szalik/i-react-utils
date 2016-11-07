import React, {PropTypes} from 'react';


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
            console.log("GlobalMessage: New message on an unmounted GlobalMessage Component:", "type=" + type, "message=" + msg);
        }
        this.messages = newArray;
        return msgObj;
    }

    close(message) {
        let index = this.state.messages.indexOf(message);
        if (index > -1) {
            let newArray = this.state.messages.slice(0);
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

    render() {
        const messages = [];
        let id = 0;
        this.state.messages.forEach((m) => {
            let key='globalMessage-' + id;
            messages.push((<div key={key} className={`alert alert-${m.type}`} role="alert" dangerouslySetInnerHTML={{__html: m.msg}}/>));
            id++;
        });

        return (
            <div {...this.props}>
                <div className="globalMessages">{messages}</div>
                {this.props.children}
            </div>
        );
    }
}

