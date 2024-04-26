import { Editor } from "@monaco-editor/react";
import { Button, Input, Layout, message, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { defaultCode } from "./UserDefinedDefaultCode";
import { addUDB } from "../../communication";
import { Link } from "react-router-dom";

export function UDBPage() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [UDBCode, setUDBCode] = useState<string | undefined>(defaultCode);
    const [UDBName, setUDBName] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const msgKey = "UDBPage";
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
                        <Title>Custom Block Definition</Title>
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
                            <Input
                                size="large"
                                prefix="Enter the name of your code here: "
                                onChange={(v) => setUDBName(v.target.value)}
                            />
                            <Editor
                                theme="vs-dark"
                                height={"70vh"}
                                defaultLanguage="python"
                                defaultValue={defaultCode}
                                onChange={(v) => {
                                    setUDBCode(v);
                                }}
                            />
                            <div style={{width:"100%"}}>
                                <Button
                                    size="large"
                                    onClick={() => {
                                        if (UDBName !== "")
                                            addUDB({
                                                name: UDBName,
                                                code: UDBCode!,
                                            }).then((r) => {
                                                if (r.status === 200)
                                                    r.text().then((t) => {
                                                        if (t === "")
                                                            messageApi.open({
                                                                key: msgKey,
                                                                type: "success",
                                                                content:
                                                                    "Success",
                                                                duration: 20,
                                                            });
                                                        else {
                                                            messageApi.open({
                                                                key: msgKey,
                                                                type: "info",
                                                                content:
                                                                    "Success but: " +
                                                                    t,
                                                                duration: 20,
                                                            });
                                                        }
                                                    });
                                                else {
                                                    r.text().then((t) => {
                                                        messageApi.open({
                                                            key: msgKey,
                                                            type: "error",
                                                            content: t,
                                                            duration: 20,
                                                        });
                                                    });
                                                }
                                            });
                                        else {
                                            messageApi.open({
                                                key: msgKey,
                                                type: "error",
                                                content:
                                                    "Please input valid name",
                                                duration: 5,
                                            });
                                        }
                                    }}
                                >
                                    Complete
                                </Button>
                                <Link to={"/homePage"}>
                                <Button
                                    style={{ marginRight: "auto" }}
                                    size="large"
                                >
                                    Back
                                </Button>
                                </Link>
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
