import React, { PropTypes } from 'react';

export default class List extends React.Component {
    static propTypes = {
        data : React.PropTypes.any, // object with property items or an array
        renderRow : React.PropTypes.func.isRequired,
        onPageChanged : React.PropTypes.func,
        onDataChanged : React.PropTypes.func,
        showPagination : React.PropTypes.bool, // default true
        pagesCount : React.PropTypes.number // number of pages (have to be set in data is an array and pagination is used)
    };

    static defaultProps = {
        showPagination : true
    };

    constructor(props) {
        super();
        this._inUse = false;
        this._data = null;
        this.thead = null;
        this.tfoot = null;
        this.state = { };
        this.page = 0;
        this.componentWillReceiveProps(props);
        this._handlePageChange = this._handlePageChange.bind(this);
        this.data = this.data.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        let id = nextProps.id;
        if (id == undefined) {
            id = "list-" + (Math.random() * 10000);
        }
        this.id = id;
        if (this.props.renderRow == undefined) {
            throw 'Missing function renderRow(item,index,key):component';
        }
        if (nextProps.children != undefined) {
            const children = Array.isArray(nextProps.children) ? nextProps.children : [nextProps.children];
            for (let i = 0; i < children.length; i++) {
                if (children[i] == null || children[i] == undefined) {
                    continue;
                }
                switch (children[i].type) {
                    case 'tfoot':
                        this.tfoot = children[i];
                        break;
                    case 'thead':
                        this.thead = children[i];
                        break;
                    default:
                        console.error('List can contain thead or tfoot components only, but', children[i], 'found in list ' + id);
                        throw new Error('List can contain thead or tfoot components only.');
                }
            }
        }
        if (nextProps.data) {
            this.data(nextProps.data);
        }
    }

    componentDidMount() {
        if (this._data != null) {
            this.setState(this._data);
        }
    }

    componentWillUnmount() {
        this._inUse = false;
    }

    componentWillMount() {
        this._inUse = true;
    }

    data(data) {
        console.log('DataSet', data, typeof data);
        if (data == null || data == undefined) {
            return this.state;
        }
        let update;
        if (Array.isArray(data)) {
            update = {
                items: data,
                count: data.length,
                total: data.length * this.props.pagesCount,
                page:  this.page
            };
        } else {
            update = {
                items: data.items,
                count: data.paging.count,
                total: data.paging.total,
                page:  data.paging.page
            };
        }
        this._data = update;
        if (this._inUse) {
            this.setState(update);
        }
        if (this.props.onDataChanged != undefined) {
            this.props.onDataChanged(update);
        }
    }

    _handlePageChange(pg) {
        if (this.props.onPageChanged != undefined) {
            this.props.onPageChanged(pg);
        }
        this.page = pg;
    }

    _renderPart(component) {
        if (component != undefined && component != null) {
            return component;
        } else {
            return null;
        }
    }

    render() {
        const self = this;
        if (this.state.items == undefined) {
            return null;
        }
        return (
            <div id={this.name} key={this.name}>
                <table className={`table ${this.props.className}`} style={{width:'100%'}} id={this.name + "-table"}>
                    {(() => { return this._renderPart(this.thead) })()}
                    {(() => {
                        const rows = [];
                        this.state.items.forEach((item, index) => {
                            let key = self.id + '-row-' + index;
                            let newRow = self.props.renderRow(item, index, key);
                            if (newRow != undefined && newRow != null) {
                                if (Array.isArray(newRow)) {
                                    throw 'Can return single &lt;tr&gt; component only';
                                } else {
                                    rows.push(newRow);
                                }
                            }
                        });
                        return (<tbody>{rows}</tbody>);
                    })()}
                    {(() => { return this._renderPart(this.tfoot) })()}
                </table>
                {(() => {
                    if (this.props.showPagination) {
                        return (<div className="row pagination-container">
                            {(() => {
                                if (this.state.page != undefined) {
                                    let pages = Math.ceil(self.state.total / self.state.count);
                                    if (pages > 1) {
                                        return (
                                            <nav aria-label="Page navigation" className="list-pagination" id={`${this.id}-pagination`}>
                                                <ul className="pagination">
                                                    {(() => {
                                                        let pg = [];
                                                        pg.push((<li key="pg-prev" className={self.state.page < 2 ? "disabled" : ""}><a onClick={function() { if (self.state.page > 1) { self._handlePageChange(self.state.page -1) }}} aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>));
                                                        for (let p = 1; p <= pages; p++) {
                                                            pg.push((<li key={`pg-pg-${p}`} className={p == self.state.page ? "active" : ""}><a onClick={function() { if (p != self.state.page) { self._handlePageChange(p) }}}>{p}</a></li>));
                                                        }
                                                        pg.push((<li className={pages <= self.state.page ? "disabled" : ""} key="pg-next"><a onClick={function() { if (pages > self.state.page) { self._handlePageChange(self.state.page +1) }}} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>));
                                                        return pg;
                                                    })()}
                                                </ul>
                                            </nav>
                                        );
                                    }
                                }
                            })()}
                        </div>);
                    } else {
                        return null;
                    }
                })()}
            </div>
        );
    }
}
