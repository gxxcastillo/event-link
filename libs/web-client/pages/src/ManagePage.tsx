<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Family Tree Management</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .breadcrumb { margin-bottom: 20px; }
        .actions button { margin: 5px; }
        .details-panel { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <header>
        <div>ClanVault</div>
        <div>User Profile | Settings | Logout</div>
    </header>
    <nav>
        <a href="#">Dashboard</a>
        <a href="#">Family Tree</a>
        <a href="#">Shared Trees</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
    </nav>
    <main>
        <div class="breadcrumb">
            Dashboard > Family Tree > [Tree Name]
        </div>
        <div class="family-tree-visualization">
            <!-- Placeholder for family tree visualization -->
            <h2>Family Tree Visualization</h2>
        </div>
        <div class="actions">
            <button onclick="location.href='#'">Add Member</button>
            <button onclick="location.href='#'">Edit Member</button>
            <button onclick="location.href='#'">Delete Member</button>
            <button onclick="location.href='#'">Upload Documents</button>
        </div>
        <div class="details-panel">
            <h3>Selected Member Details</h3>
            <!-- Placeholder for selected member details -->
            <p>Name: John Doe</p>
            <p>Birthdate: January 1, 1900</p>
            <p>Relationships: ...</p>
        </div>
    </main>
</body>
</html>