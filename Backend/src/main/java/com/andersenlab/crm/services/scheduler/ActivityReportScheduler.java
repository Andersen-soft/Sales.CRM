package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.ActivityReport;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QEmployee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.MailService;
import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.model.RoleEnum.ROLE_SITE;

@Component
@AllArgsConstructor
public class ActivityReportScheduler {
    private final ActivityService activityService;
    private final MailService mailService;
    private final EmployeeRepository employeeRepository;

    private static final String SUBJECT_RU = "Отчет по активностям";
    private static final String SUBJECT_EN = "Activity report";

    @Scheduled(cron = "0 59 23 ? * MON-FRI", zone = "GMT+3")
    public void sendActivityReports() {
        mailService.sendMail(defineRecipients(), defineMessage());
    }

    private Message defineMessage() {
        LocalDate now = LocalDate.now();
        List<ActivityReport> reports = activityService.getReports(now, now);
        Map<String, Object> args = new HashMap<>();
        args.put("date", now);
        args.put("reports", reports);
        return new Message(SUBJECT_EN, Strings.EMPTY, args, Message.Template.ACTIVITY_REPORT);
    }

    private List<RecipientDto> defineRecipients() {
        BooleanExpression employeePredicate = QEmployee.employee.isActive.eq(true)
                .and(QEmployee.employee.login.notEqualsIgnoreCase(ROLE_SITE.getName().toLowerCase()))
                .andAnyOf(QEmployee.employee.roles.any().name.eq(RoleEnum.ROLE_SALES),
                        QEmployee.employee.roles.any().name.eq(RoleEnum.ROLE_SALES_HEAD));
        List<Employee> employeesWithFilter = StreamSupport
                .stream(employeeRepository.findAll(employeePredicate).spliterator(), false)
                .collect(Collectors.toList());
        return employeesWithFilter.stream()
                .map(Employee::getEmail)
                .filter(Objects::nonNull)
                .filter(Strings::isNotBlank)
                .map(email -> RecipientDto.builder().contact(email).build())
                .collect(Collectors.toList());
    }
}
