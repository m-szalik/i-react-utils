import React from 'react';
import {devOnly, shallowCopyExcept} from './utils';
import {_buildElement} from './utils-internal';

function _subElementProps(source) {
    let dst = {};
    shallowCopyExcept(dst, source, ['component', 'errorComponent', 'loadingComponent', 'ajax']);
    return dst;
}

export default class LazyLoad extends React.Component {

    static propTypes = {
        component : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]).isRequired,
        errorComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),          // component function or element
        loadingComponent : React.PropTypes.oneOfType([ React.PropTypes.func, React.PropTypes.element ]),        // component function or element
        ajax : React.PropTypes.func.isRequired                                                                  // function that returns Ajax Promise
    };

    static defaultProps = {
        errorComponent : null,
        loadingComponent : null
    };

    constructor(props) {
        super();
        this.state = { element : null, loading : true };
        this._setup = this._setup.bind(this);
        this.reload = this.reload.bind(this);
        this.subElementProps = _subElementProps(props);
        this.loadingElement = _buildElement(props.loadingComponent, this.subElementProps, []);
    }

    _setup(props) {
        if (props.component == undefined) {
            throw new Error('Property component of LazyLoad is required');
        }
        let promise = props.ajax();
        if (promise && promise.then && promise.catch) {
            promise.then((res) => {
                let data = res.data;
                const cProps = _subElementProps(props);
                cProps.data = data;
                const element = _buildElement(props.component, cProps, props.children);
                this.setState({element: element, loading: false});
            })
            .catch((err) => {
                devOnly(() => {console.log('Unable to load resource via ajax for LazyLoad.', err);});
                if (props.errorComponent) {
                    const cProps = _subElementProps(props);
                    cProps.data = err.response.data;
                    const element = _buildElement(props.errorComponent, cProps, props.children);
                    this.setState({element: element, loading: false});
                } else {
                    this.setState({element: null, loading: false});
                }
            });
        } else {
            throw new Error('Ajax returned ' + promise + ' instead of Promise.');
        }
    }

    reload() {
        this.setState({ element : null, loading : true });
        this._setup(this.props);
    }

    componentWillMount() {
        this._setup(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.loadingComponent != newProps.loadingComponent) {
            this.loadingElement = _buildElement(newProps.loadingComponent, _subElementProps(newProps), []);
        }
        this.props = newProps;
    }

    render() {
        const {element, loading} = this.state;
        if (element == null) {
            if (loading) {
                return this.loadingElement;
            } else {
                return null;
            }
        } else {
            return element;
        }
    }

}
