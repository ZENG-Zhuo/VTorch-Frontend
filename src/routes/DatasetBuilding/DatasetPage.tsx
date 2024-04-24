import {
    Button,
    Card,
    Flex,
    Input,
    Layout,
    List,
    Popover,
    Select,
    Steps,
    Switch,
    Typography,
    message,
    theme,
} from "antd";
import Title from "antd/es/typography/Title";
import { createContext, useContext, useState } from "react";
import { Database } from "../../common/objectStorage";
import {
    getDatasetInfos,
    setDatasetInfo,
    updateDatabase,
} from "../../communication";
import { FileModuleNode, FolderModuleNode } from "../../common/pythonFileTypes";
import { ClassInfo } from "../../common/pythonObjectTypes";
import { transformsPopover } from "./TransformsPopover";
import {
    CustomCodeConfig,
    CustomCodeDatasetInfo,
    CutomCodeDefault,
    DatasetInfo,
    SegConfig,
    SegDefault,
    SegmentationDatasetInfo,
    TabularDatasetInfo,
    TabularDatasetSetting,
    TabularSettingDefault,
    TorchvisionDatasetInfo,
    TransformInstance,
} from "../../common/datasetTypes";
import { TabularConfigurePage, TabularFilePathPage } from "./TabularDataset";
import { Link } from "react-router-dom";
import { SegConfigPage, SegFilePathPage } from "./SegDataset";
import {
    CustomCodeDatasetConfigurePage,
    CustomCodePage,
} from "./CustomCodeDataset";
const { Content, Footer, Header } = Layout;
const gridStyle: React.CSSProperties = {
    width: "50%",
    textAlign: "center",
};

class DatasetTemplate {
    text: string;
    constructor(text: string) {
        this.text = text;
    }
}

export const DatasetContext = createContext<Map<string, DatasetInfo>>(
    new Map()
);

