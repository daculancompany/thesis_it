//https://codesandbox.io/s/qc0dh?file=/src/App.js
//https://agentcooper.github.io/react-pdf-highlighter/#highlight-8245652131754351

import React, { useEffect, useState } from "react";
import {
    AreaHighlight,
    Highlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
} from "react-pdf-highlighter";
import { Button, List, Typography, Radio, Space, Tooltip } from "antd";
import SplitPane from "react-split-pane";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import { DeleteOutlined, ArrowsAltOutlined } from "@ant-design/icons";

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

import Tip from "../../pages/admin/thesis/Tip";

const HighlightPopup = ({ comment }) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

export const PDFAnnotations = ({ url, id, role, data }) => {

    useEffect(() => {
        let comment_aray = [];
        if (Array.isArray(data)) {
            for (let index = 0; index < data.length; index++) {
                let comment_new = JSON.parse(data[index].comments);
                comment_new.id = data[index].id;
                comment_aray.push(comment_new);
                //console.log(JSON.parse(data[index].comments))
            }
            setHighlights(comment_aray);
        }
    }, [data]);

    const [saveInlineComment, deleteInlineComment] = useThesisStore(
        (state) => [state.saveInlineComment, state.deleteInlineComment],
        shallow
    );

    const [highlights, setHighlights] = useState([]);
    const getNextId = () => String(Math.random()).slice(2);

    let scrollViewerTo = (highlight) => {};

    const scrollToHighlightFromHash = () => {
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight) {
            scrollViewerTo(highlight);
        }
    };

    const getHighlightById = (id) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const updateHash = (highlight) => {
        let page = document.querySelectorAll(
            `[data-page-number="${highlight?.position?.pageNumber}"]`
        );
        page[1].setAttribute(
            "id",
            `page-scroll-${highlight?.position?.pageNumber}`
        );
        document
            .querySelector(`#page-scroll-${highlight?.position?.pageNumber}`)
            .scrollIntoView({ behavior: "smooth" });
    };

    const addHighlight = async (highlight) => {
        let data_return = await saveInlineComment({
            id,
            comment: JSON.stringify(highlight),
        });
        if (data_return?.data) {
            setHighlights([
                { ...highlight, id: data_return?.data },
                ...highlights,
            ]);
        }
    };

    const deleteComment = (comment_id) => {
        let new_data = [...highlights];
        const index = highlights.findIndex((item) => item.id === comment_id);
        if (index !== -1) {
            deleteInlineComment({ id: comment_id });
            new_data.splice(index, 1);
        }
        setHighlights(new_data);
    };

    return (
        <>
            <SplitPane
                split="vertical"
                minSize={350}
                defaultSize={600}
                maxSize={1000}
                style={{ background: "#fff" }}
            >
                <div className="thesis-pdf-details">
                    <List
                        bordered
                        dataSource={highlights}
                        // pagination={{
                        //     onChange: (page) => {
                        //       console.log(page);
                        //     },
                        //     pageSize: 8,
                        //   }}
                        renderItem={(highlight) => (
                            <List.Item
                            // actions={[
                            //     <Button
                            //         type="link"
                            //         onClick={() => {
                            //             updateHash(highlight);
                            //         }}
                            //     >
                            //         Page {highlight.position.pageNumber}
                            //     </Button>,
                            //     <a
                            //         key="list-loadmore-delete"
                            //         onClick={() =>
                            //             deleteComment(highlight.id)
                            //         }
                            //     >
                            //         Delete{" "}
                            //     </a>,
                            // ]}
                            >
                                <Typography.Text mark>
                                    [
                                    {`${highlight.content.text
                                        .slice(0, 20)
                                        .trim()}…`}
                                    ]
                                </Typography.Text>{" "}
                                <Typography.Text strong>
                                    {" "}
                                    {highlight.comment.text}
                                </Typography.Text>
                                <Space>
                                    <Tooltip
                                        title={` jump to page ${highlight.position.pageNumber}`}
                                    >
                                        <Button
                                            shape="circle"
                                            icon={<ArrowsAltOutlined />}
                                            onClick={() => {
                                                updateHash(highlight);
                                            }}
                                        />
                                    </Tooltip>
                                    {role === "faculty" && (
                                        <Tooltip title="delete">
                                            <Button
                                                danger
                                                type="primary"
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    deleteComment(highlight.id)
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
                <div id="pdf-content">
                    <PdfLoader url={url}>
                        {(pdfDocument) => (
                            <PdfHighlighter
                                pdfDocument={pdfDocument}
                                enableAreaSelection={(event) => event.altKey}
                                //onScrollChange={resetHash}
                                scrollRef={(scrollTo) => {
                                    scrollViewerTo = scrollTo;
                                    scrollToHighlightFromHash();
                                }}
                                onSelectionFinished={(
                                    position,
                                    content,
                                    hideTipAndSelection,
                                    transformSelection
                                ) =>
                                    role === "faculty" ? (
                                        <Tip
                                            onOpen={transformSelection}
                                            onConfirm={(comment) => {
                                                addHighlight({
                                                    content,
                                                    position,
                                                    comment,
                                                });

                                                hideTipAndSelection();
                                            }}
                                        />
                                    ) : (
                                        console.error(
                                            "Role not allowed to comment"
                                        )
                                    )
                                }
                                highlightTransform={(
                                    highlight,
                                    index,
                                    setTip,
                                    hideTip,
                                    viewportToScaled,
                                    screenshot,
                                    isScrolledTo
                                ) => {
                                    const isTextHighlight = !Boolean(
                                        highlight.content &&
                                            highlight.content.image
                                    );

                                    const component = isTextHighlight ? (
                                        <Highlight
                                            isScrolledTo={isScrolledTo}
                                            position={highlight.position}
                                            comment={highlight.comment}
                                        />
                                    ) : (
                                        <AreaHighlight
                                            highlight={highlight}
                                            onChange={(boundingRect) => {
                                                this.updateHighlight(
                                                    highlight.id,
                                                    {
                                                        boundingRect:
                                                            viewportToScaled(
                                                                boundingRect
                                                            ),
                                                    },
                                                    {
                                                        image: screenshot(
                                                            boundingRect
                                                        ),
                                                    }
                                                );
                                            }}
                                        />
                                    );

                                    return (
                                        <Popup
                                            popupContent={
                                                <HighlightPopup
                                                    {...highlight}
                                                />
                                            }
                                            onMouseOver={(popupContent) =>
                                                setTip(
                                                    highlight,
                                                    (highlight) => popupContent
                                                )
                                            }
                                            onMouseOut={hideTip}
                                            key={index}
                                            children={component}
                                        />
                                    );
                                }}
                                highlights={highlights}
                            />
                        )}
                    </PdfLoader>
                </div>
            </SplitPane>
        </>
    );
};

export default PDFAnnotations;
