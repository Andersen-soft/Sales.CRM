SELECT contact.id,
       contact.email,
       contact.personal_email,
       contact.position,
       contact.social_network,
       contact.sex,
       contact.date_of_birth,
       social_network_user.name                                                      AS social_network_user,
       company.name                                                                  AS company_name,
       countries.name_ru                                                             AS country_name,
       private_data.first_name                                                       AS first_name,
       private_data.last_name                                                        AS last_name,
       private_data.skype                                                            AS skype,
       private_data.phone                                                            AS phone,
       GROUP_CONCAT(CONCAT(company_sale.id, " ", company_sale.status) SEPARATOR ';') AS sales,
       GROUP_CONCAT(DISTINCT source.name_en SEPARATOR ', ')                          AS sources
FROM crm_contact contact
         LEFT JOIN crm_company company ON contact.company_id = company.id
         LEFT JOIN crm_countries countries ON contact.country_id = countries.id
         JOIN crm_private_data private_data ON contact.id = private_data.id
         LEFT JOIN crm_company_sale company_sale
                   ON contact.id = company_sale.main_contact_id AND company_sale.is_active = 1
         LEFT JOIN crm_source source ON company_sale.source_id = source.id
         LEFT JOIN crm_social_network_user social_network_user
                   ON contact.social_network_user_id = social_network_user.id
WHERE private_data.is_active = 1
    AND contact.create_date BETWEEN :createDateFrom AND :createDateTo
GROUP BY contact.id
ORDER BY company.id DESC, contact.create_date DESC;