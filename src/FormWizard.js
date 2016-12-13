import React from 'react';
import {setObjProperty, getObjProperty, isNotBlank} from './utils';
import {devOnly} from './utils-internal';

export function createFormValidator(message, isValidFunction) {
    return {
        message : message,
        validatorFunction : isValidFunction,
        setRequired : false
    };
}

export function createIsRequiredFormValidator(message) {
    message = message || 'Field is required';
    let validator = createFormValidator(message, function(value) {
        if (typeof value == 'string') {
            return !(value == null || value == undefined || value.trim().length == 0);
        } else {
            return value == undefined ? false : value ? true : false;
        }
    });
    validator.setRequired = true;
    return validator;
}

export function createMinLengthFormValidator(minLength, message) {
    message = message || 'Min length ' + minLength;
    let validator = createFormValidator(message, function(value) {
        return ! (value == null || value == undefined || value.trim().length < minLength);
    });
    validator.setRequired = true;
    return validator;
}

export function createMaxLengthFormValidator(maxLength, message) {
    message = message || 'Max length ' + maxLength;
    let validator = createFormValidator(message, function(value) {
        return (value == null || value == undefined || value.trim().length < maxLength);
    });
    return validator;
}

export function createEqLengthFormValidator(eqLength, message) {
    message = message || 'Required length ' + eqLength;
    let validator = createFormValidator(message, function(value) {
        return (value == null || value == undefined || value.trim().length == eqLength);
    });
    return validator;
}

export function createRegexFormValidator(regex, message) {
    if (typeof regex === 'string') {
        regex = new RegExp(regex, "i");
    }
    message = message || 'Invalid pattern (' + regex + ')';
    let validator = createFormValidator(message, function(value) {
        if (value == undefined || value == null) {
            return true;
        }
        console.log("TEST ", regex, value, regex.test(value));
        return regex.test(value);
    });
    return validator;
}

export class BootstrapWrapper extends React.Component {

    constructor(props) {
        super();
        this.props = props;
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }


