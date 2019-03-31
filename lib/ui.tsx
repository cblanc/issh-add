import { render, Box, Color } from "ink";
import { Item } from "ink-select-input";
import { SshConfigSelector } from "./ssh_config_selector";
import React, { Fragment } from "react";
import InkTextInput from "ink-text-input";
import Fuse from "fuse.js";

import { HostConfiguration } from "./index";

interface CliProps {
  index: Fuse<HostConfiguration>;
  path: string;
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
        <Box flexGrow={1}>
          <Box marginRight={1}>
            Search Host in <Color blue>{this.props.path}</Color>:
          </Box>
          <Box>
            <InkTextInput
              value={this.state.query}
              onChange={this.handleChange}
            />
          </Box>
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
  path: string;
}

export const renderUi = (options: Options): void => {
  const { index, path } = options;
  render(<Ui index={index} path={path} />);
};
