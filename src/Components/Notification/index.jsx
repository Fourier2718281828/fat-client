import "./index.css"

export const Notification = ({ message }) => (
  <div className="Notification alert alert-warning alert-dismissible fade show" role="alert">
    {message}
  </div>
);
