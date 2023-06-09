import "./index.css"

export const TableItem = ({disabled, _id, num, name, year, genre, description, actors, onEdit, onDelete}) =>
{
    const stringifyActors = (arr) => arr.join(", ");

    return (
        <tr id={num} key={num}>
            <th scope="row">{num + 1}</th>
            <td>{name}</td>
            <td>{new Date(year).getFullYear()}</td>
            <td>{genre}</td>
            <td>{description}</td>
            <td>{stringifyActors(actors)}</td>
            {!disabled && 
            <td>
                <button data-id={_id} type="button" className="btn btn-primary mr-3" onClick={() => onEdit({_id, name, year, genre, description, actors: stringifyActors(actors)})}>Edit</button>
                <button data-id={_id} type="button" className="btn btn-danger" onClick={onDelete}>Delete</button>
            </td>}
        </tr>
    );
}
