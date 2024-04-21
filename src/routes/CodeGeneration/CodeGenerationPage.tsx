import { useContext, useState } from "react";
import { DatasetContext } from "../DatasetBuilding/DatasetPage";
import { DatasetInfo } from "../../common/datasetTypes";
import { Col, Flex, Layout, Row, Select, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { getDatasetInfos } from "../../communication";

export default function CodeGenerationPage() {
    const datasets = useContext(DatasetContext);
    const [datasetInfos, setDatasetInfos] = useState<
        Map<string, DatasetInfo> | undefined
    >(undefined);
    const [selectedDataset, setSelectedDataset] = useState<string>("");
    const {
        token: {
            colorBgContainer,
            borderRadiusLG,
            colorTextTertiary,
            colorFillAlter,
            colorBorder,
        },
    } = theme.useToken();
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    if (!datasetInfos) {
        getDatasetInfos(setDatasetInfos);
    }
    return (
        <div>
            Code Generation Page
            <Layout>
                <Header
                    style={{ display: "flex", alignItems: "center" }}
                ></Header>
                <Content style={{ padding: "0 48px", alignItems: "center" }}>
                    <Title>Final Configuration</Title>
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
                            </Col>
                            <Col span={8}>
                                <Title level={5}>
                                    Set your hyperparameters
                                </Title>
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
