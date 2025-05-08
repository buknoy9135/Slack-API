import { useState } from "react";
import '../css/UserDetails.css'

function UserDetails({ selectedUser }) {
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <>
      <div className="UserDetails-container">
        <div className="user-details-button">
          <button onClick={() => setShowUserModal(true)} data-testid="openUserModal">User Details</button>
        </div>

        {showUserModal && (
          <div className="usermodal-overlay">
            <div className="usermodal-container">
              <div className="usermodal-header">
                <h2>User Details</h2>
              </div>

              <div className="usermodal-body">
                {" "}
                {selectedUser && (
                  <div>
                    <p data-testid="username"><strong>Username</strong>: {selectedUser.email.split("@")[0]}</p>
                    <p data-testid="email"><strong>Email</strong>: {selectedUser.email}</p>
                    <p data-testid="date-created">
                      <strong>Date Created</strong>:{" "}
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Last login</strong>:{" "}
                      {new Date(selectedUser.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="ok-button">
                <button onClick={() => setShowUserModal(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDetails;
