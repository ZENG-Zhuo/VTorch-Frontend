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
    Row,
    Select,
    Typography,
    theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { getDatasetInfos, updateDatabase } from "../../communication";
import { Database } from "../../common/objectStorage";
import { ClassInfo, ParameterInfo } from "../../common/pythonObjectTypes";
import {
    DefaultOptimizerConfig,
    OptimizerConfig,
} from "../../common/optimizerTypes";

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
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    if (!datasetInfos) {
        getDatasetInfos(setDatasetInfos);
    }
    let optimizers: Map<string, ClassInfo> = new Map();
    if (!databaseLoaded) {
        updateDatabase(() => {
            setDatabaseLoaded(true);
        });
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
        <div>
            Code Generation Page
            <Layout>
                <Header
                    style={{ display: "flex", alignItems: "center" }}
                ></Header>
                <Content style={{ padding: "0 48px", alignItems: "center" }}>
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
                                    Select your datasets model and loss function
                                </Title>

                                <Flex vertical gap={"large"}>
                                    <div>
                                        Dataset:
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Select a built database"
                                            optionFilterProp="children"
                                            loading={datasetInfos === undefined}
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
                                        Model: <Select />
                                    </div>
                                    <div>
                                        Loss: <Select />
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
                                        placeholder="Select a built database"
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
                                                  .getFunctions("__init__")[0]
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
                                                    optimizerInfo.parameters[i]
                                                }
                                                onChange={(e) => {
                                                    setOptimizerInfo((prev) => {
                                                        const newParam = [
                                                            ...prev.parameters,
                                                        ];
                                                        newParam[i] =
                                                            e.target.value;
                                                        return {
                                                            ...prev,
                                                            ["parameters"]:
                                                                newParam,
                                                        };
                                                    });
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </Col>
                            <Col span={8}>
                                <Button size="large">
                                    <Title level={5}>
                                        Generate your custom model
                                    </Title>
                                </Button>
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
    );
}
