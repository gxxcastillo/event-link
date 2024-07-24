<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Settings</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; }
        header { width: 100%; background-color: #333; color: white; padding: 10px 0; text-align: center; }
        nav { background-color: #444; color: white; width: 200px; padding: 20px; }
        nav a { display: block; color: white; text-decoration: none; margin-bottom: 10px; }
        main { flex: 1; padding: 20px; }
        .breadcrumb { margin-bottom: 20px; }
        .settings-section { margin-bottom: 20px; }
        .settings-section label, .settings-section input, .settings-section button { display: block; margin-bottom: 10px; }
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
            Dashboard > Settings
        </div>
        <div class="settings-section">
            <h2>Profile Settings</h2>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="user@example.com" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password">

            <label for="profile-info">Profile Information:</label>
            <input type="text" id="profile-info" name="profile-info" value="User Name">

            <button type="submit">Update Profile</button>
        </div>
        <div class="settings-section">
            <h2>Privacy Settings</h2>
            <label for="data-privacy">Data Privacy Options:</label>
            <select id="data-privacy" name="data-privacy">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <button type="submit">Save Privacy Settings</button>
        </div>
        <div class="settings-section">
            <h2>Blockchain Settings</h2>
            <p>Wallet Information: <span>0x123456789abcdef</span></p>
            <button type="button">Download Keys</button>
        </div>
        <div class="settings-section">
            <h2>Blink Token Management</h2>
            <button type="button">View Active Tokens</button>
            <button type="button">Revoke Token</button>
        </div>
    </main>
</body>
</html>