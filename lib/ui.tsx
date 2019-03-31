import { render, Box, Color } from "ink";
import { Item } from "ink-select-input";
import { SshConfigSelector } from "./ssh_config_selector";
import React, { Fragment } from "react";
import InkTextInput from "ink-text-input";
import Fuse from "fuse.js";

import { HostConfiguration } from "./index";

interface CliProps {
  index: Fuse<HostConfiguration>;
}

interface CliState {
  query: string;
  results: HostConfiguration[];
}

export class Ui extends React.PureComponent<CliProps, CliState> {
  constructor(props: CliProps) {
    super(props);
    this.state = {
      query: "",
      results: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(query: string) {
    const results = this.props.index.search(query);
    this.setState({ query, results });
  }

  handleSelect(item: Item) {
    process.stdout.write(JSON.stringify(item));
  }

  render() {
    return (
      <Fragment>
        <Box marginRight={1}>
          <Color green>Search SSH Config:</Color>
        </Box>
        <Box flexGrow={1}>
          <InkTextInput value={this.state.query} onChange={this.handleChange} />
        </Box>
        <Box width="100%">
          <SshConfigSelector
            results={this.state.results}
            onSelect={this.handleSelect}
          />
        </Box>
      </Fragment>
    );
  }
}

interface Options {
  index: Fuse<HostConfiguration>;
}

export const renderUi = (options: Options): void => {
  const { index } = options;
  render(<Ui index={index} />);
};
