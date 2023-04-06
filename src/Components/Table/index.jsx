import { useEffect, useState } from "react";
import { TableItem } from "../TableItem";
import "./index.css";
import axios from "axios";
import { InputsForm } from "../InputsForm";
import { Notification } from "../Notification";

export const Table = () => {
  const defaultTableData = {
    name: "",
    year: "",
    genre: "",
    description: "",
    actors: "",
  };
  const [tableData, setTableData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTableData, setNewTableData] = useState(defaultTableData);
  const [showNotif, setShowNotif] = useState({ show: false, message: "" });
  const [currentItemId, setCurrentItemId] = useState(null);
  const [currentFormMode, setCurrentFormMode] = useState(null);
  const [userType, setUserType] = useState(null);

  const getUserType = () => {
    const type = localStorage.getItem("user_type");
    if(!type) 
    {
      setUserType("user");
      localStorage.setItem("user_type", "user");
    }
    else if(type === "user")      
    {
      setUserType("user");
    }
    else if(type === "admin") 
    {
      setUserType("admin");
    }
    else 
    {
      setUserType("user");
    }
  };

  const validateFields = () => {
    const fields = ["name", "year", "genre", "description"];
    for (let i = 0; i < fields.length; ++i) {
      if (newTableData[fields[i]].trim() === "") return false;
    }
    return /^[\w\s]+(,[\w\s]+)*$/g.test(newTableData.actors); 
  };

  const getTableData = () => {
    const url = "http://localhost:8000/films";
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    axios
      .get(url, config)
      .then((res) => {
        setTableData(res.data);
      })
      .catch(() => {
        setTableData([]);
      });
  };

  console.log("New table data year:", newTableData.year);

  const onAddOpen = () => {
    setCurrentFormMode("add");
    setShowAddForm(true);
  };
  const onAddClose = () => {
    setNewTableData(defaultTableData);
    setShowAddForm(false);
  };

  const onEdit = (data) => { 
    const {_id, name, year, genre, description, actors} = data;
    setNewTableData({name, year, genre, description, actors});
    setCurrentFormMode("edit");
    setShowAddForm(true);
    setCurrentItemId(_id);
  };

  const onAdd = () => {
    const url = `http://localhost:8000/film`;
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    if (!validateFields()) {
      setShowNotif({ show: true, message: "Invalid input." });
      const tm = setTimeout(() => {
        setShowNotif({ show: false, message: "" });
        clearTimeout(tm);
      }, 1500);
      return;
    }

    axios
      .post(
        url,
        {
          data: {
            ...newTableData,
            actors: newTableData.actors.replaceAll(" ", "").split(","),
          },
        },
        config
      )
      .then((res) => {
        getTableData();
      });
    setNewTableData(defaultTableData);
    setShowAddForm(false);
  };

  const onInputFieldChange = (event) => {
    const { name, value } = event.target;
    setNewTableData({ ...newTableData, [name]: value });
  };

  const onSomeEdited = () => {
    const url = `http://localhost:8000/film`;
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    if (!validateFields()) {
      setShowNotif({ show: true, message: "Invalid input." });
      const tm = setTimeout(() => {
        setShowNotif({ show: false, message: "" });
        clearTimeout(tm);
      }, 1500);
      return;
    }
    if (currentItemId === null) return;
    setShowAddForm(false);
    axios
      .patch(
        url,
        {
          data: {
            ...newTableData,
            id: currentItemId,
            actors: newTableData.actors.replaceAll(" ", "").split(","),
          },
        },
        config
      )
      .then((res) => {
        setCurrentItemId(null);
        getTableData();
      });
    setNewTableData(defaultTableData);
  };

  const onDelete = (event) => {
    const { id } = event.target.dataset;
    const url = `http://localhost:8000/film/id/${id}`;
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    axios.delete(url, config).then((res) => {
      getTableData();
    });
  };

  useEffect(getTableData, []);
  useEffect(getUserType, []);

  return (
    <div className="Table">
      {userType === "admin" && 
      <button
        id="form_open_button"
        type="button"
        className="btn btn-primary"
        onClick={onAddOpen}
      >
        +
      </button>}
      {showAddForm && (
        <InputsForm
          type={currentFormMode}
          onClose={onAddClose}
          onChange={onInputFieldChange}
          onAdd={onAdd}
          onEdit={onSomeEdited}
          tableData={newTableData}
        />
      )}

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
          {tableData.length > 0 &&
            tableData.map((item, index) => (
              <TableItem
                key={index}
                {...{ ...item, num: index, onEdit, onDelete, disabled: userType !== "admin" }}
              />
            ))}
        </tbody>
      </table>
      {showNotif.show && <Notification message={showNotif.message} />}
    </div>
  );
};
