import React, { PropTypes } from 'react';


export class List extends React.Component {
    static propTypes = {
        data : React.PropTypes.any.isRequired, // object with property items or an array
        renderRow : React.PropTypes.func.isRequired
    };

    constructor(props) {
        super();
        this.state = { };
        this.componentWillReceiveProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        let id = props.id;
        if (id == undefined) {
            id = "list-" + (Math.random() * 10000);
        }
        this.id = id;
        this._handlePageChange = this._handlePageChange.bind(this);
        this.data = this.data.bind(this);
        if (this.props.renderRow == undefined) {
            throw 'Missing function renderRow(item,index,key):component';
        }
        this.data(nextProps.data);
    }

    componentDidMount() {
        if (this.props.data != undefined) {
            this.data(this.props.data);
        }
    }

    data(data) {
        if (data == null || data == undefined) {
            return;
        }
        let update;
        if (Array.isArray(data)) {
            update = { items: data };
        } else {
            update = {
                items: data.items,
                count: data.paging.count,
                total: data.paging.total,
                page:  data.paging.page
            };
        }
        this.setState(update);
    }

    _handlePageChange(pg) {
        if (this.props.onPageChanged != undefined) {
            this.onPageChanged(pg);
        }
    }

    render() {
        const self = this;
        if (this.state.items == undefined) {
            return null;
        }
        return (
            <div id={this.id} key={this.name}>
                <table className={`table ${this.props.className}`} style={{width:'100%'}} id={this.id + '-table'}>
                    {(() => {
                        if (this.props.children != null) {
                            return (<thead>{this.props.children}</thead>);
                        }
                    })()}
                    {(() => {
                        const rows = [];
                        this.state.items.forEach((item, index) => {
                            let key = self.id + '-row-' + index;
                            let newRow = self.props.renderRow(item, index, key);
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
                        if (this.state.page != undefined) {
                            let pages = Math.ceil(self.state.total / self.state.count);
                            if (pages > 1) {
                                return (
                                    <nav aria-label="Page navigation" className="list-pagination" id={`${this.id}-pagination`}>
                                        <ul className="pagination">
                                            {(() => {
                                                let pg = [];
                                                pg.push((<li key="pg-prev" className={self.state.page < 2 ? "disabled" : ""}><a
                                                    onClick={function() { if (self.state.page > 1) { self._handlePageChange(self.state.page -1) }}}
                                                    aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>));
                                                for (let p = 1; p <= pages; p++) {
                                                    pg.push((<li key={`pg-pg-${p}`} className={p == self.state.page ? "active" : ""}><a
                                                        onClick={function() { if (p != self.state.page) { self._handlePageChange(p) }}}>{p}</a></li>));
                                                }
                                                pg.push((<li className={pages <= self.state.page ? "disabled" : ""} key="pg-next"><a
                                                    onClick={function() { if (pages > self.state.page) { self._handlePageChange(self.state.page +1) }}}
                                                    aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>));
                                                return pg;
                                            })()}
                                        </ul>
                                    </nav>
                                );
                            }
                        }
                    })()}
                </div>
            </div>
        );
    }
}
