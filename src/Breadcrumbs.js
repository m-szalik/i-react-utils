import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import {isEquivalent, shallowCopy} from './utils'

export function bc(link, label) {
    return { link: link, label : label };
}

export class Breadcrumbs extends React.Component {
    static childContextTypes = {
        breadcrumbs : PropTypes.object
    };

    static contextTypes = {
        breadcrumbs : PropTypes.object
    };

    static propTypes = {
        config : PropTypes.arrayOf(PropTypes.object)
    };

    constructor(props) {
        super();
        this.props = props;
        this.state = {
            config : this.props.config ? this.props.config : null
        };
        this.configuration = this.configuration.bind(this);
        this.clear = this.clear.bind(this);
    }

    configuration(config) {
        let bc;
        if (this.delegateMode) {
            bc = this.context.breadcrumbs;
        } else {
            bc = this;
        }
        let oldState = bc.state.config;
        if (oldState == null || ! isEquivalent(oldState, config)) {
            bc.setState({config: config});
        }
    }

    clear() {
        this.configuration([]);
    }


    getChildContext() {
        return {breadcrumbs : this};
    }

    componentWillMount() {
        if (this.props.config) {
            this.configuration(this.props.config);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.config) {
            this.configuration(this.props.config);
        }
    }

    render() {
        if (this.delegateMode) {
            // do not render it
            return null;
        }
        const divProps = shallowCopy({}, this.props, ['config']);
        if (this.state.config == null || this.state.config.length == 0) {
            return (<div {...divProps}>{this.props.children}</div>);
        } else {
            const items = [];
            this.state.config.forEach((br, i) => {
                if (i == this.state.config.length -1) {
                    items.push((<li key={`bc-item-${i}`} className="active"><span>{br.label}</span></li>));
                } else {
                    items.push((<li key={`bc-item-${i}`}><Link to={br.link}>{br.label}</Link></li>));
                }
            });
            return (
                <div {...divProps}>
                    <div id="breadcrumb" className="row">
                        <ol className="breadcrumb">
                            <li><Link className="home" to="/"><span className="ico-panel ico-breadcrumb-home" aria-hidden="true"></span></Link></li>
                            {items}
                        </ol>
                    </div>
                    {this.props.children}
                </div>
            );
        }
    }
}
