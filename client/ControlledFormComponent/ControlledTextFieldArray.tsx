import {
  Text,
  Button,
  Input,
  makeStyles,
  type InputProps,
} from "@fluentui/react-components";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Add20Regular, Delete20Regular } from "@fluentui/react-icons";

import type { IHookFormProps } from "./interface";

export type IControlledTextFieldArrayProps = InputProps &
  IHookFormProps<string>;

const useStackStyle = makeStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      width: 'auto',
      height: 'auto',
      boxSizing: 'border-box',
      '> *': {
        textOverflow: 'ellipsis',
      },
      '> :not(:first-child)': {
        marginTop: '0px',
      },
      '> *:not(.ms-StackItem)': {
        flexShrink: 1,
      },
    },
  })

const useInputStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: "100%",
  },
});

export const ControlledTextFieldArray = (
  props: IControlledTextFieldArrayProps
): JSX.Element => {
  const { name, control, rules, defaultValue } = props;
  const { fields, remove, append } = useFieldArray({
    name,
    control,
  });
  const { getValues } = useFormContext();
  const arrayValues: { value: string | number }[] = getValues(name);
  const inputStyle = useInputStyles();
  const stackStyle = useStackStyle();

  return (
      <div className={stackStyle.root}>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <div className={stackStyle.root} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Controller
                  name={`${name}.${index}.value`}
                  control={control}
                  rules={rules}
                  defaultValue={defaultValue}
                  render={({
                    field: { onChange, value, onBlur, name: fieldName },
                    fieldState: { error },
                  }) => {
                    return (
                      <div className={stackStyle.root} style={{ flex: 'auto' }}>
                        <Input
                          className={inputStyle.root}
                          {...props}
                          onChange={(e, { value }) => {
                            onChange(value);
                          }}
                          value={value}
                          onBlur={onBlur}
                          name={fieldName}
                          contentAfter={error && error.message}
                        />
                        {
                          error ? (
                            <Text style={{ color: 'red' }}>{error.message}</Text>
                          ) : null
                        }
                      </div>
                    );
                  }}
                />
                {arrayValues.length > 1 ? (
                  <Button
                  appearance="subtle"
                    icon={<Delete20Regular />}
                    title="delete"
                    onClick={() => remove(index)}
                  ></Button>
                ) : null}
              </div>
            </div>
          );
        })}
        <Button
          appearance="subtle"
          icon={<Add20Regular />}
          title="Add"
          onClick={() => {
            append({
              value: "",
            });
          }}
        ></Button>
      </div>
  );
};
