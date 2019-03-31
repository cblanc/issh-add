import React from "react";
import { Box } from "ink";
import InkSelectInput, { Item } from "ink-select-input";
interface SshConfigSelectorProps {
  results: HostConfiguration[];
  onSelect: SshConfigOnSelectHandler;
  maxResults: number;
}
import { HostConfiguration } from "./index";

interface SshConfigOnSelectHandler {
  (item: Item): void;
}
const toLabel = (config: HostConfiguration): string => {
  const { host, hostName } = config;
  let label = config.identityFile.join(" | ");
  if (host) label = `${label} Host: ${host}`;
  if (hostName) label = `${label} (${hostName})`;
  return label;
};

const toItem = (config: HostConfiguration): Item => {
  return {
    label: toLabel(config),
    value: config.identityFile.join(","),
    key: config.host,
  };
};

export class SshConfigSelector extends React.PureComponent<
  SshConfigSelectorProps,
  {}
> {
  items(): Item[] {
    return this.props.results.slice(0, this.props.maxResults).map(toItem);
  }

  render() {
    return (
      <Box minHeight={this.props.maxResults}>
        <InkSelectInput items={this.items()} onSelect={this.props.onSelect} />
      </Box>
    );
  }
}
