import React, { PropTypes } from 'react';
import {isEquivalent, shallowCopy} from './utils';
import {devOnly} from './utils-internal';

export class ListPagination extends React.Component {
    static propTypes = {
        onPageChanged: React.PropTypes.func.isRequired,
        id : PropTypes.string.isRequired,
        total : PropTypes.number.isRequired,
        count : PropTypes.number.isRequired,
        page : PropTypes.number.isRequired
    };

    constructor(props) {
        super();
        this.props = props;
        this._handlePageChange = this._handlePageChange.bind(this);
    }

    _handlePageChange(page) {
        this.props.onPageChanged(page);
    }

    render() {
        const self = this;
        return (<div className="row pagination-container">
            {(() => {
                if (self.props.page != undefined) {
                    let pages = Math.ceil(self.props.total / self.props.count);
                    if (pages > 1) {
                        return (
                            <nav className="list-pagination" id={`${self.props.id}-pagination`}>
                                <ul className="pagination">
                                    {(() => {
                                        let pg = [];
                                        pg.push((<li key="pg-prev" className={self.props.page < 2 ? "disabled" : ""}><a onClick={function() { if (self.props.page > 1) { self._handlePageChange(self.props.page -1) }}} aria-label="Previous"><span>&laquo;</span></a></li>));
                                        for (let p = 1; p <= pages; p++) {
                                            pg.push((<li key={`pg-pg-${p}`} className={p == self.props.page ? "active" : ""}><a onClick={function() { if (p != self.props.page) { self._handlePageChange(p) }}}>{p}</a></li>));
                                        }
                                        pg.push((<li className={pages <= self.props.page ? "disabled" : ""} key="pg-next"><a onClick={function() { if (pages > self.props.page) { self._handlePageChange(self.props.page +1) }}}><span>&raquo;</span></a></li>));
                                        return pg;
                                    })()}
                                </ul>
                            </nav>
                        );
                    } else {
                        return null;
                    }
                }
            })()}
        </div>);
    }
}
export class SimpleListTable extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.any, // object with property items or an array
        renderRow: React.PropTypes.func.isRequired,
        indexOffset : React.PropTypes.number
    };

    static defaultProps = {
        indexOffset : 0
    };

    constructor(props) {
        super();
        this.state = {data : props.data};
        this.id = props.id;
        if (props.renderRow == undefined) {
            throw 'Missing function renderRow(item,index,key):component';
        }
        this.parts = SimpleListTable.parseListChildren(props.children);
        this.props = props;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.children == undefined || nextProps.children != this.props.children) {
            this.parts = SimpleListTable.parseListChildren(nextProps.children);
        }
        if(nextProps.data != this.props.data) {
            this.setState({data : nextProps.data});
        }
    }

    render() {
        const {data} = this.state;
        return (
            <table className={`table ${this.props.className}`} style={{width:'100%'}} id={this.id + "-table"}>
                {this.parts.thead}
                {(() => {
                    if (data) {
                        const rows = [];
                        data.forEach((item, index) => {
                            const realIndex = this.props.indexOffset + index;
                            let key = this.id + '-row-' + realIndex;
                            let newRow = this.props.renderRow(item, realIndex, key);
                            if (newRow != undefined && newRow != null) {
                                if (Array.isArray(newRow)) {
                                    throw 'Can return single &lt;tr&gt; component only';
                                } else {
                                    rows.push(newRow);
                                }
                            }
                        });
                        return (<tbody>{rows}</tbody>);
                    } else {
                        return null;
                    }
                })()}
                {this.parts.tfoot}
            </table>
        );
    }

    static parseListChildren(childrenIn) {
        const out = { tfoot: null, thead: null };
        const children = Array.isArray(childrenIn) ? childrenIn : [childrenIn];
        for (let i = 0; i < children.length; i++) {
            if (children[i] == null || children[i] == undefined) {
                continue;
            }
            switch (children[i].type) {
                case 'tfoot':
                    out.tfoot = children[i];
                    break;
                case 'thead':
                    out.thead = children[i];
                    break;
                default:
                    devOnly(() => { console.error('List can contain thead or tfoot components only, but', children[i], 'found in list'); });
            }
        }
        return out;
    }
}

function copyProps(props) {
    return shallowCopy({}, props, ['data', 'count', 'renderRow', 'showPagination', 'onPageChanged', 'prepareDataForPage']);
}


export class List extends React.Component {
    static propTypes = {
        id : React.PropTypes.string, // list id
        data : React.PropTypes.array, // data array (all available data)
        renderRow : React.PropTypes.func.isRequired, // function(item,index,key) : tr element
        count : React.PropTypes.number.isRequired, // number of items per page
        onPageChanged : React.PropTypes.func,  // callback function(page) : void (page is 1-indexed)
        prepareDataForPage : React.PropTypes.func, // function(data,page,count) : array of data (page is 1-indexed)
        showPagination : React.PropTypes.bool // default false
    };

    static defaultProps = {
        showPagination : true,
        id : "list-" + (Math.random() * 10000),
        prepareDataForPage : function(data,page,count) {
            return data.slice((page -1)*count, page*count);
        }
    };

    constructor(props) {
        super();
        this.state = { };
        this.page = 1;
        if (props.renderRow == undefined) {
            throw new Error('Missing function renderRow(item,index,key):component');
        }
        this._handlePageChange = this._handlePageChange.bind(this);
        this._data = this._data.bind(this);
        this.props = props;
        this.htmlProps = copyProps(props);
    }

    componentWillReceiveProps(nextProps) {
        const updateData = ! isEquivalent(this.props.data, nextProps.data);
        this.props = nextProps;
        this.htmlProps = copyProps(nextProps);
        if (updateData) {
            this._data(nextProps.data, true);
        }
    }

    componentDidMount() {
        this._data(this.props.data, true);
    }

    _data(data, resetPage) {
        if (resetPage) {
            this.page = 1;
        }
        if (data == null || data == undefined) {
            data = [];
        }
        const update = {
            items: this.props.prepareDataForPage(data, this.page, this.props.count),
            total: data.length,
            page:  this.page
        };
        this.setState(update);
    }

    _handlePageChange(pg) {
        if (this.props.onPageChanged != undefined) {
            this.props.onPageChanged(pg);
        }
        this.page = pg;
        this._data(this.props.data, false);
    }

    render() {
        const {items, total, page} = this.state;
        return (
            <div {...this.htmlProps} key={this.id}>
                <SimpleListTable id={this.props.id} renderRow={this.props.renderRow} data={items} indexOffset={(page -1) * this.props.count}>
                    {this.props.children}
                </SimpleListTable>
                {(() => {
                    if (items && this.props.showPagination) {
                        return (<ListPagination onPageChanged={this._handlePageChange} id={this.props.id} total={total} count={this.props.count} page={page}/>);
                    } else {
                        return null;
                    }
                })()}
            </div>
        );
    }
}
