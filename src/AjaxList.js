import React, { PropTypes } from 'react';
import List, {SimpleListTable, ListPagination} from './List';
import {shallowCopy} from './utils';
import {_buildElement, devOnly} from './utils-internal';



function copyProps(props) {
    return shallowCopy({}, props, ['fetchDataCallback', 'onFetch', 'onSuccess', 'onError', 'renderRow', 'showPagination', 'loadingComponent', 'errorComponent']);
}

export default class AjaxList extends React.Component {

    static propTypes = {
        id : React.PropTypes.string, // list id
        fetchDataCallback : React.PropTypes.func.isRequired, // func that returns ajax promise.
        onFetch : React.PropTypes.func, // when data loading starts, function(event)
        onError : React.PropTypes.func, // when data loading finishes with error, function(event)
        onSuccess : React.PropTypes.func, // when data loading finishes with success, function(event)
        errorComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),          // component function or element
        loadingComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),        // component function or element
        renderRow : React.PropTypes.func.isRequired,
        showPagination : React.PropTypes.bool // default true
    };

    static defaultProps = {
        id : "ajaxList-" + (Math.random() * 10000),
        showPagination : true,
        className : "ajaxList row",
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
        this.currentPage = 1;
        this.state = { items : null, error : null };
        this.htmlProps = copyProps(props);
        this.loadingElement = _buildElement(props.loadingComponent, {}, []);
        this.state = {"items":[],"paging":{"total":0,"page":1,"count":1}};
    }

    componentWillReceiveProps(newProps) {
        if (this.props.loadingComponent != newProps.loadingComponent) {
            this.loadingElement = _buildElement(newProps.loadingComponent, {}, []);
        }
        this.htmlProps = copyProps(newProps);
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
                if (Array.isArray(resp.data)) {
                    let page = this.state.paging.page +1;
                    const np = {... this.state.paging};
                    np.page = page;
                    this.setState({ items : resp.data, paging : np });
                } else {
                    this.setState(resp.data);
                }
                if (this.props.onSuccess) {
                    this.props.onSuccess({ page : page, data : resp.data });
                }
            },
            (err) => {
                devOnly(() => {console.log("AjaxList: fetch rejected: ", err);});
                if (this.props.onError) {
                    this.props.onError(err);
                }
                const errorElement = _buildElement(this.props.errorComponent, {error:err}, []);
                this.setState({error: errorElement});
            });
        } else {
            this.setState({"items":[],"paging":{"total":0,"page":1,"count":1}}); // empty list
        }
    }

    componentDidMount() {
        this._fetchData(1, false);
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
        if (items == null) {
            if (error == null) {
                return (<div id={this.id} {...this.htmlProps}>{this.loadingElement}</div>);
            } else {
                return (<div id={this.id} {...this.htmlProps}>{error}</div>);
            }
        } else {
            return (
                <div id={this.id} {...this.htmlProps}>
                    <SimpleListTable id={this.id} renderRow={this.props.renderRow} data={items}>
                        {this.props.children}
                    </SimpleListTable>
                    {(() => {
                        if (this.props.showPagination) {
                            return (<ListPagination onPageChanged={this._handlePageChange} id={this.id} total={paging.total} count={paging.count} page={paging.page}/>);
                        } else {
                            return null;
                        }
                    })()}
                </div>
            );
        }
    }
}
