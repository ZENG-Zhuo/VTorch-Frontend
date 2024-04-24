import { Button, Flex, Input, Popover, Switch, Typography } from "antd";
import { SegConfig, SegmentationDatasetInfo } from "../../common/datasetTypes";
import { transformsPopover } from "./TransformsPopover";
import { ClassInfo } from "../../common/pythonObjectTypes";

export function SegFilePathPage(
    filePaths: [string, string],
    setFilePaths: (_: [string, string]) => void
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
                        Please enter the segmentation image folder path(image
                        file should have extenstion .jpg):
                    </Typography.Title>
                    <Input
                        size="large"
                        value={filePaths[0]}
                        onChange={(e) =>
                            setFilePaths([e.target.value, filePaths[1]])
                        }
                    />
                    <Typography.Title level={3}>
                        Please enter the mask folder path(mask file should have
                        extension .png):
                    </Typography.Title>
                    <Input
                        size="large"
                        value={filePaths[1]}
                        onChange={(e) =>
                            setFilePaths([filePaths[0], e.target.value])
                        }
                    />
                </Flex>
            </Flex>
        </div>
    );
}

export function SegConfigPage(
    segConfig: SegConfig,
    setSegConfig: (_: SegConfig) => void,
    transformsClasses: Map<string, ClassInfo>,
    transformName: string,
    setTransformName: (newName: string) => void
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
                        Please configure your segmentation dataset
                    </Typography.Title>
                    <div>
                        <Popover
                            content={transformsPopover(
                                segConfig.transforms,
                                (newTransforms) => {
                                    const newSegConfig = { ...segConfig };
                                    newSegConfig.transforms = newTransforms;
                                    setSegConfig(newSegConfig);
                                },
                                transformsClasses,
                                transformName,
                                setTransformName
                            )}
                        >
                            <Button
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "baseline",
                                    justifyContent: "space-between",
                                }}
                                prefix={"transform"}
                                size="large"
                            >
                                <div
                                    style={{
                                        textAlign: "left",
                                    }}
                                ></div>
                                <div
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    Hang over to open the transform definition
                                    popover
                                </div>
                            </Button>
                        </Popover>
                    </div>
                </Flex>
            </Flex>
        </div>
    );
}
