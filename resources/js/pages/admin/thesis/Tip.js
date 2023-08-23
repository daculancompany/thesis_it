import React, { Component } from "react";
import { Button, Tooltip, Input, Radio } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export class Tip extends Component {
    state = {
        compact: true,
        text: "",
        emoji: "",
    };

    // for TipContainer
    componentDidUpdate(nextState) {
        // const { onUpdate } = this.props;
        // if (onUpdate && this.state.compact !== nextState.compact) {
        //   onUpdate();
        // }
    }

    render() {
        const { onConfirm, onOpen } = this.props;
        const { compact, text, emoji } = this.state;

        return (
            <div className="Tip">
                {compact ? (
                    <div
                        className="Tip__compact"
                        onClick={() => {
                            onOpen();
                            this.setState({ compact: false });
                        }}
                    >
                        Add highlight
                    </div>
                ) : (
                    <form
                        className="Tip__card"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onConfirm({ text, emoji });
                        }}
                    >
                        <div>
                            <TextArea
                                rows={4}
                                value={text}
                                onChange={(event) =>
                                    this.setState({ text: event.target.value })
                                }
                                placeholder="Enter comment here"
                            />
                            <div style={{ padding: 10 }}>
                                <Radio.Group
                                    name="emoji"
                                    //value={_emoji}
                                    onChange={(event) =>
                                        this.setState({
                                            emoji: event.target.value,
                                        })
                                    }
                                    className="tip-container"
                                >
                                    {["🔴", "❌", "✅", "❤️", "👍", "😊"].map(
                                        (_emoji) => (
                                            <Radio key={_emoji} value={_emoji}>
                                                {" "}
                                                {_emoji}
                                            </Radio>
                                        )
                                    )}
                                </Radio.Group>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }} >
                            <Button
                                type="primary"
                                htmlType="submit"
                                //onClick={() => setIsComment(true)}
                            >
                                Save
                            </Button>
                            {/* <input
                                type="submit"
                                value="Save"
                                className="btn-comment"
                            /> */}
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

export default Tip;
