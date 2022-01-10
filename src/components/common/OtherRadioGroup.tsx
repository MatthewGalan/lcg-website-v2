import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface OtherRadioGroupProps {
  label: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function OtherRadioGroup({
  label,
  options,
  onChange,
}: OtherRadioGroupProps) {
  const [radioValue, setRadioValue] = useState<string>(options[0]);
  const [otherValue, setOtherValue] = useState<string>("");

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        value={radioValue}
        onChange={(e) => {
          setRadioValue(e.target.value);
          onChange(e.target.value === "Other" ? otherValue : e.target.value);
        }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={`${option}-${index}`}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
        <FormControlLabel
          value="Other"
          control={<Radio />}
          label={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Other</Typography>
              {radioValue === "Other" && (
                <TextField
                  label=""
                  size="small"
                  value={otherValue}
                  onChange={(e) => {
                    setOtherValue(e.target.value);
                    onChange(e.target.value);
                  }}
                />
              )}
            </Stack>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}
