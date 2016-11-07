import React, { PropTypes } from 'react';
import List from './List';

export default class AjaxList extends List {
    static propTypes = {
        fetchDataCallback : React.PropTypes.func.isRequired,
        onError : React.PropTypes.func,
        renderRow : React.PropTypes.func.isRequired,
        showPagination : React.PropTypes.bool // default true
    };

    static defaultProps = {
        showPagination : true
    };

    constructor(props) {
        super(props);
        this._fetchData = this._fetchData.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this.updateAndResetPage = this.updateAndResetPage.bind(this);
        this.update = this.update.bind(this);
        this.currentPage = 1;
        this.state = { items : null, error:false };
    }

    _checkData(data) {
        if (Array.isArray(data) && this.props.showPagination && this.pagesCount == undefined) {
            throw new Error('Got array of data and pagination was required but pagesCount is not set.');
        }
    }

    _fetchData(page, withClear) {
        this.currentPage = page;
        if (withClear) {
            this.setState({items: null, error:false});
        } else {
            this.setState({error:false});
        }
        let promise = this.props.fetchDataCallback(page);
        if (promise) {
            promise.then((resp) => {
                    if (Array.isArray(resp.data)) {
                        this.pagesCount = page + 1;
                    }
                    this.data(resp.data);
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
                return (<div className="row"><div className="center-block ajaxList-loader"></div></div>);
            } else {
                return (<div className="row">An error occurred.</div>);
            }
        } else {
            return super.render();
        }
    }
}
