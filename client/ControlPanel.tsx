import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ControlledTextFieldArray } from './ControlledFormComponent/ControlledTextFieldArray';
import { ITooltipHostStyles, Label, TooltipHost, } from '@fluentui/react';
import { GraphService } from './service/Graph';

const gs = GraphService.getInstance();

export const ControlPanel = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  const defaultFilter = [
    {
      value: '',
    }
  ];

  const defaultValues: FieldValues = {
    filter: defaultFilter,
  }

  const form = useForm({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: true
  });
  const { control, reset, handleSubmit } = form;

  const onSubmit = (data: FieldValues) => {
    gs.setFilter(data.filter.map((f: { value: string }) => f.value.trim()).filter(Boolean));
  }

  const tooltipId = useId('tooltip');
  const calloutProps = { gapSpace: 0 };
  // The TooltipHost root uses display: inline by default.
  // If that's causing sizing issues or tooltip positioning issues, try overriding to inline-block.
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

  return <div style={{
    position: 'relative',
  }}>
    <Panel
      headerText="Control Panel"
      isOpen={isOpen}
      onDismiss={dismissPanel}
      // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
      closeButtonAriaLabel="Close"
      type={PanelType.large}
      isLightDismiss={true}
      isHiddenOnDismiss={true}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label id="filter" >
            <TooltipHost
              content={
                <div>
                  See <a href="https://pnpm.io/filtering#matching" target="_blank">https://pnpm.io/filtering#matching</a>
                </div>
              }
              // This id is used on the tooltip itself, not the host
              // (so an element with this id only exists when the tooltip is shown)
              id={tooltipId}
              calloutProps={calloutProps}
              styles={hostStyles}
            >
              {'--filter'}
            </TooltipHost>
          </Label>
          <div style={{ marginBottom: 6 }}>
            <ControlledTextFieldArray
              name='filter'
              control={control}
            />
          </div>
          <PrimaryButton style={{ marginRight: 6 }} text="Search" type="submit" />
          <DefaultButton text="Clear" onClick={() => {
            gs.setFilter([]);
            reset(defaultValues);
          }} />
        </form>
      </FormProvider>
    </Panel>
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
      display: isOpen ? 'none' : 'block',
    }} onClick={openPanel}>
      <DefaultButton text="Open panel" onClick={openPanel} />
    </div>
  </div >
}