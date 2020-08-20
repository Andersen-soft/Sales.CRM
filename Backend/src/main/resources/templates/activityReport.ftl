<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Отчет по активностям</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
    <tr>
        <td align="center" style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
            Activity report for ${date}
        </td>
    </tr>
    <tr>
        <td style="padding: 30px 30px 40px 30px;">
            <table align="center" border="1" cellpadding="0" cellspacing="0" width="600"
                   style="border-collapse: collapse;">
                <tr bgcolor="#70bbd9">
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px;">
                        Employee
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Calls
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Social network
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Mails
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Meetings
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Interviews
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        All activities
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Requests for CV
                    </td>
                    <td align="center" style="color: #153643; padding: 5px 10px 7px 2px">
                        Requests for estimation
                    </td>
                </tr>
                <#list reports as report>
                    <tr>
                        <td style="color: #153643; padding: 5px 10px 7px 7px">
                            ${report.sales}
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.call == 0>
                                —
                            <#else>
                                ${report.call?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.socialNetwork == 0>
                                —
                            <#else>
                                ${report.socialNetwork?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.email == 0>
                                —
                            <#else>
                                ${report.email?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.meeting == 0>
                                —
                            <#else>
                                ${report.meeting?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.interview == 0>
                                —
                            <#else>
                                ${report.interview?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.sum == 0>
                                —
                            <#else>
                                ${report.sum?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.resumeRequests == 0>
                                —
                            <#else>
                                ${report.resumeRequests?c}
                            </#if>
                        </td>
                        <td align="center" style="color: #153643; padding: 5px 10px 7px 7px">
                            <#if report.estimationRequests == 0>
                                —
                            <#else>
                                ${report.estimationRequests?c}
                            </#if>
                        </td>
                    </tr>
                </#list>
            </table>
        </td>
    </tr>
</table>
</body>
</html>