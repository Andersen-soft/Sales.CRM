set FOREIGN_KEY_CHECKS=0;

drop table if exists crm_activity;
drop table if exists crm_activity_contact;
drop table if exists crm_activity_type;
drop table if exists crm_comment;
drop table if exists crm_company;
drop table if exists crm_company_archive;
drop table if exists crm_company_distribution_history;
drop table if exists crm_company_history;
drop table if exists crm_company_industry;
drop table if exists crm_company_sale;
drop table if exists crm_company_sale_archive;
drop table if exists crm_company_sale_day_distribution;
drop table if exists crm_company_sale_google_ad_record;
drop table if exists crm_company_sale_history;
drop table if exists crm_company_sale_mail_history;
drop table if exists crm_company_sale_night_distribution_stack;
drop table if exists crm_company_sale_temp;
drop table if exists crm_contact;
drop table if exists crm_contacts_archive;
drop table if exists crm_countries;
drop table if exists crm_employee;
drop table if exists crm_employee_archive;
drop table if exists crm_employee_company_sale_temp;
drop table if exists crm_employee_country;
drop table if exists crm_employee_emails;
drop table if exists crm_employee_role;
drop table if exists crm_employee_sale_request;
drop table if exists crm_estimation_request;
drop table if exists crm_estimation_request_comment;
drop table if exists crm_estimation_request_history;
drop table if exists crm_file;
drop table if exists crm_history;
drop table if exists crm_industry;
drop table if exists crm_private_data;
drop table if exists crm_rating;
drop table if exists crm_resume;
drop table if exists crm_resume_comment;
drop table if exists crm_resume_history;
drop table if exists crm_resume_request;
drop table if exists crm_resume_request_comment;
drop table if exists crm_resume_request_history;
drop table if exists crm_resume_status_history;
drop table if exists crm_role;
drop table if exists crm_sale_object;
drop table if exists crm_sale_request;
drop table if exists crm_social_answer_industry;
drop table if exists crm_social_network_answer;
drop table if exists crm_social_network_contact;
drop table if exists crm_social_network_user;
drop table if exists crm_source;
drop table if exists crm_token;
drop table if exists crm_verification_key;

drop view if exists crm_sale_report_view;
drop view if exists crm_resume_request_view;
drop view if exists crm_resume_view;
drop view if exists crm_social_network_answer_sales_head_view;

