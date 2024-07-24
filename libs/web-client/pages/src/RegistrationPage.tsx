<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClanVault - Registration</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .container { text-align: center; }
        form { display: inline-block; text-align: left; }
        label, input { display: block; margin-bottom: 10px; }
        button { margin-top: 10px; }
        a { display: block; margin-top: 10px; color: blue; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sign Up</h1>
        <form>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirm-password" required>

            <button type="submit">Sign Up</button>
        </form>
        <a href="login.html">Already have an account? Log in</a>
    </div>
</body>
</html>