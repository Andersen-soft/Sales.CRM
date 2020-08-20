<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<body>
<meta charset="utf-8">

<p>Good afternoon, ${userName},<br><br>

    ${idRequest?c} - ${nameRequest} wasn't assigned to any Delivery Director.<br>
    You can assign yourself as responsible RM for the request within 1 hour by following the link.<br>

</p>

<p>${idRequest?c} - ${nameRequest} - <a href="${url}" target="_blank">${url}</a></p>

</body>
</html>