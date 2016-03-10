import React from 'react';
import Joyride from 'react-joyride';
import { autobind } from 'core-decorators';
import Header from '../components/Header';
import Panels from '../components/Panels';
import Charts from '../components/Charts';
import Tables from '../components/Tables';
import Loader from '../components/Loader';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      joyrideOverlay: true,
      joyrideType: 'single',
      ready: false,
      steps: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        ready: true
      });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.ready && this.state.ready) {
      this.refs.joyride.start();
    }
  }

  @autobind
  addSteps(steps) {
    const joyride = this.refs.joyride;
    let newSteps = steps;

    if (!Array.isArray(newSteps)) {
      newSteps = [newSteps];
    }

    if (!newSteps.length) {
      return;
    }

    this.setState(currentState => {
      currentState.steps = currentState.steps.concat(joyride.parseSteps(newSteps));
      return currentState;
    });
  }

  @autobind
  addTooltip(data) {
    this.refs.joyride.addTooltip(data);
  }

  stepCallback(step) {
    console.log('••• stepCallback', step); //eslint-disable-line no-console
  }

  completeCallback(steps, skipped) {
    console.log('••• completeCallback', steps, skipped); //eslint-disable-line no-console
  }

  @autobind
  onClickSwitch(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const state = {};

    if (el.dataset.key === 'joyrideType') {
      this.refs.joyride.reset();

      setTimeout(() => {
        this.refs.joyride.start();
      }, 300);

      state.joyrideType = e.currentTarget.dataset.type;
    }

    if (el.dataset.key === 'joyrideOverlay') {
      state.joyrideOverlay = el.dataset.type === 'active';
    }

    this.setState(state);
  }

  render() {
    const state = this.state;
    let html;

    if (state.ready) {
      html = (
        <div>
          <Joyride
            ref="joyride"
            debug={false}
            steps={state.steps}
            type={state.joyrideType}
            showSkipButton={true}
            showOverlay={state.joyrideOverlay}
            stepCallback={this.stepCallback}
            completeCallback={this.completeCallback} />
          <Header
            joyrideType={state.joyrideType}
            joyrideOverlay={state.joyrideOverlay}
            onClickSwitch={this.onClickSwitch}
            addSteps={this.addSteps}
            addTooltip={this.addTooltip} />

          <div id="page-wrapper">

            <div className="container-fluid">

              <Panels addSteps={this.addSteps} />
              <Charts addSteps={this.addSteps} />
              <Tables addSteps={this.addSteps} />
            </div>
          </div>
        </div>
      );
    }
    else {
      html = <Loader />;
    }

    return (
      <div className="app">
        {html}
      </div>
    );
  }
}

export default App;