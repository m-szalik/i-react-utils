import React from 'react';
import {setObjProperty, getObjProperty} from './utils';

export function createFormValidator(message, isValidFunction) {
    return {
        message : message,
        validatorFunction : isValidFunction,
        setRequired : false
    };
}

export function createIsRequiredFormValidator(message) {
    message = message || 'Pole jest wymagane';
    let validator = createFormValidator(message, function(value) {
        return ! (value == null || value == undefined || value.trim().length == 0);
    });
    validator.setRequired = true;
    return validator;
}

export function createMinLengthFormValidator(minLength, message) {
    message = message || 'Mimimalna długość to ' + minLength;
    let validator = createFormValidator(message, function(value) {
        return ! (value == null || value == undefined || value.trim().length < minLength);
    });
    validator.setRequired = true;
    return validator;
}

export function createMaxLengthFormValidator(maxLength, message) {
    message = message || 'Maksymalna długość to ' + maxLength;
    let validator = createFormValidator(message, function(value) {
        return (value == null || value == undefined || value.trim().length < maxLength);
    });
    return validator;
}

export function createEqLengthFormValidator(eqLength, message) {
    message = message || 'Wymagana długość to ' + eqLength;
    let validator = createFormValidator(message, function(value) {
        return (value == null || value == undefined || value.trim().length == eqLength);
    });
    return validator;
}

export function createRegexLengthFormValidator(regex, message) {
    if (typeof regex === 'string') {
        regex = new RegExp(regex, "i");
    }
    message = message || 'Niewłaściwy format (' + regex + ')';
    let validator = createFormValidator(message, function(value) {
        if (value == undefined || value == null) {
            return true;
        }
        return regex.test(value);
    });
    return validator;
}



export class Input extends React.Component {
    static contextTypes = {
        wizard : React.PropTypes.object
    };

    static propTypes = {
        type : React.PropTypes.string.isRequired, // input type
        name : React.PropTypes.string.isRequired, // field name
        label : React.PropTypes.string.isRequired, // label
        required : React.PropTypes.bool, // if field is required
        instantValidation : React.PropTypes.bool, // if validate onChange event
        inputId : React.PropTypes.string, // id for an input otherwise autogenerated
        placeholder : React.PropTypes.string, // input placeholder
        validators : React.PropTypes.arrayOf(React.PropTypes.object), // validators
        className : React.PropTypes.string
    };

    static defaultProps = {
        required : false,
        validators : [],
        className: ""
    };

    constructor(props) {
        super();
        this.props = props;
        let required = props.required;
        props.validators.forEach((validator) => {
            if (validator.setRequired) {
                required = true;
            }
        });
        this.validators = props.validators.slice();
        this.state = { error : null, label : props.label, required : required };
        this.inputId = props.inputId || 'form-input-' + props.name;
        if (this.validators.length == 0 && props.required) {
            this.validators.push(createIsRequiredFormValidator());
        }
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.value = this.value.bind(this);
        this._data = this._data.bind(this);
        this.orgOnChange = this.props.onChange;
    }

    _data() {
        return this.context.wizard.data;
    }

    componentWillMount() {
        // register field in form
        this.context.wizard.formInputs.push(this);
        //prepare props for input
        this.inputProps = Object.assign({}, this.props, {onChange:this.handleChange, id:this.inputId, value:this.context.wizard.data[this.props.name]});
        delete this.inputProps.item; // clear it
        delete this.inputProps.validators; // clear it
        delete this.inputProps.required; // clear it
        delete this.inputProps.options; // clear it
        delete this.inputProps.instantValidation; // clear it
        delete this.inputProps.defaultValue; // clear it
        delete this.inputProps.outerClassName;
        this.inputProps.className = 'form-control' + (this.props.className ?  ' ' + this.props.className : '') + ' form-wizard-input form-wizard-input-' + this.props.type;
    }

    componentWillUnmount() {
        // TODO unregister from wizard
    }

    validate() {
        let value = getObjProperty(this._data(), this.props.name);
        for(let i=0; i<this.validators.length; i++) {
            let validator = this.validators[i];
            let isValid = validator.validatorFunction(value);
            if (! isValid) {
               this.setState({error : validator.message});
               return false;
            }
        }
        this.setState({error : null});
        return true;
    }

