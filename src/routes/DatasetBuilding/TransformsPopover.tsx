import { Button, Flex, Input, List, Popover, Select } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { ClassInfo } from "../../common/pythonObjectTypes";
import Title from "antd/es/typography/Title";
import { TransformInstance } from "../../common/datasetTypes";

function setElementAtIndex<T>(arr: T[], index: number, value: T): void {
    if (index >= arr.length) {
        const elementsToAdd = index - arr.length + 1;
        arr.push(...Array(elementsToAdd));
    }

    arr[index] = value;
}

export function transformsPopover(
    transformss: TransformInstance[] | undefined | string,
    setTransforms: (newTransforms: TransformInstance[]) => void,
    transformsClasses: Map<string, ClassInfo>,
    transformName: string,
    setTransformName: (newName: string) => void
) {
    let transforms: TransformInstance[];
    if (!transformss || typeof transformss === "string") {
        setTransforms([]);
        transforms = [] as TransformInstance[];
    } else {
        transforms = transformss as TransformInstance[];
    }
    const filterOption = (
        input: string,
        option?: { label: string; value: string }
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    return (
        <div>
            <List
                style={{ minWidth: 700 }}
                size="large"
                header={<div>Transforms</div>}
                footer={
                    <div>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOption}
                            size="large"
                            style={{ width: "80%" }}
                            placeholder={"Select a transform"}
                            options={Array.from(
                                transformsClasses,
                                (nameClassInfo) => {
                                    return {
                                        label: nameClassInfo[0],
                                        value: nameClassInfo[0],
                                    };
                                }
                            )}
                            onChange={(v) => {
                                setTransformName(v);
                            }}
                        />
                        <Button
                            style={{ width: "20%" }}
                            size="large"
                            onClick={() => {
                                {
                                    if (transformName !== "") {
                                        const newTransforms = [
                                            ...transforms,
                                            {
                                                name: transformName,
                                                parameters: [],
                                            },
                                        ];
                                        setTransforms(newTransforms);
                                    }
                                }
                            }}
                        >
                            <PlusOutlined />
                        </Button>
                    </div>
                }
                bordered
                dataSource={transforms}
                renderItem={(item, index) => (
                    <List.Item>
                        <Flex style={{ width: "100%" }}>
                            <div>
                                <Title level={5}>{item.name}</Title>
                            </div>
                            <div style={{ width: "80%" }}>
                                {transformsClasses
                                    .get(item.name)
                                    ?.functions.find(
                                        (f) => f.name === "__init__"
                                    )
                                    ?.parameters?.slice(1)
                                    .map((p, paramIndex) => {
                                        const isTransform =
                                            p.name.includes("transform");
                                        if (isTransform) {
                                            return (
                                                <Popover
                                                    content={transformsPopover(
                                                        transforms[index]
                                                            .parameters[
                                                            paramIndex
                                                        ],
                                                        (
                                                            newTransformsForParam
                                                        ) => {
                                                            const newTransforms =
                                                                transforms;
                                                            newTransforms[
                                                                index
                                                            ].parameters[
                                                                paramIndex
                                                            ] =
                                                                newTransformsForParam;
                                                            setTransforms(
                                                                newTransforms
                                                            );
                                                        },
                                                        transformsClasses,
                                                        transformName,
                                                        setTransformName
                                                    )}
                                                >
                                                    <Button
                                                        style={{
                                                            width: "30%",
                                                        }}
                                                        prefix={p.name}
                                                    >
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {p.name}
                                                        </div>
                                                    </Button>
                                                </Popover>
                                            );
                                        } else
                                            return (
                                                <Input
                                                    prefix={p.name + ": "}
                                                    style={{
                                                        width: "30%",
                                                    }}
                                                    placeholder={
                                                        p.initial_value
                                                    }
                                                    value={
                                                        transforms[index]
                                                            .parameters[
                                                            paramIndex
                                                        ]
                                                            ? (transforms[index]
                                                                  .parameters[
                                                                  paramIndex
                                                              ] as string)
                                                            : undefined
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value;
                                                        const newTransforms = [
                                                            ...transforms,
                                                        ];
                                                        setElementAtIndex(
                                                            newTransforms[index]
                                                                .parameters,
                                                            paramIndex,
                                                            newValue
                                                        );
                                                        setTransforms(
                                                            newTransforms
                                                        );
                                                    }}
                                                />
                                            );
                                    })}
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                <CloseOutlined
                                    onClick={(_) => {
                                        const newTransforms = [...transforms];
                                        newTransforms.splice(index, 1);
                                        setTransforms(newTransforms);
                                    }}
                                />
                            </div>
                        </Flex>
                    </List.Item>
                )}
            />
        </div>
    );
}
