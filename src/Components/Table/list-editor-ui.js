"use strict";

const PORT = 8000;
const API = `http://localhost:${PORT}`;
const delete_button_text = "Delete";
const edit_button_text = "Edit";
const notification_time = 1000;
let user_data = {};
let user_count = 0;

const table_body = document.getElementById("table_body");
const form_open_button = document.getElementById("form_open_button");
const add_button = document.getElementById("add_button");
const edit_button = document.getElementById("edit_button");
const close_button = document.getElementById("close_button");
const inputs_form = document.getElementById("inputs_form");

const surname_inp = document.getElementById("surname_inp");
const name_inp = document.getElementById("name_inp");
const lastname_inp = document.getElementById("lastname_inp");
const email_inp = document.getElementById("email_inp");

const notification = document.getElementById("notification");
//
const message_sender = document.getElementById("message_sender");
const letter_area = document.getElementById("letter_area");
const send_letter_button = document.getElementById("send_letter_button");
const close_letter_button = document.getElementById("close_letter_button");
const input_letter_button = document.getElementById("input_letter_button");
//

const NotificationTypes = Object.freeze({
    success: "success",
    error  : "danger",
});

function create_text_item(text)
{
    const td = document.createElement("td");
    const textNode = document.createTextNode(text);
    td.appendChild(textNode);
    return td;
}

function create_button(text, color, onClicked)
{
    const td = document.createElement("td");
    const textNode = document.createTextNode(text);
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("className", `btn btn-${color}`);
    button.addEventListener("click", onClicked);
    button.appendChild(textNode);
    td.appendChild(button);
    return td; 
}

function create_delete_button()
{
    return create_button(delete_button_text, "danger", onRowDelete);
}

function create_edit_button()
{
    return create_button(edit_button_text, "primary", onRowEdit);
}

function add_table_item(num, surname, name, lastname, email)
{
    const tr = document.createElement("tr");
    tr.setAttribute("id", getLocalUserId(num - 1));
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = num;
    tr.appendChild(th);

    const params = Array.from([surname, name, lastname, email]);
    params.forEach(param => {
        const text_item = create_text_item(param);
        tr.appendChild(text_item);
    });

    const edit_button = create_edit_button();
    const delete_button = create_delete_button();
    tr.appendChild(edit_button);
    tr.appendChild(delete_button);
    table_body.appendChild(tr);
}

function hide(doc_elem)
{
    doc_elem.style.display = "none";
}

function show(doc_elem)
{
    doc_elem.style.display = "flex";
}

function showAddForm()
{
    show(inputs_form);
    show(add_button);
    clearFields();
}

function showEditForm()
{
    show(inputs_form);
    show(edit_button);
    clearFields();
}

function closeForm()
{
    hide(inputs_form);
    hide(add_button);
    hide(edit_button);
    clearFields();
}

function onFieldChanged(event)
{
    const {
        name, value
    } = event.target;
    user_data[name] = value;
}

function clearFields()
{
    surname_inp.value   = "";
    name_inp.value      = "";
    lastname_inp.value  = "";
    email_inp.value     = "";
}

async function isUniqueEmail(email)
{
    const found = await sendRequest(`/user/email/${email}`, "GET", "Server error.");
    const foundJson = await found.json();
    const foundEmail = foundJson.email;
    console.log("found email =", foundEmail);
    console.log("url =", `/user/email/${email}`);
    return foundEmail == undefined;
}

function validateEmail(email)
{
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
}

async function validateInputFields()
{
    const emailUnique = await isUniqueEmail(email_inp.value);
    console.log("email is unique:", emailUnique);
    return  surname_inp.value  !== ""       &&
            name_inp.value     !== ""       &&
            lastname_inp.value !== ""       &&
            validateEmail(email_inp.value)  &&
            emailUnique;
}

function notification_setup(text, type)
{
    notification.innerText = text;
    notification.setAttribute("className", `notification_${type}`);
}

function notify(text, type)
{
    notification_setup(text, type);
    show(notification);
    const tm = setTimeout(() => {
        hide(notification);
        clearTimeout(tm);
    }, notification_time);
}

function clear_user_data()
{
    user_data = {};
}

async function sendRequest(url, queryType, notificationErrorText, data)
{
    try {
        const res = await fetch(API + url, {
            method: queryType, 
            headers: {"content-type": "application/json"}, 
            body: JSON.stringify(data)
        });
        
        if(res.ok)
        {
            return res;
        }
        else
        {
            notify(notificationErrorText, NotificationTypes["error"]);
            return false;
        }

    } catch (err) {
        console.log(err);
        notify("Server is dead.", NotificationTypes["error"]);
        return false;
    }
}

