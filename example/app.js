import React from 'react';
import ReactDOM from 'react-dom';
import List from '../src/List';

class ExamplePage extends React.Component {

    constructor(props) {
        super();
        this.state = {listData : ['orange', 'blue', 'brown', 'red', 'yellow']};
        this.addPurpleHandler = this.addPurpleHandler.bind(this);
    }

    addPurpleHandler() {
        console.debug("addP");
        let list = this.state.listData;
        list.push('purple');
        this.setState({listData:list});
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
        </div>);
    }
}

ReactDOM.render(<ExamplePage/>, document.getElementById('app-container'));