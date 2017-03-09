/** Sub-components for: List and AjaxList */
import React, { PropTypes } from 'react';
import {devOnly, isEquivalent, shallowCopyExcept} from './utils';
import {_buildElement} from './utils-internal';

export class ListPagination extends React.Component {
    static propTypes = {
        onPageChanged: React.PropTypes.func.isRequired,
        id : PropTypes.string.isRequired,
        total : PropTypes.number.isRequired,
        count : PropTypes.number.isRequired,
        page : PropTypes.number.isRequired,
        maxPagesDisplayed : PropTypes.number
    };

    static defaultProps = {
        maxPagesDisplayed: 15
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
        if (self.props.page != undefined) {
            let pages = Math.ceil(self.props.total / self.props.count);
            if (pages > 1) {
                return (
                    <nav className={`list-pagination ${this.props.className ? this.props.className : ''}`} id={`${self.props.id}-pagination`}>
                        <ul className="pagination">
                            {(() => {
                                const current = self.props.page;
                                let pg = [], skipped = false;
                                pg.push((<li key="pg-prev" className={self.props.page < 2 ? "disabled" : ""} onClick={function() { if (self.props.page > 1) { self._handlePageChange(self.props.page -1) }}}><span>&laquo;</span></li>));
                                for (let p = 1; p <= pages; p++) {
                                    if (pages < self.props.maxPagesDisplayed || p < 2 || p > pages-2 || Math.abs(p-current) < 2) {
                                        skipped = false;
                                        pg.push((<li key={`pg-pg-${p}`} className={p == self.props.page ? "active" : ""}
                                                     onClick={function() { if (p != current) { self._handlePageChange(p) }}}><span>{p}</span></li>));
                                    } else {
                                        if (! skipped) {
                                            skipped = true;
                                            pg.push((<li key={`pg-skp-${p}`} className="pg-skp disabled"><span>&hellip;</span></li>));
                                        }
                                    }
                                }
                                pg.push((<li className={pages <= self.props.page ? "disabled" : ""} key="pg-next" onClick={function() { if (pages > self.props.page) { self._handlePageChange(self.props.page +1) }}}><span>&raquo;</span></li>));
                                return pg;
                            })()}
                        </ul>
                    </nav>
                );
            }
        }
        return null;
    }
}


export class SimpleListTable extends React.Component {
    static propTypes = {
        id: React.PropTypes.string.isRequired,
        data: React.PropTypes.any, // object with property items or an array
        renderRow: React.PropTypes.func.isRequired,
        headerAlwaysOn: React.PropTypes.bool.isRequired,
        noDataElement : React.PropTypes.element, // react element
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
        const hasData = data && data.length > 0;
        const showHeaders = hasData || this.props.headerAlwaysOn;
        return (
            <table className={`table ${this.props.className ? this.props.className : ''}`} style={{width:'100%'}} id={this.id + "-table"}>
                {showHeaders ? this.parts.thead : null}
                {(() => {
                    if (hasData) {
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
                        if (this.props.noDataElement) {
                            return (<tbody><tr><td colSpan="100%">{this.props.noDataElement}</td></tr></tbody>);
                        } else {
                            return null;
                        }
                    }
                })()}
                {showHeaders ? this.parts.tfoot : null}
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
