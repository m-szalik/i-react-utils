import React from 'react';
import ReactDOM from 'react-dom';
import List from '../src/List';
import AjaxList from '../src/AjaxList';
import LazyLoad from '../src/LazyLoad';
import * as fw from '../src/FormWizard';
import GlobalMessage from '../src/GlobalMessage';
import axios from 'axios';

class LazyLoadContentComponent extends React.Component {
    render() {
        return (<div>
            <code>{this.props.data.message}</code>
            {this.props.children}
        </div>);
    }
}

class FormWizardInputWrapper extends React.Component {
    render() {
        return (<div style={{border:"solid 1px gray", margin:"4px"}}>
                <ul>
                    <li>Type: {this.props.type}</li>
                    <li>Label: {this.props.label}</li>
                    <li>Required: {this.props.required ? 'YES' : 'NO'}</li>
                </ul>
                {this.props.children}
                {this.props.error != null ? (<span className="help-block">{this.props.error}</span>) : null}
            </div>);
    }
}



class ExamplePage extends React.Component {
    static contextTypes = {
        messenger : React.PropTypes.object
    };

    constructor(props) {
        super();
        this.state = {listData : ['orange', 'blue', 'brown', 'red', 'yellow'], textFieldRequired : false};
        this.addPurpleHandler = this.addPurpleHandler.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
    }

    addPurpleHandler() {
        console.debug("add purple row");
        let list = this.state.listData.slice();
        list.push('purple');
        this.setState({listData:list});
    }

    submitCallback(event, form) {
        this.context.messenger.clear();
        this.context.messenger.success(JSON.stringify(form.data()));
    }

    render() {
        return (<div className="container">
            <a href="https://github.com/m-szalik/i-react-utils/blob/master/README.md">Project's home page on GitHub</a>
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
                <h2>AjaxList</h2>
                <h3>Response format:</h3>
                <pre>{JSON.stringify( {"items" : ["Item 20 (0)","Item 21 (1)"], "paging":{ "page":3, "count":10, "total":22 }} )}</pre>
                <code>Param <strong>page</strong> starts from <strong>1</strong></code>
                <h3>Result:</h3>
                <AjaxList
                    renderRow={function(item,index,reactRowKey) {
                        return (<tr key={reactRowKey}><td>{index}</td><td>{JSON.stringify(item)}</td></tr>);
                    }}
                    fetchDataCallback={function(pageNum) {
                        return axios.get('/api/ajax-list?page=' + pageNum);
                    }}
                >
                    <thead><tr><th>index</th><th>item</th></tr></thead>
                    <tfoot><tr><th colSpan="2">End of table</th></tr></tfoot>
                </AjaxList>
            </div>
            <hr/>


            <div>
                <h2>LazyLoad</h2>
                <LazyLoad component={LazyLoadContentComponent}
                    ajax={function() {
                        return axios.get('/api/lazy-load');
                    }}
                >
                    <span>Cool :)</span>
                </LazyLoad>
            </div>
            <hr/>


            <div>
                <h2>FormWizard</h2>
                <fw.Form onSubmit={this.submitCallback} wrapper={FormWizardInputWrapper} instantValidation={true}>
                    <div>
                        <fw.Input type="checkbox" name="mainSection.enabled" inputId="inp-chb" label="Input one"/>
                    </div>
                    <div>
                        <fw.Input type="text" name="mainSection.text" inputId="inp-txt" label="Input text" defaultValue="default" required={this.state.textFieldRequired}/>
                        <span className="btn btn-default" onClick={() => { this.setState({textFieldRequired:!this.state.textFieldRequired}) }}>Toggle required</span>
                    </div>
                    <div>
                        <input type="text" name="pure" defaultValue="pureDefault" />
                    </div>
                    <input type="submit" className="btn-primary" />
                </fw.Form>
            </div>
            <hr/>

        </div>);
    }
}

ReactDOM.render(<GlobalMessage><ExamplePage/></GlobalMessage>, document.getElementById('app-container'));