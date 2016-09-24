import React, { PropTypes } from 'react';
import {List,ListHeader} from './List';
import {AjaxList} from './AjaxList';
import DatePicker from 'react-bootstrap-date-picker';
import api from './api';
import debounce from 'throttle-debounce/debounce';

export function filter(field, renderFunction) {
    let f = {
        value : "",
        field : field,
        render : renderFunction,
        apply : function(url) {
            return this.value.length > 0 ? url + '&' + this.field + '=' + this.value : url;
        },
        notify : undefined,
        changeHandler : function(event) {
            this.value = event.target.value;
            this.sendNotification();
        },
        resetHandler : function(event) {
            this.value = '';
            if (this.input) {
                this.input.value = '';
            }
            this.sendNotificationInternal();
        },
        sendNotification : debounce(1500, false, () => { f.sendNotificationInternal() }),
        sendNotificationInternal : function() {
            if (this.notify != undefined) {
                this.notify(this);
            }
        }
    };
    f.render = f.render.bind(f);
    f.changeHandler = f.changeHandler.bind(f);
    f.resetHandler = f.resetHandler.bind(f);
    f.sendNotificationInternal = f.sendNotificationInternal.bind(f);
    return f;
}


export function filterText(field, label) {
    return filter(field, function() {
        const f = this;
        return (
            <div key={`list-filter-${field}`} className="form-group col-md-4">
                <label htmlFor={`filter-${field}`}>{label}</label>
                <div className="input-group">
                    <input type="text" className="form-control" id={`filter-${field}`} onChange={this.changeHandler} ref={function(input) { f.input = input; }} />
                    <span className="input-group-addon" style={{cursor: 'pointer'}} onClick={this.resetHandler}></span>
                </div>
            </div>
        );
    });
}

export function filterSelect(field, label, options) {
    return filter(field, function() {
        const f = this;
        return (
            <div key={`list-filter-${field}`} className="form-group col-md-4">
                <label htmlFor={`filter-${field}`}>{label}</label>
                <div className="input-group">
                    <select className="form-control" id={`filter-${field}`} onChange={this.changeHandler} ref={function(input) { f.input = input; }}>
                        <option value=""></option>
                        {(() => {
                            const opts = [];
                            options.forEach( (o) => {
                                opts.push((<option value={o.value} key={`op-${o.value}`}>{o.label}</option>));
                            });
                            return opts;
                        })()}
                    </select>
                    <span className="input-group-addon" style={{cursor: 'pointer'}} onClick={this.resetHandler}></span>
                </div>
            </div>
        );
    });
}


export function filterDate(field, label) {
    let instance = filter(field, function() {
        const f = this;
        return (
            <div key={`list-filter-${field}`} className="form-group col-md-2">
                <label htmlFor={`filter-${field}`}>{label}</label>
                <DatePicker dateFormat="YYYY-MM-DD"
                            id={`filter-${field}`} onChange={this.changeHandler} ref={function(input) { f.input = input; }}
                            dayLabels={['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pią', 'Sob']}
                            clearButtonElement=""
                            monthLabels={['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']}
                />
            </div>
        );
    });
    instance.changeHandler = function(m) {
        instance.value = m == null ? '' : m;
        instance.sendNotification();
    }.bind(instance);
    return instance;
}


export class FilteredList extends React.Component {

    static propTypes = {
        filters : React.PropTypes.array.isRequired,
        baseURL : React.PropTypes.string.isRequired,
        renderRow : React.PropTypes.func.isRequired,
        showAmount : React.PropTypes.bool // default false
    };

    constructor(props) {
        super(props);
        this.fetchAjaxListCallback = this.fetchAjaxListCallback.bind(this);
        this.filterNotification = this.filterNotification.bind(this);
        this.props.filters.forEach((f) => {
            f.notify = this.filterNotification;
        });
    }

    filterNotification(filter) {
        this.refs.ajaxList.updateAndResetPage();
    }

    fetchAjaxListCallback(page) { // method invoked by AjaxList only
        this.page = page;
        let url = this.props.baseURL + '?page=' + page;
        this.props.filters.forEach((f, index) => {
            url = f.apply(url);
        });
        return api.get(url);
    }

    render() {
        const filters = [];
        this.props.filters.forEach((f, index) => {
           filters.push(f.render.apply(f));
        });
        return (<div>
            <div className="row">
                <div className="col-xs-10 no-padding">
                    {filters}
                </div>
            </div>
            <div className="row result-list">
                <AjaxList ref="ajaxList" fetchDataCallback={this.fetchAjaxListCallback} renderRow={this.props.renderRow} showAmount={this.props.showAmount}>
                    {this.props.children}
                </AjaxList>
            </div>
        </div>)
    }

}
