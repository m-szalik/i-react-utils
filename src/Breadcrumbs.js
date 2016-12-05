import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import {isEquivalent, shallowCopy} from './utils'
import {devOnly} from './utils-internal'

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
        config : PropTypes.arrayOf(PropTypes.shape({ link : PropTypes.string.isRequired, label : PropTypes.string.isRequired })),
        renderHome : PropTypes.bool
    };

    static defaultProps = {
        renderHome : false
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
        let bc = this.context.breadcrumbs ? this.context.breadcrumbs : this;
        let oldState = bc.state.config;
        if (oldState == null || ! isEquivalent(oldState, config)) {
            devOnly(()=>{console.debug('Updating breadcrumbs to', config);});
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
        if (this.context.breadcrumbs) {
            // do not render it
            return null;
        }
        const divProps = shallowCopy({}, this.props, ['config', 'renderHome']);
        if (this.state.config == null || this.state.config.length == 0) {
            return (<div {...divProps}>{this.props.children}</div>);
        } else {
            const items = [];
            if (this.props.renderHome) {
                items.push(<li key="bc-home"><Link className="home" to="/"><span className="ico-panel ico-breadcrumb-home"></span></Link></li>);
            }
            this.state.config.forEach((br, i) => {
                if (i == this.state.config.length -1) {
                    items.push((<li key={`bc-item-${i}`} className="active"><span>{br.label}</span></li>));
                } else {
                    items.push((<li key={`bc-item-${i}`}><Link to={br.link}>{br.label}</Link></li>));
                }
            });
            return (
                <div {...divProps}>
                    <div id="breadcrumb" className="breadcrumb">
                        <ol className="breadcrumb">
                            {items}
                        </ol>
                    </div>
                    {this.props.children}
                </div>
            );
        }
    }
}
