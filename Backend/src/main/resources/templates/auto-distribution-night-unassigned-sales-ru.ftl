<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Активные запросы на резюме и оценки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body>
<p>Добрый день, ${fio}!</p>
<p>За прошедшие 24 часа в системе остались неназначенными продажа(и) из авт. распределения в нерабочее время:</p>
<ul>
        <#list sales as sale>
            <li><a href=${url + sale.id?c}>${sale.company.name}</a></li>
        </#list>
</ul>
</body>
</html>