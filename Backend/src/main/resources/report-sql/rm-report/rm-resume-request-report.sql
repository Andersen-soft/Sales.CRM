SELECT
	rsr.id                                                          AS id,
	cmp.name                                                        AS company,
    slr.name                                                        AS name,
    rsr.status                                                      AS status,
    rsr.priority                                                    AS priority,
    COALESCE(CONCAT_WS(' ', prv.first_name, prv.last_name), '')     AS responsible_name,
    emp.email                                                       AS email,
    emp.login                                                       AS login,
    rsm.id                                                          AS resume_id,
    rsm.fio                                                         AS fio,
    rsm.status                                                      AS resume_status
FROM crm_resume_request rsr
JOIN crm_sale_request slr       ON slr.id = rsr.id
JOIN crm_employee emp           ON emp.id = slr.responsible_rm_id
JOIN crm_private_data prv       ON prv.id = emp.id
JOIN crm_company cmp            ON cmp.id = slr.company_id
LEFT JOIN crm_resume rsm        ON rsm.resume_request_id = rsr.id
JOIN crm_sale_object sbj        ON sbj.id = rsm.id
WHERE slr.is_active = 1
    AND slr.responsible_rm_id IS NOT NULL
    AND (
	    rsr.status IN ('CTO_NEED', 'NAME_NEED')
        OR (rsm.status = 'CTO_NEED' AND sbj.is_active = 1 AND rsr.status <> 'PENDING')
    )
    AND emp.login IS NOT NULL
    AND emp.login NOT LIKE '%sales%' ESCAPE '!'
    AND length(emp.email) <> 0;