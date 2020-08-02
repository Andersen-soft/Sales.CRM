SELECT
	rrq.id AS id,
	srq.name AS request_name,
	cmp.name AS company_name,
	COALESCE(r_name, 'Отсутствует') AS resp_name,
	COALESCE(rm_name, 'Отсутствует') AS resp_rm_name,
	COALESCE(hr_name, 'Отсутствует') AS resp_hr_name,
	rsm.resume_id,
	rsm.fio,
	rsm.create_date,
	rsm.status_changed_date AS done_date
FROM crm_resume_request rrq
INNER JOIN crm_sale_request srq ON srq.id = rrq.id
LEFT JOIN crm_company cmp ON cmp.id = srq.company_id
LEFT JOIN (
		SELECT
			responsible_hr_id,
            fio,
            status_changed_date,
            resume_request_id,
            so.create_date AS create_date,
            r.id AS resume_id
		FROM crm_resume r
		JOIN crm_sale_object so ON r.id = so.id
		WHERE r.status = 'DONE'
			AND so.is_active = 1
			AND so.create_date BETWEEN CAST(:createDateFrom AS DATETIME) AND CAST(:createDateTo AS DATETIME)
	) rsm ON rsm.resume_request_id = rrq.id
LEFT JOIN (
		SELECT pd_resp.id, CONCAT_WS(' ', pd_resp.first_name, pd_resp.last_name) AS r_name
		FROM crm_private_data pd_resp
	) pd_r ON pd_r.id = srq.responsible_for_sale_request_id
LEFT JOIN (
		SELECT pd_resp_rm.id, CONCAT_WS(' ', pd_resp_rm.first_name, pd_resp_rm.last_name) AS rm_name
		FROM crm_private_data pd_resp_rm
	) pd_rm ON pd_rm.id = srq.responsible_rm_id
LEFT JOIN (
		SELECT pd_resp_hr.id, CONCAT_WS(' ', pd_resp_hr.first_name, pd_resp_hr.last_name) AS hr_name
		FROM crm_private_data pd_resp_hr
	) pd_hr ON pd_hr.id = rsm.responsible_hr_id
WHERE srq.is_active = 1
	AND rsm.status_changed_date IS NOT NULL;
