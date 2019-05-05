import React from "react";
import { Box } from "ink";
import InkSelectInput, { Item } from "ink-select-input";
import { HostConfiguration } from "../index";

interface Props {
  results: HostConfiguration[];
  onSelect: Handler;
  maxResults: number;
}

interface Handler {
  (files: string[]): void;
}

// Creates label for host configuration
const toLabel = (config: HostConfiguration): string => {
  const { host, hostName, identityFile } = config;
  let label = "";
  if (host) label = `${label}Host: ${host} `;
  if (hostName) label = `${label}(${hostName}) `;
  label = `${label} [IdentifyFile Path(s): ${identityFile.join(" | ")}]`;
  return label;
};

const toItem = (config: HostConfiguration, index: number): Item => {
  return {
    label: toLabel(config),
    key: index,
    value: config.identityFile.join(","),
  };
};

// Select list of host configurations
// Invokes `onSelect` when config selected
export const ConfigList = (props: Props) => {
  const { results, maxResults } = props;
  const items = results.slice(0, maxResults).map(toItem);

  const handleSelect = (item: Item) => {
    const { key } = item;
    props.onSelect(results[key as number].identityFile);
  };

  return (
    <Box minHeight={props.maxResults}>
      <InkSelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
};
