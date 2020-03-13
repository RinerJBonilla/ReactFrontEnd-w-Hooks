import React, { Component } from "react";
import Axios from "axios";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import InputTag from "./InputTag";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Cookie from "js-cookie";
import "./Dialog.css";

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: "",
      description: "",
      content: "",
      editorState: EditorState.createEmpty(),
      error: false,
      message: "",
      tags: []
    };
  }

  onEditorStateChange = event => {
    const cont = draftToHtml(convertToRaw(event.getCurrentContent()));
    this.setState({ editorState: event, content: cont });
  };

  ChangeInputs = ntags => {
    this.setState({ tags: ntags });
  };

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    const payload = [];
    for (var i = 0; i < this.state.tags.length; i++) {
      payload.push({ name: this.state.tags[i] });
    }
    const obj = {
      title: this.state.title,
      description: this.state.description,
      content: this.state.content,
      tags: payload ? payload : []
    };
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };

    try {
      await Axios.post(process.env.REACT_APP_API_ADDRESS + "/posts", obj, head);
      this.setState({
        title: "",
        description: "",
        content: "",
        editorState: EditorState.createEmpty(),
        tags: []
      });

      this.props.history.push("/list");
    } catch (error) {
      return this.setState({
        error: error ? 1 : 0,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
  }

  render() {
    const { editorState, error, tags } = this.state;
    return (
      <div className="container">
        <div style={{ marginTop: 10 }}>
          <h3 data-testid="create-label">Add New Post</h3>
          <div className="content--inner">
            <form error={error ? 1 : 0} data-testid="create-form">
              <div className="form-group">
                <label data-testid="label-title">Title: </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.title}
                  data-testid="create-title"
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label data-testid="label-desc">Description: </label>
                <input
                  type="text"
                  className="form-control"
                  data-testid="create-desc"
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div>
                <label data-testid="label-tags">Tags: </label>
                <InputTag
                  ChangeInputs={this.ChangeInputs}
                  tags={tags}
                ></InputTag>
              </div>
              <div className="form-group" data-testid="ebutton">
                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  data-testid="xbutton"
                  onEditorStateChange={this.onEditorStateChange}
                />
              </div>
              <div className="form-group">
                <button
                  onClick={this.onSubmit}
                  className="btn btn-outline-secondary"
                  data-testid="cbutton"
                  type="button"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
          <div className="container mb-3">
            <div className="d-flex justify-content-center mb-3">
              <TransitionGroup component={null}>
                {error && (
                  <CSSTransition classNames="dialog" timeout={300}>
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      {this.state.message}
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
