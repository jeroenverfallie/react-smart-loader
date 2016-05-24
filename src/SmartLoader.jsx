import React, {PropTypes} from 'react';

import BoxLoader from './BoxLoader.jsx';
import {ANIMATIONS} from './constants.js';

class SmartLoader extends React.Component {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        showAfter: PropTypes.number,
        minimumDuration: PropTypes.number,
        introDuration: PropTypes.number,
        outroDuration: PropTypes.number,
        loaderProps: PropTypes.object,
        loaderComponent: PropTypes.any
    };

    static defaultProps = {
        showAfter: 1500,
        minimumDuration: 2000,
        introDuration: 1000,
        outroDuration: 500,
        loaderProps: {
            message: 'Loading interesting things..'
        },
        loaderComponent: BoxLoader
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoaderVisible: false,
            isContentVisible: false,
            loaderAnimation: ANIMATIONS.NONE
        };
    }

    componentDidMount() {
        if (this.props.isLoading) {
            this.prepareShow();
        } else {
            this.setState({
                isContentVisible: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoading && !this.props.isLoading) {
            this.prepareShow();
        }

        if (!nextProps.isLoading && this.props.isLoading) {
            window.clearTimeout(this.showTimer);
            if (this.state.isLoaderVisible) {
                this.prepareHide();
            } else {
                this.setState({
                    isLoaderVisible: false,
                    isContentVisible: true
                });
            }
        }
    }

    componentWillUnmount() {
        window.clearTimeout(this.showTimer);
        window.clearTimeout(this.introTimer);
        window.clearTimeout(this.outroTimer);
        window.clearTimeout(this.stallTimer);
    }

    prepareShow() {
        this.setState({
            loaderAnimation: ANIMATIONS.NONE,
            isLoaderVisible: false,
            isContentVisible: false
        });

        window.clearTimeout(this.showTimer);
        this.showTimer = window.setTimeout(this.show.bind(this), this.props.showAfter);
    }

    show() {
        this.setState({
            isLoaderVisible: true,
            loaderAnimation: ANIMATIONS.IN
        });

        this.introTimer = window.setTimeout(() => {
            this.setState({
                loaderAnimation: ANIMATIONS.NONE
            });
            this.becameVisibleAt = Date.now();

            if (this.prepareHideIsWaiting) {
                this.prepareHide();
            }
        }, this.props.introDuration);
    }

    prepareHide() {
        if (this.state.loaderAnimation === ANIMATIONS.IN && !this.prepareHideIsWaiting) {
            this.prepareHideIsWaiting = true;
            return;
        }

        this.prepareHideIsWaiting = false;
        const wasVisibleFor = Date.now() - this.becameVisibleAt;
        const stallFor = this.props.minimumDuration - wasVisibleFor;

        if (stallFor > 0) {
            this.stallTimer = window.setTimeout(this.prepareHide.bind(this), stallFor);
            return;
        }

        this.becameVisibleAt = 0;

        this.setState({
            loaderAnimation: ANIMATIONS.OUT
        });

        window.clearTimeout(this.outroTimer);
        this.outroTimer = window.setTimeout(this.hide.bind(this), this.props.outroDuration);
    }

    hide() {
        this.setState({
            isContentVisible: true,
            isLoaderVisible: false
        });
    }

    render() {
        if (this.state.isLoaderVisible) {
            const Loader = this.props.loaderComponent;
            return (
                <Loader
                    {...this.props.loaderProps}
                    animation={this.state.loaderAnimation} />
            );
        }

        if (this.state.isContentVisible) {
            return this.props.children;
        }

        return null;
    }
}

export default SmartLoader;
