<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
<meta charset="utf-8">
<p><a href="${appUrl}" target="_blank">${appUrl}</a></p>
<p>У вас новое сообщение в "Мои ответы соц.сетей" от <a href="${url}" target="_blank">${url}</a></p>
<#if (message)?size gt 0>
    <#list message as line>
        <p>${line}</p>
    </#list>
<#else>
</#if>
</body>
</html>