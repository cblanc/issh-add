import { Finder } from "./finder";
import { render } from "ink";
import { Item } from "ink-select-input";
import React, { useState } from "react";
import Fuse from "fuse.js";
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

export interface UpdateQuery {
  (query: string): void;
}

export interface OnConfigSelected {
  (item: Item): void;
}

// App component essentially acts as the state manager
// - Receives app config via `props`
// - Maintains current state in `state`
export const App = (props: Props) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<HostConfiguration[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<Item | null>(null);
  const { hostConfigs, path, maxResults } = props;

  // Updates query and search results
  const updateQuery: UpdateQuery = q => {
    setQuery(q);
    setResults(props.index.search(q));
  };

  const onConfigSelected: OnConfigSelected = item => setSelectedConfig(item);

  const currentState = selectedConfig === null ? "finder" : "password";

  process.stdout.write(currentState);

  return (
    <Finder
      query={query}
      updateQuery={updateQuery}
      hostConfigs={hostConfigs}
      path={path}
      onConfigSelected={onConfigSelected}
      maxResults={maxResults}
      results={results}
    />
  );
};

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
