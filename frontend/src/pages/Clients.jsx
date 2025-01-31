import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, IconButton, 
    FormControl, InputLabel  // ✅ Added FormControl & InputLabel
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [groupCategories, setGroupCategories] = useState([]); // ✅ Fix: Define groupCategories

    
    const [groups, setGroups] = useState([]);
    const [newClient, setNewClient] = useState({
        firstName: "", lastName: "", PAN: "", category: "", group: "", mobile: ""
    });

    const [openGroupDialog, setOpenGroupDialog] = useState(false);
const [newGroup, setNewGroup] = useState({ name: "", category: "" });

const handleAddGroup = () => {
    axios.post("http://localhost:5000/api/groups", newGroup)
        .then(() => {
            fetchGroups();  // ✅ Refresh Groups List Immediately
            setOpenGroupDialog(false);
            setNewGroup({ name: "", category: "" });
        })
        .catch((err) => console.error("Error adding group:", err.message));
};



    
    const fetchClients = () => {
        let isMounted = true; // ✅ Ensures cleanup on unmount
    
        axios.get("http://localhost:5000/api/clients")
            .then((res) => {
                console.log("Fetched Clients:", res.data); // ✅ Debugging Output
                if (isMounted && Array.isArray(res.data)) {
                    setClients(res.data);
                } else {
                    console.error("Unexpected API response:", res.data);
                }
            })
            .catch((err) => console.error("Error fetching clients:", err.message));
    
        return () => { isMounted = false; }; // ✅ Proper cleanup function
    };
    
    // ✅ Move Cleanup Inside useEffect
    
    useEffect(() => {
        fetchClients();
        fetchCategories();  // ✅ Fetch Categories and set `groupCategories`
        fetchGroups();
    }, []);
    
    
    

    useEffect(() => {
        axios.get("http://localhost:5000/api/groups")
            .then((res) => setGroups(res.data))
            .catch((err) => console.error("Error fetching groups:", err.message));
    }, []);
    
    
    
    const fetchCategories = () => {
        axios.get("http://localhost:5000/api/categories")
          .then((res) => {
            setCategories(res.data);
            const groupCats = res.data.filter(cat => cat.type === "Group"); // FIX: Ensure correct uppercase "Group"
            setGroupCategories(groupCats);
          })
          .catch((err) => console.error("Error fetching categories:", err.message));
      };
      
    
    
    const fetchGroups = () => {
        axios.get("http://localhost:5000/api/groups")
            .then((res) => setGroups(res.data))
            .catch((err) => console.error("Error fetching groups:", err.message));
    };
    
    
    
    
    
    
    const handleOpenDialog = (client = null) => {
        setEditingClient(client);
        if (client) {
            setNewClient(client);
        } else {
            setNewClient({ firstName: "", lastName: "", PAN: "", category: "", group: "", mobile: "" });
        }
        setOpenDialog(true);
    };

    const handleSaveClient = () => {
        // ✅ Prevent submission if required fields are missing
        if (!newClient.firstName || !newClient.category || !newClient.group) {
            alert("First Name, Category, and Group are required!");
            return;
        }
    
        if (editingClient) {
            axios.put(`http://localhost:5000/api/clients/${editingClient._id}`, newClient)
                .then(() => {
                    fetchClients();
                    setOpenDialog(false);
                })
                .catch(err => console.error("Error updating client:", err.message));
        } else {
            axios.post("http://localhost:5000/api/clients", newClient)
                .then(() => {
                    fetchClients();
                    setOpenDialog(false);
                })
                .catch(err => console.error("Error adding client:", err.message));
        }
    };
    

    const handleOpenDeleteDialog = (client) => {
        setClientToDelete(client);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmed = () => {
        if (clientToDelete) {
            console.log(`Attempting to delete client with ID: ${clientToDelete._id}`); // ✅ Debugging Output
            axios.delete(`http://localhost:5000/api/clients/${clientToDelete._id}`)
                .then(() => {
                    console.log(`Client ${clientToDelete._id} deleted successfully`);
                    fetchClients(); // ✅ Refresh the client list after deletion
                    setOpenDeleteDialog(false);
                    setClientToDelete(null);
                })
                .catch(err => console.error("Error deleting client:", err.message));
        } else {
            console.error("No client selected for deletion");
        }
    };
    

    return (
        <Container>
            <h2>Clients</h2>

            <TextField
                label="Search Clients"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginRight: 10 }}
            />

            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} style={{ marginLeft: 10 }}>
                + Add Client
            </Button>

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>PAN</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(clients) && clients.length > 0 && 
                            clients
                                .filter(client => 
                                    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    client.mobile.includes(searchQuery)
                                )
                                .map(client => (
                                    <TableRow key={client._id}>
                                        <TableCell>{client._id}</TableCell>
                                        <TableCell>{client.firstName} {client.lastName}</TableCell>
                                        <TableCell>{client.group}</TableCell>
                                        <TableCell>{client.category}</TableCell>
                                        <TableCell>{client.PAN}</TableCell>
                                        <TableCell>{client.mobile}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleOpenDialog(client)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleOpenDeleteDialog(client)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBody>

                </Table>
            </TableContainer>

            {/* Add/Edit Client Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="First Name" 
                        fullWidth 
                        required 
                        value={newClient.firstName}
                        onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <TextField 
                        label="Last Name" 
                        fullWidth 
                        value={newClient.lastName}
                        onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <TextField 
                        label="PAN" 
                        fullWidth 
                        value={newClient.PAN}
                        onChange={(e) => setNewClient({ ...newClient, PAN: e.target.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel shrink>Select a Category</InputLabel>  {/* ✅ Added 'shrink' prop */}
                        <Select
                        value={newClient.category}
                        onChange={(e) => setNewClient({ ...newClient, category: e.target.value })}
                        displayEmpty
                        >
                        <MenuItem value="" disabled>Select a Category</MenuItem>
                        {categories
                            .filter((cat) => cat.type === "Client") // FIX: Only show Client categories
                            .map((cat) => (
                            <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>

                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Select Group</InputLabel>
                        <Select
                            value={newClient.group}
                            onChange={(e) => setNewClient({ ...newClient, group: e.target.value })}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select a Group</MenuItem>
                            {groups.map((group) => (
                                <MenuItem key={group._id} value={group.name}>{group.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="text" color="primary" onClick={() => setOpenGroupDialog(true)}>
                        + Add Group
                    </Button>

                    <TextField 
                        label="Mobile" 
                        fullWidth 
                        value={newClient.mobile}
                        onChange={(e) => setNewClient({ ...newClient, mobile: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveClient} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this client?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={() => {
                            console.log("Delete confirmed!"); // ✅ Debugging Output
                            handleDeleteConfirmed();
                        }} 
                        color="error"
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)}>
                <DialogTitle>Add New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Group Name"
                        fullWidth
                        required
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Group Category (Optional)</InputLabel>
                        <Select
                            value={newGroup.category}
                            onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                            displayEmpty
                        >
                            <MenuItem value="">No Category</MenuItem>
                            {groupCategories.length > 0 ? (
                                groupCategories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No Group Categories Found</MenuItem>
                            )}

                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGroupDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddGroup} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>



        </Container>
    );
};

export default Clients;
