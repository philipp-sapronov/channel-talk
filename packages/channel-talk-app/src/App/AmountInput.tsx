import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";

export const AmountInput = ({
  onChange,
  amount,
  disabled,
}: {
  onChange: (value: number) => void;
  amount: number;
  disabled: boolean;
}) => {
  return (
    <FormControl>
      <FormLabel>Amount</FormLabel>
      <InputGroup>
        <InputLeftAddon>$</InputLeftAddon>
        <Input
          type="number"
          placeholder="Amount"
          variant="filled"
          onChange={(e) => {
            onChange(e.target.valueAsNumber);
          }}
          disabled={disabled}
          value={amount}
        />
      </InputGroup>
    </FormControl>
  );
};
