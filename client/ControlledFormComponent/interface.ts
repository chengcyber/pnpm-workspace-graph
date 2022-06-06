/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Control,
  RegisterOptions,
  UseFormSetValue,
  FieldValues,
} from "react-hook-form";

export interface IHookFormProps<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  V extends any = any,
  FV extends FieldValues = FieldValues
> {
  control: Control<FV>;
  name: string;
  rules?: RegisterOptions;
  defaultValue?: V;
  setValue?: UseFormSetValue<FV>;
}
