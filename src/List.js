import React, { PropTypes } from 'react';


export class ListHeader extends React.Component {
    render() {
        return (<tr key="header">{this.props.children}</tr>);
    }
}


export class List extends React.Component {
    static propTypes = {
        data : React.PropTypes.object,
        showAmount : React.PropTypes.bool, // default false
        renderRow : React.PropTypes.func.isRequired
    };

    constructor(props) {
        super();
        this.props = props;
        this.state = {  };
        this.name = "list-" + (Math.random() * 1000);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.data = this.data.bind(this);
        if (this.props.renderRow == undefined) {
            throw 'Missing function renderRow(item,index,key):component';
        }
    }

    componentDidMount() {
        if (this.props.data != undefined) {
            this.data(this.props.data);
        }
    }

    data(data) {
        let update = {
            items : data.items,
            count : data.paging.count,
            total : data.paging.total,
            page : data.paging.page
        };
        this.setState(update);
    }

    handlePageChange(pg) {
        if (this.props.onPageChanged != undefined) {
            this.onPageChanged(pg);
        }
    }

    render() {
        if (this.state.items == undefined) {
            return null;
        }
        let pages = Math.ceil(this.state.total / this.state.count);
        const comp = this;

        return (
            <div id={this.name} key={this.name}>
                <table className={`table ${this.props.className}`} style={{width:'100%'}} id={this.name + "-table"}>
                    {(() => {
                        if (this.props.children != null) {
                            return (<thead>{this.props.children}</thead>);
                        }
                    })()}
                    {(() => {
                        const rows = [];
                        this.state.items.forEach((item, index) => {
                            let key = comp.name + '-row-' + index;
                            let newRow = this.props.renderRow(item, index, key);
                            if (newRow != undefined && newRow != null) {
                                if (Array.isArray(newRow)) {
                                    throw 'Can return single <tr> component only';
                                } else {
                                    rows.push(newRow);
                                }
                            }
                        });
                        return (<tbody>{rows}</tbody>);
                    })()}
                </table>
                <div className="row pagination-container">
                    {(() => {
                        if (pages > 1) {
                            return (
                                <nav aria-label="Page navigation" className="col-xs-10 col-xs-offset-1">
                                    <ul className="pagination">
                                        {(() => {
                                            let pg = [];
                                            pg.push((<li key="pg-prev" className={comp.state.page < 2 ? "disabled" : ""}><a onClick={function() { if (comp.state.page > 1) { comp.handlePageChange(comp.state.page -1) }}} aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>));
                                            for(let p=1; p<=pages; p++) {
                                                pg.push((<li key={`pg-pg-${p}`} className={p == comp.state.page ? "active" : ""}><a onClick={function() { if (p != comp.state.page) { comp.handlePageChange(p) }}}>{p}</a></li>));
                                            }
                                            pg.push((<li className={pages <= comp.state.page ? "disabled" : ""} key="pg-next"><a onClick={function() { if (pages > comp.state.page) { comp.handlePageChange(comp.state.page +1) }}} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>));
                                            return pg;
                                        })()}
                                    </ul>
                                </nav>
                            );
                        }
                    })()}
                    {(() => {
                        if (this.props.showAmount || false) {
                            return (<div className="col-xs-4 total-records"><span className="col-md-4 no-padding">Ilość: {this.state.total}</span></div>);
                        }
                    })()}
                </div>
            </div>
        );
    }
}