function addNewMemberAction()
{
    sendRequest("/user", "POST", "Not added.", user_data);
    clear_user_data();
}

function addItem()
{
    add_table_item(++user_count, surname_inp.value, name_inp.value, lastname_inp.value, email_inp.value);
    closeForm();
}

async function doIfValidInput(func)
{
    if(await validateInputFields())
    {
        func();
        notify("Success!", NotificationTypes["success"]);
    }
    else
    {
        notify("Invalid input!", NotificationTypes["error"]);
    }
}

function onAddButton()
{   
    doIfValidInput( () => {
        addItem();
        clearFields();
        addNewMemberAction();
    });
}

async function getAllUsers()
{
    return sendRequest("/users", "GET", "DB error.");
}

function getLocalUserId(id)
{
    return `user_${id}`;
}

function addUsers(users)
{
    for(let i = 0; i < users.length; ++i)
    {
        const user = users[i];  
        const usurname = user["surname"];
        const uname = user["name"];
        const ulastname = user["lastname"];
        const uemail = user["email"];
        const deleteButton = create_delete_button();
        add_table_item(i + 1, usurname, uname, ulastname, uemail, deleteButton);
    }
}

function dbDeleteRow(email)
{
    sendRequest(`/user/email/${email}`, "DELETE", "Not deleted.");
}

function dbEditRow(email)
{
    const body = {
        _email: email,
        surname: surname_inp.value,
        name: name_inp.value,
        lastname: lastname_inp.value,
        email: email_inp.value
    };
    sendRequest("/user", "PATCH", "Not edited.", body);
}

function getButtonRow(target)
{
    return target.parentNode.parentNode;
}

function getRowChildText(row, index)
{
    return row.children[index].innerText;
}

function getSurname(row)
{
    return getRowChildText(row, 1);
}

function getName(row)
{
    return getRowChildText(row, 2);
}

function getLastname(row)
{
    return getRowChildText(row, 3);
}

function getEmail(row)
{
    return getRowChildText(row, 4);
}

function onRowDelete(event)
{
    const row = getButtonRow(event.target);
    const email = getEmail(row);
    dbDeleteRow(email);
    row.remove();
}

function onRowEdit(event)
{
    showEditForm();
    const row = getButtonRow(event.target);
    surname_inp.value = getSurname(row);
    name_inp.value = getName(row);
    lastname_inp.value = getLastname(row);
    email_inp.value = getEmail(row);

    edit_button.addEventListener("click", _dbEditRow);

    function _dbEditRow()
    {
        doIfValidInput(() => {
            dbEditRow(getEmail(row));
            const inputs = Array.from([
                surname_inp, 
                name_inp, 
                lastname_inp, 
                email_inp
            ]);

            for(let i = 0; i < inputs.length; ++i)
            {
                row.children[i + 1].innerText = inputs[i].value;
            }
            
            edit_button.removeEventListener("click", _dbEditRow);
            closeForm();
        });
    }
}

function clearLetterArea()
{
    letter_area.value = "";
}

function onCloseLetter()
{
    hide(message_sender);
    clearLetterArea();
}

function onOpenInputLetter()
{
    show(message_sender);
    clearLetterArea();
}

function onSendLetter()
{
}

async function dbRefreshListOfUsers()
{  
    const res = await getAllUsers()
    const users = await res.json();
    const sorted = users.sort((u1, u2) => {
        if(u1.email < u2.email) return -1;
        if(u1.email > u2.email) return 1;
        return 0;
    })
    addUsers(sorted);
    user_count = sorted.length;
}

async function checkIfServerIsRunning() {
    return await sendRequest("/status", "GET", "Server error.");
}

async function init()
{
    const serverIsRunning = await checkIfServerIsRunning();
    if(!serverIsRunning) return;

    dbRefreshListOfUsers();
    surname_inp.addEventListener("change", onFieldChanged);
    name_inp.addEventListener("change", onFieldChanged);
    lastname_inp.addEventListener("change", onFieldChanged);
    email_inp.addEventListener("change", onFieldChanged);

    form_open_button.addEventListener("click", showAddForm);
    add_button.addEventListener("click", onAddButton);
    close_button.addEventListener("click", closeForm);

    send_letter_button.addEventListener("click", onSendLetter);
    close_letter_button.addEventListener("click", onCloseLetter);
    input_letter_button.addEventListener("click", onOpenInputLetter);
}

init();