package com.andersenlab.crm.model.entities;

public final class SqlConstants {

    static final String RESUME_REQUEST_VIEW =
            "select rr.id, " +
                    "  case when resumes.hr_need > 0 then 'HR_NEED' " +
                    "    when resumes.in_progress > 0 and resumes.hr_need = 0 then 'IN_PROGRESS' " +
                    "    when resumes.hr_need = 0 and resumes.in_progress = 0 and resumes.done > 0 then 'DONE' " +
                    "    else 'HR_NEED' " +
                    "  end as status, " +
                    "  rr.id as request_id, " +
                    "  sr.is_active, " +
                    "  rr.priority, " +
                    "  rr.done_date, " +
                    "  sr.create_date " +
                    "from crm_resume_request rr left join " +
                    "   (select r.resume_request_id as request_id, " +
                    "     sum(if(r.status='HR_NEED', 1, 0)) as hr_need, " +
                    "     sum(if(r.status='IN_PROGRESS', 1, 0)) as in_progress, " +
                    "     sum(if(r.status='RM_NEED' or r.status='DONE', 1, 0)) as done " +
                    "    from crm_resume r " +
                    "    join crm_sale_object o on r.id = o.id " +
                    "    where o.is_active = 1 group by request_id) as resumes on rr.id = resumes.request_id " +
                    " join crm_sale_request sr on rr.id = sr.id ";

    static final String ACTIVITY_REPORT = "select " +
            "concat(ifnull(private_data.first_name, ''), ifnull(concat(' ', private_data.last_name), ''))        as `sales`, " +
            "       private_data.id                                                                              as `salesId`, " +
            "       SUM(CASE WHEN t.type = 'CALL' THEN 1 ELSE 0 END)                                           as `call`, " +
            "       SUM(CASE WHEN t.type = 'MEETING' THEN 1 ELSE 0 END)                                          as `meeting`, " +
            "       SUM(CASE WHEN t.type = 'SOCIAL_NETWORK' THEN 1 ELSE 0 END)                                          as `socialNetwork`, " +
            "       SUM(CASE WHEN t.type = 'INTERVIEW' THEN 1 ELSE 0 END)                                         as `interview`, " +
            "       SUM(CASE WHEN t.type = 'EMAIL' THEN 1 ELSE 0 END)                                           as `email`, " +
            "       SUM(CASE WHEN t.type is not null THEN 1 ELSE 0 END)                                          as `sum`, " +
            "       (select count(sr.id) " +
            "        from crm_sale_request sr " +
            "                 inner join crm_resume_request rr on sr.id = rr.id " +
            "        where sr.author_id = employee.id " +
            "          and sr.create_date between :reportFrom and :reportTo" +
            "          and sr.is_active = 1)                                                                     as `resumeRequests`, " +
            "       (select count(sr.id) " +
            "        from crm_sale_request sr " +
            "                 inner join crm_estimation_request er on sr.id = er.id " +
            "        where sr.author_id = employee.id " +
            "          and sr.create_date between :reportFrom and :reportTo" +
            "          and sr.is_active = 1)                                                                     as `estimationRequests` " +
            "from crm_employee employee " +
            "         inner join crm_private_data private_data on employee.id = private_data.id " +
            "         left join ( " +
            "            select distinct activity.employee_id, activity.types, activity.id as id " +
            "            from crm_activity activity " +
            "                join crm_activity_type activity_type on activity.id = activity_type.activity_id " +
            "            where activity.date_activity between :reportFrom and :reportTo " +
            "            ) activity on activity.employee_id = employee.id " +
            "         left join crm_activity_type t on activity.id = t.activity_id " +
            "where employee.login not like '%sales%' and employee.login not like '%site%'" +
            "  and  employee.id in (select p.id from crm_private_data p " +
            "                           join crm_employee_role r " +
            "                           on p.id = r.employee_id and r.role_id = 4 " +
            "                           where p.is_active = 1 " +
            "                       union " +
            "                       select s.author_id from crm_sale_request s " +
            "                           where s.is_active=1 and s.create_date between :reportFrom and :reportTo " +
            "                       union " +
            "                       select a.employee_id from crm_activity a  " +
            "                           where a.is_active=1 and a.date_activity between :reportFrom and :reportTo) " +
            "group by employee.id " +
            "order by `sum` desc";

    static final String FAVORITE_SALE_REQUESTS = "(select count(*) from crm_employee_sale_request " +
            "where crm_employee_sale_request.sale_request_id = id " +
            "and " +
            "crm_employee_sale_request.employee_id = {favoriteEmployeeId})";

    public static final String CONVERT_TO_CHAR = "CONVERT({0}, char)";

    public static final String SOURCES_STATISTIC_QUERY = "SELECT s.name as source, s.nameEn as source_en, count(cs.status) as leads " +
            "from CompanySale cs " +
            "join cs.source s " +
            "where cs.createDate BETWEEN :creationFrom AND :creationTo ";


    public static final String SALE_SEARCH = "SELECT distinct (cs) " +
            "from CompanySale cs " +
            "LEFT OUTER JOIN cs.activities a " +
            "LEFT OUTER JOIN cs.company c " +
            "LEFT OUTER JOIN cs.mainContact m " +
            "where cs.responsible = :responsible " +
            "and (concat(cs.id, '') like %:query% " +
            "or concat(m.firstName,' ' , m.lastName) like %:query% " +
            "or c.name like %:query%) " +
            "and concat(cs.status, '') like %:status% ";

    public static final String LAST_ACTIVITY_ESTIMATION = "(SELECT max(hst.create_date) FROM crm_estimation_request esr " +
            "JOIN crm_estimation_request_history esh ON esr.id = esh.estimation_request_id " +
            "JOIN crm_history hst ON esh.id = hst.id " +
            "WHERE esr.id = id " +
            "GROUP BY esr.id)";

    private SqlConstants() {
    }
}
