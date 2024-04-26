import { useContext, useState } from "react";
import { DatasetContext } from "../DatasetBuilding/DatasetPage";
import { DatasetInfo } from "../../common/datasetTypes";
import {
    Button,
    Col,
    Flex,
    Input,
    Layout,
    List,
    Modal,
    Row,
    Select,
    Typography,
    message,
    theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import {
    genCode,
    getDatasetInfos,
    getModules,
    updateDatabase,
} from "../../communication";
import { Database } from "../../common/objectStorage";
import { ClassInfo, ParameterInfo } from "../../common/pythonObjectTypes";
import {
    DefaultOptimizerConfig,
    OptimizerConfig,
} from "../../common/optimizerTypes";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";

export default function CodeGenerationPage() {
    const {
        token: {
            colorBgContainer,
            borderRadiusLG,
            colorTextTertiary,
            colorFillAlter,
            colorBorder,
        },
    } = theme.useToken();
    const [datasetInfos, setDatasetInfos] = useState<
        Map<string, DatasetInfo> | undefined
    >(undefined);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const [optimizerInfo, setOptimizerInfo] = useState<OptimizerConfig>(
        DefaultOptimizerConfig
    );
    const [databaseLoaded, setDatabaseLoaded] = useState(
        Database.packages.size > 0
    );
    const [dataloaderClass, setDataloaderClass] = useState<
        ClassInfo | undefined
    >(undefined);
    const [dataloaderParams, setDataloaderParams] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedLoss, setSelectedLoss] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [code, setCode] = useState("");
    const [modulesName, setmodulesName] = useState<string[] | undefined>();
    const [lock, setLock] = useState<boolean>(true);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const msgKey = "codeGen Page";
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    if (!datasetInfos) {
        getDatasetInfos(setDatasetInfos);
    }
    let optimizers: Map<string, ClassInfo> = new Map();
    if (!modulesName) {
        getModules().then((r) => {
            r.json().then((d) => {
                setmodulesName(d);
            });
        });
    }
    if (!databaseLoaded) {
        if (lock) {
            setLock(false);

            updateDatabase(() => {
                const trochId = Database.findPackage("torch", "1.0.0");
                if (trochId) {
                    const torch = Database.getPackage(trochId);
                    const utilsDataId = torch.getSubModule(
                        ["torch", "utils", "data"],
                        false
                    );
                    if (utilsDataId) {
                        const utilsData = Database.getNode(utilsDataId);
                        const dataLoader = utilsData.getClass("DataLoader");
                        if (dataLoader) {
                            setDataloaderClass(dataLoader);
                            const __init__ =
                                dataLoader.getFunctions("__init__");
                            if (__init__.length === 0) {
                                throw "dataloader has no init function!";
                            }
                            setDataloaderParams(
                                Array(__init__[0].parameters.length - 2).fill(
                                    ""
                                )
                            );
                        } else {
                            throw "DataLoader not found!";
                        }
                    } else throw "torch.utils.data not found!";
                }
                setDatabaseLoaded(true);
            });
        }
    } else {
        optimizers.clear();
        const trochId = Database.findPackage("torch", "1.0.0");
        if (trochId) {
            const torch = Database.getPackage(trochId);
            const optimId = torch.getSubModule(["torch", "optim"], false);
            if (optimId) {
                const optim = Database.getNode(optimId);
                optim.getClasses().map((nameAndClassInfo) => {
                    optimizers.set(nameAndClassInfo[0], nameAndClassInfo[1]);
                });
            } else throw "torch.optim not found";
        } else throw "Torch not found!";
    }
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
                        <Title>Only one step to sucess!</Title>
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
                            <Row>
                                <Col span={8}>
                                    <Title level={5}>
                                        Select your datasets model and loss
                                        function
                                    </Title>

                                    <Flex vertical gap={"large"}>
                                        <div>
                                            Train Dataset:
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select a built database"
                                                optionFilterProp="children"
                                                loading={
                                                    datasetInfos === undefined
                                                }
                                                filterOption={filterOption}
                                                value={selectedDataset}
                                                onChange={(v) => {
                                                    setSelectedDataset(v);
                                                }}
                                                options={
                                                    datasetInfos
                                                        ? Array.from(
                                                              datasetInfos,
                                                              (v) => {
                                                                  return {
                                                                      label: v[0],
                                                                      value: v[0],
                                                                  };
                                                              }
                                                          )
                                                        : []
                                                }
                                            />
                                        </div>
                                        <div>
                                            Model:{" "}
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select a model"
                                                optionFilterProp="children"
                                                loading={
                                                    datasetInfos === undefined
                                                }
                                                filterOption={filterOption}
                                                value={selectedModel}
                                                onChange={(v) => {
                                                    setSelectedModel(v);
                                                }}
                                                options={
                                                    modulesName
                                                        ? modulesName.map(
                                                              (name) => {
                                                                  return {
                                                                      label: name,
                                                                      value: name,
                                                                  };
                                                              }
                                                          )
                                                        : []
                                                }
                                            />
                                        </div>
                                        <div>
                                            Loss:{" "}
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select a loss"
                                                optionFilterProp="children"
                                                loading={
                                                    datasetInfos === undefined
                                                }
                                                filterOption={filterOption}
                                                value={selectedLoss}
                                                onChange={(v) => {
                                                    setSelectedLoss(v);
                                                }}
                                                options={
                                                    modulesName
                                                        ? modulesName.map(
                                                              (name) => {
                                                                  return {
                                                                      label: name,
                                                                      value: name,
                                                                  };
                                                              }
                                                          )
                                                        : []
                                                }
                                            />
                                        </div>
                                    </Flex>
                                </Col>
                                <Col span={8}>
                                    <Title level={5}>
                                        Configure your optimizer
                                    </Title>
                                    <div>
                                        Optimizer:{" "}
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            optionFilterProp="children"
                                            loading={!databaseLoaded}
                                            filterOption={filterOption}
                                            value={optimizerInfo.name}
                                            onChange={(v) => {
                                                setOptimizerInfo(() => {
                                                    return {
                                                        name: v,
                                                        parameters: Array(
                                                            optimizers
                                                                .get(v)!
                                                                .getFunctions(
                                                                    "__init__"
                                                                )[0].parameters
                                                                .length - 2
                                                        ).fill(undefined),
                                                    };
                                                });
                                            }}
                                            options={
                                                databaseLoaded
                                                    ? Array.from(
                                                          optimizers,
                                                          (entry) => {
                                                              return {
                                                                  label: entry[0],
                                                                  value: entry[0],
                                                              };
                                                          }
                                                      )
                                                    : []
                                            }
                                        />
                                    </div>
                                    <List
                                        style={{ width: "80%" }}
                                        size="large"
                                        loading={!databaseLoaded}
                                        header={
                                            <Typography.Title level={4}>
                                                Configure the optimizer(
                                                {optimizerInfo.name})
                                            </Typography.Title>
                                        }
                                        footer={<div></div>}
                                        bordered
                                        dataSource={
                                            optimizerInfo.name === ""
                                                ? ([] as ParameterInfo[])
                                                : optimizers
                                                      .get(optimizerInfo.name)!
                                                      .getFunctions(
                                                          "__init__"
                                                      )[0]
                                                      .parameters.slice(2)
                                        }
                                        renderItem={(param, i) => {
                                            return (
                                                <Input
                                                    prefix={param.name}
                                                    size="large"
                                                    placeholder={
                                                        param.initial_value
                                                    }
                                                    value={
                                                        optimizerInfo
                                                            .parameters[i]
                                                    }
                                                    onChange={(e) => {
                                                        setOptimizerInfo(
                                                            (prev) => {
                                                                const newParam =
                                                                    [
                                                                        ...prev.parameters,
                                                                    ];
                                                                newParam[i] =
                                                                    e.target.value;
                                                                return {
                                                                    ...prev,
                                                                    ["parameters"]:
                                                                        newParam,
                                                                };
                                                            }
                                                        );
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Title level={5}>
                                        Configure your dataloader
                                    </Title>
                                    <List
                                        style={{ width: "80%" }}
                                        size="large"
                                        loading={!dataloaderClass}
                                        header={
                                            <Typography.Title level={4}>
                                                Configure the DataLoader
                                            </Typography.Title>
                                        }
                                        footer={<div></div>}
                                        bordered
                                        dataSource={
                                            dataloaderClass
                                                ? dataloaderClass
                                                      .getFunctions(
                                                          "__init__"
                                                      )[0]
                                                      .parameters.slice(2)
                                                : ([] as ParameterInfo[])
                                        }
                                        renderItem={(param, i) => {
                                            return (
                                                <Input
                                                    prefix={param.name}
                                                    size="large"
                                                    placeholder={
                                                        param.initial_value
                                                    }
                                                    value={dataloaderParams[i]}
                                                    onChange={(e) => {
                                                        setDataloaderParams(
                                                            (prev) => {
                                                                const newParam =
                                                                    [...prev];
                                                                newParam[i] =
                                                                    e.target.value;
                                                                return newParam;
                                                            }
                                                        );
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                    <Link to={"/homePage"}>
                                        <Button size="large">
                                            Back to homePage
                                        </Button>
                                    </Link>
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            genCode({
                                                datasetName: selectedDataset,
                                                modelName: selectedModel,
                                                lossName: selectedLoss,
                                                optimizerConfig: optimizerInfo,
                                                dataloaderParams:
                                                    dataloaderParams,
                                            }).then((r) => {
                                                if (r.status === 200) {
                                                    r.text().then((d) => {
                                                        setCode(d);
                                                        setIsModalOpen(true);
                                                    });
                                                } else {
                                                    r.text().then((d) => {
                                                        messageApi.open({
                                                            key: msgKey,
                                                            type: "error",
                                                            content: d,
                                                            duration: 7,
                                                        });
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        <Title level={5}>
                                            Generate your custom model
                                        </Title>
                                    </Button>
                                    <Modal
                                        title="Basic Modal"
                                        open={isModalOpen}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        width={1000}
                                    >
                                        <Title level={5}>Generated code:</Title>
                                        <Editor
                                            theme="vs-dark"
                                            height={"70vh"}
                                            defaultLanguage="python"
                                            value={code}
                                            onChange={(v) => {
                                                if (v) setCode(v);
                                            }}
                                        />
                                    </Modal>
                                </Col>
                            </Row>
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
