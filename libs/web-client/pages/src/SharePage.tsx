<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Data Sharing</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .breadcrumb { margin-bottom: 20px; }
        .form { margin-bottom: 20px; }
        .form label, .form input, .form button { display: block; margin-bottom: 10px; }
        .shares-list { margin-top: 20px; padding: 10px; border: 1px solid #ddd; }
    </style>
    <script>
        async function generateBlinkToken() {
            const email = document.getElementById('email').value;
            const permissions = document.getElementById('permissions').value;
            // Pseudo-code for generating a Blink token
            const blinkToken = await generateBlinkTokenAPI(email, permissions);
            alert('Blink token generated and shared!');
        }
    </script>
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
            Dashboard > Family Tree > [Tree Name] > Sharing
        </div>
        <div class="form">
            <h2>Share Family Tree</h2>
            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required>

            <label for="permissions">Permissions:</label>
            <select id="permissions" name="permissions">
                <option value="view">View</option>
                <option value="edit">Edit</option>
            </select>

            <button type="button" onclick="generateBlinkToken()">Send Invitation</button>
        </div>
        <div class="shares-list">
            <h3>Current Shares</h3>
            <ul>
                <li>User: user@example.com - Permission: View <button>Revoke Access</button></li>
                <li>User: another@example.com - Permission: Edit <button>Revoke Access</button></li>
            </ul>
        </div>
    </main>
</body>
</html>