import { Finder } from "./finder";
import { render } from "ink";
import React, { useState } from "react";
import Fuse from "fuse.js";
import { HostConfiguration } from "../index";
import { PasswordDialog } from "./password_dialog";

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

export interface OnPasswordSubmitted {
  (password: string): void;
}

export interface UpdateQuery {
  (query: string): void;
}

export interface OnConfigSelected {
  (identityFiles: string[]): void;
}

// App component essentially acts as the state manager
// - Receives app config via `props`
// - Maintains current state in `state`
export const App = (props: Props) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<HostConfiguration[]>([]);
  const [identityFiles, setIdentityFiles] = useState<string[]>([]);
  const { hostConfigs, path, maxResults } = props;

  // Updates query and search results
  const updateQuery: UpdateQuery = q => {
    setQuery(q);
    setResults(props.index.search(q));
  };

  const onConfigSelected: OnConfigSelected = files => setIdentityFiles(files);

  const onPasswordSubmitted = (password: string) =>
    process.stdout.write(password);

  if (identityFiles.length > 0)
    return (
      <PasswordDialog
        identityFile={identityFiles[0]}
        onPasswordSubmitted={onPasswordSubmitted}
      />
    );

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
