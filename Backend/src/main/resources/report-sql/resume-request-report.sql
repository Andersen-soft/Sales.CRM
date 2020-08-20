SELECT
	rrq.id AS id,
	cmp.name AS company_name,
	srq.name AS request_name,
    rrq.status AS request_status,
    CASE
		WHEN rrq.status = 'CTO_NEED' THEN CONCAT(prv.first_name, ' ', prv.last_name)
		ELSE ''
    END AS full_name,
	rrq.priority AS priority,
    rrq.status_changed_date AS request_status_changed_date,
    rsm.id AS resume_id,
    rsm.fio AS fio,
    rsm.status AS resume_status,
    CASE
		WHEN rsm.status = 'CTO_NEED' THEN CONCAT(prv.first_name, ' ', prv.last_name)
		WHEN rsm.status = 'IN_PROGRESS' THEN coalesce(hr_full_name, '')
		ELSE ''
    END AS responsible_for_resume,
    rsm.status_changed_date AS resume_status_changed_date
FROM resume_request rrq
INNER JOIN sale_request srq ON srq.id = rrq.id
LEFT JOIN (
		SELECT rsm_in.id, status, status_changed_date, resume_request_id, fio, CONCAT_WS(' ', prv_in.first_name, prv_in.last_name) AS hr_full_name
        FROM resume rsm_in
		JOIN sale_object sbj on rsm_in.id = sbj.id
        LEFT JOIN private_data prv_in ON prv_in.id = rsm_in.responsible_hr_id
		WHERE (rsm_in.status NOT IN ('PENDING', 'DONE') OR (rsm_in.status IN ('PENDING', 'DONE') AND rsm_in.status_changed_date > timestamp(:statusChangedExpires) ) )
		AND sbj.is_active = 1
        AND rsm_in.status_changed_date is not null
    ) rsm ON rsm.resume_request_id = rrq.id
LEFT JOIN company cmp on cmp.id = srq.company_id
LEFT JOIN private_data prv on prv.id = srq.responsible_rm_id
WHERE (
		rrq.status NOT IN ('PENDING', 'DONE') OR (rrq.status IN ('PENDING', 'DONE') AND rrq.status_changed_date > timestamp(:statusChangedExpires))
        )
AND srq.is_active = 1
ORDER BY srq.deadline ASC, rrq.id ASC;