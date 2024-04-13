import { Breadcrumb, Card, Input, Layout, Menu, theme } from "antd";
import Title from "antd/es/typography/Title";
const { Content, Footer, Header } = Layout;
const items = new Array(0).fill(null).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

const gridStyle: React.CSSProperties = {
    width: "50%",
    textAlign: "center",
};

const steps = [
    {
      title: 'First',
      content: 'First-content',
    },
    {
      title: 'Second',
      content: 'Second-content',
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ];
  
export default function DatasetPage() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <div>
            <Layout>
                <Header style={{ display: "flex", alignItems: "center" }}>
                    <div className="demo-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={["2"]}
                        items={items}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </Header>
                <Content style={{ padding: "0 48px", alignItems:"center" }}>
                    <Title>Dataset Building</Title>
                    <div
                        style={{
                            background: colorBgContainer,
                            width: "100%",
                            height: "100%",
                            minHeight: 750,
                            padding: 24,
                            borderRadius: borderRadiusLG,
                            alignItems: "center"
                        }}
                    >
                        <Input
                            prefix="Dataset name"
                            size="large"
                            placeholder="large"
                        ></Input>
                        <Card title="Dataset Templates">
                        <Card.Grid style={gridStyle}>Select from torchvision dataset</Card.Grid>
                        <Card.Grid style={gridStyle}>Build your own tabular dataset</Card.Grid>
                        <Card.Grid style={gridStyle}>Build your own image classification dataset</Card.Grid>
                        <Card.Grid style={gridStyle}>Build your own image segmentatio dataset</Card.Grid>
                        <Card.Grid style={gridStyle}>Build your own text dataset</Card.Grid>
                        <Card.Grid style={gridStyle}>Build dataset by code</Card.Grid>
                        </Card>
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    VTorch {new Date().getFullYear()} Created by HKUST student
                </Footer>
            </Layout>
        </div>
    );
}
