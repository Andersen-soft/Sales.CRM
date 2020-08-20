<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<body>
<meta charset="utf-8">

<p>Good afternoon ${userName},<br><br>

    You are assigned Responsible RM for CV request ${idRequest?c} - ${nameRequest}.<br>
    You have 30 minutes to accept* the request.<br>
    Otherwise the request will be available for all Delivery Directors.<br><br>

    *"Accept" means to leave a comment in the request's chat or to change status of the request.<br>

</p>

<p>${idRequest?c} - ${nameRequest} - <a href="${url}" target="_blank">${url}</a></p>

</body>
</html>