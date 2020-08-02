SELECT
	esq.id AS id,
    cmp.name AS company_name,
    srq.name AS name,
    esq.status AS status,
	CASE
		WHEN esq.status = 'APPROVE_NEED' THEN COALESCE(CONCAT_WS(' ', prv_rm.first_name, prv_rm.last_name), '')
		WHEN esq.status = 'IN_PROGRESS' THEN COALESCE(CONCAT_WS(' ', prv_req.first_name, prv_req.last_name), '')
        WHEN esq.status = 'ESTIMATION_NEED' THEN COALESCE(CONCAT_WS(' ', prv_req.first_name, prv_req.last_name), '')
	ELSE ''
    END AS responsible,
    esq.status_changed_date AS status_changed_date
FROM estimation_request esq
JOIN sale_request srq ON srq.id = esq.id
LEFT JOIN company cmp ON cmp.id = srq.company_id
LEFT JOIN private_data prv_rm on prv_rm.id = srq.responsible_rm_id
LEFT JOIN private_data prv_req on prv_req.id = srq.responsible_for_request_id
WHERE (
	esq.status NOT IN ('DONE','PENDING')
	OR ( esq.status IN  ('DONE','PENDING') AND esq.status_changed_date > timestamp(:statusChangedExpires) )
)
AND srq.is_active = 1

ORDER BY srq.deadline ASC, esq.id ASC
