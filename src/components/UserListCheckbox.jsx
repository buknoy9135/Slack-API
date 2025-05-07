import React from "react";

function UserListCheckbox(props) {
  const { userList, selectedUserIds, onToggle } = props;
  
  if (!userList || userList.length === 0) {
    return <div>No users available...</div>;
  }

  return (
    <div className="user-list-scrollbox">
      {userList
        .filter((user) => user.id >= 194)
        .sort((a, b) => a.email.localeCompare(b.email))
        .map((user) => {
          const { id, email } = user;
          const username = email.split("@")[0];
          const isChecked = selectedUserIds.includes(id);

          return (
            
              <label key={id} className="user-checkbox-item">
                <input
                  type="checkbox"
                  value={id}
                  checked={isChecked}
                  onChange={() => onToggle(id)}
                />
                {username} (ID: {id})
              </label>
            
          );
        })}
    </div>
  );
}

export default UserListCheckbox;
