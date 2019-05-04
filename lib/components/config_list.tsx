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
  (item: Item): void;
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

const toItem = (config: HostConfiguration): Item => {
  return {
    label: toLabel(config),
    value: config.identityFile.join(","),
    key: config.host,
  };
};

// Select list of host configurations
// Invokes `onSelect` when config selected
export const ConfigList = (props: Props) => {
  const items = props.results.slice(0, props.maxResults).map(toItem);
  return (
    <Box minHeight={props.maxResults}>
      <InkSelectInput items={items} onSelect={props.onSelect} />
    </Box>
  );
};
