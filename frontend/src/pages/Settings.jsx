import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Settings</h2>
            <Button variant="contained" onClick={() => navigate("/categories")}>
                Manage Categories
            </Button>
        </div>
    );
};

export default Settings;