    render() {
        const type = this.props.type;
        if (type == 'checkbox') {
            return (<div className={` ${this.props.outerClassName} ${this.props.error != null ? 'has-error' : ''} `}>
                <div className="checkbox"><label>{this.props.children} {this.props.label}</label></div>
            </div>);
        } else {
            return (
                <div className={` ${this.props.outerClassName} `}>
                    <div className={`form-group ${this.props.className} ${this.props.error != null ? 'has-error' : ''}`}>
                        <label className="form-control-label" htmlFor={this.props.inputId}>{this.props.label}</label>
                        {(() => {
                            return this.props.required ? (<span className="form-wizard-required"></span>) : null;
                        })()}
                        {this.props.children}
                        {(() => {
                            return this.props.error != null ? (<span className="help-block">{this.props.error}</span>) : null;
                        })()}
                    </div>
                </div>
            );
        }
    }
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
        className : React.PropTypes.string,
        defaultValue : React.PropTypes.string,
        wrapper : React.PropTypes.func // wrapper component
    };

    static defaultProps = {
        required : false,
        validators : [],
        className: "",
        outerClassName: ""
    };

    constructor(props) {
        super();
        this.wizardIndex = -1;
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
        this._handleChange = this._handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.value = this.value.bind(this);
        this.orgOnChange = this.props.onChange;
    }


    componentWillMount() {
        // register field in form
        this.wizardIndex = this.context.wizard.formInputs.push(this) -1;
        if (isNotBlank(this.props.defaultValue)) {
            this.value(this.props.defaultValue);
        }
        //prepare props for input
        this.inputProps = Object.assign({}, this.props, {onChange:this._handleChange, id:this.inputId, value:this.context.wizard.formData[this.props.name]});
        delete this.inputProps.formData; // clear it
        delete this.inputProps.validators; // clear it
        delete this.inputProps.required; // clear it
        delete this.inputProps.options; // clear it
        delete this.inputProps.instantValidation; // clear it
        delete this.inputProps.defaultValue; // clear it
        delete this.inputProps.inputId;
        delete this.inputProps.outerClassName;
        delete this.inputProps.wrapper;
        if (this.props.type == 'checkbox') {
            this.inputProps.className = (this.props.className ? ' ' + this.props.className : '') + ' form-wizard-input form-wizard-input-' + this.props.type;
        } else {
            this.inputProps.className = 'form-control' + (this.props.className ? ' ' + this.props.className : '') + ' form-wizard-input form-wizard-input-' + this.props.type;
        }
    }

    componentWillUnmount() {
        if (this.wizardIndex >= 0) {
            delete this.context.wizard.formInputs[this.wizardIndex];
            this.wizardIndex = -1;
        }
    }

    validate() {
        let value = getObjProperty(this.context.wizard.formData, this.props.name);
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
        const data = this.context.wizard.formData;
        const old = getObjProperty(data, name);
        if (newValue != undefined) { // set new value
            let nv = newValue == '' ? null : newValue;
            if (this.props.type == 'number' && nv != null) {
                nv = parseInt(nv);
            }
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


    _handleChange(event) {
        let val = event.target.value;
        if (event.target.type == 'checkbox') {
            val = event.target.checked;
            if (val == undefined || val == null) {
                val = false;
            }
        }
        this.value(val == undefined ? null : val);
        if (this.orgOnChange) {
            this.orgOnChange(event);
        }
    }

    render() {
        let type = this.props.type == undefined ? undefined : this.props.type.toLowerCase();
        let input;
        let dv = this.value();
        if (dv == null) {
            dv = '';
        }
        if (type == 'checkbox') {
            const chval = this.value();
            input = (<input key={this.inputId} type="checkbox" {...this.inputProps} value={chval==null?undefined:chval} checked={chval==undefined?false:chval} />);
        } else if (type == 'textarea') {
            input = (<textarea key={this.inputId} {...this.inputProps} value={dv}/>);
        } else if (type == 'select') {
            let opts = [];
            opts.push((<option key="" value=""></option>));
            let isa = Array.isArray(this.props.options);
            for (let key in this.props.options) {
                let val = this.props.options[key];
                let rk = isa ? val : key;
                opts.push((<option label={val} value={rk} key={rk}>{val}</option>));
            }
            input = (<select key={this.inputId} {...this.inputProps} value={dv}>{opts}</select>);
        } else {
            input = (<input key={this.inputId} type={type} {...this.inputProps} value={dv}/>);
        }

        let wrapper = this.props.wrapper;
        if (wrapper == undefined) {
            wrapper = this.context.wizard.props.wrapper;
        }
        if (wrapper == undefined || wrapper == null) {
            return input;
        } else {
            const wProps = {
                type : type,
                outerClassName : this.props.outerClassName,
                label : this.state.label,
                required : this.state.required,
                error : this.state.error,
                inputId : this.inputId,
                inputProps : this.props,
                key : this.inputId + "-wrapper"
            };
            return React.createElement(wrapper, wProps, [input]);
        }
    }
}


export class Form extends React.Component {
    static childContextTypes = {
        wizard : React.PropTypes.object
    };

    static propTypes = {
        formData : React.PropTypes.object,          // where to save or get values
        instantValidation : React.PropTypes.bool,   // parameter to pass to Input(s)
        onValidationError : React.PropTypes.func,   // callback func(event, form)
        onSubmit : React.PropTypes.func,            // callback func(event, form)
        wrapper : React.PropTypes.func              // default wrapper component
    };

    static defaultProps = {
        instantValidation : false,
        formData : {}
    };

    constructor(props) {
        super();
        this.mounted = false;
        this.formInputs = [];
        this.state = { };
        this.componentWillReceiveProps(props);
        this._handleOnSubmit = this._handleOnSubmit.bind(this);
        this.data = this.data.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.formData = nextProps.formData;
        this.formProps = Object.assign({}, nextProps);
        delete this.formProps.formData; // clear it
        delete this.formProps.instantValidation; // clear it
        delete this.formProps.onValidationError; // clear it
        delete this.formProps.onSubmit; // clear it
        delete this.formProps.wrapper; // clear it
        if (this.mounted) {
            this.forceUpdate();
        }
    }


    data() {
        return this.formData;
    }


    getChildContext() {
        const self = this;
        return {
            wizard: self
        };
    }

    _handleOnSubmit(event) {
        event.preventDefault();
        devOnly(() => {  console.debug("Submit (Form)", event, this.formData);  });
        // validation
        let ret = true;
        this.formInputs.forEach((fin) => {
            if (! fin.validate()) {
                ret = false;
                devOnly(() => { console.debug('Invalid field', fin);  });
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

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (<div>
            <form {...this.formProps} onSubmit={this._handleOnSubmit}>
                {this.props.children}
            </form>
        </div>);
    }

}
