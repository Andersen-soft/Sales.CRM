package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QEmployee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends BaseRepository<QEmployee, Employee, Long> {

    @Override
    default void customize(QuerydslBindings bindings, QEmployee root) {
        bindStringAndLong(bindings, root);

        bindings.bind(root.role).first((path, value) -> root.roles.any().eq(value));
    }

    /**
     * @param login login of entity to find
     * @return employee entity, found by login
     */
    Employee findEmployeeByLogin(String login);

    Employee findEmployeeByOldId(Long oldId);

    Employee findEmployeeByTelegramUsername(String username);

    Employee findEmployeeByTelegramUsernameAndLotteryParticipantIsTrueAndIsActiveTrue(String telegramUsername);

    Employee findEmployeeByTelegramUsernameAndNightDistributionParticipantIsTrueAndIsActiveTrue(String telegramUsername);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByTelegramUsernameAndIdNot(String telegramUserName, Long id);

    boolean existsByLoginAndIdNot(String login, Long id);

    List<Employee> findByResponsibleRMAndIsActiveTrue(boolean responsibleRm);

    Employee findById(Long id);

    List<Employee> findByCountriesAndIsActiveTrue(Iterable<Country> countries);

    List<Employee> findAllByLotteryParticipantIsTrueAndIsActiveTrue();

    List<Employee> findAllByDayDistributionParticipantIsTrueAndIsActiveTrue();

    List<Employee> findAllByNightDistributionParticipantIsTrueAndIsActiveTrue();

    List<Employee> findAllByCountriesAndRegionalDistributionParticipantIsTrueAndIsActiveTrue(Iterable<Country> countries);

    Employee findByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND (:email = e.email OR :email MEMBER OF e.additionalEmails)")
    Employee findByEmailIncludingAdditional(@Param("email") String email);

    @Query("SELECT e FROM Employee e WHERE :email = e.email OR :email MEMBER OF e.additionalEmails")
    Employee findByEmailIncludingAdditionalAndInactive(@Param("email") String email);
}
