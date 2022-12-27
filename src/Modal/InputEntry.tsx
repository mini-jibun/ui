import React from 'react';
import { Box, SpaceBetween, Input, InputProps } from '@cloudscape-design/components';

type InputEntryProps = {
  value: string;
  title: string;
  onChange: (state: string) => void;
}

const InputEntry = (props: InputEntryProps) => {
  const onChange = (detail: InputProps.ChangeDetail) => {
    props.onChange(detail.value);
  };

  return (
    <SpaceBetween direction="vertical" size="xs">
      <Box variant="p">{props.title}</Box>
      <Input
        value={props.value}
        onChange={({ detail }) => { onChange(detail) }}
      />
    </SpaceBetween>
  );
};
export default InputEntry;
