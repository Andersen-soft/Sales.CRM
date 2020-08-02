<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Активные запросы на резюме и оценки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin: 0; padding: 0;">

    <#if (resume_request.requests)?size gt 0>
    <p><b>Requests for CV</b></p>
        <br/>
    <p><b>*${resume_request.name}*</b></p>

        <ul>
            <#list resume_request.requests as resumeRequest>
                <li  type="none" style="color: #153643; padding: 5px 10px 7px 7px">
                    <a href="${resumeRequest.url}">${resumeRequest.id}</a> - ${resumeRequest.company} - ${resumeRequest.name} - ${resumeRequest.status} - ${resumeRequest.priority}
                    <ul>
                        <#list resumeRequest.resumes as resume>
                            <li type="square" style="color: #153643; padding: 5px 10px 7px 7px">${resume.fio} - ${resume.status}</li>
                        </#list>
                    </ul>
                </li>
            </#list>
        </ul>
    <#else>
    </#if>


    <#if (estimation_request.requests)?size gt 0>
<p><b>Requests for estimation</b></p>
        <br/>
        <p><b>*${estimation_request.name}*</b></p>

        <ul>
            <#list estimation_request.requests as estimationRequest>
                <li  type="none" style="color: #153643; padding: 5px 10px 7px 7px">
                    <a href="${estimationRequest.url}">${estimationRequest.id}</a> - ${estimationRequest.company} - ${estimationRequest.name} - ${estimationRequest.status}
                </li>
            </#list>
        </ul>
    <#else>
    </#if>

</body>
</html>