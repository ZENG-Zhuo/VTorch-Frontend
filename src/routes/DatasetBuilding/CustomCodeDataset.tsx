import { Flex, Input, Switch, Typography } from "antd";
import {} from "../../common/datasetTypes";
import { Editor } from "@monaco-editor/react";

export function CustomCodePage(code: string, setCode: (_: string) => void) {
    return (
        <div>
            <Editor
                theme="vs-dark"
                height={"70vh"}
                defaultLanguage="python"
                value={code}
                onChange={(v) => {
                    if (v) setCode(v);
                }}
            />
        </div>
    );
}

export function CustomCodeDatasetConfigurePage(
    customCodeDatasetDefinition: string,
    setCustomCodeDatasetDefinition: (_: string) => void
) {
    return (
        <div>
            <Flex justify="center" gap={"small"}>
                <Flex
                    vertical
                    // align="flex-end"
                    // justify="space-between"
                    // style={{ padding: 32 }}
                >
                    <Typography.Title level={3}>
                        Please put a line of code here declaring your custom
                        dataset
                    </Typography.Title>
                    <div>
                        <Input
                            style={{ width: "100%" }}
                            size="large"
                            prefix="dataset= "
                            value={customCodeDatasetDefinition}
                            onChange={(e) => {
                                setCustomCodeDatasetDefinition(e.target.value);
                            }}
                        />
                    </div>
                </Flex>
            </Flex>
        </div>
    );
}
