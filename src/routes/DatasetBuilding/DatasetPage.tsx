import {
    Breadcrumb,
    Button,
    Card,
    Input,
    Layout,
    Menu,
    Select,
    Steps,
    Switch,
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
    const [torchvisionDatabaseName, setTorchvisionDatabaseName] = useState("");
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
    const datasetTemplatesData = [
        {
            text: "Select from torchvision dataset",
            component: [
                <div>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        loading={!databaseLoaded}
                        placeholder="Select a torchvision database"
                        optionFilterProp="children"
                        filterOption={filterOption}
                        onChange={(v) => {
                            setTorchvisionDatabaseName(v);
                        }}
                        options={databaseLoaded ? datasetOptions : []}
                    />
                </div>,
                <div></div>,
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
            content: <div></div>,
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
