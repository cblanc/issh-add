import { Finder } from "./finder";
import { render } from "ink";
import { Item } from "ink-select-input";
import React from "react";
import Fuse from "fuse.js";
import { sshAdd } from "../ssh_add";
import { HostConfiguration } from "../index";

export interface Props {
  index: Fuse<HostConfiguration>;
  path: string;
  maxResults: number;
  hostConfigs: HostConfiguration[];
}

export interface State {
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
    this.updateQuery = this.updateQuery.bind(this);
    this.selectConfig = this.selectConfig.bind(this);
  }

  // Update config search term
  updateQuery(query: string) {
    const results = this.props.index.search(query);
    this.setState({ query, results });
  }

  // Select a config to be added to ssh agent
  selectConfig(item: Item) {
    const { value } = item;
    if (typeof value !== "string")
      throw new Error(`Identifyfile not found for ${item.label}`);
    const identityFiles = value.split(",");
    for (const file of identityFiles) {
      sshAdd(file);
    }
  }

  render() {
    const { query, results } = this.state;
    const { updateQuery, selectConfig } = this;
    const { hostConfigs, path, maxResults } = this.props;
    return (
      <Finder
        query={query}
        updateQuery={updateQuery}
        hostConfigs={hostConfigs}
        path={path}
        selectConfig={selectConfig}
        maxResults={maxResults}
        results={results}
      />
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
