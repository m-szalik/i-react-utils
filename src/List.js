import React, { PropTypes } from 'react';
import {SimpleListTable, ListPagination} from './ListComponents';
import {isEquivalent, shallowCopyExcept} from './utils';
import {devOnly, _buildElement} from './utils-internal';


function copyProps(props) {
    return shallowCopyExcept({}, props, ['data', 'count', 'renderRow', 'showPagination', 'onPageChanged', 'prepareDataForPage', 'noDataComponent', 'headerAlwaysOn']);
}


export default class List extends React.Component {
    static propTypes = {
        id : React.PropTypes.string, // list id
        data : React.PropTypes.array, // data array (all available data)
        renderRow : React.PropTypes.func.isRequired, // function(item,index,key) : tr element
        count : React.PropTypes.number, // number of items per page
        onPageChanged : React.PropTypes.func,  // callback function(page) : void (page is 1-indexed)
        prepareDataForPage : React.PropTypes.func, // function(data,page,count) : array of data (page is 1-indexed)
        showPagination : React.PropTypes.bool, // Default: true
        headerAlwaysOn : React.PropTypes.bool,  // if show header and footer when no data is available. Default: true
        noDataComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ])  // component function or element
    };

    static defaultProps = {
        showPagination : true,
        headerAlwaysOn : true,
        count : 10,
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
        this.noDataElement = _buildElement(props.noDataComponent, this.htmlProps, []);
    }

    componentWillReceiveProps(nextProps) {
        const updateData = ! isEquivalent(this.props.data, nextProps.data);
        this.htmlProps = copyProps(nextProps);
        if (this.props.noDataComponent != nextProps.noDataComponent) {
            this.noDataElement = _buildElement(nextProps.noDataComponent, this.htmlProps, []);
        }
        this.props = nextProps;
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
                <SimpleListTable id={this.props.id} renderRow={this.props.renderRow} data={items} indexOffset={(page -1) * this.props.count}
                                 headerAlwaysOn={this.props.headerAlwaysOn} noDataElement={this.noDataElement}>
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
