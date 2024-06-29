import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  InfoLabel,
  DrawerBody,
  Text,
  Toolbar,
} from "@fluentui/react-components";
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  DataFunnel20Regular,
  Dismiss24Regular,
  Save20Regular,
  SpinnerIos20Regular,
} from "@fluentui/react-icons";
import { useBoolean } from "@fluentui/react-hooks";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { saveAs } from 'file-saver';
import { ControlledTextFieldArray } from "./ControlledFormComponent/ControlledTextFieldArray";
import { GraphService } from "./service/Graph";
import { useState } from "react";

const gs = GraphService.getInstance();

export const ControlPanel = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(true);
  const [isExpandActions, { toggle: toggleExpandActions }] = useBoolean(true);
  const [isExportingImage, setIsExportImage] = useState(false);

  const onSave = () => {
    console.log("on save");
    setIsExportImage(true);
    const blobPromise = gs.exportToPNG();
    if (!blobPromise) {
      console.log('Save failed, cy not initialized');
      setIsExportImage(false);
      return;
    }

    blobPromise.then((blob: Blob) => {
      saveAs(blob, `pnpm-workspace-graph.png`)
    }).catch((error) => {
      console.log('Error exporting image:', error);
    }).finally(() => {
      setIsExportImage(false);
    })
  };

  const defaultFilter = [
    {
      value: "",
    },
  ];

  const defaultValues: FieldValues = {
    filter: defaultFilter,
  };

  const form = useForm({
    defaultValues,
    shouldFocusError: true,
    shouldUnregister: true,
  });
  const { control, reset, handleSubmit } = form;

  const onSubmit = (data: FieldValues) => {
    gs.setFilter(
      data.filter.map((f: { value: string }) => f.value.trim()).filter(Boolean)
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Drawer
        open={isOpen}
        size="medium"
        position="bottom"
        onOpenChange={(_, { open }) => {
          if (open) {
            openPanel();
          } else {
            dismissPanel();
          }
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={dismissPanel}
              />
            }
          >
            Filter Settings
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InfoLabel
                info={
                  <div>
                    See{" "}
                    <a
                      href="https://pnpm.io/filtering#matching"
                      target="_blank"
                    >
                      https://pnpm.io/filtering#matching
                    </a>
                  </div>
                }
              >
                <Text size={400}>--filter</Text>
              </InfoLabel>
              <div style={{ marginBottom: 6 }}>
                <ControlledTextFieldArray name="filter" control={control} />
              </div>
              <Button
                appearance="primary"
                style={{ marginRight: 6 }}
                type="submit"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  gs.setFilter([]);
                  reset(defaultValues);
                }}
              >
                Clear
              </Button>
            </form>
          </FormProvider>
        </DrawerBody>
      </Drawer>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          display: isOpen ? "none" : "block",
        }}
      >
        <Toolbar>
          <Button
            appearance="subtle"
            icon={
              isExpandActions ? (
                <ChevronLeft20Regular />
              ) : (
                <ChevronRight20Regular />
              )
            }
            title={
              isExpandActions ? "Collapse Action Bar" : "Expand Action Bar"
            }
            onClick={toggleExpandActions}
          />
          <Button
            appearance="subtle"
            icon={<DataFunnel20Regular />}
            title="Filter Settings"
            onClick={openPanel}
          >
            {isExpandActions ? "Filter" : ""}
          </Button>
          <Button
            appearance="subtle"
            icon={isExportingImage ? <SpinnerIos20Regular /> : <Save20Regular />}
            disabled={isExportingImage}
            title="Save"
            onClick={onSave}
          >
            {isExpandActions ? "Save" : ""}
          </Button>
        </Toolbar>
      </div>
    </div>
  );
};
