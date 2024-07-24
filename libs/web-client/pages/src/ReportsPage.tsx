<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Analytics and Reports</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .breadcrumb { margin-bottom: 20px; }
        .form { margin-bottom: 20px; }
        .form label, .form select, .form button { display: block; margin-bottom: 10px; }
        .reports-list, .chart-visualization { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }
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
            Dashboard > Reports
        </div>
        <div class="form">
            <h2>Generate Report</h2>
            <label for="report-type">Report Type:</label>
            <select id="report-type" name="report-type">
                <option value="ancestor">Ancestor Report</option>
                <option value="descendant">Descendant Report</option>
            </select>
            <button type="submit">Generate Report</button>
        </div>
        <div class="reports-list">
            <h3>Generated Reports</h3>
            <ul>
                <li>Ancestor Report - <button>Download</button> <button>View</button></li>
                <li>Descendant Report - <button>Download</button> <button>View</button></li>
            </ul>
        </div>
        <div class="chart-visualization">
            <h3>Chart Visualization</h3>
            <!-- Placeholder for chart visualization -->
        </div>
    </main>
</body>
</html>