$p = 'admin'
$b = [System.Text.Encoding]::ASCII.GetBytes($p)
$e =[Convert]::ToBase64String($b)
"Encoded password ($p) is: $e"