    value(newValue) {
        const name = this.props.name;
        const data = this._data();
        const old = getObjProperty(data, name);
        if (newValue != undefined) { // set new value
            const nv = newValue == '' ? null : newValue;
            if (nv != old) {
                setObjProperty(data, name, nv);
                let instantValidation = this.props.instantValidation;
                if (instantValidation == undefined) {
                    instantValidation = this.context.wizard.props.instantValidation;
                }
                if (instantValidation) {
                    this.validate();
                }
                this.forceUpdate();
            }
        }
        return old;
    }

    handleChange(event) {
        let ep;
        if (event.target) {
            const val = event.target.value;
            this.value(val == undefined ? null : val);
            ep = event;
        }
        if (this.orgOnChange) {
            this.orgOnChange(ep);
        }
    }

    render() {
        const name = this.props.name;
        const item = this._item();
        let type = this.props.type == undefined ? undefined : this.props.type.toLowerCase();
        return (
                <div className={` ${this.props.outerClassName}   `}>
                    <div className={`form-group ${this.props.className} ${this.state.error != null ? 'has-error' : ''}`}>
                        <label className="form-control-label" htmlFor={this.inputId}>{this.state.label}</label>
                        {(() => {
                            if (this.state.required) {
                                return (<span className="form-wizard-required"></span>);
                            }
                        })()}
                        {(() => {
                            let dv = getObjProperty(item, name);
                            if (dv == null) {
                                dv = '';
                            }
                            if (this.props.options != undefined) { // select
                                if (type != undefined && type != 'select' && type !='nice-select') {
                                    throw 'Cannot use options with type "' + type +'"';
                                }
                                if (type == 'nice-select') {
                                    const opts = [{value:'', label:'Wybierz', name:name}];
                                    const isArr = Array.isArray(this.props.options);
                                    for(let key in this.props.options) {
                                        const sval = this.props.options[key];
                                        opts.push({value:isArr ? sval : key, label:sval, name:name});
                                    }
                                    return (<Select
                                        name={this.props.name}
                                        value={dv}
                                        options={opts}
                                        onChange={this.handleChange}
                                        required={this.state.required}
                                    />);
                                } else {
                                    let opts = [];
                                    opts.push((<option key="" value=""></option>));
                                    let isa = Array.isArray(this.props.options);
                                    for (let key in this.props.options) {
                                        let val = this.props.options[key];
                                        let rk = isa ? val : key;
                                        opts.push((<option label={val} value={rk} key={rk}>{val}</option>));
                                    }
                                    return (<select {...this.inputProps} value={dv}>{opts}</select>);
                                }
                            }
                            type = type || 'text';
                            if (type == 'textarea') {
                                return (<textarea {...this.inputProps} value={dv}/>);
                            } else {
                                return (<input type={type} {...this.inputProps} value={dv}/>);
                            }
                        })()}
                        {(() => {
                            if (this.state.error != null) {
                                return (
                                    <span className="help-block">{this.state.error}</span>
                                );
                            }
                        })()}
                    </div>
            </div>
        );
    }
}

export class Form extends React.Component {
    static childContextTypes = {
        wizard : React.PropTypes.object
    };

    static propTypes = {
        data : React.PropTypes.object,   // where to save or get values
        instantValidation : React.PropTypes.bool,   // parameter to pass to Input(s)
        onValidationError : React.PropTypes.func,   // callback func(event, form)
        onSubmit : React.PropTypes.func             // callback func(event, form)
    };

    static defaultProps = {
        instantValidation : false,
        data : {}
    };

    constructor(props) {
        super();
        this.props = props;
        this.data = props.data;
        this.formInputs = [];
        this.state = { };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    getChildContext() {
        const self = this;
        return {
            wizard: self
        };
    }


    handleOnSubmit(event) {
        event.preventDefault();
        console.debug("Submit (Form)", event, this.item);
        // validation
        let ret = true;
        this.formInputs.forEach((fin) => {
            if (! fin.validate()) {
                ret = false;
            }
        });
        if (ret) {
            if (this.props.onSubmit) {
                this.props.onSubmit(event, this);
            }
        } else {
            if (this.props.onValidationError) {
                this.props.onValidationError(event, this);
            }
        }
    }

    render() {
        return (<form {...this.props} onSubmit={this.handleOnSubmit}>
            {this.props.children}
        </form>);
    }

}
