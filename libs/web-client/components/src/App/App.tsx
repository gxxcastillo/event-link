<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .quick-actions button { margin: 5px; }
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
        <h1>Welcome, [User]!</h1>
        <div class="quick-actions">
            <button onclick="location.href='#'">Create Family Tree</button>
            <button onclick="location.href='#'">View Shared Trees</button>
            <button onclick="location.href='#'">Generate Report</button>
        </div>
        <div class="recent-activity">
            <h2>Recent Activity</h2>
            <ul>
                <li>Added new member to family tree</li>
                <li>Shared tree with user@example.com</li>
                <li>Generated ancestor report</li>
            </ul>
        </div>
    </main>
</body>
</html>