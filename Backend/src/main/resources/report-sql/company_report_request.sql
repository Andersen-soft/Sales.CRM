SELECT company.id,
       company.name,
       company.url,
       company.phone,
       company.description,
       GROUP_CONCAT(CONCAT(company_sale.id, " ", company_sale.status) SEPARATOR ';') AS sales
FROM crm_company company
LEFT JOIN crm_company_sale company_sale ON company.id = company_sale.company_id AND company_sale.is_active = 1
WHERE company.is_active = 1
    AND company.create_date BETWEEN :createDateFrom AND :createDateTo
GROUP BY company.id
ORDER BY company.create_date DESC;