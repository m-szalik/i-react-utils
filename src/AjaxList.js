import React, { PropTypes } from 'react';
import List from './List';

export default class AjaxList extends List {
    static propTypes = {
        fetchDataCallback : React.PropTypes.func.isRequired,
        onError : React.PropTypes.func,
        renderRow : React.PropTypes.func.isRequired
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

    _fetchData(page, withClear) {
        this.currentPage = page;
        if (withClear) {
            this.setState({items: null, error:false});
        } else {
            this.setState({error:false});
        }
        let promise = this.props.fetchDataCallback(page);
        promise.then((resp) => {
                            this.data(resp.data);
                        },
                        (err) => {
                            if (this.props.onError) {
                                console.log("AjaxList: fetch rejected: ", err);
                                this.props.onError(err);
                            } else {
                                console.error("AjaxList: fetch rejected: ", err);
                            }
                            this.setState({error:true});
                        });
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
                return (<div className="row"><img className="center-block ajax-loader" alt="..."/></div>);
            }
        } else {
            return super.render();
        }
    }
}
