import React, { useState, Fragment } from "react";
import { Box } from "ink";
import { OnPasswordSubmitted } from "./app";
import InkTextInput from "ink-text-input";

interface Props {
  onPasswordSubmitted: OnPasswordSubmitted;
  identityFile: string;
}

export const PasswordDialog = (props: Props) => {
  const { identityFile, onPasswordSubmitted } = props;
  const [password, setPassword] = useState("");

  return (
    <Fragment>
      <Box width="100%">
        <Box>Enter passphrase for ${identityFile} 🔑 : </Box>
        <InkTextInput
          onSubmit={onPasswordSubmitted}
          value={password}
          onChange={setPassword}
          mask="*"
        />
      </Box>
    </Fragment>
  );
};
