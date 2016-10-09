import React, {PropTypes} from 'react';
import { Link } from 'react-router';

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
    }

    getChildContext() {
        return {breadcrumbs : this};
    }

    componentWillMount() {
        this.delegateMode = this.context.breadcrumbs != undefined;
        if (this.delegateMode) {
            this.context.breadcrumbs.setState({config: this.state.config});
        }
    }

    render() {
        if (this.delegateMode) {
            // do not render it
            return null;
        }
        if (this.state.config == null) {
            return (<div>{this.props.children}</div>);
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
                <div>
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
