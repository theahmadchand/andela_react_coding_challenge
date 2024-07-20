import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  render() {
    const { FallbackComponent } = this.props;
    return this.state.error ? (
      <FallbackComponent error={this.state.error} />
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
