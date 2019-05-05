import React, { useState } from "react";
import { Box, Color } from "ink";
import InkSelectInput, { Item } from "ink-select-input";
import { HostConfiguration } from "../index";
import ColorPipe from "ink-color-pipe";

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
  const { host, hostName } = config;
  let label = host;
  if (hostName) label = `${label}   (${hostName}) `;
  return label;
};

const toItem = (config: HostConfiguration, index: number): Item => {
  return {
    label: toLabel(config),
    key: index,
    value: config.identityFile.join(","),
  };
};

const toConfig = (
  item: Item,
  hostConfiguration: HostConfiguration[]
): HostConfiguration => {
  return hostConfiguration[item.key as number];
};

// Select list of host configurations
// Invokes `onSelect` when config selected
export const ConfigList = (props: Props) => {
  const { results, maxResults } = props;
  const DEFAULT_CONFIG_INDEX = 0;
  const [currentConfig, setCurrentConfig] = useState<HostConfiguration>(
    results[DEFAULT_CONFIG_INDEX]
  );
  const items = results.slice(0, maxResults).map(toItem);

  const handleSelect = (item: Item) => {
    const { identityFile } = toConfig(item, results);
    props.onSelect(identityFile);
  };

  const handleHighlight = (item: Item) => {
    setCurrentConfig(toConfig(item, results));
  };

  let hostname;
  if (currentConfig.hostName !== undefined) {
    hostname = (
      <>
        <ColorPipe styles="bgGreen.black">> Host Name</ColorPipe>
        <Color gray>{currentConfig.hostName}</Color>
      </>
    );
  }

  return (
    <Box minHeight={props.maxResults}>
      <Box width="50%">
        <InkSelectInput
          initialIndex={DEFAULT_CONFIG_INDEX}
          items={items}
          onHighlight={handleHighlight}
          onSelect={handleSelect}
        />
      </Box>
      <Box flexDirection="column">
        <ColorPipe styles="bgGreen.black">> Identity Files </ColorPipe>
        {currentConfig.identityFile.map(file => (
          <Color blue>{file}</Color>
        ))}
      </Box>
    </Box>
  );
};
