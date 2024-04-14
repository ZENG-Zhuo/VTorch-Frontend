import {
    Breadcrumb,
    Button,
    Card,
    Flex,
    Input,
    Layout,
    List,
    Menu,
    Popover,
    Select,
    Steps,
    Switch,
    Typography,
    message,
    theme,
} from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { cpuUsage } from "process";
import { useState } from "react";
import { UnaryExpression } from "typescript";
import { Database } from "../../common/objectStorage";
import { updateDatabase } from "../../dataCom";
import { FileModuleNode, FolderModuleNode } from "../../common/pythonFileTypes";
import { ClassInfo } from "../../common/pythonObjectTypes";
import { PlusOutlined } from "@ant-design/icons";
const { Content, Footer, Header } = Layout;
const items = new Array(0).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

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

type TransformInstance = {
    name: string;
    parameters: string[];
};

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
    const [databaseName, setDatabaseName] = useState("");
    const [databaseLoaded, setDatabaseLoaded] = useState(
        Database.packages.size > 0
    );
    const [popoverChange, setPopoverChange] = useState(true);
    const [torchvisionDatasetName, setTorchvisionDatasetName] = useState("");
    let datasetOptions: { value: string; label: string }[] = [];
    let torchvisionDatasets: FolderModuleNode | FileModuleNode | undefined;
    let torchvisionDatasetsClasses: Map<string, ClassInfo> = new Map();
    if (!databaseLoaded) {
        updateDatabase(() => {
            setDatabaseLoaded(true);
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
    const targetTorchvisionDatasetInitFuncParams =
        targetTorchvisionDataset?.functions
            .find((f) => f.name === "__init__")
            ?.parameters.slice(1);
    const targetTorchvisionDatasetInitFuncValues: (
        | string
        | TransformInstance[]
        | undefined
    )[] = [];
    targetTorchvisionDatasetInitFuncParams?.forEach(() => {
        targetTorchvisionDatasetInitFuncValues.push(undefined);
    });
    console.log("Params: ", targetTorchvisionDatasetInitFuncParams);

    function popOverContent(paramId: number) {
        if (targetTorchvisionDatasetInitFuncValues[paramId] === undefined) {
            targetTorchvisionDatasetInitFuncValues[paramId] =
                [] as TransformInstance[];
        }
        const param = targetTorchvisionDatasetInitFuncValues[paramId];

        const transformInstances = param as TransformInstance[];
        return (
            <div>
                <List
                    size="large"
                    header={<div>Header</div>}
                    footer={
                        <div>
                            <Button
                                style={{ width: "100%" }}
                                size="large"
                                onClick={() => {
                                    transformInstances.push({
                                        name: "new",
                                        parameters: [],
                                    });
                                    setPopoverChange(!popoverChange);
                                    console.log("transforms: ",
                                        transformInstances
                                    );
                                }}
                            >
                                <PlusOutlined />
                            </Button>
                        </div>
                    }
                    bordered
                    dataSource={
                        popoverChange ? transformInstances : transformInstances
                    }
                    renderItem={(item) => (
                        <List.Item>
                            <div>{item.name}</div>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
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
                                loading={!databaseLoaded}
                                placeholder="Select a torchvision database"
                                optionFilterProp="children"
                                filterOption={filterOption}
                                value={torchvisionDatasetName}
                                onChange={(v) => {
                                    setTorchvisionDatasetName(v);
                                }}
                                options={databaseLoaded ? datasetOptions : []}
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
                                                    content={popOverContent(i)}
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
            component: [<div></div>, <div></div>],
        },
        {
            text: "Build your own image classification dataset",
            component: [<div></div>, <div></div>],
        },
        {
            text: "Build your own image segmentatio dataset",
            component: [<div></div>, <div></div>],
        },
        {
            text: "Build your own text dataset",
            component: [<div></div>, <div></div>],
        },
        {
            text: "Build dataset by code",
            component: [<div></div>, <div></div>],
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
                            value={databaseName}
                            onChange={(e) => {
                                setDatabaseName(e.target.value);
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
            if (checkedId !== -1 && databaseName !== "")
                setCurrent(current + 1);
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
                    <Header style={{ display: "flex", alignItems: "center" }}>
                        <div className="demo-logo" />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            items={items}
                            style={{ flex: 1, minWidth: 0 }}
                        />
                    </Header>
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
                                {current < steps.length - 1 && (
                                    <Button
                                        type="primary"
                                        onClick={() => next()}
                                    >
                                        Next
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button type="primary" onClick={() => {}}>
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
                        VTorch {new Date().getFullYear()} Created by HKUST
                        student
                    </Footer>
                </Layout>
            </div>
        </>
    );
}
