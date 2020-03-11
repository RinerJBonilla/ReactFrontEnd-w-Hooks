import React, { Component } from "react";
import Axios from "axios";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import InputTag from "./InputTag";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Cookie from "js-cookie";

export default class Edit extends Component {
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
      userid: "",
      editorState: EditorState.createEmpty(),
      error: false,
      message: "",
      tags: [],
      backUpTags: []
    };
  }

  ChangeInputs = ntags => {
    this.setState({ tags: ntags });
  };

  async componentDidMount() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };

    try {
      const response = await Axios.get(
        process.env.REACT_APP_API_ADDRESS +
          "/posts/" +
          this.props.match.params.id,
        head
      );

      const ttags = [];
      for (var i = 0; i < response.data.tags.length; i++) {
        ttags.push(response.data.tags[i].name);
      }
      this.setState({
        title: response.data.title,
        description: response.data.description,
        content: response.data.content,
        userid: response.data.userid,
        tags: ttags,
        backUpTags: response.data.tags
      });
      console.log("yay", this.state.tags);
      const blocksFromHtml = htmlToDraft(this.state.content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState: editorState
      });
    } catch (error) {
      console.log(error);
    }
  }

  onEditorStateChange = event => {
    const cont = draftToHtml(convertToRaw(event.getCurrentContent()));
    this.setState({ editorState: event, content: cont });
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

  checkTagChanges() {
    const tagsToRemove = this.state.backUpTags.filter(
      t1 => !this.state.tags.some(t2 => t1.name === t2)
    );
    const tagsToCreate = this.state.tags.filter(
      t1 => !this.state.backUpTags.some(t2 => t1 === t2.name)
    );
    console.log("tags to remove: ", tagsToRemove);
    console.log("tags to create: ", tagsToCreate);

    const nTagsToCreate = [];
    for (var i = 0; i < tagsToCreate.length; i++) {
      nTagsToCreate.push({ name: tagsToCreate[i] });
    }

    const nTagsToRemove = [];
    for (var j = 0; j < tagsToRemove.length; j++) {
      nTagsToRemove.push({ id: tagsToRemove[j].id });
    }

    console.log("tags to create 2: ", nTagsToCreate);
    console.log("tags to remove 2: ", nTagsToRemove);

    return { nTagsToCreate, nTagsToRemove };
  }

  async onSubmit(e) {
    e.preventDefault();

    const { nTagsToCreate, nTagsToRemove } = this.checkTagChanges();
    const obj = {
      title: this.state.title,
      description: this.state.description,
      content: this.state.content,
      createtags: nTagsToCreate.length > 0 ? nTagsToCreate : [],
      removetags: nTagsToRemove.length > 0 ? nTagsToRemove : []
    };
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };

    try {
      console.log(head);
      const response = await Axios.put(
        process.env.REACT_APP_API_ADDRESS +
          "/posts/" +
          this.props.match.params.id,
        obj,
        head
      );
      console.log(response.data);

      this.setState({
        title: "",
        description: "",
        content: "",
        editorState: EditorState.createEmpty(),
        tags: [],
        backUpTags: []
      });

      this.props.history.push("/list");
    } catch (error) {
      console.log("error", error);
      return this.setState({
        error: true,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
  }

  render() {
    const { editorState, error, tags } = this.state;
    return (
      <div style={{ marginTop: 10 }}>
        <h3 data-testid="edit-mypost">Edit Post</h3>
        <form error={error ? 1 : 0} data-testid="edit-form">
          <div className="form-group">
            <label data-testid="title-label">Title: </label>
            <input
              type="text"
              className="form-control"
              data-testid="edit-title"
              value={this.state.title}
              onChange={this.onChangeTitle}
            />
          </div>
          <div className="form-group">
            <label data-testid="desc-label">Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.description}
              data-testid="edid-desc"
              onChange={this.onChangeDescription}
            />
          </div>
          <div>
            <InputTag ChangeInputs={this.ChangeInputs} tags={tags}></InputTag>
          </div>
          <div className="form-group" data-testid="content-editor">
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              data-testid="editor-wrapper"
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>

          <div className="form-group">
            <button
              onClick={this.onSubmit}
              data-testid="ebutton"
              className="btn btn-outline-secondary"
              type="button"
            >
              Update
            </button>
          </div>
        </form>
        <div className="container mb-3">
          <div className="d-flex justify-content-center mb-3">
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {this.state.message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
