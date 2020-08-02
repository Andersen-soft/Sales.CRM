package com.andersenlab.crm.utils;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.Nameable;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.StringTokenizer;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static com.andersenlab.crm.services.i18n.I18nConstants.BUNDLE_NAME;
import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

/**
 * Utility class, that provides static methods for manipulating, filtering and comparing data
 */
public final class ServiceUtils {

    private ServiceUtils() {
    }

    /**
     * Compares string, provided with supplier method and condition string
     *
     * @param filtered   supplier return value
     * @param condition  string to compare with
     * @param ignoreCase true if ignore case
     * @return true if filtered object corresponds to the condition
     */
    public static boolean getStringCondition(Supplier<String> filtered, String condition, boolean ignoreCase) {
        if (condition == null) {
            return true;
        }
        if (ignoreCase) {
            return condition.equalsIgnoreCase(filtered.get());
        }
        return condition.equals(filtered.get());
    }

    /**
     * Checks, if isFavorite true, checks list for containing given favorite object. If contains
     * throws CrmException, if not - add to given lest favorite object. If isFavorite false, removes
     * favorite object from given list.
     */
    public static <T> void assignFavorite(List<T> favorites, T favorite, Boolean isFavorite) {
        if (Boolean.TRUE.equals(isFavorite) && !favorites.contains(favorite)) {
            favorites.add(favorite);
        }
        if (!Boolean.TRUE.equals(isFavorite)) {
            favorites.remove(favorite);
        }
    }

    public static LocalDateTime timestampToLocalDateTime(Timestamp dateTime) {
        return getNullable(dateTime, Timestamp::toLocalDateTime);
    }

    public static LocalDateTime daysExceptWeekend() {
        LocalDateTime localDate = LocalDateTime.now();

        DayOfWeek dayOfWeek = localDate.getDayOfWeek();
        LocalDateTime firstWorkingDay;

        switch (dayOfWeek) {
            case SATURDAY:
                firstWorkingDay = localDate.plusDays(2);
                break;
            case SUNDAY:
                firstWorkingDay = localDate.plusDays(1);
                break;
            default:
                firstWorkingDay = localDate;
        }
        return firstWorkingDay;
    }

    /**
     * Define weekend days
     *
     * @param localDateTime LocalDate
     * @return Weekend days
     */
    public static boolean isWeekend(LocalDateTime localDateTime) {
        return localDateTime.getDayOfWeek() == DayOfWeek.SATURDAY || localDateTime.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    public static <E extends Enum<E> & Nameable> E getByNameOrThrow(Class<E> type, String name) {
        return EnumSet.allOf(type)
                .stream()
                .filter(t -> t.getName().equalsIgnoreCase(name)
                        || t.name().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(java.lang.String.format("Value for %s with name %s not found", type.getSimpleName(), name)));
    }

    //Method reference replaced with lambda because of bug JDK-8141508
    @SuppressWarnings("all")
    public static <E extends Enum<E> & Nameable> List<String> getEnumNames(Class<E> nameableEnum) {
        return EnumSet.allOf(nameableEnum).stream().map(e -> e.getName()).collect(Collectors.toList());
    }

    public static List<Locale> getAvailableLocales() {
        return Arrays.stream(Locale.getISOLanguages())
                .map(Locale::forLanguageTag)
                .filter(v -> ResourceBundle.getBundle(BUNDLE_NAME, v) != null)
                .collect(Collectors.toList());
    }

    private static List<ResourceBundle> getAvailableBundles() {
        return getAvailableLocales().stream()
                .map(v -> ResourceBundle.getBundle(BUNDLE_NAME, v))
                .collect(Collectors.toList());
    }

    public static <E extends Enum<E> & Nameable> List<E> filterEnumByStringInBundleValues(
            String value, Class<E> targetEnum) {
        return EnumSet.allOf(targetEnum).stream()
                .filter(foundEnum -> {
                    for (ResourceBundle rb : getAvailableBundles()) {
                        if (rb.containsKey(foundEnum.getName())
                                && rb.getString(foundEnum.getName()).equalsIgnoreCase(value)) {
                            return true;
                        }
                    }

                    return false;
                }).collect(Collectors.toList());
    }

    /**
     * Utility method to check if specified value is present in specified enum class.
     *
     * @param targetEnum Specified enum class.
     * @param value      String value to look for.
     * @param <E>        Generic to limit class argument specification, so only enum classes
     *                   could be passed for this method's parameter.
     * @return True if specified value is presend as specified enum's constant, false otherwise.
     */
    public static <E extends Enum<E>> boolean enumConstantsContains(Class<E> targetEnum, String value) {
        return EnumSet.allOf(targetEnum).stream()
                .anyMatch(e -> e.name().equalsIgnoreCase(value));
    }

    private static int asciiConverter(String string) {
        char firstChar = string.charAt(0);
        return (int) firstChar;
    }

    public static boolean isRusWord(String key) {
        return (asciiConverter(key)) >= 1040 && (asciiConverter(key)) <= 1103;
    }

    /**
     * Counter words in String sentence
     *
     * @param sentence any String sentence
     * @return count of words in String
     */
    public static int countWordsUsingStringTokenizer(String sentence) {
        if (sentence == null || sentence.isEmpty()) {
            return 0;
        }
        StringTokenizer tokens = new StringTokenizer(sentence);
        return tokens.countTokens();
    }

    /**
     * Method that negates a specified predicate, to simplify method reference
     *
     * @param p   Initial predicate
     * @param <T> Predicate parameter
     * @return Negated predicate
     */
    public static <T> Predicate<T> not(Predicate<T> p) {
        return p.negate();
    }

    public static boolean employeeRolesContains(Employee employee, RoleEnum role) {
        return employee.getRoles().stream().map(Role::getName).anyMatch(roleEnum -> roleEnum.equals(role));
    }

    public static boolean isEmployeeCrmBot(Employee employee) {
        return employeeRolesContains(employee, RoleEnum.ROLE_SITE);
    }
}
