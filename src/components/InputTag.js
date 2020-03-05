import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InputTag.css";

export default function InputTag(props) {
  const [tags, setTags] = useState([...props.tags]);

  const removeTag = i => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
    props.ChangeInputs(newTags);
  };

  useEffect(() => {
    console.log("props changed");
    setTags([...props.tags]);
  }, [props.tags]);

  const addInput = e => {
    console.log("event: ", e.target.value);
    const val = e.target.value;

    console.log("val: ", val);
    if (e.key === "Enter" && val) {
      if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTags([...tags, val]);
      props.ChangeInputs([...tags, val]);
      e.target.value = null;
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="input-tag">
      <ul className="input-tag__tags" data-testid="tag-container">
        {tags.map((tag, i) => (
          <li key={i} data-testid={"element_" + i}>
            {tag}
            <button
              type="button"
              data-testid={"btn_" + i}
              onClick={() => {
                removeTag(i);
              }}
            >
              +
            </button>
          </li>
        ))}
        <li className="input-tag__tags__input" data-testid={"keydown"}>
          <input type="text" onKeyDown={addInput} data-testid="text-input" />
        </li>
      </ul>
    </div>
  );
}
