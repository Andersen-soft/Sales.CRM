SELECT
	esr.id                                                          AS id,
	cmp.name                                                        AS company,
    slr.name                                                        AS name,
    esr.status                                                      AS status,
    esr.priority                                                    AS priority,
    COALESCE(CONCAT_WS(' ', prv.first_name, prv.last_name), '')     AS responsible_name,
    emp.email                                                       AS email,
    emp.login                                                       AS login,
    ''                                                              AS resume_id,
    ''                                                              AS fio,
    ''                                                              AS resume_status
FROM crm_estimation_request esr
JOIN crm_sale_request slr           ON slr.id = esr.id
JOIN crm_employee emp               ON emp.id = slr.responsible_rm_id
JOIN crm_private_data prv           ON prv.id = emp.id
JOIN crm_company cmp                ON cmp.id = slr.company_id
WHERE slr.is_active = 1
    AND slr.responsible_rm_id IS NOT NULL
    AND esr.status = 'APPROVE_NEED'
    AND emp.login IS NOT NULL
    AND emp.login NOT LIKE '%sales%' ESCAPE '!'
    AND length(emp.email) <> 0;