export default function DatasetPage() {
    const {
        token: {
            colorBgContainer,
            borderRadiusLG,
            colorTextTertiary,
            colorFillAlter,
            colorBorder,
        },
    } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [checkedId, setCheckedId] = useState(-1);
    const [datasetName, setDatasetName] = useState("");
    const [datasetLoaded, setDatasetLoaded] = useState(
        Database.packages.size > 0
    );
    const [torchvisionDatasetName, setTorchvisionDatasetName] = useState("");
    const [transformName, setTransformName] = useState("");
    const [
        targetTorchvisionDatasetInitFuncValues,
        setTargetTorchvisionDatasetInitFuncValues,
    ] = useState<(string | TransformInstance[] | undefined)[]>([]);
    const [tabularSetting, setTarbularSetting] =
        useState<TabularDatasetSetting>(TabularSettingDefault);
    const [segConfig, setSegConfig] = useState<SegConfig>(SegDefault);
    const [CCDConfig, setCCDConfig] =
        useState<CustomCodeConfig>(CutomCodeDefault);
    let datasetOptions: { value: string; label: string }[] = [];
    let torchvisionDatasets: FolderModuleNode | FileModuleNode | undefined;
    let torchvisionDatasetsClasses: Map<string, ClassInfo> = new Map();
    let transformsClasses: Map<string, ClassInfo> = new Map();
    if (!datasetLoaded) {
        updateDatabase(() => {
            setDatasetLoaded(true);
        });
    } else {
        const torchvisionId = Database.findPackage("torchvision", "1.0.0");
        if (torchvisionId) {
            const torchvision = Database.getPackage(torchvisionId);
            const datasetsId = torchvision.getSubModule(
                ["torchvision", "datasets"],
                false
            );
            if (datasetsId) {
                torchvisionDatasets = Database.getNode(datasetsId);
                torchvisionDatasets.classes.map((c) => {
                    torchvisionDatasetsClasses.set(c.name, c);
                });
                Array.from(torchvisionDatasets.importedClasses, (entry) => {
                    const classFound = torchvisionDatasets!.getClass(entry[0]);
                    if (classFound) {
                        torchvisionDatasetsClasses.set(entry[0], classFound);
                    } else {
                        throw "Invalid import info: " + entry[0];
                    }
                });
            } else {
                console.log(Database.packages);
                throw "torchviison.datasets not loaded";
            }
            const transformsId = torchvision.getSubModule(
                ["torchvision", "transforms"],
                false
            );
            if (transformsId) {
                const transformsPackage = Database.getNode(transformsId);
                transformsPackage.classes.map((c) => {
                    transformsClasses.set(c.name, c);
                });
                Array.from(transformsPackage.importedClasses, (entry) => {
                    const classFound = transformsPackage!.getClass(entry[0]);
                    if (classFound) {
                        transformsClasses.set(entry[0], classFound);
                    } else {
                        throw "Invalid import info: " + entry[0];
                    }
                });
            } else {
                throw "torchvision.transforms not found";
            }
        } else throw "torchvision not loaded!";
        datasetOptions = Array.from(
            torchvisionDatasetsClasses,
            (nameAndClassInfo) => {
                return {
                    value: nameAndClassInfo[0],
                    label: nameAndClassInfo[0],
                };
            }
        );
    }
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const targetTorchvisionDataset = torchvisionDatasetsClasses.get(
        torchvisionDatasetName
    );
    const targetTorchvisionDatasetInitFuncParams = targetTorchvisionDataset
        ?.getFunctions("__init__")[0]
        ?.parameters.slice(1);

    if (targetTorchvisionDatasetInitFuncValues.length === 0)
        targetTorchvisionDatasetInitFuncParams?.forEach(() => {
            targetTorchvisionDatasetInitFuncValues.push(undefined);
        });

    const datasetTemplatesData = [
        {
            text: "Select from torchvision dataset",
            component: [
                <div>
                    <Flex justify="center" gap={"middle"}>
                        <Flex
                            vertical
                            align="flex-end"
                            justify="space-between"
                            style={{ padding: 32 }}
                        >
                            <Typography.Title level={3}>
                                Please select a torchvision dataset
                            </Typography.Title>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                loading={!datasetLoaded}
                                placeholder="Select a torchvision database"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                value={torchvisionDatasetName}
                                onChange={(v) => {
                                    setTorchvisionDatasetName(v);
                                }}
                                options={datasetLoaded ? datasetOptions : []}
                            />
                        </Flex>
                    </Flex>
                </div>,
                <div>
                    {torchvisionDatasetName !== "" ? (
                        <Flex justify="center">
                            <List
                                style={{ width: "80%" }}
                                size="large"
                                header={
                                    <Typography.Title level={4}>
                                        Configure the target Dataset(
                                        {targetTorchvisionDataset?.name})
                                    </Typography.Title>
                                }
                                footer={<div></div>}
                                bordered
                                dataSource={
                                    targetTorchvisionDatasetInitFuncParams!
                                }
                                renderItem={(param, i) => {
                                    if (param.name.includes("transform")) {
                                        return (
                                            <div>
                                                <Popover
                                                    content={transformsPopover(
                                                        targetTorchvisionDatasetInitFuncValues[
                                                            i
                                                        ],
                                                        (newTransforms) => {
                                                            setTargetTorchvisionDatasetInitFuncValues(
                                                                (prev) => {
                                                                    const newValues =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    newValues[
                                                                        i
                                                                    ] =
                                                                        newTransforms;
                                                                    return newValues;
                                                                }
                                                            );
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
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "baseline",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                        prefix={param.name}
                                                        size="large"
                                                    >
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {param.name}
                                                        </div>
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            Hang over to open
                                                            the transform
                                                            definition popover
                                                        </div>
                                                    </Button>
                                                </Popover>
                                            </div>
                                        );
                                    } else
                                        return (
                                            <div>
                                                <Input
                                                    prefix={param.name}
                                                    size="large"
                                                    placeholder={
                                                        param.initial_value
                                                    }
                                                    onChange={(e) => {
                                                        targetTorchvisionDatasetInitFuncValues[
                                                            i
                                                        ] = e.target.value;
                                                    }}
                                                />
                                            </div>
                                        );
                                }}
                            />
                        </Flex>
                    ) : undefined}
                </div>,
            ],
        },
        {
            text: "Build your own tabular dataset",
            component: [
                TabularFilePathPage(tabularSetting.filePath, (filePath) => {
                    setTarbularSetting((prev) => ({
                        ...prev,
                        ["filePath"]: filePath,
                    }));
                }),
                TabularConfigurePage(tabularSetting, setTarbularSetting),
            ],
        },
        {
            text: "Build your own image segmentatio dataset",
            component: [
                SegFilePathPage(
                    [segConfig.imgDir, segConfig.maskDir],
                    (dirs) => {
                        setSegConfig({
                            ...segConfig,
                            ["imgDir"]: dirs[0],
                            ["maskDir"]: dirs[1],
                        });
                    }
                ),
                SegConfigPage(
                    segConfig,
                    setSegConfig,
                    transformsClasses,
                    transformName,
                    setTransformName
                ),
            ],
        },
        {
            text: "Build dataset by code",
            component: [
                CustomCodePage(CCDConfig.code, (newCode) => {
                    setCCDConfig({ ...CCDConfig, ["code"]: newCode });
                }),
                CustomCodeDatasetConfigurePage(
                    CCDConfig.datasetDefinition,
                    (newCode) => {
                        setCCDConfig({
                            ...CCDConfig,
                            ["datasetDefinition"]: newCode,
                        });
                    }
                ),
            ],
        },
    ];

    const datasetTemplates = datasetTemplatesData.map(
        (data) => new DatasetTemplate(data.text)
    );
    const steps = [
        {
            title: "First",
            content: (
                <div>
                    <div>
                        <Input
                            prefix="Dataset name"
                            size="large"
                            placeholder="CustomDataset"
                            value={datasetName}
                            onChange={(e) => {
                                setDatasetName(e.target.value);
                            }}
                        ></Input>
                    </div>
                    <Card title="Dataset Templates">
                        {datasetTemplates.map((template, index) => {
                            return (
                                <Card.Grid style={gridStyle}>
                                    {template.text}
                                    <Switch
                                        value={index === checkedId}
                                        onChange={(checked) => {
                                            if (checked) setCheckedId(index);
                                            else if (checkedId === index)
                                                setCheckedId(-1);
                                        }}
                                    />
                                </Card.Grid>
                            );
                        })}
                    </Card>
                </div>
            ),
        },
        {
            title: "Second",
            content: <div>{datasetTemplatesData[checkedId]?.component[0]}</div>,
        },
        {
            title: "Last",
            content: <div>{datasetTemplatesData[checkedId]?.component[1]}</div>,
        },
    ];
    const stepItems = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const [messageApi, contextHolder] = message.useMessage();
    const msgKey = "datasetPage";

    const next = () => {
        if (current === 0) {
            if (checkedId !== -1 && datasetName !== "") setCurrent(current + 1);
            else
                messageApi.open({
                    key: msgKey,
                    type: "error",
                    content: "Need input",
                    duration: 2,
                });
        } else setCurrent(current + 1);
    };

    const prev = () => {
        setTargetTorchvisionDatasetInitFuncValues([]);
        setCurrent(current - 1);
    };
    const contentStyle: React.CSSProperties = {
        lineHeight: "260px",
        textAlign: "center",
        color: colorTextTertiary,
        backgroundColor: colorFillAlter,
        borderRadius: borderRadiusLG,
        border: `1px dashed ${colorBorder}`,
        marginTop: 16,
    };
    return (
        <>
            {contextHolder}
            <div>
                <Layout>
                    <Header
                        style={{ display: "flex", alignItems: "center" }}
                    ></Header>
                    <Content
                        style={{ padding: "0 48px", alignItems: "center" }}
                    >
                        <Title>Dataset Building</Title>
                        <div
                            style={{
                                background: colorBgContainer,
                                width: "100%",
                                height: "100%",
                                minHeight: 750,
                                padding: 24,
                                borderRadius: borderRadiusLG,
                                alignItems: "center",
                            }}
                        >
                            <Steps current={current} items={stepItems} />
                            <div style={contentStyle}>
                                {steps[current].content}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <Link to={"/homePage"}>
                                    <Button>Back to homePage</Button>
                                </Link>
                                {current < steps.length - 1 && (
                                    <Button
                                        type="primary"
                                        onClick={() => next()}
                                    >
                                        Next
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            switch (checkedId) {
                                                case 0:
                                                    setDatasetInfo(
                                                        datasetName,
                                                        new TorchvisionDatasetInfo(
                                                            datasetName,
                                                            torchvisionDatasetName,
                                                            targetTorchvisionDatasetInitFuncValues
                                                        )
                                                    );
                                                    break;
                                                case 1:
                                                    setDatasetInfo(
                                                        datasetName,
                                                        new TabularDatasetInfo(
                                                            datasetName,
                                                            tabularSetting
                                                        )
                                                    );
                                                    break;
                                                case 2:
                                                    setDatasetInfo(
                                                        datasetName,
                                                        new SegmentationDatasetInfo(
                                                            datasetName,
                                                            segConfig
                                                        )
                                                    );
                                                    break;

                                                case 3:
                                                    setDatasetInfo(
                                                        datasetName,
                                                        new CustomCodeDatasetInfo(
                                                            datasetName,
                                                            CCDConfig
                                                        )
                                                    );
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }}
                                    >
                                        Done
                                    </Button>
                                )}
                                {current > 0 && (
                                    <Button
                                        style={{ margin: "0 8px" }}
                                        onClick={() => prev()}
                                    >
                                        Previous
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        VTorch {new Date().getFullYear()} Created by LPDAN1 FYP
                        group
                    </Footer>
                </Layout>
            </div>
        </>
    );
}
