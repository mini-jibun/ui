import React from 'react';
import { Box, SpaceBetween, Input, InputProps } from '@cloudscape-design/components';


export type onInputEntryChange = (state: string) => void;
type InputEntryProps = {
  initValue: string,
  title: string,
  onChange: onInputEntryChange
};

const InputEntry = (props: InputEntryProps) => {
  const [value, setValue] = React.useState(props.initValue);
  const onChange = (detail: InputProps.ChangeDetail) => {
    setValue(detail.value);
    props.onChange(detail.value);
  };

  return (
    <>
      <Box float="left">
        <SpaceBetween direction="horizontal" size="m">
          <Box variant="p">{props.title}</Box>
          <Input
            value={value}
            onChange={({detail}) => {onChange(detail)}}
          />
        </SpaceBetween>
      </Box>
    </>
  );
};
export default InputEntry;
