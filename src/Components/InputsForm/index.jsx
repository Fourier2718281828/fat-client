import "./index.css";

export const InputsForm = ({
  tableData,
  type,
  onChange,
  onAdd,
  onEdit,
  onClose,
}) => {
  return (
    <div id="inputs_form">
      <div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Name
            </span>
          </div>
          <input
            name="name"
            value={tableData.name}
            type="text"
            className="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={onChange}
          />
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Year
            </span>
          </div>
          <input
            name="year"
            value={tableData.year}
            type="date"
            className="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={onChange}
          />
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Genre
            </span>
          </div>
          <input
            name="genre"
            value={tableData.genre}
            type="text"
            className="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={onChange}
          />
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Desctiption
            </span>
          </div>
          <input
            name="description"
            value={tableData.description}
            type="text"
            className="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={onChange}
          />
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Actors
            </span>
          </div>
          <input
            name="actors"
            value={tableData.actors}
            type="text"
            className="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={onChange}
          />
        </div>
      </div>

      {type === "add" && (
        <button
          id="add_button"
          type="button"
          className="btn btn-primary"
          onClick={onAdd}
        >
          Add
        </button>
      )}
      {type === "edit" && (
        <button
          id="edit_button"
          type="button"
          className="btn btn-primary"
          onClick={onEdit}
        >
          Edit
        </button>
      )}
      <button
        id="close_button"
        type="button"
        className="btn btn-danger"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};