create table crm_activity (id bigint not null auto_increment, date_activity datetime(6), description TEXT not null, is_active bit, company_sale_id bigint, employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_activity_contact (activity_id bigint not null, contact_id bigint not null, primary key (activity_id, contact_id)) ENGINE=InnoDB;
create table crm_activity_type (id bigint not null auto_increment, type varchar(255), activity_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_comment (id bigint not null auto_increment, create_date datetime(6), description TEXT, edit_date datetime(6), is_edited BIT, id_employee bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company (id bigint not null auto_increment, create_date datetime(6), dd_last_assignment_date datetime(6), description TEXT, is_active BIT not null, name varchar(255), old_id bigint, phone varchar(255), url varchar(255), responsible_employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_archive (id bigint not null auto_increment, date_time datetime(6), company_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_distribution_history (id bigint not null auto_increment, event varchar(255), event_date datetime(6), author_id bigint, company_id bigint, current_dd_id bigint, previous_dd_id bigint, reference_dd_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_history (id bigint not null auto_increment, company_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_industry (company_id bigint not null, industry_id bigint not null) ENGINE=InnoDB;
create table crm_company_sale (id bigint not null auto_increment, category varchar(255), create_date datetime(6), create_lead_date datetime(6), description TEXT, day_auto_distribution BIT not null, is_active BIT not null, is_sale_approved BIT not null, lottery_date datetime(6), next_activity_date datetime(6), old_id bigint, status integer, status_changed_date datetime(6), time_status varchar(255), weight bigint, company_id bigint, first_activity_id bigint, last_activity_id bigint, main_contact_id bigint, company_recommendation_id bigint, responsible_id bigint, source_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_archive (id bigint not null auto_increment, date_time datetime(6), company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_day_distribution (sale_temp_id bigint not null, employee_id bigint not null, primary key (sale_temp_id, employee_id)) ENGINE=InnoDB;
create table crm_company_sale_google_ad_record (id bigint not null auto_increment, conversion_date datetime(6), conversion_name varchar(255), gclid varchar(255), is_exported BIT, first_point varchar(255), last_point varchar(255), session_point varchar(255), company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_history (id bigint not null auto_increment, company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_mail_history (id bigint not null auto_increment, contact_email varchar(255), request_result varchar(255), message TEXT, sales_email varchar(255), company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_night_distribution_stack (id bigint not null auto_increment, lottery_date datetime(6), employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_company_sale_temp (id bigint not null auto_increment, assignment_date datetime(6), is_sale_approved BIT not null, status varchar(255), sale_id bigint, responsible_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_contact (create_date datetime(6), date_of_birth datetime(6), email varchar(255), old_id bigint, personal_email varchar(255), position varchar(255), sex integer not null, social_network varchar(255), id bigint not null, company_id bigint, country_id bigint, social_network_user_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_contacts_archive (id bigint not null auto_increment, date datetime(6), contact_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_countries (id bigint not null auto_increment, alpha_2 CHAR(2) default '' not null, alpha_3 CHAR(3) default '' not null, name_en varchar(255), name_ru VARCHAR(255) default '' not null, primary key (id)) ENGINE=InnoDB;
create table crm_employee (auto_distribution_date datetime(6), create_date datetime(6), distribution_date_day datetime(6), distribution_day_participant BIT, distribution_date_rm datetime(6), email varchar(255), employee_lang varchar(255), last_access_date datetime(6), login varchar(255), lottery_participant BIT not null, may_db_auth BIT, distribution_date_night datetime(6), distribution_night_participant BIT, old_id bigint, password varchar(255), position varchar(255), distribution_date_regional datetime(6), distribution_regional_participant BIT, responsible_rm BIT not null, telegram_username varchar(255), id bigint not null, mentor_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_employee_archive (id bigint not null auto_increment, date datetime(6), employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_employee_company_sale_temp (company_sale_temp_id bigint not null, employee_id bigint not null, primary key (company_sale_temp_id, employee_id)) ENGINE=InnoDB;
create table crm_employee_country (employee_id bigint not null, country_id bigint not null, primary key (employee_id, country_id)) ENGINE=InnoDB;
create table crm_employee_emails (employee_id bigint not null, email varchar(255)) ENGINE=InnoDB;
create table crm_employee_role (employee_id bigint not null, role_id bigint not null, primary key (employee_id, role_id)) ENGINE=InnoDB;
create table crm_employee_sale_request (employee_id bigint not null, sale_request_id bigint not null) ENGINE=InnoDB;
create table crm_estimation_request (old_id bigint, status varchar(255) not null, status_changed_date datetime(6), id bigint not null, company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_estimation_request_comment (id bigint not null auto_increment, estimation_request_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_estimation_request_history (id bigint not null auto_increment, estimation_request_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_file (id bigint not null auto_increment, file_key varchar(255), comments TEXT, creation_date datetime(6), name varchar(255), old_id bigint, estimation_id bigint, sale_object_id bigint, sale_request_id bigint, uploaded_by_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_history (id bigint not null auto_increment, create_date datetime(6), description TEXT, description_en TEXT, employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_industry (id bigint not null auto_increment, common BIT not null, create_date datetime(6), name varchar(255), employee_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_private_data (id bigint not null auto_increment, additional_info TEXT, additional_phone varchar(255), first_name varchar(255), is_active BIT, last_name varchar(255), middle_name varchar(255), phone varchar(255), skype varchar(255), primary key (id)) ENGINE=InnoDB;
create table crm_rating (id bigint not null auto_increment, rate integer, primary key (id)) ENGINE=InnoDB;
create table crm_resume (fio varchar(255), hr_comment longtext, is_urgent bit, returns_resume_count bigint, status varchar(255) not null, status_changed_date datetime(6), id bigint not null, responsible_hr_id bigint, resume_request_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_comment (id bigint not null auto_increment, resume_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_history (id bigint not null auto_increment, resume_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_request (auto_distribution bit, done_date datetime(6), old_id bigint, priority varchar(255) not null, status varchar(255) not null, status_changed_date datetime(6), id bigint not null, company_sale_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_request_comment (id bigint not null auto_increment, resume_request_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_request_history (id bigint not null auto_increment, resume_request_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_resume_status_history (id bigint not null auto_increment, status_duration bigint, status_name varchar(255), status_started datetime(6), resume_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_role (id bigint not null auto_increment, name varchar(255), primary key (id)) ENGINE=InnoDB;
create table crm_sale_object (id bigint not null auto_increment, create_date datetime(6), is_active bit, author_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_sale_request (id bigint not null auto_increment, create_date datetime(6), deadline datetime(6), is_active bit, name varchar(255), start_at datetime(6), author_id bigint, company_id bigint, first_responsible_rm bigint, responsible_for_request_id bigint, responsible_for_sale_request_id bigint, responsible_rm_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_social_network_answer (id bigint not null auto_increment, company_name varchar(255), create_date datetime(6) not null, date_of_birth datetime(6), email varchar(255), email_private varchar(255), first_name varchar(255) not null, last_name varchar(255) not null, link_lead varchar(255) not null, message longtext not null, phone varchar(255), phone_company varchar(255), position varchar(255), sex integer not null, site varchar(255), skype varchar(255), status smallint not null, assistant_id bigint, country_id bigint, social_network_contact_id bigint, source_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_social_answer_industry (social_id bigint not null, industry_id  bigint not null, foreign key (social_id) references crm_social_network_answer (id), foreign key (industry_id) references crm_industry (id));
create table crm_social_network_contact (id bigint not null auto_increment, create_date datetime(6), sales_id bigint, sales_assistant_id bigint, social_network_user_id bigint, source_id bigint, primary key (id)) ENGINE=InnoDB;
create table crm_social_network_user (id bigint not null auto_increment, create_date datetime(6), name varchar(255), primary key (id)) ENGINE=InnoDB;
create table crm_source (id bigint not null auto_increment, description_en varchar(255), description_ru varchar(255), name varchar(255), name_en varchar(255), type varchar(255), primary key (id)) ENGINE=InnoDB;
create table crm_token (id bigint not null auto_increment, create_date datetime(6), login varchar(255), value varchar(255), primary key (id)) ENGINE=InnoDB;
create table crm_verification_key (id bigint not null auto_increment, create_date datetime(6), token varchar(255), token_key varchar(255), primary key (id)) ENGINE=InnoDB;

alter table crm_employee add constraint UK_ffxtmoyi06xigkbn6ht0kmfit unique (email);
alter table crm_social_network_contact add constraint UK_SOCIAL_NETWORK_CONTACT unique (social_network_user_id, source_id);
alter table crm_social_network_user add constraint UKbuymc7q71e5uewp427m4orydi unique (name);
alter table crm_source add constraint UK3cqqiqgqv07qfxd1igw9o3cuo unique (name);
alter table crm_activity add constraint FKo946ojhw4h3yrmcmpyla6cg7r foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_activity add constraint FKh98d7dt0rtgmpet04pvia77yg foreign key (employee_id) references crm_employee (id);
alter table crm_activity_contact add constraint FKt83f8um9o5jp5muh3pq41snx8 foreign key (contact_id) references crm_contact (id);
alter table crm_activity_contact add constraint FK9tpjpn3jqqhas45sfdeif27d3 foreign key (activity_id) references crm_activity (id);
alter table crm_activity_type add constraint FKjcikf8tmfiaeql8fqrba7i1sa foreign key (activity_id) references crm_activity (id);
alter table crm_comment add constraint FKersir1cl5wy8kdrokv8lkplk foreign key (id_employee) references crm_employee (id);
alter table crm_company add constraint FKt7gqkn5pj131fvlg04ithewnv foreign key (responsible_employee_id) references crm_employee (id);
alter table crm_company_archive add constraint FK5dxrr5wsl5uyimnjf35i3th68 foreign key (company_id) references crm_company (id);
alter table crm_company_distribution_history add constraint FKgx94duiv30y8f95big000rqh3 foreign key (author_id) references crm_employee (id);
alter table crm_company_distribution_history add constraint FKilyxjtban8aiy75alkj6jmubr foreign key (company_id) references crm_company (id);
alter table crm_company_distribution_history add constraint FKacrhor5dq6nbjhj2m3dejnejr foreign key (current_dd_id) references crm_employee (id);
alter table crm_company_distribution_history add constraint FKp2s7a8wfd4mlap6kitym79pxk foreign key (previous_dd_id) references crm_employee (id);
alter table crm_company_distribution_history add constraint FKk3o647lq6vpfd02c1nrm8xat1 foreign key (reference_dd_id) references crm_employee (id);
alter table crm_company_history add constraint FKq94grewuwvofy27xgworpflle foreign key (company_id) references crm_company (id);
alter table crm_company_history add constraint FKn316pwaiv3bv13niov2jufmt6 foreign key (id) references crm_history (id);
alter table crm_company_industry add constraint FK5va7ryp7q6m7myd0oynoxok foreign key (industry_id) references crm_industry (id);
alter table crm_company_industry add constraint FKaba7yeeugaaujx1bq992jynog foreign key (company_id) references crm_company (id);
alter table crm_company_sale add constraint FKsekpojc67vl8m1ewtp7u6iqoo foreign key (company_id) references crm_company (id);
alter table crm_company_sale add constraint FK4r10yj1kjwjtvnijgdn64sn66 foreign key (first_activity_id) references crm_activity (id);
alter table crm_company_sale add constraint FKtowsmwc6jvvngos90jochuivv foreign key (last_activity_id) references crm_activity (id);
alter table crm_company_sale add constraint FKqa11abhggy4p8594ehftsm1fi foreign key (main_contact_id) references crm_contact (id);
alter table crm_company_sale add constraint FK938ksgjenkbo4whkmgrsjtkpi foreign key (company_recommendation_id) references crm_company (id);
alter table crm_company_sale add constraint FKh2pauq19wn3wxd8o2quocgm4f foreign key (responsible_id) references crm_employee (id);
alter table crm_company_sale add constraint FKptg9c2165bvnk00vsq5xh6r62 foreign key (source_id) references crm_source (id);
alter table crm_company_sale_archive add constraint FK4rt62dd9nb6jsfjjj1ib3skv5 foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_company_sale_day_distribution add constraint FKav6baclj692vb0kkfyjp43h52 foreign key (employee_id) references crm_employee (id);
alter table crm_company_sale_day_distribution add constraint FKixk4jc9vl2o35u57xmvtv4vw9 foreign key (sale_temp_id) references crm_company_sale_temp (id);
alter table crm_company_sale_google_ad_record add constraint FKsgb94xqu8wqillmho2iq640sn foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_company_sale_history add constraint FK9o6kkxiuwiila8m208iqlfngw foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_company_sale_history add constraint FK7nia433kmy3flf9ra66p7c5c5 foreign key (id) references crm_history (id);
alter table crm_company_sale_mail_history add constraint FKlo93jk51kggchadw5ufo4x0wb foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_company_sale_night_distribution_stack add constraint FKkcaha9kqsur42frr0mhuygsmx foreign key (employee_id) references crm_employee (id);
alter table crm_company_sale_temp add constraint FKieycbi5jd3t86gnjeibo63rp9 foreign key (sale_id) references crm_company_sale (id);
alter table crm_company_sale_temp add constraint FKfo5h3c9kkjqhse0gt5mt3d6jg foreign key (responsible_id) references crm_employee (id);
alter table crm_contact add constraint FKflvq3pf55wsn7wiy6fsfv1aes foreign key (company_id) references crm_company (id);
alter table crm_contact add constraint FKomrkhsewherhukkk707axih18 foreign key (country_id) references crm_countries (id);
alter table crm_contact add constraint FK2bc2u46r6mh3eks3sbs09ifqt foreign key (social_network_user_id) references crm_social_network_user (id);
alter table crm_contact add constraint FKa2697xxrvhn3kapfwdnfhvj2a foreign key (id) references crm_private_data (id);
alter table crm_contacts_archive add constraint FKldtrr6exjmf2p53b5nelffp9a foreign key (contact_id) references crm_contact (id);
alter table crm_employee add constraint FKfb4gqjaosurhv83rl08w8b00b foreign key (mentor_id) references crm_employee (id);
alter table crm_employee add constraint FKthqp9thaukrv3angvupafonif foreign key (id) references crm_private_data (id);
alter table crm_employee_archive add constraint FKc4dbvjk9yod4wabr5lghyysq2 foreign key (employee_id) references crm_employee (id);
alter table crm_employee_company_sale_temp add constraint FK8sl5krq1uiai118b00cbu6xsj foreign key (employee_id) references crm_employee (id);
alter table crm_employee_company_sale_temp add constraint FKpo65eaijra0n7aie21poy12yq foreign key (company_sale_temp_id) references crm_company_sale_temp (id);
alter table crm_employee_country add constraint FK2pcq7lxed11x7ou7c66a0ayiu foreign key (country_id) references crm_countries (id);
alter table crm_employee_country add constraint FKgbbh0cygkx10wirla6cbmitv1 foreign key (employee_id) references crm_employee (id);
alter table crm_employee_emails add constraint FKqb6oefio0plvn8agjcdd2r8gp foreign key (employee_id) references crm_employee (id);
alter table crm_employee_role add constraint FKkcl4k1dyat0t80sktph0y1n7c foreign key (role_id) references crm_role (id);
alter table crm_employee_role add constraint FKjyi8mjikwirms5u9797q9k1c1 foreign key (employee_id) references crm_employee (id);
alter table crm_employee_sale_request add constraint FKjfi9pcxlippmo5q8ea0m6fgpr foreign key (sale_request_id) references crm_sale_request (id);
alter table crm_employee_sale_request add constraint FK3c3d029097eabn2n8al9tuigq foreign key (employee_id) references crm_employee (id);
alter table crm_estimation_request add constraint FKtnsxpavq7prq0uq8anjlmck46 foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_estimation_request add constraint FKg1t1e99t84lxxudoam44kvibs foreign key (id) references crm_sale_request (id);
alter table crm_estimation_request_comment add constraint FKjkkbdmf9iiakntvgkryo97ke6 foreign key (estimation_request_id) references crm_estimation_request (id);
alter table crm_estimation_request_comment add constraint FKtqn7b4h0kvpw1d1j3cthicvav foreign key (id) references crm_comment (id);
alter table crm_estimation_request_history add constraint FKr68wc29c92xcwl5klsxlm7sjo foreign key (estimation_request_id) references crm_estimation_request (id);
alter table crm_estimation_request_history add constraint FK31kotwo4ijybsrdy4w9qr2ptw foreign key (id) references crm_history (id);
alter table crm_file add constraint FKktl91580ilo5rp4o65ce1jm0o foreign key (estimation_id) references crm_sale_request (id);
alter table crm_file add constraint FK35j3bcyu3ve6e1908w3xmdvu8 foreign key (sale_object_id) references crm_sale_object (id);
alter table crm_file add constraint FKq1blj66ifrk7rqqm0gf7xc7ub foreign key (sale_request_id) references crm_sale_request (id);
alter table crm_file add constraint FK5pnyy02l5axxc59ctb5fu9umv foreign key (uploaded_by_id) references crm_employee (id);
alter table crm_history add constraint FKq2jgygjyh7ajn2r7ujkkgo75f foreign key (employee_id) references crm_employee (id);
alter table crm_industry add constraint FKib8r1wgeoalh50v9ctpm5hslo foreign key (employee_id) references crm_employee (id);
alter table crm_resume add constraint FKgn9uh7mkl1hxgofev6d92snq6 foreign key (responsible_hr_id) references crm_employee (id);
alter table crm_resume add constraint FKkkxd64g9w5krhmfeut2qo4wbp foreign key (resume_request_id) references crm_resume_request (id);
alter table crm_resume add constraint FK8qo6yebi0f4lwy0rnby43pad7 foreign key (id) references crm_sale_object (id);
alter table crm_resume_comment add constraint FK986t51kbn8f5nnw44rlrjcwdd foreign key (resume_id) references crm_resume (id);
alter table crm_resume_comment add constraint FKlwcs6x8busnpg849iw0g32qyq foreign key (id) references crm_comment (id);
alter table crm_resume_history add constraint FK6ll8tjqcny8n0ufsvg9ao6g3y foreign key (resume_id) references crm_resume (id);
alter table crm_resume_history add constraint FKgt04b6lfee3nt240ndvgqsk6q foreign key (id) references crm_history (id);
alter table crm_resume_request add constraint FK2gwi32y6x3tcif0jopiwacv03 foreign key (company_sale_id) references crm_company_sale (id);
alter table crm_resume_request add constraint FK47agb0nfi4i7nno03o6771pc3 foreign key (id) references crm_sale_request (id);
alter table crm_resume_request_comment add constraint FKcppeos1w52f0ns7gvp3iw07si foreign key (resume_request_id) references crm_resume_request (id);
alter table crm_resume_request_comment add constraint FK3al71i08cuccfbu7caelawekm foreign key (id) references crm_comment (id);
alter table crm_resume_request_history add constraint FKko704lg5ludjxyhq6aasry350 foreign key (resume_request_id) references crm_resume_request (id);
alter table crm_resume_request_history add constraint FK8qycslhj6vphhospnn4aftyjm foreign key (id) references crm_history (id);
alter table crm_resume_status_history add constraint FK6shwirnebakajlnmf0vqrqeyg foreign key (resume_id) references crm_resume (id);
alter table crm_sale_object add constraint FKg1bgyx1exihbx17jd5u6rgs15 foreign key (author_id) references crm_employee (id);
alter table crm_sale_request add constraint FKayfebyemn28idu0fnqyn0pxuv foreign key (author_id) references crm_employee (id);
alter table crm_sale_request add constraint FKdhxfuwgg8552nsk0i975dnh3c foreign key (company_id) references crm_company (id);
alter table crm_sale_request add constraint FKxh44fcangrrmdfc1qt3ah5g0 foreign key (first_responsible_rm) references crm_employee (id);
alter table crm_sale_request add constraint FKi9juf1l78uq84adblt8u3hhmr foreign key (responsible_for_request_id) references crm_employee (id);
alter table crm_sale_request add constraint FKq5yr02aboj6an66paxo267ilc foreign key (responsible_for_sale_request_id) references crm_employee (id);
alter table crm_sale_request add constraint FK3h96pko8lpfpbihbmj12fqbas foreign key (responsible_rm_id) references crm_employee (id);
alter table crm_social_network_answer add constraint FKdyjf4dm6pjqsdhqc126r558pp foreign key (assistant_id) references crm_employee (id);
alter table crm_social_network_answer add constraint FK4wwuoxhyjvtackj08tfni4y74 foreign key (country_id) references crm_countries (id);
alter table crm_social_network_answer add constraint FKhye7x4u3c10k6gxr7bpj61rof foreign key (social_network_contact_id) references crm_social_network_contact (id);
alter table crm_social_network_answer add constraint FKa3vltn1o464sjuvwv9m3su9ei foreign key (source_id) references crm_source (id);
alter table crm_social_network_contact add constraint FKmjqb398jwaxowdov938l38q7h foreign key (sales_id) references crm_employee (id);
alter table crm_social_network_contact add constraint FKd63u4g4e8v68ddyk6gbw59up5 foreign key (sales_assistant_id) references crm_employee (id);
alter table crm_social_network_contact add constraint FK6al7489petm8drt45wk3w9q6j foreign key (social_network_user_id) references crm_social_network_user (id);
alter table crm_social_network_contact add constraint FKoqjlufbl7xyk4rb7u0qo5duo8 foreign key (source_id) references crm_source (id);

set FOREIGN_KEY_CHECKS=1;

CREATE VIEW crm_sale_report_view AS select concat_ws('_',(case when (resume_requests.id is not null) then 'RESUME' end),(case when (estimation_requests.id is not null) then 'ESTIMATION' end),(case when (estimation_requests.id is null and resume_requests.id is null) then 'NONE' end)) AS type, cs.create_date AS create_date, cs.create_lead_date AS create_lead_date, cs.id AS id, cs.status AS status, coalesce(cs.category,'Отсутствует') AS category, cs.status_changed_date AS status_changed_date, recommendation.id AS company_recommendation_id, coalesce(recommendation.name,'Отсутствует') AS company_recommendation_name, cast(cs.status_changed_date as date) AS status_date, cs.responsible_id AS responsible_id, concat(ifnull(rsp.first_name,''), ifnull(concat(' ',rsp.last_name),'')) AS responsible_name, cs.weight AS weight, com.id AS company_id, com.name AS company_name, com.url AS company_url, coalesce(com.responsible_employee_id,-(1)) AS company_dd_id, (case when (concat(ifnull(dd_pd.first_name,''), ifnull(concat(' ',dd_pd.last_name),'')) = '') then 'Отсутствует' else concat(ifnull(dd_pd.first_name,''), ifnull(concat(' ',dd_pd.last_name),'')) end) AS company_dd_name, concat(ifnull(p.first_name,''), ifnull(concat(' ',p.last_name),'')) AS main_contact, con.position AS contact_position, con.social_network AS social_network, con.email AS email, p.skype AS skype, p.phone AS phone, con.personal_email AS personal_email, coalesce(s.id,-(1)) AS source_id, coalesce(s.name,'Отсутствует') AS source_name, coalesce(s.name_en,'None') AS source_name_en, coalesce(s.description_ru,'Отсутствует') AS source_description_ru, coalesce(s.description_en,'None') AS source_description_en, coalesce(c.id,-(1)) AS country_id, coalesce(c.name_ru,'Отсутствует') AS country_name, coalesce(c.name_en,'None') AS country_name_en, snu.id AS social_contact_id, coalesce(snu.name,'Отсутствует') AS social_contact_name, lact.date_activity AS last_activity_date, fact.date_activity AS first_activity_date, resume_requests.resume_requests AS resume_requests, estimation_requests.estimation_requests AS estimation_requests, (case when (company_industries.industry_names is null or (company_industries.industry_names = '')) then 'Отсутствует' else company_industries.industry_names end) AS company_industries from ((((((((((((((crm_company_sale cs left join crm_company com on((cs.company_id = com.id))) left join crm_company recommendation on((cs.company_recommendation_id = recommendation.id))) left join crm_private_data dd_pd on((com.responsible_employee_id = dd_pd.id))) left join crm_contact con on((cs.main_contact_id = con.id))) left join crm_private_data p on((con.id = p.id))) left join crm_countries c on((con.country_id = c.id))) left join crm_social_network_user snu on((snu.id = con.social_network_user_id))) left join crm_source s on((cs.source_id = s.id))) left join crm_private_data rsp on((rsp.id = cs.responsible_id))) left join (select srr.id AS id,rrq.company_sale_id AS company_sale_id,group_concat(concat(srr.id,' ',srr.name) separator '#=#') AS resume_requests from (crm_resume_request rrq left join crm_sale_request srr on((srr.id = rrq.id))) where (srr.is_active = 1) group by rrq.company_sale_id) resume_requests on((resume_requests.company_sale_id = cs.id))) left join (select srr.id AS id,erq.company_sale_id AS company_sale_id,group_concat(concat(srr.id,' ',srr.name) separator '#=#') AS estimation_requests from (crm_estimation_request erq left join crm_sale_request srr on((srr.id = erq.id))) where (srr.is_active = 1) group by erq.company_sale_id) estimation_requests on((estimation_requests.company_sale_id = cs.id))) left join (select crm_activity.company_sale_id AS company_sale_id,max(crm_activity.date_activity) AS date_activity from crm_activity group by crm_activity.company_sale_id) lact on((lact.company_sale_id = cs.id))) left join (select crm_activity.company_sale_id AS company_sale_id,min(crm_activity.date_activity) AS date_activity from crm_activity group by crm_activity.company_sale_id) fact on((fact.company_sale_id = cs.id))) left join (select com_i.company_id AS company_id,group_concat(i.name separator '#=#') AS industry_names from (crm_company_industry com_i left join crm_industry i on((com_i.industry_id = i.id))) group by com_i.company_id) company_industries on((company_industries.company_id = cs.company_id))) where (cs.is_active = 1);
CREATE VIEW crm_resume_request_view AS select rr.id AS resume_request_id,sr.name AS name,c.id AS company_id,c.name AS company_name,rr.status AS status,ifnull((select sum(r.returns_resume_count) from crm_resume r where (r.resume_request_id = rr.id)),0) AS returns_resume_count,sr.deadline AS deadline,pd.id AS responsible_id,(case when (trim(concat(coalesce(pd.first_name,''),' ',coalesce(pd.last_name,''))) = '') then NULL else trim(concat(coalesce(pd.first_name,''),' ',coalesce(pd.last_name,''))) end) AS responsible,sr.create_date AS create_date,pd2.id AS responsible_for_sale_request_id,(case when (trim(concat(coalesce(pd2.first_name,''),' ',coalesce(pd2.last_name,''))) = '') then NULL else trim(concat(coalesce(pd2.first_name,''),' ',coalesce(pd2.last_name,''))) end) AS responsible_for_sale_request_name,(select count(0) from (crm_resume r join crm_sale_object cso on((r.id = cso.id))) where ((r.resume_request_id = rr.id) and (cso.is_active = 1))) AS count_resume,rr.company_sale_id AS company_sale_id,sr.is_active AS is_active,(select max(hst.create_date) from ((crm_resume_request rer join crm_resume_request_history rsh on((rer.id = rsh.resume_request_id))) join crm_history hst on((rsh.id = hst.id))) where (rer.id = rr.id) group by rer.id) AS last_active_date from ((((crm_resume_request rr left join crm_sale_request sr on((sr.id = rr.id))) left join crm_company c on((c.id = sr.company_id))) left join crm_private_data pd on((pd.id = sr.responsible_rm_id))) left join crm_private_data pd2 on((pd2.id = sr.responsible_for_sale_request_id)));
CREATE VIEW crm_resume_view AS select rsm.id AS id,sbj.create_date AS create_date,srqs.deadline AS deadline,rsm.resume_request_id AS resume_request_id,replace(rsm.fio,'_',' ') AS fio,rsm.status AS status,rsm.responsible_hr_id AS responsible_hr_id,ifnull(rsm.hr_comment,'') AS comment,rsm.is_urgent AS is_urgent from (((crm_resume rsm join crm_sale_object sbj on(((sbj.id = rsm.id) and (sbj.is_active = 1)))) left join crm_resume_request rsmr on((rsmr.id = rsm.resume_request_id))) join crm_sale_request srqs on((srqs.id = rsmr.id))) order by srqs.deadline desc,rsm.resume_request_id,sbj.create_date desc;
CREATE VIEW crm_social_network_answer_sales_head_view AS select crm_social_network_answer.id AS id,crm_social_network_answer.status AS status,crm_social_network_answer.create_date AS create_date,crm_social_network_answer.assistant_id AS assistant_id,e2.id AS responsible_id,c.source_id AS source_id,crm_social_network_answer.social_network_contact_id AS social_network_contact_id,crm_social_network_answer.message AS message,crm_social_network_answer.link_lead AS link_lead,crm_social_network_answer.first_name AS first_name,crm_social_network_answer.last_name AS last_name,crm_social_network_answer.sex AS sex,crm_social_network_answer.country_id AS country_id,crm_social_network_answer.company_name AS company_name from ((crm_social_network_answer left join crm_social_network_contact c on((crm_social_network_answer.social_network_contact_id = c.id))) join crm_employee e2 on((c.sales_id = e2.id))) order by crm_social_network_answer.create_date desc;
