import { useEffect, useState } from "react";
import { TableItem } from "../TableItem";
import "./index.css";
import axios from "axios";

export const Table = () => {
  const [tableData, setTableData] = useState([]);
  const temp_content_arr = [
    {
      id: 1, 
      name: "fuck", 
      year: "1234", 
      genre: "fuck", 
      description: "fuck", 
      actors: "fuck"
    },
    {
      id: 2, 
      name: "fuck", 
      year: "1234", 
      genre: "fuck", 
      description: "fuck", 
      actors: "fuck"
    },
  ];

  const getTableData = () => {
    const url = "http://localhost:8000/films";
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    axios
      .get(url, config)
      .then(res => {
        console.log("getTableData:", res.data);
        setTableData(res.data);
      })
      .catch(() => {
        setTableData([]);
      });
  };

  const onEdit = (event) => {
    const {id} = event.target.dataset;
    console.log("OnEdit id:", id);
  };

  const onDelete = (event) => {
    const {id} = event.target.dataset;
    const url = `http://localhost:8000/film/id/${id}`;
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    axios
      .delete(url, config)
      .then(res => {
        console.log("delete res:", res.data);
        getTableData();
      })
  };

  useEffect(getTableData, []);

  return (
    <div className="Table">
      <button id="form_open_button" type="button" className="btn btn-primary">
        +
      </button>
      <button id="input_letter_button" type="button" className="btn btn-primary">
        Send
      </button>
      <div id="inputs_form">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Прізвище
            </span>
          </div>
          <input
            id="surname_inp"
            name="surname"
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Ім'я
            </span>
          </div>
          <input
            id="name_inp"
            name="name"
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              По-батькові
            </span>
          </div>
          <input
            id="lastname_inp"
            name="lastname"
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Електронна адреса
            </span>
          </div>
          <input
            id="email_inp"
            name="email"
            type="text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <button id="add_button" type="button" className="btn btn-primary">
          Add
        </button>
        <button id="edit_button" type="button" className="btn btn-primary">
          Edit
        </button>
        <button id="close_button" type="button" className="btn btn-danger">
          Close
        </button>
      </div>

      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Назва</th>
            <th scope="col">Рік</th>
            <th scope="col">Жанр</th>
            <th scope="col">Опис</th>
            <th scope="col">Актори</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="table_body">
          {tableData.length > 0 && tableData.map((item, index)=> <TableItem key={index} { ...{ ...item, num: index, onEdit, onDelete } } />)}
        </tbody>
      </table>
      <div id="notification"></div>
    </div>
  );
};
