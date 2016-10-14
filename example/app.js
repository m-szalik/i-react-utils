import React from 'react';
import ReactDOM from 'react-dom';
import List from '../src/List';
import * as fw from '../src/FormWizard';
import GlobalMessage from '../src/GlobalMessage';


class FormWizardInputWrapper extends React.Component {
    render() {
        return (<div>{this.props.type} <strong>{this.props.label}</strong> {this.props.children}</div>);
    }
}



class ExamplePage extends React.Component {
    static contextTypes = {
        messenger : React.PropTypes.object
    };

    constructor(props) {
        super();
        this.state = {listData : ['orange', 'blue', 'brown', 'red', 'yellow']};
        this.addPurpleHandler = this.addPurpleHandler.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
    }

    addPurpleHandler() {
        console.debug("addP");
        let list = this.state.listData;
        list.push('purple');
        this.setState({listData:list});
    }

    submitCallback(event, form) {
        this.context.messenger.clear();
        this.context.messenger.success(JSON.stringify(form.data()));
    }

    render() {
        return (<div>
            <h1>Examples</h1>
            <div>
                <h2>List</h2>
                <button onClick={this.addPurpleHandler}>Add purple</button>
                <List ref="list" data={this.state.listData} renderRow={function(item,index,reactRowKey) {
                    return (<tr key={reactRowKey}><td style={{"background":item}}>{item}</td></tr>);
                }}>
                    <thead><tr><th>colored rows</th></tr></thead>
                    <tfoot><tr><th>End of table</th></tr></tfoot>
                </List>
            </div>
            <hr/>
            <div>
                <h2>FormWizard</h2>
                <fw.Form onSubmit={this.submitCallback} wrapper={FormWizardInputWrapper}>
                    <fw.Input type="checkbox" name="mainSection.enabled" inputId="inp-chb" label="Input one"/>
                    <fw.Input type="text" name="mainSection.text" inputId="inp-txt" label="Input text" defaultValue="default"/>
                    <input type="text" name="pure" defaultValue="pureDefault"/>
                    <input type="submit" className="btn-primary" />
                </fw.Form>
            </div>
            <hr/>
        </div>);
    }
}

ReactDOM.render(<GlobalMessage><ExamplePage/></GlobalMessage>, document.getElementById('app-container'));