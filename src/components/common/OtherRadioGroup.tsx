import React from "react";
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
  value: string;
  onChange: (value: string) => void;
}

export default function OtherRadioGroup({
  label,
  options,
  value,
  onChange,
}: OtherRadioGroupProps) {
  const radioValue = options.includes(value) ? value : "Other";

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={label}
        value={radioValue}
        onChange={(e) =>
          e.target.value === "Other" ? onChange("") : onChange(e.target.value)
        }
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
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </Stack>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}
