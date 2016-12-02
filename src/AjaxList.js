import React, { PropTypes } from 'react';
import List from './List';
import {shallowCopy} from './utils';

function copyProps(props) {
    return shallowCopy({}, props, ['fetchDataCallback', 'onFetch', 'onSuccess', 'onError', 'renderRow', 'showPagination']);
}

export default class AjaxList extends List {
    static propTypes = {
        fetchDataCallback : React.PropTypes.func.isRequired, // func that returns ajax promise.
        onFetch : React.PropTypes.func, // when data loading starts
        onError : React.PropTypes.func, // when data loading finishes with error
        onSuccess : React.PropTypes.func, // when data loading finishes with success
        renderRow : React.PropTypes.func.isRequired,
        showPagination : React.PropTypes.bool // default true
    };

    static defaultProps = {
        showPagination : true,
        className : "ajaxList row"
    };

    constructor(props) {
        super(props);
        this._fetchData = this._fetchData.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this.updateAndResetPage = this.updateAndResetPage.bind(this);
        this.update = this.update.bind(this);
        this.currentPage = 1;
        this.state = { items : null, error:false };
        this.htmlProps = copyProps(props);
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
            this.setState({items: null, error:false});
        } else {
            this.setState({error:false});
        }
        let promise = this.props.fetchDataCallback(page);
        if (promise) {
            promise.then((resp) => {
                console.debug('My promise resp', resp);
                if (Array.isArray(resp.data)) {
                    this.pagesCount = page + 1;
                }
                this.data(resp.data);
                if (this.props.onSuccess) {
                    this.props.onSuccess({ page : page, data : resp.data });
                }
            },
            (err) => {
                if (this.props.onError) {
                    console.log("AjaxList: fetch rejected: ", err);
                    this.props.onError(err);
                } else {
                    console.error("AjaxList: fetch rejected: ", err);
                }
                this.setState({error: true});
            });
            console.debug('My promise ', promise);
        } else {
            this.data({"items":[],"paging":{"total":0,"page":1,"count":1}}); // empty list
        }
    }

    componentDidMount() {
        this._fetchData(1, false);
    }

    _handlePageChange(pg) {
        super._handlePageChange(pg);
        this._fetchData(pg, true);
    }

    updateAndResetPage() {
        this._fetchData(1, true);
    }

    update() {
        this._fetchData(this.currentPage, false);
    }

    render() {
        if (this.state.items == null) {
            if (! this.state.error) {
                return (<div {...this.htmlProps}><div className="center-block ajaxList-loader"></div></div>);
            } else {
                return (<div {...this.htmlProps}>An error occurred.</div>);
            }
        } else {
            return super.render();
        }
    }
}
