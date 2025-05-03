import { useState } from "react";
import CreateChannel from "./CreateChannel";

function AddMember() {

    const [showModalAddMember, setShowModalAddMember] = useState(false);
    
    return (      
        <div className="AddMember-container">
            <button className="addmember-button" onClick={() => setShowModalAddMember(true)}>Add Member</button>
            {
                showModalAddMember && (
                    <form onSubmit={handleAddMember}>

                    </form>
                )
            }
        </div>
    )
}

export default AddMember;