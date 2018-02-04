import React, { PropTypes } from 'react';
import {SimpleListTable, ListPagination} from './ListComponents';
import {devOnly, shallowCopyExcept} from './utils';
import {_buildElement} from './utils-internal';



function copyProps(props) {
    return shallowCopyExcept({}, props, ['dataTransform', 'fetchDataCallback', 'onFetch', 'onSuccess', 'onError', 'renderRow', 'showPagination', 'loadingComponent', 'errorComponent', 'noDataComponent', 'headerAlwaysOn']);
}

export default class AjaxList extends React.Component {

    static propTypes = {
        id : React.PropTypes.string, // list id
        fetchDataCallback : React.PropTypes.func.isRequired, // func that returns ajax promise.
        dataTransform : React.PropTypes.func, // func that transforms data, function(data, response) --> transformed data
        onFetch : React.PropTypes.func, // when data loading starts, function(event)
        onError : React.PropTypes.func, // when data loading finishes with error, function(event)
        onSuccess : React.PropTypes.func, // when data loading finishes with success, function(event)
        errorComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),          // component function or element
        loadingComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),        // component function or element
        noDataComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),         // component function or element
        renderRow : React.PropTypes.func.isRequired,
        showPagination : React.PropTypes.bool, // Default true
        headerAlwaysOn : React.PropTypes.bool  // if show header and footer when no data is available. Default: true
    };

    static defaultProps = {
        id : "ajaxList-" + Math.floor(Math.random() * 1000000).toString(22),
        showPagination : true,
        headerAlwaysOn : true,
        className : "ajaxList",
        errorComponent : (<div className="center-block ajaxList-error">An error occurred.</div>),
        loadingComponent : (<div className="center-block ajaxList-loader"></div>)
    };

    constructor(props) {
        super(props);
        this.props = props;
        this.id = props.id || 'ajaxList-' + (Math.random() * 10000);
        this._fetchData = this._fetchData.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this.updateAndResetPage = this.updateAndResetPage.bind(this);
        this.update = this.update.bind(this);
        this.mounted = false;
        this.currentPage = 1;
        this.htmlProps = copyProps(props);
        this.loadingElement = _buildElement(props.loadingComponent, this.htmlProps, []);
        this.noDataElement = _buildElement(props.noDataComponent, this.htmlProps, []);
        this.state = {"items":null,"paging":{"total":0,"page":1,"count":1}, error:null};
    }

    componentWillReceiveProps(newProps) {
        this.htmlProps = copyProps(newProps);
        if (this.props.loadingComponent != newProps.loadingComponent) {
            this.loadingElement = _buildElement(newProps.loadingComponent, this.htmlProps, []);
        }
        if (this.props.noDataComponent != newProps.noDataComponent) {
            this.noDataElement = _buildElement(newProps.noDataComponent, this.htmlProps, []);
        }
        this.props = newProps;
    }

    _checkData(data) {
        if (Array.isArray(data) && this.props.showPagination && this.pagesCount == undefined) {
            throw new Error('Got array of data and pagination was required but pagesCount is not set.');
        }
    }

    _fetchData(page, withClear) {
        this.currentPage = page;
        if (this.props.onFetch) {
            this.props.onFetch({ page : page });
        }
        if (withClear) {
            this.setState({items: null, error:null});
        } else {
            this.setState({error:null});
        }
        let promise = this.props.fetchDataCallback(page);
        if (promise) {
            promise.then((resp) => {
                let data = resp.data;
                if (this.props.dataTransform) {
                    data = this.props.dataTransform(data, resp);
                }
                if (this.mounted) {
                    if (Array.isArray(data)) {
                        let page = this.state.paging.page + 1;
                        const np = {... this.state.paging};
                        np.page = page;
                        this.setState({items: data, paging: np});
                    } else {
                        this.setState(data);
                    }
                }
                if (this.props.onSuccess) {
                    this.props.onSuccess({ page : page, data : data });
                }
            },
            (err) => {
                devOnly(() => {console.log("AjaxList: fetch rejected: ", err);});
                if (this.props.onError) {
                    this.props.onError(err);
                }
                if (this.mounted) {
                    const errCompProps = {...this.htmlProps, error: err};
                    const errorElement = _buildElement(this.props.errorComponent, errCompProps, []);
                    this.setState({error: errorElement});
                }
            });
        } else {
            this.setState({"items":[],"paging":{"total":0,"page":1,"count":1}}); // empty list
        }
    }

    componentWillMount() {
        this.mounted = true;
    }

    componentDidMount() {
        this._fetchData(1, false);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _handlePageChange(pg) {
        this._fetchData(pg, true);
    }

    updateAndResetPage() {
        this._fetchData(1, true);
    }

    update() {
        this._fetchData(this.currentPage, false);
    }

    render() {
        const {paging, items, error} = this.state;
        let noDataElem;
        if (error) {
            noDataElem = error;
        } else {
            noDataElem = items == null ? this.loadingElement : this.noDataElement;
        }
        const indexOffset = Math.max(0, paging.page -1) * paging.count;
        return (
            <div id={this.id} {...this.htmlProps}>
                <SimpleListTable className={this.props.className} id={this.id} renderRow={this.props.renderRow} data={items} headerAlwaysOn={this.props.headerAlwaysOn} noDataElement={noDataElem} indexOffset={indexOffset}>
                    {this.props.children}
                </SimpleListTable>
                {(() => {
                    if (this.props.showPagination) {
                        return (<ListPagination className={this.props.className} onPageChanged={this._handlePageChange} id={this.id} total={paging.total} count={paging.count} page={paging.page}/>);
                    } else {
                        return null;
                    }
                })()}
            </div>
        );
    }
}
