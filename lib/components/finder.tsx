import React, { Fragment } from "react";
import InkTextInput from "ink-text-input";
import { Item } from "ink-select-input";
import { ConfigList } from "./config_list";
import { Box, Color } from "ink";
import { Props as AppProps, State as AppState } from "./app";

type ParentProps = "hostConfigs" | "path" | "maxResults";

type ParentState = "query" | "results";

interface UpdateQuery {
  (query: string): void;
}

interface SelectConfig {
  (item: Item): void;
}

interface Props
  extends Pick<AppProps, ParentProps>,
    Pick<AppState, ParentState> {
  updateQuery: UpdateQuery;
  selectConfig: SelectConfig;
}

const NoMatch = (query: string) => (
  <Color red>{`No match found for "${query}"`}</Color>
);

const QueryPrompt = () => <Color white>Search for a config file</Color>;

export const Finder = (props: Props) => {
  const {
    hostConfigs,
    path,
    selectConfig,
    maxResults,
    query,
    updateQuery,
    results,
  } = props;

  const configLength = hostConfigs.length;

  let matches;
  if (query.length === 0) {
    matches = QueryPrompt();
  } else if (results.length === 0) {
    matches = NoMatch(query);
  } else {
    matches = (
      <ConfigList
        results={results}
        onSelect={selectConfig}
        maxResults={maxResults}
      />
    );
  }

  return (
    <Fragment>
      <Color grey>Loaded {configLength} host configurations</Color>
      <Box flexGrow={1}>
        <Box marginRight={1}>
          Search Host in <Color blue>{path}</Color>:
        </Box>
        <Box>
          <InkTextInput value={query} onChange={updateQuery} />
        </Box>
      </Box>
      <Box width="100%">{matches}</Box>
    </Fragment>
  );
};
