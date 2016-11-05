import React from 'react';


export default class PasswordStrengthMeter extends React.Component {
    static propTypes = {
        minLength : React.PropTypes.number,          // min password length
        strengthThreshold : React.PropTypes.number.isRequired,  // lowest security level possible
        password : React.PropTypes.string.isRequired,  // password
        rules : React.PropTypes.array
    };

    static defaultProps = {
        minLength : 0,
        rules : [new RegExp('[a-z]'), new RegExp('[A-Z]'), new RegExp('[0-9]'), new RegExp('[\\W]'), new RegExp('.{9,}')]
    };

    constructor(props) {
        super();
        this.state = { level : 0, length : 0 };
        this.props = props;
        this._calculate = this._calculate.bind(this);
    }

    _calculate(password) {
        if (password === undefined || password === null) {
            password = '';
        }
        let level = 0;
        if (password.length >= this.props.minLength) {
            this.props.rules.forEach((r) => {
                if (r.test(password)) {
                    level++;
                }
            });
        }
        this.setState({level : level, length : password.length });
        return level;
    }

    componentDidMount() {
        this._calculate(this.props.password);
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this._calculate(nextProps.password);
    }


    render() {
        const {length,level} = this.state;
        const max = this.props.rules.length + 1;
        const step = 100 / max;
        const prc = ( step * (level + (length > 0 ? 1 : 0)) )  + "%";
        let cl = 'progress-bar-danger';
        if (level >= this.props.strengthThreshold) {
            cl = 'progress-bar-warning';
        }
        let i = Math.floor((max -1 - this.props.strengthThreshold) / 2) + this.props.strengthThreshold;
        if (level == max -1 || level >= i) {
            cl = 'progress-bar-success'
        }
        return (
            <div {... this.props} className="password-strength-meter progress">
                <div className={`progress-bar ${cl} password-strength-meter-bar`} style={{width: prc}}>${this.props.children}</div>
            </div>
        );
    }

}
