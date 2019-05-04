import { render, Box, Color } from "ink";
import { Item } from "ink-select-input";
import { ConfigList } from "./config_list";
import React, { Fragment } from "react";
import InkTextInput from "ink-text-input";
import Fuse from "fuse.js";
import { sshAdd } from "../ssh_add";
import { HostConfiguration } from "../index";

interface Props {
  index: Fuse<HostConfiguration>;
  path: string;
  maxResults: number;
  hostConfigs: HostConfiguration[];
}

interface State {
  query: string;
  results: HostConfiguration[];
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
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
    const { value } = item;
    if (typeof value !== "string")
      throw new Error(`Identifyfile not found for ${item.label}`);
    const identityFiles = value.split(",");
    for (const file of identityFiles) {
      sshAdd(file);
    }
  }

  configLength(): number {
    return this.props.hostConfigs.length;
  }

  renderResults() {
    return (
      <Box width="100%">
        <ConfigList
          results={this.state.results}
          onSelect={this.handleSelect}
          maxResults={this.props.maxResults}
        />
      </Box>
    );
  }

  renderNoMatch() {
    return (
      <Box width="100%">
        <Color red>{`No match found for "${this.state.query}"`}</Color>
      </Box>
    );
  }

  results() {
    const { results, query } = this.state;
    if (query.length === 0) return;
    if (results.length > 0) return this.renderResults();
    return this.renderNoMatch();
  }

  render() {
    const { query } = this.state;
    return (
      <Fragment>
        <Color grey>Loaded {this.configLength()} host configurations</Color>
        <Box flexGrow={1}>
          <Box marginRight={1}>
            Search Host in <Color blue>{this.props.path}</Color>:
          </Box>
          <Box>
            <InkTextInput value={query} onChange={this.handleChange} />
          </Box>
        </Box>
        {this.results()}
      </Fragment>
    );
  }
}

interface Options extends Props {}

export const renderApp = (options: Options): void => {
  const { index, path, maxResults, hostConfigs } = options;
  render(
    <App
      index={index}
      path={path}
      maxResults={maxResults}
      hostConfigs={hostConfigs}
    />
  );
};
