<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Shared Trees</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .breadcrumb { margin-bottom: 20px; }
        .search-bar { margin-bottom: 20px; }
        .shared-trees-list { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }
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
            Dashboard > Shared Trees
        </div>
        <div class="search-bar">
            <label for="search">Search Shared Trees:</label>
            <input type="text" id="search" name="search" placeholder="Search...">
        </div>
        <div class="shared-trees-list">
            <h3>Shared Trees</h3>
            <ul>
                <li>Tree Name: Doe Family Tree - Permission: View <button>View</button></li>
                <li>Tree Name: Smith Family Tree - Permission: Edit <button>Edit</button></li>
            </ul>
        </div>
    </main>
</body>
</html>