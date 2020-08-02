<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Активные запросы на резюме и оценки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body>
<p>Good afternoon, ${fio}!</p>
<p>In the past 24 hours some sales have been left without assign while auto distribution during non-working hours:</p>
<ul>
        <#list sales as sale>
            <li><a href=${url + sale.id?c}>${sale.company.name}</a></li>
        </#list>
</ul>
</body>
</html>