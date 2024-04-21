import { Flex, Input, InputNumber, Switch, Typography } from "antd";
import {
    TabularDatasetSetting,
    TabularSettingDefault,
} from "../../common/datasetTypes";

export function TabularFilePathPage(
    filePath: string,
    setFilePath: (_: string) => void
) {
    return (
        <div>
            <Flex justify="center" gap={"middle"}>
                <Flex
                    vertical
                    align="flex-end"
                    justify="space-between"
                    style={{ padding: 32 }}
                >
                    <Typography.Title level={3}>
                        Please enter the tabular file path(commonly extension:
                        .npy .csv .txt)
                    </Typography.Title>
                    <Input
                        size="large"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                    />
                </Flex>
            </Flex>
        </div>
    );
}

export function TabularConfigurePage(
    tabularSetting: TabularDatasetSetting,
    setTarbularSetting: (_: TabularDatasetSetting) => void
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
                        Please configure your tabular dataset
                    </Typography.Title>
                    <div>
                        <Input
                            style={{ width: "100%" }}
                            size="large"
                            prefix="targetColumn: "
                            value={tabularSetting.targetColumn}
                            placeholder={TabularSettingDefault.targetColumn}
                            onChange={(e) => {
                                if (e !== null)
                                    setTarbularSetting({
                                        ...tabularSetting,
                                        ["targetColumn"]: e.target.value,
                                    });
                            }}
                        />
                        <Input
                            size="large"
                            prefix="delimiter: "
                            value={tabularSetting.delimiter}
                            placeholder={TabularSettingDefault.delimiter}
                            onChange={(e) =>
                                setTarbularSetting({
                                    ...tabularSetting,
                                    ["delimiter"]: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        is the input an npy file:{" "}
                        <Switch
                            value={tabularSetting.isNPY}
                            onChange={(e) => {
                                setTarbularSetting({
                                    ...tabularSetting,
                                    ["isNPY"]: e,
                                });
                            }}
                        />
                    </div>
                </Flex>
            </Flex>
        </div>
    );
}
