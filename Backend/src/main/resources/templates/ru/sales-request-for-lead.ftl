<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Активные запросы на резюме и оценки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin: 0; padding: 0;">

<#if (resume_requests)?size gt 0>
<p><b>Запросы на резюме</b></p>
<br/>
<#list resume_requests as element>

<#if (element.requests)?size gt 0>
<p><b>*${element.name}*</b></p>

<ul>
    <#list element.requests as request>
    <li type="none" style="color: #153643; padding: 5px 10px 7px 7px">
        <a href="${request.url}">${request.url}</a> - ${request.company} - ${request.name} - ${request.priority}
    </li>
</
#list>
</ul>
<#else>
</
#if>
</#list>
<#else>
</#if>

</body>
</html>