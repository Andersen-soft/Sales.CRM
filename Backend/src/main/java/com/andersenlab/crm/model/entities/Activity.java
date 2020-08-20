package com.andersenlab.crm.model.entities;

import com.andersenlab.crm.model.Nameable;
import com.querydsl.core.annotations.PropertyType;
import com.querydsl.core.annotations.QueryType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedNativeQuery;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static com.andersenlab.crm.model.entities.SqlConstants.ACTIVITY_REPORT;

@SqlResultSetMapping(
        name = "activityReportMapping",
        classes = {
                @ConstructorResult(
                        targetClass = ActivityReport.class,
                        columns = {
                                @ColumnResult(name = "sales", type = String.class),
                                @ColumnResult(name = "salesId", type = Long.class),
                                @ColumnResult(name = "call", type = Long.class),
                                @ColumnResult(name = "meeting", type = Long.class),
                                @ColumnResult(name = "socialNetwork", type = Long.class),
                                @ColumnResult(name = "interview", type = Long.class),
                                @ColumnResult(name = "email", type = Long.class),
                                @ColumnResult(name = "sum", type = Long.class),
                                @ColumnResult(name = "resumeRequests", type = Long.class),
                                @ColumnResult(name = "estimationRequests", type = Long.class)
                        }
                )
        }
)
@NamedNativeQuery(
        name = "Activity.getActivityReport",
        query = ACTIVITY_REPORT,
        resultSetMapping = "activityReportMapping"
)
@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Table(name = "crm_activity")
public class Activity {

    @Getter
    @AllArgsConstructor
    public enum TypeEnum implements Nameable {
        CALL("activity.type.call"),
        EMAIL("activity.type.email"),
        SOCIAL_NETWORK("activity.type.socialNetwork"),
        MEETING("activity.type.meeting"),
        INTERVIEW("activity.type.interview");

        private final String name;

        private static final Map<String,TypeEnum> map;

        static {
            map = new HashMap<>();
            for (TypeEnum type : TypeEnum.values()) {
                map.put(type.getName(), type);
            }
        }

        public static TypeEnum findByName (String name) {
            return map.get(name);
        }

    }

    @Id
    @GeneratedValue
    @NonNull
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "date_activity")
    private LocalDateTime dateActivity;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @OneToMany(mappedBy = "activity", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private Set<ActivityType> activityTypes = new HashSet<>();

    @NotEmpty
    @Column(nullable = false)
    @JoinTable(name = "crm_activity_contact",
            joinColumns = @JoinColumn(name = "activity_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "contact_id", referencedColumnName = "id"),
            uniqueConstraints = {@UniqueConstraint(columnNames = {"activity_id", "contact_id"})}
    )
    @ManyToMany
    private Set<Contact> contacts = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee responsible;

    @ManyToOne
    @JoinColumn(name = "company_sale_id", referencedColumnName = "id")
    private CompanySale companySale;

    @Transient
    @QueryType(PropertyType.SIMPLE)
    private String search;

    @PrePersist
    private void init() {
        this.isActive = true;
    }
}
